import React from "react";
import { RoomsCollection } from "/imports/api/rooms/rooms";
import { withTracker } from "meteor/react-meteor-data";

// these will all get converted to containers
import WelcomeScreen from "./host/WelcomeScreen";
import WaitingRoomScreen from "./host/WaitingRoomScreen";
import BidScreen from "./host/BidScreen";
import GameplayScreen from "./host/GameplayScreen";

class App extends React.Component {
	renderGameRoundScreen() {
		switch (this.props.room.currRound) {
			case "bid":
				return (
					<BidScreen
						playerIdToBids={{ 1: 2, 2: 0, 3: null }}
						players={[
							{ _id: 1, name: "Jen" },
							{ _id: 2, name: "Dean" },
							{ _id: 3, name: "Max" }
						]}
					/>
				);
				break;
			case "play":
				return (
					<GameplayScreen
						playerIdToBids={{ 1: 2, 2: 0, 3: 1 }}
						players={[
							{ _id: 1, name: "Jen" },
							{ _id: 2, name: "Dean" },
							{ _id: 3, name: "Max" }
						]}
						trumpCard={{ suit: "H", value: "5", type: "Standard" }}
						currTrick={{
							cardsPlayed: {
								1: { suit: "C", value: 10, type: "Standard" },
								2: { suit: "D", value: 13, type: "Standard" },
								3: { suit: null, value: null, type: "Jester" }
							}
						}}
					/>
				);
				break;
			default:
				return <WelcomeScreen />;
		}
	}

	renderRoomScreen() {
		switch (this.props.room.gameState) {
			case "waiting":
				return (
					<WaitingRoomScreen
						code="BALLS"
						players={[
							{ _id: 1, name: "Jen" },
							{ _id: 2, name: "Dean" },
							{ _id: 3, name: "Max" }
						]}
					/>
				);
				break;
			case "active":
				return this.renderActiveGameScreen();
				break;
			default:
				return <WelcomeScreen />;
		}
	}

	render() {
		console.log(this.props.room);
		return (
			<div>{this.props.room ? this.renderRoomScreen() : <WelcomeScreen />}</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe("rooms");
	console.log(RoomsCollection.find().fetch());
	return {
		// TODO: properly fetch
		room: RoomsCollection.find().fetch()[7]
	};
})(App);

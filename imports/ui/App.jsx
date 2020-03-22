import React from "react";
import WelcomeScreen from "./host/WelcomeScreen";
import WaitingRoomScreen from "./host/WaitingRoomScreen";
import BidScreen from "./host/BidScreen";
import GameplayScreen from "./host/GameplayScreen";

export default class App extends React.Component {
	renderScreen() {
		// TODO add logic for which screen to render
		return (
			<div>
				<WelcomeScreen />
				<WaitingRoomScreen
					code="BALLS"
					players={[
						{ _id: 1, name: "Jen" },
						{ _id: 2, name: "Dean" },
						{ _id: 3, name: "Max" }
					]}
				/>
				<BidScreen
					playerIdToBids={{ 1: 2, 2: 0, 3: null }}
					players={[
						{ _id: 1, name: "Jen" },
						{ _id: 2, name: "Dean" },
						{ _id: 3, name: "Max" }
					]}
				/>
			</div>
		);
	}

	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
				<img
					src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
					width="200px"
				/>
				<GameplayScreen
					playerIdToBids={{ 1: 2, 2: 0, 3: 1 }}
					players={[
						{ _id: 1, name: "Jen" },
						{ _id: 2, name: "Dean" },
						{ _id: 3, name: "Max" }
					]}
					trumpCard={{ suit: "H", value: "5" }}
					currTrick={{ cardsPlayed: { 1: { suit: "C", value: "10" } } }}
				/>
			</div>
		);
	}
}

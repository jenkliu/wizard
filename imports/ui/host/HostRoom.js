import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { withTracker } from 'meteor/react-meteor-data';

import WaitingRoomScreen from './WaitingRoomScreen';
import GameplayScreen from './GameplayScreen';
import ScoreboardScreen from './ScoreboardScreen';

class HostRoom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currRoundScores: null,
			totalScores: null
		};
	}

	// this is legacy
	// TODO consider using getDerivedStateFromProps or componentDidUpdate instead
	// https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
	componentWillReceiveProps(props) {
		if (props.room.currRound && props.room.currRound.state === 'finished') {
			this.fetchScores();
		}
	}

	startTrick = () => {
		Meteor.call('rooms.tricks.start', this.props.room._id);
	};

	startRound = () => {
		Meteor.call('rooms.rounds.start', this.props.room._id);
		Meteor.call('rooms.rounds.deal', this.props.room._id);
	};

	startGame = () => {
		Meteor.call('rooms.start', this.props.room._id);
		this.startRound();
	};

	fetchScores = () => {
		Meteor.call('rooms.rounds.getCurrRoundPlayerIDsToScores', this.props.room._id, (error, currRoundScores) => {
			if (error) console.error(error);
			Meteor.call('rooms.rounds.getPlayerIDsToScores', this.props.room._id, (error, totalScores) => {
				if (error) console.error(error);
				this.setState({ currRoundScores, totalScores });
			});
		});
	};

	render() {
		const { room } = this.props;
		// Waiting room
		if (room.state === 'waiting') {
			return <WaitingRoomScreen code={room.code} players={room.players} startGame={this.startGame} />;
		}
		// Active game in bid/play state
		if (room.state === 'active' && room.currRound.state !== 'finished') {
			return (
				<GameplayScreen
					playerIdToBids={room.currRound.playerIDsToBids}
					players={room.players}
					trumpCard={room.currRound.trumpCard}
					currTrick={room.currRound.currTrick}
					startTrick={this.startTrick}
					currRoundState={room.currRound.state}
					activePlayerId={room.currRound.activePlayerID}
					leadPlayerId={room.currRound.currTrick ? room.currRound.currTrick.leadPlayerID : null}
					gameCode={room.code}
				/>
			);
		}
		// Score state
		if (room.currRound.state === 'finished' && this.state.currRoundScores) {
			return (
				<ScoreboardScreen
					players={room.players}
					startNextRound={this.startRound}
					currRoundPlayerIdToScores={this.state.currRoundScores}
					totalPlayerIdToScores={this.state.totalScores}
				/>
			);
		}

		// TODO return loading indicator otherwise
		return null;
	}
}

export default withTracker(({ roomId }) => {
	Meteor.subscribe('rooms');
	const room = RoomsCollection.findOne({ _id: roomId });
	return {
		room
	};
})(HostRoom);

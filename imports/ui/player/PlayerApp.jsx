import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { PlayersCollection } from '/imports/api/players/players';

import { withTracker } from 'meteor/react-meteor-data';
import PlayerJoinScreen from './PlayerJoinScreen';
import WaitingScreen from './WaitingScreen';
import PlayerHandScreen from './PlayerHandScreen';

class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	joinGame = (name, browserKey, roomCode) => {
		const playerId = Meteor.call('players.get_or_create', name, browserKey, roomCode, (error, result) => {
			if (error) console.error(error); // todo handle error
			Meteor.call('rooms.addPlayer', result);
		});
	};

	submitBid = (playerId, bid) => {
		Meteor.call('rooms.rounds.updateBid', this.props.room._id, playerId, bid);

		// STUB TODO remove
		Meteor.call('rooms.rounds.updateBid', this.props.room._id, 3, 1);

		// TODO move to controller
		Meteor.call('rooms.start', this.props.room._id);
		Meteor.call('rooms.rounds.start', this.props.room._id);
		Meteor.call('rooms.rounds.deal', this.props.room._id);
		Meteor.call('rooms.rounds.beginPlay', this.props.room._id);
		Meteor.call('rooms.tricks.start', this.props.room._id);
	};

	playCard = (playerId, card) => {
		Meteor.call('rooms.tricks.playCard', this.props.room._id, playerId, card);
	};

	renderScreen() {
		return (
			<div>
				<WaitingScreen />
				<PlayerHandScreen
					// cards={[
					// 	{ suit: 'C', value: 10, type: 'Standard' },
					// 	{ suit: 'C', value: 3, type: 'Standard' },
					// 	{ suit: 'H', value: 9, type: 'Standard' },
					// 	{ suit: 'H', value: 13, type: 'Standard' },
					// 	{ suit: 'S', value: 14, type: 'Standard' },
					// 	{ suit: 'D', value: 10, type: 'Standard' },
					// 	{ suit: null, value: null, type: 'Jester' },
					// 	{ suit: null, value: null, type: 'Wizard' }
					// ]}
					cards={this.props.room.currRound.playerIDsToCards[2]}
					currRoundState="play"
					// myPlayer={{ _id: 1, name: 'Jen' }}
					// activePlayer={{ _id: 1, name: 'Jen' }}
					myPlayer={{ _id: 2, name: 'Dean' }}
					activePlayer={{ _id: 1, name: 'Dean' }}
					submitBid={this.submitBid}
					playCard={this.playCard}
				/>
			</div>
		);
	}

	render() {
		console.log(this.props.room);
		if (!this.props.room) return null;
		return (
			<div>
				<PlayerJoinScreen joinGame={this.joinGame} />
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('rooms');
	const rooms = RoomsCollection.find().fetch();

	Meteor.subscribe('players');
	const players = PlayersCollection.find().fetch();
	console.log(players);
	return {
		// TODO: properly fetch the correct room
		room: rooms[rooms.length - 1]
	};
})(PlayerApp);

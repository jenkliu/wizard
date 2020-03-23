import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { PlayersCollection } from '/imports/api/players/players';
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';
import PlayerJoinScreen from './PlayerJoinScreen';
import PlayerWaitingScreen from './PlayerWaitingScreen';
import PlayerHandScreen from './PlayerHandScreen';

const getPlayerById = playerId => {
	return PlayersCollection.findOne({ _id: playerId });
};

class PlayerRoom extends React.Component {
	constructor(props) {
		super(props);
	}

	submitBid = (playerId, bid) => {
		Meteor.call('rooms.rounds.updateBid', this.props.room._id, playerId, bid, (error, playerIdsToBids) => {
			if (error) console.error(error);
			// If all bids are in, start round
			console.log('playerIdsToBids', playerIdsToBids);
			let numBids = 0;
			Object.values(playerIdsToBids).map(bid => {
				if (bid !== null) numBids++;
			});

			console.log('num bids', numBids);
			if (numBids == this.props.room.players.length) {
				console.log('lets begin playing!');
				Meteor.call('rooms.rounds.beginPlay', this.props.room._id);
				Meteor.call('rooms.tricks.start', this.props.room._id);
			}
		});
	};
	// TODO: add callback: if num cards played == num players in room, then call 3.1
	playCard = (playerId, card) => {
		Meteor.call('rooms.tricks.playCard', this.props.room._id, playerId, card);
	};

	hasInitializedHand() {
		return this.props.room.currRound && this.props.room.currRound.playerIDsToCards;
	}

	render() {
		if (this.props.room.gameState === 'active' && this.hasInitializedHand()) {
			return (
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
					cards={this.props.room.currRound.playerIDsToCards[this.props.myPlayer._id]}
					currRoundState={this.props.room.currRound.state}
					// myPlayer={{ _id: 1, name: 'Jen' }}
					// activePlayer={{ _id: 1, name: 'Jen' }}
					myPlayer={this.props.myPlayer}
					activePlayer={getPlayerById(this.props.room.currRound.activePlayerID)}
					submitBid={this.submitBid}
					playCard={this.playCard}
				/>
			);
		}
		// otherwise waiting or currRound hasn't initialized yet.
		return <PlayerWaitingScreen code={this.props.room.code} />;
	}
}

PlayerRoom.propTypes = {
	room: PropTypes.object, //required
	myPlayer: PropTypes.object //required
};

export default withTracker(({ myPlayerId }) => {
	const myPlayer = PlayersCollection.findOne({ _id: myPlayerId });
	const roomId = myPlayer.roomID;

	Meteor.subscribe('rooms');
	const room = RoomsCollection.findOne({ _id: roomId });
	console.log('ROOM', room);

	// Meteor.subscribe('players');
	return {
		room,
		myPlayer
	};
})(PlayerRoom);

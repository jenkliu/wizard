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
			let numBids = 0;
			Object.values(playerIdsToBids).forEach(bid => {
				if (bid !== null) numBids++;
			});

			if (numBids == this.props.room.players.length) {
				Meteor.call('rooms.rounds.beginPlay', this.props.room._id);
				Meteor.call('rooms.tricks.start', this.props.room._id);
			}
		});
	};

	playCard = (playerId, card) => {
		Meteor.call('rooms.tricks.playCard', this.props.room._id, playerId, card, (error, playerIdsToCards) => {
			if (error) console.error(error);
			// If all cards are in, finish trick
			let numCards = 0;
			Object.values(playerIdsToCards).forEach(card => {
				if (card !== null) numCards++;
			});

			if (numCards === this.props.room.players.length) {
				Meteor.call('rooms.tricks.finish', this.props.room._id, (error, data) => {
					// todo check who won the trick and display somehow (on the host side..?)
					if (data.isLastTrick) {
						Meteor.call('rooms.rounds.finish', this.props.room._id, (error, data) => {
							// TODO: add callback: if data. isLastRound, then finish room
						});
					} else {
						Meteor.call('rooms.tricks.start', this.props.room._id);
					}
				});
			}
		});
	};

	hasInitializedHand() {
		const { room } = this.props;
		return room.currRound && Object.keys(room.currRound.playerIDsToCards).length > 0;
	}

	render() {
		if (this.props.room.currRound && this.props.room.currRound.state === 'finished') {
			return <div>Round complete!</div>;
		}

		if (this.props.room.gameState === 'active' && this.hasInitializedHand()) {
			return (
				<PlayerHandScreen
					cards={this.props.room.currRound.playerIDsToCards[this.props.myPlayer._id]}
					currRoundState={this.props.room.currRound.state}
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

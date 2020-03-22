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
		Meteor.call('rooms.rounds.updateBid', this.props.room._id, playerId, bid);

		// STUB TODO remove
		Meteor.call('rooms.rounds.updateBid', this.props.room._id, 3, 1);
	};

	playCard = (playerId, card) => {
		Meteor.call('rooms.tricks.playCard', this.props.room._id, playerId, card);
	};

	render() {
		switch (this.props.room.gameState) {
			case 'waiting':
				return <PlayerWaitingScreen code={this.props.room.code} />;
				break;
			case 'active':
				return (
					<div>
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
							currRoundState="play"
							// myPlayer={{ _id: 1, name: 'Jen' }}
							// activePlayer={{ _id: 1, name: 'Jen' }}
							myPlayer={this.props.myPlayer}
							activePlayer={getPlayerById(this.props.room.currRound.activePlayerID)}
							submitBid={this.submitBid}
							playCard={this.playCard}
						/>
					</div>
				);
				break;
			default:
				return <WelcomeScreen />;
		}
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

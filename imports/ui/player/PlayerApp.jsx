import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { withTracker } from 'meteor/react-meteor-data';
import PlayerJoinScreen from './PlayerJoinScreen';
import WaitingScreen from './WaitingScreen';
import PlayerHandScreen from './PlayerHandScreen';

class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
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
				<PlayerJoinScreen />
				<WaitingScreen />
			</div>
		);
	}

	render() {
		console.log(this.props.room);
		if (!this.props.room) return null;
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
					cards={this.props.room.currRound.playerIDsToCards[3]}
					currRoundState="play"
					// myPlayer={{ _id: 1, name: 'Jen' }}
					// activePlayer={{ _id: 1, name: 'Jen' }}
					myPlayer={{ _id: 3, name: 'Dean' }}
					activePlayer={{ _id: 3, name: 'Dean' }}
					submitBid={this.submitBid}
					playCard={this.playCard}
				/>
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('rooms');
	const rooms = RoomsCollection.find().fetch();
	return {
		// TODO: properly fetch the correct room
		room: rooms[rooms.length - 1]
	};
})(PlayerApp);

import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { withTracker } from 'meteor/react-meteor-data';
import PlayerJoinScreen from './PlayerJoinScreen';
import WaitingScreen from './WaitingScreen';
import PlayerHandScreen from './PlayerHandScreen';

class PlayerApp extends React.Component {
	submitBid = (playerId, bid) => {
		Meteor.call('rooms.rounds.updateBid', this.props.room._id, playerId, bid);
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
		return (
			<div>
				<PlayerHandScreen
					cards={[
						{ suit: 'C', value: 10, type: 'Standard' },
						{ suit: 'C', value: 3, type: 'Standard' },
						{ suit: 'H', value: 9, type: 'Standard' },
						{ suit: 'H', value: 13, type: 'Standard' },
						{ suit: 'S', value: 14, type: 'Standard' },
						{ suit: 'D', value: 10, type: 'Standard' },
						{ suit: null, value: null, type: 'Jester' },
						{ suit: null, value: null, type: 'Wizard' }
					]}
					currRoundState="bid"
					myPlayer={{ _id: 1, name: 'Jen' }}
					activePlayer={{ _id: 1, name: 'Jen' }}
					submitBid={this.submitBid}
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

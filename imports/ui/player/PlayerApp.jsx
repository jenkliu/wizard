import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { PlayersCollection } from '/imports/api/players/players';
import PropTypes from 'prop-types';

import { withTracker } from 'meteor/react-meteor-data';
import PlayerJoinScreen from './PlayerJoinScreen';
import PlayerRoom from './PlayerRoom';

const getPlayerById = playerId => {
	return PlayersCollection.findOne({ _id: playerId });
};

export default class PlayerApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			myPlayerId: null
		};
	}

	joinGame = (name, browserKey, roomCode) => {
		const playerId = Meteor.call('players.get_or_create', name, browserKey, roomCode, (error, result) => {
			if (error) console.error(error); // todo handle error
			this.setState({ myPlayerId: result }); // todo: set room here
			Meteor.call('rooms.addPlayer', result);
		});
	};

	render() {
		if (!this.state.myPlayerId) {
			return <PlayerJoinScreen joinGame={this.joinGame} />;
		}
		return <PlayerRoom myPlayerId={this.state.myPlayerId} />;
	}
}

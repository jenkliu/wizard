import React from "react";
import PropTypes from "prop-types";

export default class WaitingRoomScreen extends React.Component {
	// startGame = () => {
	// 	Meteor.call("rooms.start", this.props.roomId);
	// 	Meteor.call("rooms.rounds.start", this.props.roomId);
	// };

	renderPlayer(player) {
		return <ul key={player._id}>{player.name}</ul>;
	}

	render() {
		return (
			<div>
				<h1> Game code</h1>
				{this.props.code}
				<h1>Players in this game:</h1>
				<ul>{this.props.players.map(player => this.renderPlayer(player))}</ul>
				<button onClick={this.props.startGame}>Start game</button>
			</div>
		);
	}
}

WaitingRoomScreen.propTypes = {
	code: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func
	// roomId: PropTypes.string
};

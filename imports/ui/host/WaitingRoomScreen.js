import React from "react";
import PropTypes from "prop-types";

export default class WaitingRoomScreen extends React.Component {
	renderPlayer(player) {
		return <ul>{player.name}</ul>;
	}

	render() {
		return (
			<div>
				<h1>Number of rooms</h1>
				{this.props.numRooms}

				<h1> Game code</h1>
				{this.props.code}
				<h1>Players in this game:</h1>
				<ul>{this.props.players.map(player => this.renderPlayer(player))}</ul>
				<button>Start game</button>
			</div>
		);
	}
}

WaitingRoomScreen.propTypes = {
	code: PropTypes.string,
	numRooms: PropTypes.integer,
	players: PropTypes.array
};

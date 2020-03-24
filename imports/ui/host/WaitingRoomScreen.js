import React from 'react';
import PropTypes from 'prop-types';

export default class WaitingRoomScreen extends React.Component {
	renderPlayer(player) {
		return <p key={player._id}>{player.name}</p>;
	}

	render() {
		return (
			<div>
				<h1> Game code</h1>
				<div className="game-code">{this.props.code}</div>
				<div className="players-list">
					<h1>Players in this game:</h1>
					<p>
						{this.props.players.length > 0
							? this.props.players.map(player => this.renderPlayer(player))
							: 'None yet. Join the game at wizard.dog using the code above!'}
					</p>
				</div>
				<button className="btn" onClick={this.props.startGame}>
					Start game
				</button>
			</div>
		);
	}
}

WaitingRoomScreen.propTypes = {
	code: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func
};

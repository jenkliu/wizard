import React from 'react';
import PropTypes from 'prop-types';

export default class WaitingRoomScreen extends React.Component {
	renderPlayer(player) {
		return <p key={player._id}>{player.name}</p>;
	}

	roomHasPlayers() {
		return this.props.players.length > 0;
	}

	render() {
		return (
			<div>
				<h1 className="heading"> Game code</h1>
				<div className="game-code">{this.props.code}</div>
				<div className="players-list">
					<h1 className="heading">Players joined</h1>
					<p>
						{this.roomHasPlayers() ? (
							this.props.players.map((player) => this.renderPlayer(player))
						) : (
							<span>
								None yet. Join the game at{' '}
								<a href="https://www.wizards.dog" target="_blank">
									wizards.dog
								</a>{' '}
								using the code above!
							</span>
						)}
					</p>
				</div>
				<button className="btn" disabled={!this.roomHasPlayers()} onClick={this.props.startGame}>
					Start game
				</button>
			</div>
		);
	}
}

WaitingRoomScreen.propTypes = {
	code: PropTypes.string,
	players: PropTypes.array,
	startGame: PropTypes.func,
};

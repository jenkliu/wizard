import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

export default class PlayerJoinScreen extends React.Component {
	constructor(props) {
		super(props);
		// TODO prepopulate if already exists
		this.state = {
			gameCode: '',
			name: '',
			isShowingModal: false,
		};
	}

	handleShowHowToPlayModal = () => this.setState({ isShowingModal: true });

	handleCloseHowToPlayModal = () => this.setState({ isShowingModal: false });

	handleChangeGameCode = (e) => {
		this.setState({ gameCode: e.target.value.toUpperCase() });
	};

	handleChangeName = (e) => {
		this.setState({ name: e.target.value.toUpperCase() });
	};

	// TODO create real browserKey for 2nd param
	handleClickPlay = () => {
		this.props.joinGame(this.state.name, this.state.name, this.state.gameCode);
	};

	render() {
		return (
			<div>
				<h1 className="wizards-title">w i z a r d s</h1>
				<p />
				<div>
					<input placeholder="Enter game code" value={this.state.gameCode} onChange={this.handleChangeGameCode} />
				</div>
				<div>
					<input placeholder="Enter your name" value={this.state.name} onChange={this.handleChangeName} />
				</div>
				<button className="btn" onClick={this.handleClickPlay}>
					Play
				</button>
				<p className="host-link">
					<a href="#" onClick={this.handleShowHowToPlayModal}>
						How to play
					</a>{' '}
					| <a href="/host">Host a game</a>
				</p>
				<Modal show={this.state.isShowingModal} onHide={this.handleCloseHowToPlayModal}>
					<Modal.Header>
						<span className="close-button" onClick={this.handleCloseHowToPlayModal}>
							✖
						</span>
						<Modal.Title>
							<h3>Modal heading</h3>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Wizards is based on the trick-taking card game{' '}
						<a href="https://en.wikipedia.org/wiki/Wizard_(card_game)">Wizard</a>. Learn how to play{' '}
						<a href="https://ourpastimes.com/play-wizard-card-game-2284959.html">here</a>.
						<p>
							To play Wizards online:
							<ol>
								<li>
									<b>Host:</b> On a laptop, go to <a href="wizards.dog/host">wizards.dog/host</a> and create a game.
								</li>
								<li>
									<b>Host:</b> Screenshare with 2-5 friends.
								</li>
								<li>
									<b>All players (including host):</b> On your mobile device, go to{' '}
									<a href="wizards.dog">wizards.dog</a> and join using the game code on the host's screen.
								</li>
							</ol>
						</p>
						Have fun!
					</Modal.Body>
					<Modal.Footer />
				</Modal>
			</div>
		);
	}
}

PlayerJoinScreen.propTypes = {
	joinGame: PropTypes.func,
};

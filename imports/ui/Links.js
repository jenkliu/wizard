import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';

export default class PlayerJoinScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowingModal: false,
		};
	}

	static defaultProps = {
		shouldShowHostLink: false,
		shouldShowJoinLink: false,
	};

	handleShowHowToPlayModal = () => this.setState({ isShowingModal: true });

	handleCloseHowToPlayModal = () => this.setState({ isShowingModal: false });

	render() {
		return (
			<div>
				<p className="host-link">
					<a href="#" onClick={this.handleShowHowToPlayModal}>
						How to play
					</a>
					{this.props.shouldShowHostLink ? (
						<span>
							{' '}
							| <a href="/host">Host a game</a>
						</span>
					) : null}
					{this.props.shouldShowJoinLink ? (
						<span>
							{' '}
							| <a href="/">Join a game</a>
						</span>
					) : null}
				</p>
				<Modal show={this.state.isShowingModal} onHide={this.handleCloseHowToPlayModal}>
					<Modal.Body>
						<a className="close-button" onClick={this.handleCloseHowToPlayModal}>
							✕
						</a>
						<div className="how-to-play">
							<h1 className="how-to-play-title">How to play </h1>

							<div className="instructions">
								<a href="https://en.wikipedia.org/wiki/Wizard_(card_game)" target="_blank">
									Wizard
								</a>{' '}
								is a trick-taking card game (like Hearts and Spades) for 3-6 players. Learn the rules{' '}
								<a href="https://ourpastimes.com/play-wizard-card-game-2284959.html" target="_blank">
									here
								</a>
								. To play online:
								<h2>1. Create a game</h2> (<i>Only one player does this.</i>) On a laptop, go to{' '}
								<a href="https://www.wizards.dog/host" target="_blank">
									wizards.dog/host
								</a>{' '}
								and create a game. Share your screen with 2-5 friends (e.g. via Zoom).
								<h2>2. Join the game</h2> (<i>All players, including host, do this.</i>) On a mobile device, go to{' '}
								<a href="https://www.wizards.dog" target="_blank">
									wizards.dog
								</a>{' '}
								and join using the game code on the host's screen.
								<h2>3. HAVE FUN!</h2>
							</div>
							<p>
								<button className="btn" onClick={this.handleCloseHowToPlayModal}>
									Got it
								</button>
							</p>
						</div>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

PlayerJoinScreen.propTypes = {
	shouldShowHostLink: PropTypes.bool.isRequired,
	shouldShowJoinLink: PropTypes.bool.isRequired,
};

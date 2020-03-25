import React from 'react';
import PropTypes from 'prop-types';

// TODO: add ability to join existing room as a host

export default class WelcomeScreen extends React.Component {
	render() {
		return (
			<div>
				<h1 className="wizards-title">w i z a r d s</h1>
				<img
					src="
					https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
				/>
				<p>
					<button className="btn" onClick={this.props.createRoom}>
						Create a game
					</button>
				</p>
			</div>
		);
	}
}

WelcomeScreen.propTypes = {
	createRoom: PropTypes.func
};

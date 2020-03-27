import React from 'react';
import PropTypes from 'prop-types';

export default class PlayerWaitingScreen extends React.Component {
	render() {
		return (
			<div className="player-waiting-screen">
				<p>Game code: {this.props.code}</p>
				<p>Waiting for game to start...</p>
			</div>
		);
	}
}

PlayerWaitingScreen.propTypes = {
	code: PropTypes.string
};

import React from 'react';
import PropTypes from 'prop-types';

export default class PlayerWaitingScreen extends React.Component {
	render() {
		return (
			<div>
				<div>Game code: {this.props.code}</div>
				Waiting for game to start...
			</div>
		);
	}
}

PlayerWaitingScreen.propTypes = {
	code: PropTypes.string
};

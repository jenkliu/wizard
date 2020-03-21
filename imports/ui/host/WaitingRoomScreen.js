import React from "react";
import PropTypes from "prop-types";

export default class WaitingRoomScreen extends React.Component {
	render() {
		return (
			<div>
				<h1>Game code</h1>
				{this.props.code}
				<h1>Players in this game:</h1>
				<ul>
					<li> Dean!! ??!!? </li>
					<li> Jen</li>
				</ul>
				<button>Start game</button>
			</div>
		);
	}
}

WaitingRoomScreen.propTypes = {
	code: PropTypes.string
};

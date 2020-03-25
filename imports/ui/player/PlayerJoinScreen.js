import React from 'react';
import PropTypes from 'prop-types';

export default class PlayerJoinScreen extends React.Component {
	constructor(props) {
		super(props);
		// TODO prepopulate if already exists
		this.state = {
			gameCode: '',
			name: ''
		};
	}

	handleChangeGameCode = e => {
		this.setState({ gameCode: e.target.value.toUpperCase() });
	};

	handleChangeName = e => {
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
				<div>
					<input placeholder="Enter game code" value={this.state.gameCode} onChange={this.handleChangeGameCode} />
				</div>
				<div>
					<input placeholder="Enter your name" value={this.state.name} onChange={this.handleChangeName} />
				</div>
				<button className="btn" onClick={this.handleClickPlay}>
					Play
				</button>
			</div>
		);
	}
}

PlayerJoinScreen.propTypes = {
	joinGame: PropTypes.func
};

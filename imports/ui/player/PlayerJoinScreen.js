import React from 'react';

export default class PlayerJoinScreen extends React.Component {
	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
				<div>
					<input placeholder="Enter game code" />
				</div>
				<div>
					<input placeholder="Enter your name" />
				</div>
				<button onClick={this.createRoom}>Play</button>
			</div>
		);
	}
}

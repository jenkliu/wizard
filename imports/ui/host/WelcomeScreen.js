import React from "react";

export default class App extends React.Component {
	createRoom = () => {
		Meteor.call("rooms.create");
	};

	render() {
		return (
			<div>
				<h1>Welcome to Wizard</h1>
				<button onClick={this.createRoom}>Create a room</button>
			</div>
		);
	}
}

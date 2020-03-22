import React from "react";

export default class App extends React.Component {
	createRoom = () => {
		Meteor.call("rooms.create");
	};

	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
				<img
					src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
					width="200px"
				/>
				<button onClick={this.createRoom}>Create a room</button>
			</div>
		);
	}
}

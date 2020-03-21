import React from "react";
import WelcomeScreen from "./host/WelcomeScreen";
import WaitingRoomScreen from "./host/WaitingRoomScreen";
import BidScreen from "./host/BidScreen";

export default class App extends React.Component {
	// TODO add logic for which screen to render
	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
				<img2
					src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
					width="200px"
				/>
				<img
					src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
					width="200px"
				/>
				<br />
				<WelcomeScreen />
				<WaitingRoomScreen
					code="BALLS"
					players={[{ _id: 1, name: "Jen" }, { _id: 2, name: "Dean" }]}
				/>
			</div>
		);
	}
}

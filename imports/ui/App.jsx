import React from "react";
import { WelcomeScreen } from "./host/WelcomeScreen";
import WaitingRoomScreen from "./host/WaitingRoomScreen";
import BidScreen from "./host/BidScreen";

export default class App extends React.Component {
	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
				<img
					src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
					width="200px"
				/>
				<img
					src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg"
					width="200px"
				/>
				<br />
				<button onClick={createRoom}>make a room</button>

				<WaitingRoomScreen
					code="BALLS"
					players={[{ name: "Jen" }, { name: "Dean" }]}
				/>
			</div>
		);
	}
}

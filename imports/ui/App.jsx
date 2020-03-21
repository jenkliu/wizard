import React from "react";
import { WelcomeScreen } from "./host/WelcomeScreen";
import WaitingRoomScreenContainer from "./host/WaitingRoomScreenContainer";
import BidScreen from "./host/BidScreen";

export default class App extends React.Component {
	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
        <img src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg" width="200px"/>
        <img src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg" width="200px"/>
        <br />
				<WaitingRoomScreenContainer />
			</div>
		);
	}
}

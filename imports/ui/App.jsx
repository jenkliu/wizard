import React from "react";
import { WelcomeScreen } from "./host/WelcomeScreen";
import WaitingRoomScreenContainer from "./host/WaitingRoomScreenContainer";
import BidScreen from "./host/BidScreen";

import { RoomsCollection } from "/imports/api/rooms/rooms";

//todo: move this to rooms.js
const createRoom = () => {
	console.log("hey a room");
	RoomsCollection.insert({
		code: "Test",
		createdAt: new Date()
	});
};

export default class App extends React.Component {
	// TODO: Read https://reactjs.org/docs/hooks-state.html

	// TODO put "Make a room" logic in WelcomeScreen & add logic
	// for which screen to show here

	render() {
		return (
			<div>
				<h1>w i z a r d s</h1>
        <img src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg" width="200px"/>
        <img src="https://previews.123rf.com/images/chudtsankov/chudtsankov1303/chudtsankov130300165/18573211-happy-wizard-with-open-arms.jpg" width="200px"/>
        <br />
				<button onClick={createRoom}>make a room</button>

				<WaitingRoomScreenContainer />
			</div>
		);
	}
}

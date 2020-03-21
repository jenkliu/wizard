import { Meteor } from "meteor/meteor";
import { RoomsCollection } from "/imports/api/rooms/rooms";
import { withTracker } from "meteor/react-meteor-data";

import WaitingRoomScreen from "./WaitingRoomScreen";

const WaitingRoomScreenContainer = withTracker(() => {
	Meteor.subscribe("rooms");
	// TODO fetch specific ID
	const rooms = RoomsCollection.find().fetch();
	return {
		// TODO make this less hacky
		code: rooms.length > 0 ? rooms[0].code : null,
		numRooms: rooms.length
	};
})(WaitingRoomScreen);

export default WaitingRoomScreenContainer;

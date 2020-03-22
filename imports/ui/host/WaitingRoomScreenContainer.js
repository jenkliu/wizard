import { Meteor } from "meteor/meteor";
import { RoomsCollection } from "/imports/api/rooms/rooms";
import { withTracker } from "meteor/react-meteor-data";

import WaitingRoomScreen from "./WaitingRoomScreen";

const WaitingRoomScreenContainer = withTracker(({ id }) => {
	Meteor.subscribe("rooms");
	const room = RoomsCollection.findOne({ _id: id });
	return {
		code: room.code,
		players: room.players,
		roomId: room._id
	};
})(WaitingRoomScreen);

export default WaitingRoomScreenContainer;

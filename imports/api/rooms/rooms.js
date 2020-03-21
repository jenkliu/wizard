import { Mongo } from "meteor/mongo";

export const RoomsCollection = new Mongo.Collection("rooms");

Meteor.methods({
	"rooms.create"() {
		console.log("making a room");
		RoomsCollection.insert({
			code: "Test",
			createdAt: new Date()
		});
	}
});

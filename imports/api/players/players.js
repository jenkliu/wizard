import { Mongo } from 'meteor/mongo';
import { RoomsCollection } from '/imports/api/rooms/rooms';

export const PlayersCollection = new Mongo.Collection('players');

Meteor.methods({
  'players.get_or_create'(name, browserKey, roomCode) {
    // TODO if game for this room is active, throw error

    room = RoomsCollection.find({ code: roomCode, gameState: 'waiting' }, { sort: { createdAt: -1 } }).fetch()[0];
    if (room == null) {
      console.log("Couldn't find room");
      return;
    }

    // If the browserKey x roomCode already exists, just grab that player.
    player = PlayersCollection.find({ browserKey: browserKey, roomID: room._id }).fetch()[0];
    if (player == null) {
      player = PlayersCollection.insert({
        name: name,
        browserKey: browserKey,
        roomID: room._id
      });
    }

    // Refresh player object
    player = PlayersCollection.find({ browserKey: browserKey, roomID: room._id }).fetch()[0];
    console.log('Player: ' + player._id, player);
    return player._id;
  }
});

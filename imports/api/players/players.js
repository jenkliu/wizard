import { Mongo } from 'meteor/mongo';

export const PlayersCollection = new Mongo.Collection('players');

Meteor.methods({
  'players.get_or_create'(name, browserKey, roomCode){
    // If the browserKey x roomCode already exists, just grab that player.
    player = PlayersCollection.find({browserKey: browserKey, roomCode: roomCode}).fetch()[0];
    if (player == null) {
      player = PlayersCollection.insert({
        name: name,
        browserKey: browserKey,
        roomCode: roomCode,
      });
    }

    // Refresh player object
    player = PlayersCollection.find({browserKey: browserKey, roomCode: roomCode}).fetch()[0];
    console.log("Player: " + player._id);
    return player._id;
  },
});

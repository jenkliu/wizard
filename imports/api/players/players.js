import { Mongo } from 'meteor/mongo';

export const PlayersCollection = new Mongo.Collection('players');

Meteor.methods({
  'players.create'(name, browserKey){
    player = PlayersCollection.insert({
      name: name,
      browserKey: browserKey,
    });
    console.log("Created a player: " + player);
  },
});

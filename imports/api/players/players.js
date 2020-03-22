import { Mongo } from 'meteor/mongo';

export const PlayersCollection = new Mongo.Collection('players');

Meteor.methods({
  'players.create'(name, browserKey){
    player = PlayerCollection.insert({
      name: name,
      browserKey: browserKey,
    });
  },
});

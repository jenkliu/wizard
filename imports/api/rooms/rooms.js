import { Mongo } from 'meteor/mongo';

export const RoomsCollection = new Mongo.Collection('rooms');

Meteor.methods({
  'rooms.create'() {
    console.log("Making a room!");

    RoomsCollection.insert({
      game_state: "waiting",
      code: "BALLS",
      createdAt: new Date(),
      players: [
        {name: "Dean"},
        {name: "Jennifer"}
      ],
      num_tricks_arr: [1, 2, 3, 4, 5],
      curr_round: null,
      rounds: [],
    });
  },
  'rooms.rounds.start'(roomId) {
    // todo: start a round
    curr_round = {
      state: "bid",
      active_player: null,
      bids: [],
      num_tricks: 69,
      tricks: [],
      player_ids_to_cards: {},
      curr_trick: []
    }
  },
  'rooms.tricks.start'(roomId) {
    // todo: start a trick
    curr_trick = {
      lead_player_id: "",
      winning_player_id: "",
      cards_played: {},
      lead_suit: ""
    }
  }
})

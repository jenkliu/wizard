import { Mongo } from "meteor/mongo";

export const RoomsCollection = new Mongo.Collection("rooms");

Meteor.methods({
	"rooms.create"() {
		console.log("Making a room!");

    RoomsCollection.insert({
      gameState: "waiting",
      code: "BALLS",
      createdAt: new Date(),
      players: [
        {name: "Dean"},
        {name: "Jennifer"}
      ],
      numTricksArr: [1, 2, 3, 4, 5],
      currRound: null,
      rounds: [],
    });
  },

  'rooms.rounds.start'(roomID) {
    // todo: if currRound is not null, move currRound to the rounds array
    room = RoomsCollection.find({_id: roomID}).fetch()[0];
    rounds = room.rounds;
    if(room.currRound) {
      rounds.push(room.currRound);
    }
    RoomsCollection.update(roomID, {
      $set: {
        rounds: rounds,
        currRound: {
          state: "bid",
          activePlayer: null,
          bids: [],
          numTricks: 69,
          playerIDsToCards: {},
          trumpCard: null,
          currTrick: [],
          tricks: []
        }
      }
    });
    // todo: call rooms.rounds.deal
  },
  'rooms.rounds.deal'(roomID) {
    // todo: set trumpCard (can't be a wizard)
    // todo: set playerIDsToCards
  },
  'rooms.rounds.playerIDsToTricksWon'(round) {
    // todo: helper function to determine which tricks were won by which players
  },
  'rooms.rounds.playerIDsToScores'(round) {
    // todo: helper function to determine the scores of each round
  },

  'rooms.tricks.start'(roomID) {
    // todo: move currTrick to the tricks array
    // todo: set currTrick
    currTrick = {
      leadPlayerID: "",
      winningPlayerID: "",
      cardsPlayed: {},
      leadSuit: ""
    }
  }
})

import { Mongo } from "meteor/mongo";

export const RoomsCollection = new Mongo.Collection("rooms");

Meteor.methods({
	"rooms.create"() {
    room = RoomsCollection.insert({
      gameState: "waiting",
      code: "BALLS",
      createdAt: new Date(),
      players: [
        {
          _id: 1,
          name: "Dean"
        },
        {
          _id: 2,
          name: "Jennifer"
        },
        {
          _id: 3,
          name: "Bruno"
        }
      ],
      numTricksArr: [1, 2, 3, 4, 5],
      currRound: null,
      rounds: [],
    });
    console.log("Made a room with ID: " + room);
  },

  'rooms.rounds.start'(roomID) {
    room = RoomsCollection.find({_id: roomID}).fetch()[0];

    // update historical rounds array
    rounds = room.rounds;
    if(room.currRound) {
      rounds.push(room.currRound);
    };

    playerIDsToBids = room.players.reduce(function(map, obj) {
      map[obj._id] = null;
      return map;
    }, {});

    // initialize round
    RoomsCollection.update(roomID, {
      $set: {
        rounds: rounds,
        currRound: {
          state: "bid",
          activePlayer: null,
          playerIDsToBids: playerIDsToBids,
          numTricks: 69,
          playerIDsToCards: {},
          trumpCard: null,
          currTrick: null,
          tricks: []
        }
      }
    });
  },
  'rooms.rounds.deal'(roomID) {
    // todo: set trumpCard (can't be a wizard)
    // todo: set playerIDsToCards
  },
  'rooms.rounds.updateBid'(roomID, playerID, bid) {
    room = RoomsCollection.find({_id: roomID}).fetch()[0];
    currRound = room.currRound;
    currRound.playerIDsToBids[playerID] = bid;
    RoomsCollection.update(roomID, {
      $set: {currRound: currRound}
    });
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

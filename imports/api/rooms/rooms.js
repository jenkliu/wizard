import { Mongo } from "meteor/mongo";

export const RoomsCollection = new Mongo.Collection("rooms");

var shuffle = require("shuffle-array");

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
			rounds: [],
			currRound: null
		});
		console.log("Made a room with ID: " + room);
	},
	"rooms.start"(roomID) {
		room = RoomsCollection.find({ _id: roomID }).fetch()[0];
		RoomsCollection.update(roomID, {
			$set: { gameState: "active" }
		});
		console.log("Room is now active" + room);
	},

	"rooms.rounds.start"(roomID) {
		room = RoomsCollection.find({ _id: roomID }).fetch()[0];

		// Update historical rounds array
		rounds = room.rounds;
		if (room.currRound) {
			rounds.push(room.currRound);
		}

		playerIDsToBids = room.players.reduce(function(map, obj) {
			map[obj._id] = null;
			return map;
		}, {});

		RoomsCollection.update(roomID, {
			$set: {
				rounds: rounds,
				currRound: {
					state: "bid",
					activePlayer: null, // todo: set activePlayer
					playerIDsToBids: playerIDsToBids,
					numTricks: 5, // todo: set numTricks from numTricksArr
					playerIDsToCards: {},
					trumpCard: null,
					tricks: [],
					currTrick: null
				}
			}
		});
	},
	"rooms.rounds.deal"(roomID) {
		room = RoomsCollection.find({ _id: roomID }).fetch()[0];

		deck = [];
		suits = ["S", "H", "C", "D"];
		suits.forEach(function(suit) {
			for (value = 2; value <= 14; value++) {
				deck.push({
					suit: suit,
					value: value,
					type: "Standard"
				});
			}
		});
		shuffle(deck);
		// Set trumpCard, ensuring (for now) that it's neither a Wizard nor a
		// Jester.
		trumpCard = deck.pop();

		// Add Wizards and Jesters
		for (i = 0; i < 4; i++) {
			deck.push({ suit: null, value: null, type: "Wizard" });
			deck.push({ suit: null, value: null, type: "Jester" });
		}
		shuffle(deck);

		// Deal out
		playerIDsToCards = {};
		room.players.forEach(function(player) {
			hand = [];
			for (i = 0; i < room.currRound.numTricks; i++) {
				hand.push(deck.pop());
			}
			playerIDsToCards[player._id] = hand;
		});

		currRound = room.currRound;
		currRound.trumpCard = trumpCard;
		currRound.playerIDsToCards = playerIDsToCards;
		RoomsCollection.update(roomID, {
			$set: { currRound: currRound }
		});
	},
	"rooms.rounds.updateBid"(roomID, playerID, bid) {
		room = RoomsCollection.find({ _id: roomID }).fetch()[0];
		currRound = room.currRound;
		currRound.playerIDsToBids[playerID] = bid;
		RoomsCollection.update(roomID, {
			$set: {
				currRound: currRound
				// todo: update activePlayer to the next one
			}
		});
	},
	"rooms.rounds.beginPlay"(roomID) {
		// todo: change round state from "bid" to "play"
	},
	"rooms.rounds.playerIDsToTricksWon"(round) {
		// todo: helper function to determine which tricks were won by which players
	},
	"rooms.rounds.playerIDsToScores"(round) {
		// todo: helper function to determine the scores of each round
	},

	"rooms.tricks.start"(roomID) {
		// todo: move currTrick to the tricks array
		// todo: set currTrick
		currTrick = {
			leadPlayerID: "",
			winningPlayerID: "",
			playerIDsToCards: {},
			leadCard: ""
		};
	},
	"rooms.tricks.playCard"(roomID, playerID, card) {
		// todo:
	}
});

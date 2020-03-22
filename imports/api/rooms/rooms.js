import { Mongo } from 'meteor/mongo';
import { PlayersCollection } from '/imports/api/players/players';

export const RoomsCollection = new Mongo.Collection('rooms');

var shuffle = require('shuffle-array');

function getNextPlayerID(players, currentPlayerID) {
  playerIDs = players.map(function(player){ return player._id });
  return playerIDs[(playerIDs.indexOf(currentPlayerID) + 1) % playerIDs.length];
}

Meteor.methods({
  'rooms.create'() {
    room = RoomsCollection.insert({
      gameState: 'waiting',
      code: 'BALLS',
      createdAt: new Date(),
      players: [],
      numTricksArr: [1, 2, 3, 4, 5],
      rounds: [],
      currRound: null
    });
    console.log('Made a room with ID: ' + room);
  },
  'rooms.addPlayer'(playerID) {
    player = PlayersCollection.find({ _id: playerID }).fetch()[0];
    room = RoomsCollection.find({ _id: player.roomID }).fetch()[0];
    players = room.players;
    players.push(player);
    RoomsCollection.update(room._id, {
      $set: { players: players }
    });
  },
  'rooms.removePlayer'(playerID) {
    player = PlayersCollection.find({ _id: playerID }).fetch()[0];
    room = RoomsCollection.find({ _id: player.roomID }).fetch()[0];
    players = room.players.filter(function(player) {
      return player._id != playerID;
    });
    RoomsCollection.update(room._id, {
      $set: { players: players }
    });
  },
  'rooms.start'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    RoomsCollection.update(roomID, {
      $set: { gameState: 'active', players: shuffle(room.players) }
    });
  },

  'rooms.rounds.start'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];

    // Update historical rounds array
    rounds = room.rounds;
    if (room.currRound) {
      rounds.push(room.currRound);
    }
    roundsPlayed = rounds.length; // gratuitously self-documenting, lol

    playerIDsToBids = room.players.reduce(function(map, obj) {
      map[obj._id] = null;
      return map;
    }, {});

    // Action starts with the player 'after' the dealer.
    activePlayer = room.players[(roundsPlayed + 1) % room.players.length];

    RoomsCollection.update(roomID, {
      $set: {
        rounds: rounds,
        currRound: {
          state: 'bid',
          activePlayerID: activePlayer._id,
          playerIDsToBids: playerIDsToBids,
          numTricks: room.numTricksArr[roundsPlayed],
          playerIDsToCards: {},
          trumpCard: null,
          tricks: [],
          currTrick: null
        }
      }
    });
  },
  'rooms.rounds.deal'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];

    deck = [];
    suits = ['S', 'H', 'C', 'D'];
    suits.forEach(function(suit) {
      for (value = 2; value <= 14; value++) {
        deck.push({
          suit: suit,
          value: value,
          type: 'Standard'
        });
      }
    });
    shuffle(deck);
    // Set trumpCard, ensuring (for now) that it's neither a Wizard nor a
    // Jester.
    trumpCard = deck.pop();

    // Add Wizards and Jesters
    for (i = 0; i < 4; i++) {
      deck.push({ suit: null, value: null, type: 'Wizard' });
      deck.push({ suit: null, value: null, type: 'Jester' });
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
  'rooms.rounds.updateBid'(roomID, playerID, bid) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];

    if (playerID != room.currRound.activePlayerID) { return; }

    currRound = room.currRound;
    currRound.playerIDsToBids[playerID] = bid;
    currRound.activePlayerID = getNextPlayerID(room.players, playerID);
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
  },
  'rooms.rounds.beginPlay'(roomID) {
    // todo: change round state from "bid" to "play"
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
      leadPlayerID: '',
      winningPlayerID: '',
      playerIDsToCards: {},
      leadCard: ''
    };
  },
  'rooms.tricks.playCard'(roomID, playerID, card) {
    // todo:
  }
});

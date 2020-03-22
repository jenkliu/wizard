import { Mongo } from 'meteor/mongo';
import { PlayersCollection } from '/imports/api/players/players';

export const RoomsCollection = new Mongo.Collection('rooms');

var shuffle = require('shuffle-array');

function getNextPlayerID(players, currentPlayerID) {
  playerIDs = players.map(function(player) {
    return player._id;
  });
  return playerIDs[(playerIDs.indexOf(currentPlayerID) + 1) % playerIDs.length];
}

function isLegalPlay(trickLeadCard, hand, card) {
  if (trickLeadCard == null) {
    return true;
  } else if (card.type == "Wizard" || card.type == "Jester") {
    return true;
  } else if (trickLeadCard.type == "Wizard") {
    return true;
  } else if (trickLeadCard.suit == card.suit) {
    return true;
  } else if (hand.filter(function(card) {
      return card.suit == trickLeadCard.suit; }).length == 0) {
    return true;
  }
  
  return false;
}

Meteor.methods({
  'rooms.create'() {
    room = RoomsCollection.insert({
      gameState: 'waiting',
      code: 'BALLS', // todo: make the code random, lol
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
    // TODO: throw error if we haven't dealt yet

    room = RoomsCollection.find({ _id: roomID }).fetch()[0];

    if (playerID != room.currRound.activePlayerID) {
      throw new Meteor.Error('action taken by non-active player');
    }

    currRound = room.currRound;
    currRound.playerIDsToBids[playerID] = bid;
    currRound.activePlayerID = getNextPlayerID(room.players, playerID);
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
    console.log('Bid updated', room);
  },
  'rooms.rounds.beginPlay'(roomID) {
    // todo: throw error if the bids aren't in yet
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound;
    currRound.state = "play";
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
  },
  'rooms.rounds.playerIDsToTricksWon'(round) {
    // todo: helper function to determine which tricks were won by which players
  },
  'rooms.rounds.playerIDsToScores'(round) {
    // todo: helper function to determine the scores of each round
  },

  'rooms.tricks.start'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound

    // Update historical tricks array
    if (currRound.currTrick) {
      currRound.activePlayerID = currRound.currTrick.winningPlayerID;
      currRound.tricks.push(currRound.currTrick);
    }

    currRound.currTrick = {
      leadPlayerID: currRound.activePlayerID,
      winningPlayerID: null,
      playerIDsToCards: {},
      // NOTE: This isn't redundant - consider if a trick starts with Player 1
      // playing a Jester, followed by Player 2 playing an 8 of Clubs. Then,
      // Player 3 must also play a Club. In this case, we would set leadCard to
      // the 8 of Clubs.
      leadCard: null,
    };
    
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
  },
  'rooms.tricks.playCard'(roomID, playerID, card) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound

    if (playerID != room.currRound.activePlayerID) {
      throw new Meteor.Error('action taken by non-active player');
    }
    // todo: throw error if the player doesn't actually have that card

    if (!isLegalPlay(currRound.currTrick.leadCard, currRound.playerIDsToCards[playerID], card)) {
      throw new Meteor.Error('illegal move')
    }

    currRound.currTrick.playerIDsToCards[playerID] = card;
    if (!currRound.currTrick.leadCard && card.type != "Jester") {
      currRound.currTrick.leadCard = card;
    }
    currRound.activePlayerID = getNextPlayerID(room.players, playerID);

    playerCards = currRound.playerIDsToCards[playerID].filter(function(handCard) {
      return !((handCard.suit == card.suit) && (handCard.value == card.value) && (handCard.type == card.type))
    });
    if (playerCards.length == currRound.playerIDsToCards[playerID].length) {
      throw new Meteor.Error('card not in hand');
    }
    currRound.playerIDsToCards[playerID] = playerCards;
  
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
  },
  'rooms.tricks.finish'(roomID) {
    // todo: throw an error if not everyone has played a card

    // IF THERE IS AT LEAST 1 WIZARD: apply wizard logic
    // IF THERE ARE ALL JESTERS: whoever went first

    // otherwise, look at only the Standard cards
    // highest trump card wins
    // otherwise, highest leadCard wins
  },
});

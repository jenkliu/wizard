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

export function isLegalPlay(trickLeadCard, hand, card) {
  // Make sure the card exists in the hand!
  matchingCards = hand.filter(function(handCard) {
    return handCard.id == card.id;
  });
  if (matchingCards.length == 0) {
    return false;
  }

  if (trickLeadCard == null) {
    return true;
  } else if (card.type == 'Wizard' || card.type == 'Jester') {
    return true;
  } else if (trickLeadCard.type == 'Wizard') {
    return true;
  } else if (trickLeadCard.suit == card.suit) {
    return true;
  } else if (
    hand.filter(function(card) {
      return card.suit == trickLeadCard.suit;
    }).length == 0
  ) {
    return true;
  }

  return false;
}

export function getWinningPlayerID(trickCards, leadCard, trumpCard, orderedPlayerIDs) {
  // If a wizard is played, the first wizard wins.
  for (i = 0; i < orderedPlayerIDs.length; i++) {
    if (trickCards[orderedPlayerIDs[i]].type == 'Wizard') {
      return orderedPlayerIDs[i];
    }
  }

  // If all cards are jesters, the first card wins.
  isAllJesters = true;
  for ([k, v] of Object.entries(trickCards)) {
    if (v.type != 'Jester') {
      isAllJesters = false;
    }
  }
  if (isAllJesters) {
    return orderedPlayerIDs[0];
  }

  // Otherwise, the best standard card wins.
  standardCards = Object.entries(trickCards).filter(function([id, card]) {
    return card.type == 'Standard';
  });
  // Trump suit > led suit > other suits
  suitValues = { C: 0, D: 0, H: 0, S: 0 };
  suitValues[leadCard.suit] = 1;
  suitValues[trumpCard.suit] = 2;

  // Sort the standard cards in descending order of quality
  standardCards.sort(function([id1, c1], [id2, c2]) {
    if (suitValues[c1.suit] != suitValues[c2.suit]) {
      return suitValues[c2.suit] - suitValues[c1.suit];
    } else {
      return c2.value - c1.value;
    }
  });

  return standardCards[0][0];
}

export function getPlayerIDsToScores(round) {
  // todo: throw error if the round hasn't ended
  playerIDs = Object.keys(round.playerIDsToBids);
  playerIDsToTricksTaken = {};
  playerIDsToScores = {};
  for (i = 0; i < playerIDs.length; i++) {
    playerIDsToTricksTaken[playerIDs[i]] = 0;
  }
  for (i = 0; i < round.tricks.length; i++) {
    playerIDsToTricksTaken[round.tricks[i].winningPlayerID] += 1;
  }
  for (i = 0; i < playerIDs.length; i++) {
    playerBid = round.playerIDsToBids[playerIDs[i]];
    playerTricksTaken = playerIDsToTricksTaken[playerIDs[i]];
    if (playerBid == playerTricksTaken) {
      playerIDsToScores[playerIDs[i]] = 20 + 10 * playerBid;
    } else {
      playerIDsToScores[playerIDs[i]] = -10 * Math.abs(playerBid - playerTricksTaken);
    }
  }
  return playerIDsToScores;
}

Meteor.methods({
  'rooms.create'() {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';
    code = '';
    for (var i = 0; i < 5; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      code += chars.substring(rnum, rnum + 1);
    }
    return RoomsCollection.insert({
      state: 'waiting',
      code: code,
      createdAt: new Date(),
      players: [],
      numTricksArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

      rounds: [],
      currRound: null
    });
  },
  'rooms.addPlayer'(playerID) {
    player = PlayersCollection.find({ _id: playerID }).fetch()[0];
    room = RoomsCollection.find({ _id: player.roomID }).fetch()[0];

    if (room.state != 'waiting') {
      throw new Meteor.Error('cannot add player to a non-waiting room');
    }

    players = room.players;
    players.push(player);
    RoomsCollection.update(room._id, {
      $set: { players: players }
    });
  },
  'rooms.removePlayer'(playerID) {
    player = PlayersCollection.find({ _id: playerID }).fetch()[0];
    room = RoomsCollection.find({ _id: player.roomID }).fetch()[0];

    if (room.state != 'waiting') {
      throw new Meteor.Error('cannot remove player from a non-waiting room');
    }

    players = room.players.filter(function(player) {
      return player._id != playerID;
    });
    RoomsCollection.update(room._id, {
      $set: { players: players }
    });
  },
  'rooms.start'(roomID) {
    if (room.state != 'waiting') {
      throw new Meteor.Error('you are trying to start a non-waiting room');
    }

    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    RoomsCollection.update(roomID, {
      $set: { state: 'active', players: shuffle(room.players) }
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
    for (i = 0; i < suits.length; i++) {
      for (value = 2; value <= 14; value++) {
        deck.push({
          id: i * 13 + value - 1,
          suit: suits[i],
          value: value,
          type: 'Standard'
        });
      }
    }
    shuffle(deck);
    // Set trumpCard, ensuring (for now) that it's neither a Wizard nor a
    // Jester.
    trumpCard = deck.pop();

    // Add Wizards and Jesters
    for (i = 0; i < 4; i++) {
      deck.push({ id: 53 + i, suit: null, value: null, type: 'Wizard' });
      deck.push({ id: 57 + i, suit: null, value: null, type: 'Jester' });
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
    return currRound.playerIDsToBids;
  },
  'rooms.rounds.beginPlay'(roomID) {
    // todo: throw error if the bids aren't in yet
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];

    for ([playerID, bid] of Object.entries(room.currRound.playerIDsToBids)) {
      if (bid == null) {
        throw new Meteor.Error('everyone needs to bid before you begin play');
      }
    }

    currRound = room.currRound;
    currRound.state = 'play';
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
  },
  'rooms.rounds.getPlayerIDsToScores'(roomID) {
    // get total scores from all historical rounds
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    scores = room.rounds.map(function(round) {
      return getPlayerIDsToScores(round);
    });

    playerIDs = Object.keys(room.currRound.playerIDsToBids);
    playerIDsToScores = getPlayerIDsToScores(room.currRound);
    return scores.reduce(function(playerIDsToScores, roundScores) {
      for (i = 0; i < playerIDs.length; i++) {
        playerIDsToScores[playerIDs[i]] += roundScores[playerIDs[i]];
      }
      return playerIDsToScores;
    }, playerIDsToScores);
  },
  'rooms.rounds.getCurrRoundPlayerIDsToScores'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    return getPlayerIDsToScores(room.currRound);
  },

  'rooms.tricks.start'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound;

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
      leadCard: null
    };

    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
  },
  'rooms.tricks.playCard'(roomID, playerID, card) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound;

    if (playerID != room.currRound.activePlayerID) {
      throw new Meteor.Error('action taken by non-active player');
    }

    if (!isLegalPlay(currRound.currTrick.leadCard, currRound.playerIDsToCards[playerID], card)) {
      throw new Meteor.Error('illegal move');
    }

    currRound.currTrick.playerIDsToCards[playerID] = card;
    if (!currRound.currTrick.leadCard && card.type != 'Jester') {
      currRound.currTrick.leadCard = card;
    }

    playerCards = currRound.playerIDsToCards[playerID].filter(function(handCard) {
      return !(handCard.id == card.id);
    });
    currRound.playerIDsToCards[playerID] = playerCards;

    if (Object.keys(currRound.currTrick.playerIDsToCards).length < room.players.length) {
      currRound.activePlayerID = getNextPlayerID(room.players, playerID);
    } else {
      currRound.activePlayerID = null;
    }

    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
    return currRound.currTrick.playerIDsToCards;
  },
  'rooms.tricks.finish'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound;
    // todo: throw an error if not everyone has played a card

    orderedPlayerIDs = [];
    playerIDs = room.players.map(function(p) {
      return p._id;
    });
    leadPlayerIndex = playerIDs.indexOf(currRound.currTrick.leadPlayerID);
    for (i = 0; i < playerIDs.length; i++) {
      orderedPlayerIDs.push(playerIDs[(leadPlayerIndex + i) % playerIDs.length]);
    }

    currRound.currTrick.winningPlayerID = getWinningPlayerID(
      room.currRound.currTrick.playerIDsToCards,
      currRound.currTrick.leadCard,
      currRound.trumpCard,
      orderedPlayerIDs
    );
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
    return {
      isLastTrick: currRound.numTricks == currRound.tricks.length + 1,
      winningPlayerID: currRound.currTrick.winningPlayerID
    };
  },
  'rooms.rounds.finish'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];
    currRound = room.currRound;

    // Clean up the last trick
    if (currRound.currTrick) {
      currRound.activePlayerID = currRound.currTrick.winningPlayerID;
      currRound.tricks.push(currRound.currTrick);
      currRound.currTrick = null;
    }
    currRound.activePlayerID = null;
    currRound.state = 'finished';
    RoomsCollection.update(roomID, {
      $set: { currRound: currRound }
    });
    return { isLastRound: room.numTricksArr.length == room.rounds.length + 1 };
  },
  'rooms.finish'(roomID) {
    room = RoomsCollection.find({ _id: roomID }).fetch()[0];

    // Clean up the last round
    rounds = room.rounds;
    if (room.currRound) {
      rounds.push(room.currRound);
    }

    RoomsCollection.update(roomID, {
      $set: {
        rounds: rounds,
        currRound: null,
        state: 'finished'
      }
    });
  }
});

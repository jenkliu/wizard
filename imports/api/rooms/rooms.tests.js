import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { RoomsCollection, getWinningPlayerID, isLegalPlay, getPlayerIDsToScores } from './rooms.js';
import { PlayersCollection } from '../players/players.js'

if (Meteor.isServer) {
  describe('Rooms', () => {
    describe('scores rounds properly', () => {
      it('refuses to score an unfinished round', () => {
        assert.throws(() => {
          getPlayerIDsToScores({
            state: 'play',
            playerIDsToBids: {a: 2, b: 1, c: 1},
            numTricks: 5,
            tricks: [
              {winningPlayerID: 'a'},
              {winningPlayerID: 'a'},
              {winningPlayerID: 'b'},
              {winningPlayerID: 'c'},
            ]
          });
        }, Meteor.Error, 'cannot compute the score of an unfinished round');
      });

      it('standard round, player c busts', () => {
        scores = getPlayerIDsToScores({
          state: 'finished',
          playerIDsToBids: {a: 2, b: 1, c: 1},
          numTricks: 5,
          tricks: [
            {winningPlayerID: 'a'},
            {winningPlayerID: 'a'},
            {winningPlayerID: 'b'},
            {winningPlayerID: 'c'},
            {winningPlayerID: 'c'},
          ]
        });
        assert.equal(scores.a, 40);
        assert.equal(scores.b, 30);
        assert.equal(scores.c, -10);
      });
    });

    describe('picks the right winners', () => {
      it('multiple wizards', () => {
        winningPlayerID = getWinningPlayerID({
            'a': {suit: 'S', value: 7, type: 'Standard'},
            'b': {suit: null, value: null, type: 'Wizard'},
            'c': {suit: null, value: null, type: 'Wizard'},
          },
          {suit: 'S', value: 7, type: 'Standard'},
          {suit: 'S', value: 9, type: 'Standard'},
          ['a', 'b', 'c']
        );
        assert.equal(winningPlayerID, 'b');
      });

      it('all jesters', () => {
        winningPlayerID = getWinningPlayerID({
            'a': {suit: null, value: null, type: 'Jester'},
            'b': {suit: null, value: null, type: 'Jester'},
            'c': {suit: null, value: null, type: 'Jester'},
            'd': {suit: null, value: null, type: 'Jester'},
          },
          null,
          {suit: 'S', value: 9, type: 'Standard'},
          ['a', 'b', 'c', 'd']
        );
        assert.equal(winningPlayerID, 'a');
      });

      it('trump', () => {
        winningPlayerID = getWinningPlayerID({
            'a': {suit: 'S', value: 7, type: 'Standard'},
            'b': {suit: 'S', value: 11, type: 'Standard'},
            'c': {suit: 'D', value: 7, type: 'Standard'},
          },
          {suit: 'S', value: 7, type: 'Standard'},
          {suit: 'D', value: 9, type: 'Standard'},
          ['a', 'b', 'c']
        );
        assert.equal(winningPlayerID, 'c');
      });

      it('no trumps', () => {
        winningPlayerID = getWinningPlayerID({
            'a': {suit: 'S', value: 7, type: 'Standard'},
            'b': {suit: 'S', value: 11, type: 'Standard'},
            'c': {suit: 'S', value: 3, type: 'Standard'},
          },
          {suit: 'S', value: 7, type: 'Standard'},
          {suit: 'D', value: 9, type: 'Standard'},
          ['a', 'b', 'c']
        );
        assert.equal(winningPlayerID, 'b');
      });

      it('off-suits', () => {
        winningPlayerID = getWinningPlayerID({
            'a': {suit: 'S', value: 7, type: 'Standard'},
            'b': {suit: 'C', value: 11, type: 'Standard'},
            'c': {suit: 'H', value: 3, type: 'Standard'},
          },
          {suit: 'S', value: 7, type: 'Standard'},
          {suit: 'D', value: 9, type: 'Standard'},
          ['a', 'b', 'c']
        );
        assert.equal(winningPlayerID, 'a');
      });

      it('joker leads', () => {
        winningPlayerID = getWinningPlayerID({
            'a': {suit: null, value: null, type: 'Joker'},
            'b': {suit: 'S', value: 11, type: 'Standard'},
            'c': {suit: 'S', value: 3, type: 'Standard'},
          },
          {suit: 'S', value: 11, type: 'Standard'},
          {suit: 'D', value: 9, type: 'Standard'},
          ['a', 'b', 'c']
        );
        assert.equal(winningPlayerID, 'b');
      });
    });

    describe('legal plays (can tell the difference between right and wrong)', () => {
      it('no lead card', () => {
        assert.equal(isLegalPlay(
          null,
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
          ],
          {id: 45, suit: 'S', value: 7, type: 'Standard'}
        ), true);
      });

      it('wizard-led', () => {
        assert.equal(isLegalPlay(
          {id: 53, suit: null, value: null, type: 'Wizard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
            {id: 53, suit: null, value: null, type: 'Wizard'},
          ],
          {id: 45, suit: 'S', value: 7, type: 'Standard'}
        ), true);

        assert.equal(isLegalPlay(
          {id: 53, suit: null, value: null, type: 'Wizard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
            {id: 53, suit: null, value: null, type: 'Wizard'},
          ],
          {id: 53, suit: null, value: null, type: 'Wizard'},
        ), true);
      });

      it('following suit', () => {
        assert.equal(isLegalPlay(
          {id: 44, suit: 'S', value: 6, type: 'Standard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
          ],
          {id: 45, suit: 'S', value: 7, type: 'Standard'}
        ), true);

        assert.equal(isLegalPlay(
          {id: 44, suit: 'S', value: 6, type: 'Standard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
          ],
          {id: 21, suit: 'D', value: 9, type: 'Standard'}
        ), false);
      });

      it('off-suit', () => {
        assert.equal(isLegalPlay(
          {id: 44, suit: 'S', value: 6, type: 'Standard'},
          [
            {id: 19, suit: 'D', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
          ],
          {id: 19, suit: 'D', value: 7, type: 'Standard'},
        ), true);
      });

      it('non-standard cards can be played whenever you want', () => {
        assert.equal(isLegalPlay(
          {id: 44, suit: 'S', value: 6, type: 'Standard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 53, suit: null, value: null, type: 'Wizard'},
            {id: 54, suit: null, value: null, type: 'Wizard'},
            {id: 57, suit: null, value: null, type: 'Jester'},
            {id: 58, suit: null, value: null, type: 'Jester'},
          ],
          {id: 53, suit: null, value: null, type: 'Wizard'}
        ), true);

        assert.equal(isLegalPlay(
          {id: 44, suit: 'S', value: 6, type: 'Standard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 53, suit: null, value: null, type: 'Wizard'},
            {id: 54, suit: null, value: null, type: 'Wizard'},
            {id: 57, suit: null, value: null, type: 'Jester'},
            {id: 58, suit: null, value: null, type: 'Jester'},
          ],
          {id: 57, suit: null, value: null, type: 'Jester'}
        ), true);
      });

      it('playing a non-existant wizard', () => {
        assert.equal(isLegalPlay(
          {id: 44, suit: 'S', value: 6, type: 'Standard'},
          [
            {id: 45, suit: 'S', value: 7, type: 'Standard'},
            {id: 21, suit: 'D', value: 9, type: 'Standard'},
          ],
          {id: 53, suit: null, value: null, type: 'Wizard'}
        ), false);
      });
    });

    describe('lobby stuff', () => {
      let roomID;

      beforeEach(() => {
        RoomsCollection.remove({});
        PlayersCollection.remove({});
      });

      it('creating a room', () => {
        roomID = Meteor.call('rooms.create');
        assert.equal(RoomsCollection.find().fetch().length, 1)
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.state, 'waiting');
        assert.equal(room.rounds.length, 0);
        assert.equal(room.currRound, null);
      });

      it('join a waiting room', () => {
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];

        player1_id = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);
        player2_id = Meteor.call('players.get_or_create', 'Jennifer', 'BBB', room.code);
        player3_id = Meteor.call('players.get_or_create', 'Max', 'CCC', room.code);

        assert.equal(
          Meteor.call('players.get_or_create', 'Newplayer', 'CCC', room.code),
          player3_id);
        assert.equal(PlayersCollection.find().fetch().length, 3)
      });

      it('cannot join a non-existant room', () => {
        assert.equal(
          Meteor.call('players.get_or_create', 'Dean', 'AAA', 'BADCODE'),
          null);
      });

      it('cannot join a finished room', () => {
        roomID = Meteor.call('rooms.create');
        RoomsCollection.update(roomID, {
          $set: { state: 'finished' }
        });

        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(
          Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code),
          null);
      });

      it('adding and removing players', () => {
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        player1_id = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);
        player2_id = Meteor.call('players.get_or_create', 'Jennifer', 'BBB', room.code);

        Meteor.call('rooms.addPlayer', player1_id);
        Meteor.call('rooms.addPlayer', player2_id);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.players.length, 2);
        assert.equal(room.players[0]._id, player1_id);
        assert.equal(room.players[1]._id, player2_id);

        Meteor.call('rooms.removePlayer', player2_id);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.players.length, 1);
      });

      it('cannot add/remove players to/from active rooms', () => {
        roomID = Meteor.call('rooms.create');
        Meteor.call('rooms.start', roomID);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        playerID = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);

        assert.throws(() => {
          Meteor.call('rooms.addPlayer', playerID);
        }, Meteor.Error, 'cannot add player to a non-waiting room');
        assert.throws(() => {
          Meteor.call('rooms.removePlayer', playerID);
        }, Meteor.Error, 'cannot remove player from a non-waiting room');
      });

      it('cannot start an active or finished room', () => {
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.state, 'waiting');

        Meteor.call('rooms.start', roomID);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.state, 'active');

        assert.throws(() => {
          Meteor.call('rooms.start', roomID);
        }, Meteor.Error, 'you are trying to start a non-waiting room')

        RoomsCollection.update(roomID, {
          $set: { state: 'finished' }
        });

        assert.throws(() => {
          Meteor.call('rooms.start', roomID);
        }, Meteor.Error, 'you are trying to start a non-waiting room')
      });

      it('starting properly changes room state', () => {
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.state, 'waiting');

        Meteor.call('rooms.start', roomID);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.state, 'active');
      });

      // todo: require 2 people to start a room
    });

    describe('dealing cards', () => {
      let roomID;

      beforeEach(() => {
        RoomsCollection.remove({});
        PlayersCollection.remove({});
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        player1_id = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);
        player2_id = Meteor.call('players.get_or_create', 'Jennifer', 'BBB', room.code);
        Meteor.call('rooms.addPlayer', player1_id);
        Meteor.call('rooms.addPlayer', player2_id);
        Meteor.call('rooms.start', roomID);
      });

      it('ensure everyone gets the right number of cards', () => {
        // todo
      });
    });

    describe('bidding', () => {
      let roomID;
      let player1ID;
      let player2ID;

      beforeEach(() => {
        RoomsCollection.remove({});
        PlayersCollection.remove({});
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        player1_id = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);
        player2_id = Meteor.call('players.get_or_create', 'Jennifer', 'BBB', room.code);
        Meteor.call('rooms.addPlayer', player1_id);
        Meteor.call('rooms.addPlayer', player2_id);
        Meteor.call('rooms.start', roomID);

        Meteor.call('rooms.rounds.start', roomID);
        Meteor.call('rooms.rounds.deal', roomID);

        player1ID = room.players[0]._id
        player2ID = room.players[1]._id
      });

      it('let everyone bid', () => {
        // todo: ensure that the return signature of updateBid works
      });

      it('yell at people who bid out of turn', () => {
        assert.throws(() => {
          Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 1);
        }, Meteor.Error, 'action taken by non-active player');

        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);

        assert.throws(() => {
          Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
        }, Meteor.Error, 'action taken by non-active player');
      });

      it('check the last-bidder restrictions in currRound', () => {
        RoomsCollection.update(roomID, {
          $set: { numTricksArr: [1, 7] }
        });

        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.forbiddenBid, null);
        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.forbiddenBid, null);
        Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 1);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.forbiddenBid, null);

        Meteor.call('rooms.rounds.beginPlay', roomID);

        Meteor.call('rooms.tricks.start', roomID);
        Meteor.call('rooms.tricks.playCard', roomID, player2ID,
          room.currRound.playerIDsToCards[player2ID][0]);
        Meteor.call('rooms.tricks.playCard', roomID, player1ID,
          room.currRound.playerIDsToCards[player1ID][0]);
        Meteor.call('rooms.tricks.finish', roomID);
        Meteor.call('rooms.rounds.finish', roomID);

        Meteor.call('rooms.rounds.start', roomID);
        Meteor.call('rooms.rounds.deal', roomID);

        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.forbiddenBid, null);

        Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 2);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.forbiddenBid, 5);

        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 4);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.forbiddenBid, null);
      });

      it('starting round 4, do not let the last person even-bid', () => {
        RoomsCollection.update(roomID, {
          $set: { numTricksArr: [1, 4] }
        });

        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
        Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 0);
        Meteor.call('rooms.rounds.beginPlay', roomID);
        Meteor.call('rooms.tricks.start', roomID);
        Meteor.call('rooms.tricks.playCard', roomID, player2ID,
          room.currRound.playerIDsToCards[player2ID][0]);
        Meteor.call('rooms.tricks.playCard', roomID, player1ID,
          room.currRound.playerIDsToCards[player1ID][0]);
        Meteor.call('rooms.tricks.finish', roomID);


        room = RoomsCollection.find({ _id: roomID }).fetch()[0];

        Meteor.call('rooms.rounds.finish', roomID);
        Meteor.call('rooms.rounds.start', roomID);
        Meteor.call('rooms.rounds.deal', roomID);

        Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 4);

        assert.throws(() => {
          Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 0);
        }, Meteor.Error, 'cannot bid 0');

        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
      });

      it('can\'t start a round unless everyone has bid', () => {
        assert.throws(() => {
          Meteor.call('rooms.rounds.beginPlay', roomID);
        }, Meteor.Error, 'everyone needs to bid before you begin play');

        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);

        assert.throws(() => {
          Meteor.call('rooms.rounds.beginPlay', roomID);
        }, Meteor.Error, 'everyone needs to bid before you begin play');
      });
    });

    describe('playing tricks', () => {
      let roomID;
      let player1ID;
      let player2ID;
      let wizardCard1;
      let wizardCard2;
      let jesterCard1;
      let jesterCard2;

      beforeEach(() => {
        RoomsCollection.remove({});
        PlayersCollection.remove({});
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        deanID = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);
        jenniferID = Meteor.call('players.get_or_create', 'Jennifer', 'BBB', room.code);
        Meteor.call('rooms.addPlayer', deanID);
        Meteor.call('rooms.addPlayer', jenniferID);
        Meteor.call('rooms.start', roomID);

        RoomsCollection.update(roomID, {
          $set: { numTricksArr: [2] }
        });
        Meteor.call('rooms.rounds.start', roomID);
        Meteor.call('rooms.rounds.deal', roomID);

        player1ID = room.players[0]._id
        player2ID = room.players[1]._id

        wizardCard1 = {id: 53, suit: null, value: null, type: 'Wizard'};
        wizardCard2 = {id: 54, suit: null, value: null, type: 'Wizard'};
        jesterCard1 = {id: 57, suit: null, value: null, type: 'Jester'};
        jesterCard2 = {id: 58, suit: null, value: null, type: 'Jester'};

        // override player cards
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        currRound = room.currRound
        currRound.playerIDsToCards[player1ID] = [ wizardCard1, wizardCard2 ];
        currRound.playerIDsToCards[player2ID] = [ jesterCard1, jesterCard2 ];
        RoomsCollection.update(roomID, {
          $set: { currRound: currRound }
        });

        Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
        Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 1);
        Meteor.call('rooms.rounds.beginPlay', roomID);
        Meteor.call('rooms.tricks.start', roomID);
      });

      it('yell at people who play out of turn', () => {
        assert.throws(() => {
          Meteor.call('rooms.tricks.playCard', roomID, player1ID, wizardCard1);
        }, Meteor.Error, 'action taken by non-active player');

        Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard1);

        assert.throws(() => {
          Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard2);
        }, Meteor.Error, 'action taken by non-active player');

        assert.throws(() => {
          Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard2);
        }, Meteor.Error, 'action taken by non-active player');
      });

      it('activePlayer should be null after everyone plays a card', () => {
        Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard1);
        Meteor.call('rooms.tricks.playCard', roomID, player1ID, wizardCard1);

        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.activePlayerID, null);
      });

      it('don\'t let them call rooms.tricks.finish unless everyone\'s played', () => {
        assert.throws(() => {
          Meteor.call('rooms.tricks.finish', roomID);
        }, Meteor.Error, 'people still need to play their cards');

        Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard1);

        assert.throws(() => {
          Meteor.call('rooms.tricks.finish', roomID);
        }, Meteor.Error, 'people still need to play their cards');

        Meteor.call('rooms.tricks.playCard', roomID, player1ID, wizardCard1);

        finishTrickCallback = Meteor.call('rooms.tricks.finish', roomID);
        assert.equal(finishTrickCallback.winningPlayerID, player1ID);
      })

      it('ensure proper behavior when a player has duplicate cards', () => {
        playCardCallback = Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard2);

        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.playerIDsToCards[player2ID][0].id, jesterCard1.id);
        assert.equal(room.currRound.playerIDsToCards[player1ID].length, 2);
      });

      it('ensure proper returns', () => {
        // todo: when you play a card, ensure that you return all cards that have been played
      });
    });

    describe('playing a game of wizards', () => {
      let roomID;

      beforeEach(() => {
        RoomsCollection.remove({});
        PlayersCollection.remove({});
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        player1_id = Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code);
        player2_id = Meteor.call('players.get_or_create', 'Jennifer', 'BBB', room.code);
        Meteor.call('rooms.addPlayer', player1_id);
        Meteor.call('rooms.addPlayer', player2_id);
        Meteor.call('rooms.start', roomID);
      });

      it('let\'s play a game of wizards', () => {
        wizardCard1 = {id: 53, suit: null, value: null, type: 'Wizard'};
        wizardCard2 = {id: 54, suit: null, value: null, type: 'Wizard'};
        jesterCard1 = {id: 57, suit: null, value: null, type: 'Jester'};
        jesterCard2 = {id: 58, suit: null, value: null, type: 'Jester'};

        RoomsCollection.update(roomID, {
          $set: { numTricksArr: [1, 2] }
        });
        Meteor.call('rooms.rounds.start', roomID);
        Meteor.call('rooms.rounds.deal', roomID);

        player1ID = room.players[0]._id
        player2ID = room.players[1]._id

        // override player cards
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        currRound = room.currRound
        currRound.playerIDsToCards[player1ID] = [ wizardCard1 ];
        currRound.playerIDsToCards[player2ID] = [ jesterCard1 ];
        RoomsCollection.update(roomID, {
          $set: { currRound: currRound }
        });

        bids = Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
        assert.equal(bids[player1ID], null);
        assert.equal(bids[player2ID], 1);

        bids = Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 1);
        assert.equal(bids[player1ID], 1);
        assert.equal(bids[player2ID], 1);

        Meteor.call('rooms.rounds.beginPlay', roomID);
        Meteor.call('rooms.tricks.start', roomID);

        playCardCallback = Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard1);
        assert.equal(Object.keys(playCardCallback).length, 1);
        assert.equal(playCardCallback[player2ID].id, jesterCard1.id);
        playCardCallback = Meteor.call('rooms.tricks.playCard', roomID, player1ID, wizardCard1);
        assert.equal(Object.keys(playCardCallback).length, 2);
        assert.equal(playCardCallback[player2ID].id, jesterCard1.id);
        assert.equal(playCardCallback[player1ID].id, wizardCard1.id);

        // ensure that cards were removed
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.playerIDsToCards[player1ID].length, 0);
        assert.equal(room.currRound.playerIDsToCards[player2ID].length, 0);

        finishTrickCallback = Meteor.call('rooms.tricks.finish', roomID);
        assert.equal(finishTrickCallback.isLastTrick, true);
        assert.equal(finishTrickCallback.winningPlayerID, player1ID);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.currTrick.winningPlayerID, player1ID);

        finishRoundCallback = Meteor.call('rooms.rounds.finish', roomID);
        assert.equal(finishRoundCallback.isLastRound, false);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound.state, 'finished');

        scores = Meteor.call('rooms.rounds.getCurrRoundPlayerIDsToScores', roomID);
        assert.equal(scores[player1ID], 30);
        assert.equal(scores[player2ID], -10);

        scores = Meteor.call('rooms.rounds.getPlayerIDsToScores', roomID);
        assert.equal(scores[player1ID], 30);
        assert.equal(scores[player2ID], -10);

        // Round 2!
        Meteor.call('rooms.rounds.start', roomID);
        Meteor.call('rooms.rounds.deal', roomID);

        // override player cards
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        currRound = room.currRound
        currRound.playerIDsToCards[player1ID] = [ wizardCard1, jesterCard1 ];
        currRound.playerIDsToCards[player2ID] = [ wizardCard2, jesterCard2 ];
        RoomsCollection.update(roomID, {
          $set: { currRound: currRound }
        });

        bidCallback = Meteor.call('rooms.rounds.updateBid', roomID, player1ID, 1);
        assert.equal(bidCallback[player1ID], 1);
        assert.equal(bidCallback[player2ID], null);

        bidCallback = Meteor.call('rooms.rounds.updateBid', roomID, player2ID, 1);
        assert.equal(bidCallback[player1ID], 1);
        assert.equal(bidCallback[player2ID], 1);

        Meteor.call('rooms.rounds.beginPlay', roomID);
        Meteor.call('rooms.tricks.start', roomID);
        Meteor.call('rooms.tricks.playCard', roomID, player1ID, jesterCard1);
        playCardCallback = Meteor.call('rooms.tricks.playCard', roomID, player2ID, wizardCard2);
        assert.equal(Object.keys(playCardCallback).length, 2);
        assert.equal(playCardCallback[player1ID].id, jesterCard1.id);
        assert.equal(playCardCallback[player2ID].id, wizardCard2.id);
        finishTrickCallback = Meteor.call('rooms.tricks.finish', roomID);
        assert.equal(finishTrickCallback.winningPlayerID, player2ID);
        assert.equal(finishTrickCallback.isLastTrick, false);

        Meteor.call('rooms.tricks.start', roomID);
        Meteor.call('rooms.tricks.playCard', roomID, player2ID, jesterCard2);
        Meteor.call('rooms.tricks.playCard', roomID, player1ID, wizardCard1);
        finishTrickCallback = Meteor.call('rooms.tricks.finish', roomID);
        assert.equal(finishTrickCallback.winningPlayerID, player1ID);
        assert.equal(finishTrickCallback.isLastTrick, true);

        finishRoundCallback = Meteor.call('rooms.rounds.finish', roomID);
        assert.equal(finishRoundCallback.isLastRound, true);

        scores = Meteor.call('rooms.rounds.getCurrRoundPlayerIDsToScores', roomID);
        assert.equal(scores[player1ID], 30);
        assert.equal(scores[player2ID], 30);

        scores = Meteor.call('rooms.rounds.getPlayerIDsToScores', roomID);
        assert.equal(scores[player1ID], 60);
        assert.equal(scores[player2ID], 20);

        Meteor.call('rooms.finish', roomID);

        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.currRound, null);
        assert.equal(room.state, 'finished');
      });
    });
  });
}

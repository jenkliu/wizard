import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { RoomsCollection, getWinningPlayerID, isLegalPlay, getPlayerIDsToScores } from './rooms.js';
import { PlayersCollection } from '../players/players.js'

if (Meteor.isServer) {
  describe('Rooms', () => {
    describe('scores rounds properly', () => {
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
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
          ],
          {suit: 'S', value: 7, type: 'Standard'}
        ), true);
      });

      it('wizard-led', () => {
        assert.equal(isLegalPlay(
          {suit: null, value: null, type: 'Wizard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
            {suit: null, value: null, type: 'Wizard'},
          ],
          {suit: 'S', value: 7, type: 'Standard'}
        ), true);

        assert.equal(isLegalPlay(
          {suit: null, value: null, type: 'Wizard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
            {suit: null, value: null, type: 'Wizard'},
          ],
          {suit: null, value: null, type: 'Wizard'},
        ), true);
      });

      it('following suit', () => {
        assert.equal(isLegalPlay(
          {suit: 'S', value: 6, type: 'Standard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
          ],
          {suit: 'S', value: 7, type: 'Standard'}
        ), true);

        assert.equal(isLegalPlay(
          {suit: 'S', value: 6, type: 'Standard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
          ],
          {suit: 'D', value: 9, type: 'Standard'}
        ), false);
      });

      it('off-suit', () => {
        assert.equal(isLegalPlay(
          {suit: 'S', value: 6, type: 'Standard'},
          [
            {suit: 'D', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
          ],
          {suit: 'D', value: 7, type: 'Standard'},
        ), true);
      });

      it('non-standard cards can be played whenever you want', () => {
        assert.equal(isLegalPlay(
          {suit: 'S', value: 6, type: 'Standard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: null, value: null, type: 'Wizard'},
            {suit: null, value: null, type: 'Wizard'},
            {suit: null, value: null, type: 'Jester'},
            {suit: null, value: null, type: 'Jester'},
          ],
          {suit: null, value: null, type: 'Wizard'}
        ), true);

        assert.equal(isLegalPlay(
          {suit: 'S', value: 6, type: 'Standard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: null, value: null, type: 'Wizard'},
            {suit: null, value: null, type: 'Wizard'},
            {suit: null, value: null, type: 'Jester'},
            {suit: null, value: null, type: 'Jester'},
          ],
          {suit: null, value: null, type: 'Jester'}
        ), true);
      });

      it('playing a non-existant wizard', () => {
        assert.equal(isLegalPlay(
          {suit: 'S', value: 6, type: 'Standard'},
          [
            {suit: 'S', value: 7, type: 'Standard'},
            {suit: 'D', value: 9, type: 'Standard'},
          ],
          {suit: null, value: null, type: 'Wizard'}
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
        assert.equal(room.gameState, 'waiting');
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

      it('cannot join an active/non-existant room', () => {
        roomID = Meteor.call('rooms.create');
        Meteor.call('rooms.start', roomID);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];

        assert.equal(
          Meteor.call('players.get_or_create', 'Dean', 'AAA', room.code),
          null);
        assert.equal(
          Meteor.call('players.get_or_create', 'Dean', 'AAA', 'BADCODE'),
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

      it('starting properly changes room state', () => {
        roomID = Meteor.call('rooms.create');
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.gameState, 'waiting');

        Meteor.call('rooms.start', roomID);
        room = RoomsCollection.find({ _id: roomID }).fetch()[0];
        assert.equal(room.gameState, 'active');
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

      it('let everyone bid', () => {
        // todo: ensure that the return signature of updateBid works
      });

      it('yell at people who bid out of turn', () => {
        // todo
      });
    });

    describe('playing tricks', () => {
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

      it('yell at people who play out of turn', () => {
        // todo
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

      it('play a round', () => {
        // todo: make numTricks just like [1, 2] or something
        // todo: ensure that rooms.tricks.finish properly returns isLastTrick
        // todo: ensure that rooms.rounds.finish properly returns isLastRound
        // todo: test scoreboard
      });
    });
  });
}

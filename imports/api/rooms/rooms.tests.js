import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { RoomsCollection, getWinningPlayerID, isLegalPlay } from './rooms.js';

if (Meteor.isServer) {
  describe('Rooms', () => {
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

    describe('methods', () => {
      const userId = Random.id();
      let roomID;

      beforeEach(() => {
        RoomsCollection.remove({});
        roomID = RoomsCollection.insert({
          'gameState': 'waiting',
          'code': 'BALLS',
          'createdAt': new Date(),
          'players': [],
          'numTricksArr': [1, 2, 3, 4, 5],
          'rounds': [],
          'currRound': null,          
        });
      });

      it('sample invocation stuff', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        // const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method invocation that looks like what the method expects
        // const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        // deleteTask.apply(invocation, [taskId]);

        // Verify that the method does what we expected
        // assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}

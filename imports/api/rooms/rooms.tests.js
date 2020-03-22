import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';

import { RoomsCollection, getWinningPlayerID } from './rooms.js';

if (Meteor.isServer) {
  describe('Rooms', () => {
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

      it('picks the right winners', () => {
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

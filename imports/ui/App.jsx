import React from 'react';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { RoomsCollection } from '/imports/api/rooms/rooms';

export const App = () => {

  const createRoom = () => {
    console.log("hey a room");
    RoomsCollection.insert({
      code: "Test",
      createdAt: new Date()
    })
  }

  // TODO: Read https://reactjs.org/docs/hooks-state.html

  // TODO: As a proof-of-concept, figure out how to display
  // the code of the last room

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <button onClick={createRoom}>make a room</button>
      <Hello/>
      <Info/>
    </div>
  );
};

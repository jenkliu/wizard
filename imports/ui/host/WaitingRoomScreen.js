import React from "react";
import PropTypes from "prop-types";

export default class WaitingRoomScreen extends React.Component {
  createRoom() {
    Meteor.call('rooms.create')
  }

  render() {
    return (
      <div>
        <button onClick={this.createRoom.bind(this)}>make a room</button>
        <br />
        <strong>Number of rooms:</strong> {this.props.numRooms}
        <h1>Players in this game:</h1>
        <ul>
          <li> Dean!! ??!!? </li>
          <li> Jen</li>
        </ul>
        <button>Start game</button>
      </div>
    );
  }
}

WaitingRoomScreen.propTypes = {
  code: PropTypes.string,
  numRooms: PropTypes.integer
};

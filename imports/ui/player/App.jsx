import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { withTracker } from 'meteor/react-meteor-data';

class App extends React.Component {
	render() {
		console.log(this.props.room);
		return <div>WELCOME!!!</div>;
	}
}

export default withTracker(() => {
	Meteor.subscribe('rooms');
	const rooms = RoomsCollection.find().fetch();
	return {
		// TODO: properly fetch the correct room
		room: rooms[rooms.length - 1]
	};
})(App);

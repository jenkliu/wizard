import React from 'react';
import { RoomsCollection } from '/imports/api/rooms/rooms';
import { withTracker } from 'meteor/react-meteor-data';

// these will all get converted to containers
import WelcomeScreen from './WelcomeScreen';
import HostRoom from './HostRoom';

export default class HostApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			roomId: null
		};
	}

	createRoom = () => {
		Meteor.call('rooms.create', (error, result) => {
			if (error) console.error(error);
			this.setState({ roomId: result });
			console.log('set state', this.state);
		});
	};

	render() {
		return (
			<div className="host-app-container">
				{this.state.roomId ? <HostRoom roomId={this.state.roomId} /> : <WelcomeScreen createRoom={this.createRoom} />}
			</div>
		);
	}
}

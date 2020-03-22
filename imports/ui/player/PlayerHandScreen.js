import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';

export default class PlayerHandScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = { bid: 0 };
	}

	isMyTurn() {
		return this.props.myPlayer._id === this.props.activePlayer._id;
	}

	handleSubmitBid = () => {
		console.log('submitting bid');
		this.props.submitBid(this.props.myPlayer._id, this.state.bid);
	};

	handleChangeBid = event => {
		this.setState({ bid: event.target.value });
	};

	renderBidInput() {
		return (
			<div>
				<input placeholder="Enter your bid" value={this.state.bid} onChange={this.handleChangeBid} />
				<button onClick={this.handleSubmitBid}>Submit</button>
			</div>
		);
	}

	// TODO make these fan out/scrollable in a carousel
	// allow selection while it's my turn
	renderCard(card, i) {
		return <Card key={i} suit={card.suit} value={card.value} type={card.type} />;
	}

	renderStatus() {
		if (this.props.currRoundState === 'bid') {
			if (this.isMyTurn()) {
				return 'Your turn to bid!';
			} else {
				return `Waiting for ${this.props.activePlayer.name} to bid...`;
			}
		} else {
			// play state
			if (this.isMyTurn()) {
				return 'Your turn!';
			} else {
				return `${this.props.activePlayer.name}'s turn`;
			}
		}
	}

	renderCta() {
		if (!this.isMyTurn()) return;
		if (this.props.currRoundState === 'bid') {
			return this.renderBidInput();
		} else {
			return <button className="btn">PLAY</button>;
		}
	}

	// TODO sort cards
	render() {
		return (
			<div>
				<div className="status">{this.renderStatus()}</div>
				<div className="player-hand">{this.props.cards.map((card, i) => this.renderCard(card, i))}</div>
				{this.isMyTurn() ? this.renderCta() : null}
			</div>
		);
	}
}

PlayerHandScreen.propTypes = {
	myPlayer: PropTypes.object,
	cards: PropTypes.array,
	activePlayer: PropTypes.object,
	currRoundState: PropTypes.string, // 'bid' | 'play'
	submitBid: PropTypes.func
};

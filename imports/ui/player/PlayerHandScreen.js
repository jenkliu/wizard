import React from 'react';
import PropTypes from 'prop-types';
import ClickableCard from '../ClickableCard';

export default class PlayerHandScreen extends React.Component {
	constructor(props) {
		super(props);
		let cardIdsToCards = {};
		props.cards.forEach((card, i) => {
			cardIdsToCards[i] = { id: i, ...card };
		});

		this.state = {
			bid: 0,
			activeCardId: null,
			cardIdsToCards
		};
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

	handleClickCard = id => {
		this.setState({ activeCardId: id });
	};

	handleClickPlayCard = () => {
		console.log('clicked play card');
		const cardPlayedId = this.state.activeCardId;
		const card = this.state.cardIdsToCards[cardPlayedId];
		this.props
			.playCard(this.props.myPlayer._id, card)
			.then(didSucceed => {
				const newCardIdsToCards = this.state.cardIdsToCards;
				delete newCardIdsToCards[cardPlayedId];
				this.setState({ cardIdsToCards: newCardIdsToCards });
			})
			.catch(err => alert(err));
	};

	// TODO make these fan out/scrollable in a carousel
	// TODO disable selection when it's not my turn
	renderClickableCard(cardId) {
		const card = this.state.cardIdsToCards[cardId];
		return (
			<ClickableCard
				isActive={cardId === this.state.activeCardId}
				onClick={this.handleClickCard.bind(this, cardId)}
				key={cardId}
				suit={card.suit}
				value={card.value}
				type={card.type}
			/>
		);
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
			return (
				<button disabled={this.state.activeCardId === null} className="btn" onClick={this.handleClickPlayCard}>
					PLAY CARD
				</button>
			);
		}
	}

	// TODO sort cards
	render() {
		return (
			<div>
				<div className="status">{this.renderStatus()}</div>
				<div className="player-hand">
					{Object.keys(this.state.cardIdsToCards).map(cardId => this.renderClickableCard(cardId))}
				</div>
				{this.isMyTurn() ? this.renderCta() : null}
			</div>
		);
	}
}

PlayerHandScreen.propTypes = {
	myPlayer: PropTypes.object,
	cards: PropTypes.array.isRequired,
	activePlayer: PropTypes.object,
	currRoundState: PropTypes.string, // 'bid' | 'play' | 'finished'
	submitBid: PropTypes.func,
	playCard: PropTypes.func
};

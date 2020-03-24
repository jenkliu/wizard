import React from 'react';
import PropTypes from 'prop-types';
import ClickableCard from '../ClickableCard';

function cardSortFnByValue(card1, card2) {
	return card1.value - card2.value;
}

function sortCards(cards) {
	const suitToCards = {
		H: [],
		C: [],
		S: [],
		D: []
	};
	const specialTypesToCards = {
		Jester: [],
		Wizard: []
	};
	cards.forEach(card => {
		console.log(card.type);
		if (card.type === 'Standard') suitToCards[card.suit].push(card);
		else specialTypesToCards[card.type].push(card);
	});
	Object.keys(suitToCards).forEach(cat => suitToCards[cat].sort(cardSortFnByValue));
	return suitToCards['C']
		.concat(suitToCards['H'])
		.concat(suitToCards['S'])
		.concat(suitToCards['D'])
		.concat(specialTypesToCards['Jester'])
		.concat(specialTypesToCards['Wizard']);
}

export default class PlayerHandScreen extends React.Component {
	constructor(props) {
		super(props);
		let cardIdsToCards = {};
		sortCards(props.cards).forEach((card, i) => {
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
		this.props.submitBid(this.props.myPlayer._id, this.state.bid);
	};

	handleChangeBid = event => {
		this.setState({ bid: event.target.value });
	};

	renderBidInput() {
		return (
			<div>
				<input placeholder="Enter your bid" value={this.state.bid} onChange={this.handleChangeBid} />
				<button className="btn inline" onClick={this.handleSubmitBid}>
					Submit
				</button>
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
				isClickable={this.isMyTurn() && this.props.currRoundState === 'play'}
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
		if (!this.isMyTurn() || this.props.cards.length === 0) return null;
		if (this.props.currRoundState === 'bid') {
			return this.renderBidInput();
		} else {
			return (
				<button disabled={this.state.activeCardId === null} className="btn" onClick={this.handleClickPlayCard}>
					Play card
				</button>
			);
		}
	}

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

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
			cardIdsToCards[card.id] = card;
		});

		this.state = {
			bid: '',
			activeCard: null,
			cardIdsToCards
		};
	}

	// focusIfMyTurn() {
	// 	// if (this.props.activePlayer && this.props.activePlayer._id === this.props.myPlayer._id) {
	// 	// 	console.log('my turn');
	// 	// 	this._bidInput.focus({ preventScroll: true });
	// 	// }
	// }

	// componentDidMount() {
	// 	this.focusIfMyTurn();
	// }

	// componentDidUpdate() {
	// 	this.focusIfMyTurn();
	// }

	isMyTurn() {
		const { myPlayer, activePlayer } = this.props;
		return activePlayer && myPlayer._id === activePlayer._id;
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
				<input
					autoFocus={true}
					className="inline"
					placeholder="Enter your bid"
					value={this.state.bid}
					onChange={this.handleChangeBid}
					ref={c => (this._bidInput = c)}
				/>
				{this.isMyTurn() ? (
					<button className="btn inline" disabled={this.state.bid === ''} onClick={this.handleSubmitBid}>
						Submit
					</button>
				) : null}
				{this.props.forbiddenBid && this.isMyTurn() ? (
					<p className="bid-note">Can't bid {this.props.forbiddenBid}</p>
				) : null}
			</div>
		);
	}

	handleClickCard = card => {
		if (this.state.activeCard && card.id === this.state.activeCard.id) {
			this.setState({ activeCard: null });
		} else {
			this.setState({ activeCard: card });
		}
	};

	handleClickPlayCard = () => {
		const card = this.state.activeCard;
		this.props
			.playCard(this.props.myPlayer._id, card)
			.then(data => {
				this.setState({ activeCard: null });
			})
			.catch(err => alert(err));
	};

	// TODO make these fan out/scrollable in a carousel
	// TODO disable selection when it's not my turn
	renderClickableCard(card) {
		return (
			<ClickableCard
				isActive={this.state.activeCard && card.id === this.state.activeCard.id}
				isClickable={this.props.currRoundState === 'play'}
				onClick={this.handleClickCard.bind(this, card)}
				key={card.id}
				suit={card.suit}
				value={card.value}
				type={card.type}
			/>
		);
	}

	renderStatus() {
		const { activePlayer, currRoundState, trickWinner, myPlayer } = this.props;
		if (currRoundState === 'bid') {
			if (this.isMyTurn()) {
				return 'Your turn to bid!';
			} else if (activePlayer) {
				return `Waiting for ${activePlayer.name} to bid...`;
			}
		} else {
			// play state
			if (this.isMyTurn()) {
				return 'Your turn!';
			} else if (activePlayer) {
				return `${activePlayer.name}'s turn`;
			} else if (trickWinner) {
				console.log('trickWinner is', trickWinner);
				if (trickWinner._id === myPlayer._id) {
					return 'You won the trick!';
				} else {
					return `${trickWinner.name} won the trick!`;
				}
			}
		}
	}

	renderCta() {
		if (this.props.currRoundState === 'bid') {
			return this.renderBidInput();
		} else if (this.isMyTurn()) {
			return (
				<button disabled={this.state.activeCard === null} className="btn" onClick={this.handleClickPlayCard}>
					Play card
				</button>
			);
		}
		return null;
	}

	render() {
		return (
			<div>
				<div className="status">{this.renderStatus()}</div>
				<div className="player-hand">{sortCards(this.props.cards).map(card => this.renderClickableCard(card))}</div>
				{this.renderCta()}
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
	playCard: PropTypes.func,
	trickWinner: PropTypes.object,
	forbiddenBid: PropTypes.number
};

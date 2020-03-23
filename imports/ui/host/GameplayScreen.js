import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import classNames from 'classnames';

export default class GameplayScreen extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    // someone just won the trick, show who won then start the next trick
    if (
      !(prevProps.currTrick && prevProps.currTrick.winningPlayerID) &&
      (this.props.currTrick && this.props.currTrick.winningPlayerID)
    ) {
      setTimeout(() => {
        this.props.startTrick();
      }, 2000);
    }
  }

  renderPlayer(player) {
    const cardPlayed = this.props.currTrick && this.props.currTrick.playerIDsToCards[player._id];
    const cardClasses = classNames('player-card', {
      'is-winner': this.props.currTrick && this.props.currTrick.winningPlayerID === player._id
    });

    return (
      <div className="player-card-container" key={player._id}>
        <div className={cardClasses}>
          {cardPlayed ? (
            <Card value={cardPlayed.value} suit={cardPlayed.suit} type={cardPlayed.type} />
          ) : (
            <div className="placeholder-card" />
          )}
        </div>

        <div className="player-name">{player.name}</div>
        <div className="bid">Bid: {this.props.playerIdToBids[player._id]}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Game on!</h1>
        <div className="trump-card">
          <Card value={this.props.trumpCard.value} suit={this.props.trumpCard.suit} type={this.props.trumpCard.type} />
          Trump
        </div>
        <div className="player-cards-container">{this.props.players.map(player => this.renderPlayer(player))}</div>
      </div>
    );
  }
}

GameplayScreen.propTypes = {
  playerIdToBids: PropTypes.object.isRequired, // { player_id: bid}
  players: PropTypes.array.isRequired,
  trumpCard: PropTypes.object.isRequired, // card: { suit: 'H'.isRequired, value: '4', type: 'Standard'}
  currTrick: PropTypes.object.isRequired, // {cardsPlayed: {playerId: card}}
  startTrick: PropTypes.func.isRequired
};

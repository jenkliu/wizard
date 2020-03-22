import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';

export default class Gameplay extends React.Component {
  renderPlayer(player) {
    const cardPlayed = this.props.currTrick.playerIDsToCards[player._id];

    return (
      <div className="player-card-container" key={player._id}>
        <div className="player-card">
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

Gameplay.propTypes = {
  playerIdToBids: PropTypes.object, // { player_id: bid}
  players: PropTypes.array,
  trumpCard: PropTypes.object, // card: { suit: 'H', value: '4', type: 'Standard'}
  currTrick: PropTypes.object // {cardsPlayed: {playerId: card}}
};

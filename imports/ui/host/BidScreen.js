import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';

//TODO consider combining with GameplayScreen
export default class BidScreen extends React.Component {
  renderPlayer(player) {
    return (
      <div className="player-bid" key={player._id}>
        <div className="player-name">{player.name}</div>

        <div className="bid">
          {this.props.playerIdToBids[player._id] != null ? this.props.playerIdToBids[player._id] : '?'}
        </div>
      </div>
    );
  }

  renderTrumpCard() {
    return (
      <div className="trump-card">
        <Card value={this.props.trumpCard.value} suit={this.props.trumpCard.suit} type={this.props.trumpCard.type} />
        Trump
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Time to bid</h1>
        {this.props.trumpCard ? this.renderTrumpCard() : null}
        {this.props.players.map(player => this.renderPlayer(player))}
      </div>
    );
  }
}

BidScreen.propTypes = {
  playerIdToBids: PropTypes.object, // { player_id: bid}
  players: PropTypes.array,
  trumpCard: PropTypes.object
};

import React from "react";
import PropTypes from "prop-types";
import { Card } from "../Card";

export default class Gameplay extends React.Component {
  renderPlayer(player) {
    return (
      <div className="player-bid" key={player._id}>
        <div className="player-name">{player.name}</div>

        <div className="bid">
          {this.props.playerIdToBids[player._id] !== null
            ? this.props.playerIdToBids[player._id]
            : "?"}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Game on!</h1>
        <div className="trump-card">
          <Card
            value={this.props.trumpCard.value}
            suit={this.props.trumpCard.suit}
          />
          Trump
        </div>
        <div className="players">
          {this.props.players.map(player => this.renderPlayer(player))}
        </div>
      </div>
    );
  }
}

Gameplay.propTypes = {
  playerIdToBids: PropTypes.object, // { player_id: bid}
  players: PropTypes.array,
  trumpCard: PropTypes.object // card: { suit: 'Heart', value: 4, type: 'Standard'}
};

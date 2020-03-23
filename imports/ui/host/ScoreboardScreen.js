import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

export default class ScoreboardScreen extends React.Component {
  renderPlayerScore(player) {
    return (
      <div className="player-bid" key={player._id}>
        <div className="player-name">{player.name}</div>

        <div className="round-score">{this.props.currRoundPlayerIdToScores[player._id]}</div>
        <div className="total-score">{this.props.totalPlayerIdToScores[player._id]}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Scores</h1>
        {this.props.players.map(player => this.renderPlayerScore(player))}

        <button onClick={this.props.startNextRound}>Start next round</button>
      </div>
    );
  }
}

ScoreboardScreen.propTypes = {
  currRoundPlayerIdToScores: PropTypes.object.isRequired, // { player_id: bid}
  totalPlayerIdToScores: PropTypes.object.isRequired, // { player_id: bid}
  players: PropTypes.array.isRequired,
  startNextRound: PropTypes.func.isRequired,
  isLastRound: PropTypes.bool // to do figure out how to get this
};

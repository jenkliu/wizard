import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import classNames from 'classnames';

export default class ScoreboardScreen extends React.Component {
  renderPlayerScore(player) {
    const roundScore = this.props.currRoundPlayerIdToScores[player._id];
    const totalScore = this.props.totalPlayerIdToScores[player._id];
    const roundScoreClasses = classNames('round-score', { met: roundScore > 0, missed: roundScore < 0 });
    return (
      <div className="player-bid" key={player._id}>
        <div className="scoreboard-player-name">{player.name}</div>
        <div className={roundScoreClasses}>{`${roundScore > 0 ? '+' : ''}${roundScore}`}</div>
        <div className="total-score">{totalScore}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Scoreboard</h1>
        <div className="scoreboard">{this.props.players.map(player => this.renderPlayerScore(player))}</div>
        <button className="btn" onClick={this.props.startNextRound}>
          Start next round
        </button>
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

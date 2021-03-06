import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import classNames from 'classnames';

export default class ScoreboardScreen extends React.Component {
  sortPlayersByTotalScore(players) {
    const sortFn = (player1, player2) => {
      return this.props.totalPlayerIdToScores[player2._id] - this.props.totalPlayerIdToScores[player1._id];
    };
    return players.sort(sortFn);
  }

  renderPlayerScore(player, rank) {
    const roundScore = this.props.currRoundPlayerIdToScores[player._id];
    const totalScore = this.props.totalPlayerIdToScores[player._id];
    const roundScoreClasses = classNames('round-score', { met: roundScore > 0, missed: roundScore < 0 });
    return (
      <div className="player-bid" key={player._id}>
        <div className="scoreboard-player-name">{`${rank}. ${player.name}`}</div>
        <div className={roundScoreClasses}>{`${roundScore > 0 ? '+' : ''}${roundScore}`}</div>
        <div className="total-score">{totalScore}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1 className="heading">Scoreboard</h1>
        <div className="scoreboard">
          {this.sortPlayersByTotalScore(this.props.players).map((player, i) => this.renderPlayerScore(player, i + 1))}
        </div>
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
  isLastRound: PropTypes.bool, // to do figure out how to get this
};

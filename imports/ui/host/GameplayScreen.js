import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import classNames from 'classnames';

export default class GameplayScreen extends React.Component {
  constructor(props) {
    super(props);

    // assume we initialize this component every new round
    const playerIdToTricks = {};
    props.players.forEach((player) => {
      playerIdToTricks[player._id] = 0;
    });

    this.state = {
      playerIdToTricks,
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // someone just won the trick, show who won then start the next trick
    if (
      !(prevProps.currTrick && prevProps.currTrick.winningPlayerID) &&
      (this.props.currTrick && this.props.currTrick.winningPlayerID)
    ) {
      const winningPlayerID = this.props.currTrick.winningPlayerID;
      const newPlayerIdToTricks = { ...this.state.playerIdToTricks };
      newPlayerIdToTricks[winningPlayerID] = this.state.playerIdToTricks[winningPlayerID] + 1;
      this.setState({ playerIdToTricks: newPlayerIdToTricks });

      setTimeout(() => {
        this.props.startTrick();
      }, 3000);
    }
  }

  renderTricks(player) {
    let tricksDisplay = [];
    const numTricksWon = this.state.playerIdToTricks[player._id];
    const numTricksBid = this.props.playerIdToBids[player._id];
    const numTricksMet = numTricksWon >= numTricksBid ? numTricksBid : numTricksWon;
    const numTricksLeft = numTricksBid - numTricksWon;
    for (let i = 0; i < numTricksMet; i++) {
      tricksDisplay.push(<span key={`met-${i}`} className="trick met" />);
    }
    if (numTricksLeft > 0) {
      for (let i = 0; i < numTricksLeft; i++) {
        tricksDisplay.push(<span key={`incomplete-${i}`} className="trick incomplete" />);
      }
    }
    if (numTricksLeft < 0) {
      for (let i = 0; i < Math.abs(numTricksLeft); i++) {
        tricksDisplay.push(<span key={`extra-${i}`} className="trick extra" />);
      }
    }
    return <div className="tricks">{tricksDisplay}</div>;
  }

  renderPlayer(player) {
    const cardPlayed = this.props.currTrick && this.props.currTrick.playerIDsToCards[player._id];
    const cardClasses = classNames('player-card', {
      'is-winner': this.props.currTrick && this.props.currTrick.winningPlayerID === player._id,
    });

    return (
      <div className="player-card-container" key={player._id}>
        <div className={cardClasses}>
          {cardPlayed ? (
            <Card value={cardPlayed.value} suit={cardPlayed.suit} type={cardPlayed.type} />
          ) : (
            <div
              className={classNames('placeholder-card', { 'is-active': player._id === this.props.activePlayerId })}
            />
          )}
        </div>

        <div className="player-name">
          {player._id === this.props.leadPlayerId ? '🧙‍♂️ ' : null}
          {player.name}
        </div>
        <div className="bid">
          Bid: {this.props.playerIdToBids[player._id] != null ? this.props.playerIdToBids[player._id] : '-'}
        </div>
        {this.renderTricks(player)}
      </div>
    );
  }

  render() {
    const title = this.props.currRoundState === 'bid' ? 'Time to bid' : 'Game on!';
    return (
      <div className="gameplay-screen">
        <div className="gameplay-gamecode">
          GAME CODE: <br />
          {this.props.gameCode}
        </div>
        <h1 className="heading">{title}</h1>
        <div className="trump-card">
          <Card value={this.props.trumpCard.value} suit={this.props.trumpCard.suit} type={this.props.trumpCard.type} />
          <p>Trump</p>
        </div>
        <div className="player-cards-container">{this.props.players.map((player) => this.renderPlayer(player))}</div>
      </div>
    );
  }
}

GameplayScreen.propTypes = {
  playerIdToBids: PropTypes.object.isRequired, // { player_id: bid}
  players: PropTypes.array.isRequired,
  trumpCard: PropTypes.object.isRequired, // card: { suit: 'H'.isRequired, value: '4', type: 'Standard'}
  currTrick: PropTypes.object, // {cardsPlayed: {playerId: card}}
  startTrick: PropTypes.func.isRequired,
  currRoundState: PropTypes.string.isRequired, // 'bid' || 'play'
  activePlayerId: PropTypes.string,
  leadPlayerId: PropTypes.string,
  gameCode: PropTypes.string.isRequired,
};

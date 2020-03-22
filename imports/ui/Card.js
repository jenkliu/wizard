import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const getSuitSymbol = suit => {
  const suitMap = {
    S: "♠︎",
    H: "♥︎",
    C: "♣︎",
    D: "♦︎"
  };
  return suitMap[suit];
};

// TODO: support wizards and jesters
export default class Card extends React.Component {
  render() {
    const { suit, value } = this.props;
    const classes = classNames("card", {
      "card-black": suit == "C" || suit == "S",
      "card-red": suit == "H" || suit == "D"
    });
    return (
      <div className={classes}>
        <div className="card-tl">
          <div className="card-value">{value}</div>
          <div className="card-suit">{getSuitSymbol(suit)}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{value}</div>
          <div className="card-suit">{getSuitSymbol(suit)}</div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  suit: PropTypes.string, // "S", "C", "H", "D"
  value: PropTypes.string
};

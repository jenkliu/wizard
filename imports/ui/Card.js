// modified from https://codepen.io/ursooperduper/pen/EXWxdW
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const getSuitSymbol = suit => {
  if (!suit) return null;
  const suitMap = {
    S: "♠︎",
    H: "♥︎",
    C: "♣︎",
    D: "♦︎"
  };
  return suitMap[suit];
};

const getDisplayValue = value => {
  if (!value) return null;
  if (value > 0 && value < 11) return value;
  const valueMap = {
    11: "J",
    12: "Q",
    13: "K",
    14: "A"
  };
  return valueMap[value];
};

export default class Card extends React.Component {
  renderSpecialCard() {
    const { type } = this.props;
    const value = type === "Wizard" ? "W" : "JE";

    // TODO: add graphics for wizards/jesters (Bonny?)
    return (
      <div className="card card-special">
        <div className="card-tl">
          <div className="card-value">{value}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{value}</div>
        </div>
      </div>
    );
  }

  render() {
    const { suit, value, type } = this.props;
    const classes = classNames("card", {
      "card-black": suit == "C" || suit == "S",
      "card-red": suit == "H" || suit == "D"
    });
    if (type !== "Standard") return this.renderSpecialCard();

    return (
      <div className={classes}>
        <div className="card-tl">
          <div className="card-value">{getDisplayValue(value)}</div>
          <div className="card-suit">{getSuitSymbol(suit)}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{getDisplayValue(value)}</div>
          <div className="card-suit">{getSuitSymbol(suit)}</div>
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  suit: PropTypes.string, // "S", "C", "H", "D"
  value: PropTypes.number, // 1-14, where 11-14 are J,Q,K,A
  type: PropTypes.string // "Standard", "Wizard", "Jester"
};

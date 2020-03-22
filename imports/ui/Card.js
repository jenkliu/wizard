import React from "react";

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
export const Card = props => {
  if (props.suit == "C" || props.suit == "S") {
    return (
      <div className="card card-black">
        <div className="card-tl">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{getSuitSymbol(props.suit)}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{getSuitSymbol(props.suit)}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="card card-red">
        <div className="card-tl">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{getSuitSymbol(props.suit)}</div>
        </div>
        <div className="card-br">
          <div className="card-value">{props.value}</div>
          <div className="card-suit">{getSuitSymbol(props.suit)}</div>
        </div>
      </div>
    );
  }
};

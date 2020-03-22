import React from "react";

export class Deck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shuffleCards(deck) {
    console.log("shuffling deck");
    let counter = deck.length;
    let t;
    let i;

    while (counter) {
      i = Math.floor(Math.random() * counter--);
      t = deck[counter];
      deck[counter] = deck[i];
      deck[i] = t;
    }
    return deck;
  }

  render() {
    const suits = ["S", "H", "C", "D"];

    const values = [
      "A",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K"
    ];
    let cardDeck = [];
    let card = [];

    for (let x = 0; x < suits.length; x++) {
      for (let y = 0; y < values.length; y++) {
        card = { suit: suits[x], val: values[y] };
        cardDeck.push(card);
      }
    }

    this.shuffleCards(cardDeck);

    return (
      <div>
        <button onClick={this.shuffleCards(cardDeck)}>Shuffle</button>
        <div className="deck">
          {cardDeck.map(function(card) {
            return <Card suit={card.suit} value={card.val} />;
          })}
        </div>
      </div>
    );
  }
}

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

import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      monsters: [
        {
          name: "Frankenstein",
          id: "asc1",
        },
        {
          name: "Dracula",
          id: "fea2",
        },
        {
          name: "Zombie",
          id: "gfr3",
        },
      ],
    };
  }
  render() {
    return (
      <div>
        {this.state.monsters.map((monster) => (
          <h1 key={monster.id}>{monster.name}</h1>
        ))}
      </div>
    );
  }
}

export default App;
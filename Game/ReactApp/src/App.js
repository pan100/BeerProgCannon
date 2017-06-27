import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Game from './Game.js'

class App extends Component {
  render() {
    return (
      <Game width="800" height="500"/>
    );
  }
}

export default App;

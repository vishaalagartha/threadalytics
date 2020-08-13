import React, { Component } from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from 'Pages/Home'
import Team from 'Pages/Team'
import Game from 'Pages/Game'
import Leaderboard from 'Pages/Leaderboard'
import Compare from 'Pages/Compare'
import User from 'Pages/User'
import About from 'Pages/About'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path='/' params={{fromHeader: true}} component={Home} />
        <Route exact path='/games/:away@:home-:timestamp' params={{fromHeader: true}} component={Game} />
        <Route exact path='/teams/:abbr' params={{fromHeader: true}} component={Team} />
        <Route exact path='/teams/:abbr/games/:away@:home-:timestamp' params={{fromHeader: true}} component={Game} />
        <Route exact path='/compare' params={{fromHeader: true}} component={Compare} />
        <Route exact path='/leaderboard/' params={{fromHeader: true}} component={Leaderboard} />
        <Route exact path='/leaderboard/:abbr' params={{fromHeader: true}} component={Leaderboard} />
        <Route exact path='/user/' params={{fromHeader: true}} component={User} />
        <Route exact path='/about' params={{fromHeader: true}} component={About} />
      </BrowserRouter>
    )
  };
}

export default App

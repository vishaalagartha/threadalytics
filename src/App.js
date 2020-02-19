import React, { Component } from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from 'Pages/Home'
import Team from 'Pages/Team'
import Game from 'Pages/Game'
import Leaderboard from 'Pages/Leaderboard'
import NRL from 'Pages/NRL'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path='/' params={{fromHeader: true}} component={Home} />
        <Route exact path='/games/:id' params={{fromHeader: true}} component={Game} />
        <Route exact path='/teams/:abbr' params={{fromHeader: true}} component={Team} />
        <Route exact path='/teams/:abbr/games/:id' params={{fromHeader: true}} component={Game} />
        <Route exact path='/leaderboard/' params={{fromHeader: true}} component={Leaderboard} />
        <Route exact path='/leaderboard/:abbr' params={{fromHeader: true}} component={Leaderboard} />
        <Route exact path='/nrl' params={{fromHeader: true}} component={NRL} />
        <Route exact path='/nrl/games/:id' params={{fromHeader: true}} component={Game} />
      </BrowserRouter>
    )
  };
}

export default App

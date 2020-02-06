import React, { Component } from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Home from 'Pages/Home'
import Game from 'Pages/Game'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route exact path='/' params={{fromHeader: true}} component={Home} />
        <Route exact path='/games/:id' params={{fromHeader: true}} component={Game} />
      </BrowserRouter>
    )
  };
}

export default App

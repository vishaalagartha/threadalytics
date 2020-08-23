import React, { useEffect } from 'react'
import {BrowserRouter, Route, Link} from 'react-router-dom'
import Home from 'Pages/Home'
import Team from 'Pages/Team'
import Game from 'Pages/Game'
import Leaderboard from 'Pages/Leaderboard'
import Compare from 'Pages/Compare'
import User from 'Pages/User'
import Guess from 'Pages/Guess'
import About from 'Pages/About'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Toast = ({ closeToast }) => {
  return (
    <Link to='/guess-that-flair' style={{fontFamily: 'Action Bold NBA', width: 'auto', marginRight: '10px'}}>
      New feature alert: 
      Guess That Flair!
    </Link>
  )
}
const App = () => { 

  useEffect(() => {
    toast.warn(Toast, {position: toast.POSITION.TOP_RIGHT, toastId: 'no-way'})
  }, [])

  return (
    <div>
      <BrowserRouter>
        <Route exact path='/' params={{fromHeader: true}} component={Home} />
        <Route exact path='/games/:away@:home-:timestamp' params={{fromHeader: true}} component={Game} />
        <Route exact path='/teams/:abbr' params={{fromHeader: true}} component={Team} />
        <Route exact path='/teams/:abbr/games/:away@:home-:timestamp' params={{fromHeader: true}} component={Game} />
        <Route exact path='/compare' params={{fromHeader: true}} component={Compare} />
        <Route exact path='/leaderboard/' params={{fromHeader: true}} component={Leaderboard} />
        <Route exact path='/leaderboard/:abbr' params={{fromHeader: true}} component={Leaderboard} />
        <Route exact path='/user/' params={{fromHeader: true}} component={User} />
        <Route exact path='/guess-that-flair/' params={{fromHeader: true}} component={Guess} />
        <Route exact path='/about' params={{fromHeader: true}} component={About} />
        <ToastContainer style={{width: 'auto'}}/>
      </BrowserRouter>
    </div>
  )
}


export default App

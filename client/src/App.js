import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import 'bootstrap/dist/css/bootstrap.min.css'
import Design from './pages/Design'
import About from './pages/About'
import Comments from './pages/Comments'
import Winners from './pages/Winners'
import PlayerSentiments from './pages/PlayerSentiments'


const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route Component={Home} path='/' exact />
          <Route Component={Comments} path='/comments' exact />
          <Route Component={Winners} path='/winners' exact />
          <Route Component={PlayerSentiments} path='/sentiments' exact />
          <Route Component={Design} path='/design' exact />
          <Route Component={About} path='/about' exact />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

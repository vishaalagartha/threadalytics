import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'


const App = () => {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route Component={Home} path='/' exact />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

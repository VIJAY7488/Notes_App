
import './App.css'
import Home from './Pages/Home/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import MainPage from './Pages/MainPage/MainPage'

const routes = (
  <Router>
    <Routes>
      <Route path='/' exact element={<MainPage/>} />
      <Route path='/dashboard' exact element={<Home/>} />
      <Route path='/login' exact element={<Login/>} />
      <Route path='/signup' exact element={<Signup/>} />
    </Routes>
  </Router>
)

function App() {
  

  return (
    <>
      {routes}
    </>
  )
}

export default App

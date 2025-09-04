import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Notes from './pages/Notes'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route exact path='/' element={<Notes/>} />
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/register' element={<Register/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App

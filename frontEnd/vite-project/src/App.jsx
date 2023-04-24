import { useEffect, useRef, useState } from 'react'
import { BrowserRouter,  Route,  Routes, useNavigate } from 'react-router-dom'

import './App.css'
import Login from './page/Login'


function App() {
 

  return (
    <>

<BrowserRouter>
<Routes>
<Route path='/' element={<Login></Login>} > </Route>
</Routes>
</BrowserRouter>
    </>
  )
}

export default App

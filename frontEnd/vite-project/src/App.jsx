import { useEffect, useRef, useState } from 'react'
import { BrowserRouter,  Route,  Routes, useNavigate } from 'react-router-dom'

import './App.css'
import Login from './page/Login'
import { Protect } from './components/Protect.jsx'
import { Dashboard } from './page/Dashboard.jsx'


function App() {
   

  return (
    <>

<BrowserRouter>
<Routes>
<Route path='/' element={<Login></Login>} > </Route>
<Route element={<Protect></Protect>}  >
  <Route path='/dashboard' element={<Dashboard></Dashboard>} >  </Route>  
  {/* die Routen unterhalb 
  Werden erst in Protect geprüft und wenn Sie weiter dürfen den werden Sie
  in Protect mit dem <Outlet> </Outlet> nach hier unten zum path= weitergeleitet   */}
  </Route>
</Routes>
</BrowserRouter>
    </>
  )
}

export default App

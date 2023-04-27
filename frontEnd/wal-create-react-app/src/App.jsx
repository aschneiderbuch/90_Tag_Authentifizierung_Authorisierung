import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'
import { Protect } from './components/Protect.jsx'
import { Dashboard } from './page/Dashboard.jsx'
import { Home } from './page/Home.jsx'


function App() {


  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Home></Home>} > </Route >
          <Route path='/logout' element={<Home></Home>} > </Route>
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

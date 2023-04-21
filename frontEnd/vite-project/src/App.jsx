import { useState, useEffect } from 'react'

import './App.css'


function App() {

  useEffect(() => {
    console.log(document.cookie)
  }, [])

  const login = async () => {
    const result = await fetch('http://localhost:9999/login', {
      method: 'POST',
      credentials: 'include',         // ! wichtig, damit die Secure Cookies abgefragt und mitgeschickt werden
      headers: {
        'content-type': 'application/json'          //  damit das Prasen mit express.json() funktioniert
      },
      body:JSON.stringify({ user: 'testName', password: 'testPassword'})
    })
    const data = await result.json()
    console.log(data)
  }

  const check = async () => {
    const result = await fetch('http://localhost:9999/user',{
      credentials: 'include'
    })
  }

  return (
    <>

      <button onClick={login} >login</button>
      <button onClick={check}>check</button>

    </>
  )
}

export default App

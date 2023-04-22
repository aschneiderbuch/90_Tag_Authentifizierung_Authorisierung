import { useEffect, useRef, useState } from 'react'

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
      body: JSON.stringify({ user: 'testName', password: 'testPassword' })
    })
    const data = await result.json()
    console.log(data)
  }

  const check = async () => {
    const result = await fetch('http://localhost:9999/user', {
      credentials: 'include'
    })
    const data = await result.json()
    console.log(data)
  }



  
  const userRef = useRef()   // useRef anstatt useState, 
  // damit nicht bei jedem tippen ein neu rendern stattfindet
  const passwordRef = useRef()
  const envURL = 'http://localhost:9999'
  const envPath = '/register'
  const url = envURL + envPath

  const register = async () => {
    // holt sich den Wert vom inputFeld user und password
    const user = userRef.current.value      // holen des inputs 
    const password = passwordRef.current.value

    try {
      // const getResult = async () => {
      const result = await fetch(url, {
        method: 'POST',
        credentials: 'include',        // wichtig damit Secure Cookies abgefragt und mitgeschickt werden
        headers: {
          'content-type': 'application/json'    // damit express.json() Parsen kann
        },
        body: JSON.stringify({ user, password })  //?   // input Felder in ein Objekt und mitschicken
      })
      const data = await result.json()
      console.log(data)
      userRef.current.value = ''    // leert das input Feld nach dem Register drücken
      // so wie wenn man mit useState arbeitet 
      passwordRef.current.value = ''

      //  }
      //   getResult()

    } catch (error) {
      console.log(error)
    }





  }

  return (
    <>

      <button onClick={login} >login</button>
      <button onClick={check}>check</button>

      <button onClick={register}>register</button>
      <label htmlFor='user'>Register</label>
      <input ref={userRef} type="text" placeholder='user' name='user' required></input>
      <label htmlFor='password'>Password</label>
      <input ref={passwordRef} type="password" placeholder='password' name='password' required></input>


    </>
  )
}

export default App

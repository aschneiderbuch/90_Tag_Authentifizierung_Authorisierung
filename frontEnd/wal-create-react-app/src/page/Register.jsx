import { useRef, useState } from 'react'


import React from 'react'

export const Register = () => {

    const [error, setError] = useState(false)

    const userRef = useRef()   // useRef anstatt useState, 
    // damit nicht bei jedem tippen ein neu rendern stattfindet
    const passwordRef = useRef()
    const envURL = 'http://localhost:9999'
    const envPath = '/register'
    const url = envURL + envPath

    const register2 = async () => {
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

            if (result.ok) {
                console.log('register erfolgreich')
            } else {
                setError(true)     // gibt Error Text wenn nicht geklappt
            }
            //  }
            //   getResult()

        } catch (error) {
            console.log(error)
        }

    }
        return (
            <section className='register'>


                <button onClick={register2}>register</button>
                <label htmlFor='user'>Register</label>
                <input ref={userRef} type="text" placeholder='user' name='user' required></input>
                <label htmlFor='password'>Password</label>
                <input ref={passwordRef} type="password" placeholder='password' name='password' required></input>


                <h4>Status: Error:?  {error ? <p>Sorry hat nicht geklappt</p> : <p>Alles gut</p>}
                    {/* error && <h4></h4> */}
                </h4>

            </section>
        )
    
}
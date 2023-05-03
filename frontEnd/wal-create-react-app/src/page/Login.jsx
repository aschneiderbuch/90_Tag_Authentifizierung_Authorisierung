import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'


import React from 'react'

export const Login = () => {

    const [error, setError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(document.cookie)
    }, [])

    const userLoginRef = useRef()
    const passwordLoginRef = useRef()

    const login2 = async () => {

        const userLogin = userLoginRef.current.value
        // if (userLogin === '') { setError(true); return }   // ! wichtig wenn keine Eingabe kommt man nicht durch Login Feld durch

        const passwordLogin = passwordLoginRef.current.value
        // if (passwordLogin === '') { setError(true); return }    // ! wichtig wenn keine Eingabe kommt man nicht durch Login Feld durch

        const result = await fetch('http://localhost:9999/login', {
            method: 'POST',
            credentials: 'include',         // ! wichtig, damit die Secure Cookies abgefragt und mitgeschickt werden
            headers: {
                'content-type': 'application/json'          //  damit das Prasen mit express.json() funktioniert
            },
            body: JSON.stringify({ user: userLogin, password: passwordLogin })  //?   // input Felder in ein Objekt und mitschicken
        })
        // const data = await result.json()    // gibt keine Antwort nur res.200   also kommt Fehler
        // console.log(data)   

        if (result.ok) {
            console.log('login erfolgreich, mit User: ' + userLogin)
            const data = await result.json()
            console.log(data)
            localStorage.setItem('mailtoken',  data.token )   // speichert den Token in den localStorage')

            navigate('/email')     // weil erfolgreich, wird man weitergeleitet
        }
        else {
            setError(true)   // wenn nicht erfolgreich, wird der Error auf true gesetzt  und unten kommt eine h5 Ausgabe Text
        }

    }

    const check = async () => {
        const result = await fetch('http://localhost:9999/user', {
            credentials: 'include'
        })
        const data = await result.json()
        console.log(data)
    }


    return (

        <section className='login'>

            <button onClick={login2} >login</button>
            <label htmlFor="userLogin">userLogin</label>
            <input ref={userLoginRef} type="text" name="userLogin" id="userLogin" placeholder='userLogin' required />
            <label htmlFor="passwordLogin">passwordLogin</label>
            <input ref={passwordLoginRef} type="password" name='passwordLogin' id='passwordLogin' placeholder="passwordLogin" required />
            <button onClick={check}>check</button>



            <h4>Status: Error:?  {error ? <p>Sorry hat nicht geklappt</p> : <p>Alles gut</p>}
                {/* error && <h4></h4> */}
            </h4>

        </section>
    )
}

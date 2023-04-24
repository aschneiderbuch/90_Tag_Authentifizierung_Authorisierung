import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'



function Login() {
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(document.cookie)
    }, [])

    const userLoginRef = useRef()
    const passwordLoginRef = useRef()

    const login = async () => {

        const userLogin = userLoginRef.current.value
        if(userLogin === '') {setError(true); return }   // ! wichtig wenn keine Eingabe kommt man nicht durch Login Feld durch

        const passwordLogin = passwordLoginRef.current.value
        if(passwordLogin === '') { setError(true) ; return}    // ! wichtig wenn keine Eingabe kommt man nicht durch Login Feld durch

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

            navigate('/dashboard')     // weil erfolgreich, wird man weitergeleitet
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
        <>

            <button onClick={login} >login</button>
            <label htmlFor="userLogin">userLogin</label>
            <input ref={userLoginRef} type="text" name="userLogin" id="userLogin" placeholder='userLogin' required />
            <label htmlFor="passwordLogin">passwordLogin</label>
            <input ref={passwordLoginRef} type="password" name='passwordLogin' id='passwordLogin' placeholder="passwordLogin" required />
            <button onClick={check}>check</button>

            <button onClick={register}>register</button>
            <label htmlFor='user'>Register</label>
            <input ref={userRef} type="text" placeholder='user' name='user' required></input>
            <label htmlFor='password'>Password</label>
            <input ref={passwordRef} type="password" placeholder='password' name='password' required></input>


            <h4>Status: Error:?  {error ? <h5>Sorry hat nicht geklappt</h5> : <h5>Alles gut</h5>}
                {/* error && <h4></h4> */}
            </h4>


        </>
    )
}

export default Login

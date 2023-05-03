import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'



import React from 'react'

export const Email = () => {
    const codeRef = useRef()
    const nav = useNavigate()

    const codeSenden = async () => {
        const token =  localStorage.getItem('mailtoken') //?
        console.log(token)

        const response = await fetch('http://localhost:9999/mailcheck', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ secret: codeRef.current.value })
        })
        console.log(codeRef.current.value)
        console.log(token)
        if (response.ok) {
            console.log("alles gut, du bist eingeloggt Email-Code stimmt")
            nav('/dashboard')
        }
    }



    return (
        <section className='email'>

            <h1>Email Auth   Code aus Email</h1>

            <input ref={codeRef} type="text" placeholder='Code aus der Email' />
            <button onClick={codeSenden} >Absenden</button>


        </section>
    )
}

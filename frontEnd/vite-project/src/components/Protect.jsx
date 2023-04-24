import { Outlet } from "react-router-dom"

// rfac
import { useEffect, useState } from 'react'

export const Protect = () => {
    // useEffect um verifyToken herum bauen
    // und noch einen State ab schon ein Ergebniss vom fetch da ist
    const [istErlaubt, setIstErlaubt] = useState(false)     // damit wird rendern ausgelöst
    // damit ich in der useEffect abfragen kann ob es erlaubt ist oder nicht

    useEffect(() => {

        const verifyToken = async () => {
            try {
                const result = await fetch('http://localhost:9999/userValidate', {
                    credentials: 'include'
                })
                if (result.ok) {
                    setIstErlaubt(true)
                   // console.log(result)
                    return <Outlet></Outlet>  // ! hier leite er dann zu den geschützten Protected Routen 

                } else {
                    setIstErlaubt(false)
                   // console.log(result)                    // Seite wo soll er noch so hin wenn nix ist
                }
            } catch (err) {
                console.log(err)
            }

        }
        verifyToken()

    }, [])


    return (
        <>
        { istErlaubt ? <Outlet></Outlet> : <h1> Bitte einlogen </h1>} 
{/*         // ! <Outlet> </Outlet> damit wird in die Erlaubten Routen die Protected sind weitergeleitet
 */}      
        </>
    )


}

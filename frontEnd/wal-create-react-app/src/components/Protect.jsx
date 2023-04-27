import { Outlet } from "react-router-dom"

// rfac
import { useEffect, useState } from 'react'
import { Login } from '../page/Login.jsx'

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
                 //   return <Outlet></Outlet>  // ! hier leite er dann zu den geschützten Protected Routen 

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

switch(istErlaubt){
    case true:
        return <Outlet></Outlet>
    case false:
        return <Login></Login>
    default:
        return <h1> *** L o a d i n g *** </h1>
}

   /*  return  (
        <>


         { istErlaubt_ ? <Outlet></Outlet> : <h1> Bitte einlogen </h1>} 
        { istErlaubt ? <Outlet></Outlet> : <Login></Login> }  
    
        </>
    )
 */

}

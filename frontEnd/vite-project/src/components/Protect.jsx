import { Navigate, Outlet } from "react-router-dom"

// rfac
import React, { useEffect } from 'react'

export const Protect = () => {


    // useEffect um verifyToken herum bauen
    // und noch einen State ab schon ein Ergebniss vom fetch da ist

    useEffect(() => {

        const verifyToken = async () => {
            try {
                const result = await fetch('http://localhost:9999/userValidate', {
                    credentials: 'include'
                })
                if (result.ok) {
                    console.log(result)
                    return <Outlet></Outlet> // damit wird in die Erlaubten Routen die Protected sind weitergeleitet

                } else {
                    return false
                    // Seite wo soll er noch so hin wenn nix ist
                }
            } catch (err) {
                console.log(err)
            }

        }
        verifyToken()

    }, [])




}

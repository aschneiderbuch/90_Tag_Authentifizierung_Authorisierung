import { createHmac } from 'crypto'

import { validationResult } from 'express-validator'  // für Validierung damit er isEmpty Fehler meldet
import validator from 'validator'       // für isStrongPassword Validierung

import { verifyToken } from '../util/token.js'



// ! das Passwort aus dem FrontEnd wird verschlüsselt     !!! so das es nie wieder zurück gerechnet werden kann
// ! man kann nur anhand der Hashes vergleichen ob es das gleiche Passwort ist bzw war
// ! ohne .update    erzeugt hmac ein Hash-Objekt, das nicht mehr geändert werden kann  und das nicht mehr entschlüsselt werden kann
// ! next      wichtig,   damit die Funktion weiter geht wenn leer ist
export const encryptPassword = (req, res, next) => {
  console.log('in der middleware')
  console.log(req.body)

  // Passwort wird mit express validator geprüft ob es auch wirklich ein isStrongPassword ist
  const result = validationResult(req)

  // prüft ob es Validierungsfehler gibt, wenn es keine gibt, dann = leer und es geht weiter mit hmac
  if (result.isEmpty()) {

    // entspricht das Passwort den isStrongPassword Kriterien
    // min 8 Zeichen min 1 groß min 1 klein min 1 Sonderzeichen
    if (validator.isStrongPassword(req.body.password)) {

      // jetzt noch das Password auf zusätzliche eigene Kriterien prüfen mit //! check
      const checkPasswordAufEigeneKriterien = validator
        .matches(req.body.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})/)
      // ! min 10 Zeichen, groß, klein, Sonderzeichen, Buchstaben und Zahlen
        
      if (checkPasswordAufEigeneKriterien) {

      // das Passwort wird zu einem Hash verschlüsselt  -> Rückumwandlung nicht mehr möglich
      const hmac = createHmac('sha512',
        req.body.password)     //  das Passwort aus dem FrontEnd //! soll verschlüsselt


      // ! das Passwort wird noch zusätzlich mit dem JWT_SECRET verschlüsselt
      // ! vorteil, wenn das psw nur a wäre, könnte es durch brute force herausgefunden werden 
      // bzw. durch ein Wörterbuch oder durch Rainbow Tables
      hmac.update(process.env.JWT_SECRET)

      req.body.password = hmac.digest('hex')     // ! hier wird psw verschlüsselt // das Passwort wird in Hexadezimal umgewandelt
      // ! wir speichern das verschlüsselte psw zurück ins psw und überschreiben es somit von davor
      // ! psw wird also sofort verschlüsselt selbst im BackEnd wird es also nie im Klartext gespeichert


      } else {
        return res.status(403).json({ message: `eigene Passwort prüfung ist nicht sicher genug(min 10 Zeichen, groß, klein, Sonderzeichen, Buchstaben und Zahlen) ${result.array()}` })
      }


    } else {
      return res.status(401).json({ message: `Passwort ist nicht sicher genug(min 8 Zeichen, groß, klein, Sonderzeichen, Buchstaben und Zahlen) ${result.array()}` })
    }

  } else {
    return res.status(402).json({ message: `Passwort Validierungsfehler ${result.array()}` })
  }

  next()      // wichtig, damit die Funktion weiter geht, wenn kein .password
}




// ! verifyJWTToken  // von util/token.js
export const verifyJWTToken = (req, res, next) => {
  const token = req.cookies.token
  try {
    const userClaim = verifyToken(token)   // ! vergleich findet in token.js statt   
    req.user = userClaim
    next()
  } catch (err) {
    console.log(err)
    res.status(401).end()
  }
}





export const deleteCookie = (req, res, next) => {
  console.log('in Middleware deleteCookie')
  res.clearCookie('token', { httpOnly: true, secure: true })  // ! secure Cookie 'token'    wird gelöscht
  // damit nicht mehr eingeloggt ist

  // res.cookie.set('token', 's', { expires: new Date(0), secure:true})
  // '' leeren String, damit Hash weg ist
  // new Date(0) setzt das Ablaufdatum vom token auf 1.1.1970 00:00:00 ;-)

  next()
}





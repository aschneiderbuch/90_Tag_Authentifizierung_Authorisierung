import { createHmac } from 'crypto' 

// ! das Passwort aus dem FrontEnd wird verschlüsselt
// ! next      wichtig,   damit die Funktion weiter geht wenn leer ist
export const encryptPassword = (req, res, next) => {
    console.log('in der middleware')
    console.log(req.body)
const hmac = createHmac('sha512',  
 req.body.password)     // ! das Passwort aus dem FrontEnd wird verschlüsselt

// ! hmac.update(process.env.JWT_SECRET)     // ! das Passwort wird noch zusätzlich mit dem JWT_SECRET verschlüsselt

req.body.password = hmac.digest('hex')     // das Passwort wird in Hexadezimal umgewandelt

next()      // wichtig, damit die Funktion weiter geht, wenn kein .password

}
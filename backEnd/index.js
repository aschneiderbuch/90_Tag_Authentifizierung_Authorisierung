import './util/config.js'
import express from 'express'     // zum server erstellen
import cors from 'cors'          // für Sicherheit URL beschränken    // ! Secure HTTPS Cookies  credentails: true
import morgan from 'morgan'     // für Logging
import cookieParser from 'cookie-parser'     // auslesen von Cookies





import multer from 'multer'    // für Bilder -> uploads   oder zum inputFields auslesen     // dest: 'uploads/' bild im Backend speichern - pfad in MongoDB hinterlegen
import { fileTypeFromBuffer } from 'file-type'      // zum erkennen des Dateitpys  und zwischenspeichern im Buffer und Memory
import path from 'path'    // ! 87_Tag_Boo -> boote.js damit Bild Pfad gefunden wird      wenn man Pfad in MongoDB speichert 
import { ObjectId } from 'mongodb'  // damit man api/v1/boote/:id aufrufen kann   und  id auslesen kann mit const { id } = req.params
import { v4 as uuidv4 } from 'uuid' 
import express_validator from 'express-validator'   // für Validierung von Daten im BackEnd
import nodemailor from 'nodemailer'   // für Email versenden   // https://mailtrap.io/  free Testing Dashboard
import { getDb } from './util/db.js'   //   stellt Verbindung zur MongoDB her einloggen und Datenbank auswählen






const BACKEND_PORT = process.env.BACKEND_PORT
const app = express()   // server erstellen

app.use(morgan('dev'))   // für Logging

const CORS_WHITELIST = process.env.CORS_WHITELIST
app.use(cors( {
    origin: CORS_WHITELIST.split(','),
    credentails: true           // ! Secure HTTPS Cookies    wichtig damit HTTPS Cookies durchgelassen werden
}))

app.use(cookieParser())          // ! auslesen von Cookies

app.use(express.json())             // für JSON Daten vom FrontEnd BODY PARSER

// / output auf Seite   Alles OKAY
app.get('/', (req, res) => {
    res.status(200).send('Alles OKAY')
})

// alle Routen


// einfache Cookies setzen mit einer Route    // ohne Sicherheit ohne HTTPS ohne credentials
app.get ('/cookieSetzen', (req, res) => {
    res.cookie('testNameKey', 'testTextValue' )  // mit maxAge: 1000 * 60 * 60   // 1 Stunde aktiv
    res.status(200).send('Cookie gesetzt Alles OKAY')
})


// auf Cookie Objekt zugreifen        
// geht nur mit authController.js   ->  das von der Middleware cookieParser erstellt wurde
app.get('/cookieAuslesen' , (req, res) => {
    console.log(req.cookies.token)    // ! das Cookie Objekt von token wird ausgelesen
    res.end()
})


// ? Vorsicht verschlüsseltes Passwort und Token sind zwei unterschiedliche Dinge

// wir bauen uns ein registerieren und einen anmelden/login bereich   Routen
app.post('/register', encryptPassword, register)   // ! das Passwort wird verschlüsselt
// psw wird mit encryptPassword in util/token.js verschlüsselt
// und dann register in controller/authController.js weitergeleitet
// dort in authCon.. wird das Passwort in der // ! MongoDB gespeichert

app.post('/login', encryptPassword, login)  // ! das verschlüsselte Passwort wird weitergeleitet und geprüft
// psw wird mit encryptPassword in util/token.js verschlüsselt
// und dann login in controller/authController.js weitergeleitet
//  dort in authCon.. wird das Passwort in der // ! MongoDB geprüft



// Server starten
app.listen(BACKEND_PORT, () => {
    console.log(`Server läuft auf Port: ${BACKEND_PORT} `)
})
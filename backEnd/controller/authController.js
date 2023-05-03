import { getDb } from '../util/db.js'
import { createToken, createMailToken, verifyMailToken } from '../util/token.js'    // dort wird Token mit jwt.sign  JWT_SECRET und user._id  und 1h verschlüsselt
import { sendMail } from '../util/mail.js'

// ! damit werden die Cookies sicherer gemacht, das sie im FontEnd nicht gelesen werden können 
// ! und nur über HTTPS übertragen werden
// ! dieses cookie kann nur im BakcEnd gelesen werden    
// ! kann nicht im FrontEnd ausgelesen werden
const cookieConfig = {
    httpOnly: true,     // ! Secure HTTPS Cookies    wichtig damit HTTPS Cookies durchgelassen werden  // ! Cookies können nicht im FrontEnd ausgelesen werden
    secure: true,       // ! aktivieren von HTTPS Cookies   // außnahme localhost
    sameSite: 'none'    // ! damit sie nicht von der gleichen Domain kommen müssen 
    // da wir auf localhost:3000 oder localhost:5173 arbeiten  // React Vite usw
}






// wir erzeugen einen neuen User und legen Ihn in der Datenbank ab
// mit Namen und bereits mit Token verschlüsseltem Passwort
// ! Problem es findet noch kein Abgleich mit der Datenbank statt ob es den User schon gibt :-(
const COL = 'user'
export const register = async (req, res) => {
    try {

        console.log(req.body)
        // const user = req.body   -> dann kann man unten anstatt req.body    user   reinschreiben 

        const db = await getDb()
        const result = await db.collection(COL).insertOne(req.body)  // ! das Passwort ist bereits verschlüsselt und wird verschlüsselt in die MongoDb geschrieben
        console.log(result)
        res.status(201).json(result)


    } catch (err) {
        console.log(err)
        res.status(589).json({ message: ` User konnte nicht angelegt werden: ${err}` })
    }

}

// login ohne den MailVersand  
export const login_ohneMailVersand = async (req, res) => {

    try {

        console.log(req.body)
        const db = await getDb()
        const dbUser = await db.collection('user').findOne({ user: req.body.user, password: req.body.password })
        console.log(dbUser)

        if (dbUser === null) {
            res.status(401).end()   // ! nur 401 zurück, 
            // ! damit unberechtigte nicht wissen ob es user schon gibt oder ob nur psw usw. falsch sind usw
            // ! dadurch mehr Sicherheit
            //       401 Unauthorized   //  403 Forbidden //  404 Not Found

        } else {
            // wir wollen eine Token haben
            console.log(dbUser)
            const token = createToken(dbUser) // ! das Token wird mit jwt.sign  JWT_SECRET und user._id  und 1h verschlüsselt
            res.cookie('token', token, cookieConfig) // ! das Token wird in einem Cookie gespeichert 
            // und ans FrontEnd zurückgegeben 
            // damit es dort bei Cookies gespeichert wird 
            // ! und man nicht immer neu einloggen muss wenn man einen fetch im FontEnd macht 
            // ! sondern das Cookie mit dem Token wird vom FontEnd mitgeschickt

            res.end()     // ! fontEnd bekommt nur 200 zurück  
            // und weiß dann das alles OKAY ist 
        }
    } catch (err) {
        console.log(err)
        res.status(579).json({ message: ` User Login nicht möglich: ${err}` })
    }
}

// login neu   mit MailVersand
export const login = async (req, res) => {
   const { user, password } = req.body
    console.log('test clg user'+user)
   // console.log(password)
    const user2 = req.body
    console.log('test clg user2'+user2)

    try {
        const db = await getDb()
        const result = await db.collection(COL).findOne({user, password}) // ! wir suchen nach dem User in der Datenbank/Dokument

        if (result === null) {
            res.status(401).json({ message: ` User ${user} nicht gefunden: ${err}` })
        }
        else { // createMailToken wird aus util/token.js importiert
            const mailtoken = createMailToken({ user: result._id }) // wir holen _id aus der Datenbank und verschlüsseln es mit jwt.sign

            // sendMail wird aus util/mail.js importiert
            // wir übergeben sendMail aus der Datenbank die EmailAdresse 
            // und den gerade mit jwt.sign verschlüsselten mailtoken
            sendMail(result.email, mailtoken.secret)
            res.status(200).json({ token: mailtoken.token }) // wir geben den mailtoken ans FrontEnd zurück  
            // ! damit wir ihn im localStorage speichern können
            // ! damit es noch sicherer wäre könnten wir den mailtoken auch als 2ten secure Cookie speichern wie oben im login
        }
    } catch (err) {
        console.log(err)
        res.status(579).json({ message: `User Login nicht möglich es wird kein mailtoken verschickt: ${err}` })
    }
}


export const mailCheck = async (req, res) => {
    
    console.log('--> inhalt von req.headers[authorization]'+req.headers['authorization'])
    const mailtoken = req.headers['authorization'].split(' ')[1] // den mailToken vom frontEnd aus dem header holen
    // authorization      ist im frontEnd gesetzt, damit er hier durchkommt
    // authorization     muss hier auch gesetzt werden, damit er im frontEnd durchkommt
    // authorization    heißt noch nicht, das es sicher ist, es ist nur ein Name
    // authorization    --> d.h. der mailToken muss hier noch verifiziert werden
    const secret = req.body.secret     // der secret Code vom frontEnd inputField wird ausgelesen (evtl. 6 Stellig)
    console.log('vor try verifyMailToken' + secret, mailtoken)
    console.log('--> mailtoken.token', mailtoken.token)


    try {
        const claim = verifyMailToken(mailtoken, secret)
        console.log('nach verifyMailToken', claim)

        // ! jetzt wird der login Token für die secure Cookies erstellt      -> so wie oben im login_alt...
        const token = createToken({ user: claim.user }) // ! das Token wird mit jwt.sign  JWT_SECRET und user._id  und 1h verschlüsselt
        res.cookie('token', token, cookieConfig) // ! ans frontEnd schicken und in secure Cookie speichern
        res.status(200).end()
    } catch (err) {
        console.log(err.message)
        console.log(err.stack)
        res.status(491).json({ message: `User Login, Fehler bei Email-Code eingabe: ${err}` })
    }
}
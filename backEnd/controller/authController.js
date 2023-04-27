import { getDb } from '../util/db.js'
import { createToken } from '../util/token.js'    // dort wird Token mit jwt.sign  JWT_SECRET und user._id  und 1h verschlüsselt

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
export const register = async (req, res) => {
    try {

        console.log(req.body)
        // ! try und catch fehlt noch ???
    
        const db = await getDb()
        const result = await db.collection('user').insertOne(req.body)  // ! das Passwort ist bereits verschlüsselt und wird verschlüsselt in die MongoDb geschrieben
        console.log(result)
        res.status(201).json(result)   


    } catch (err) {
        
    }

}


export const login = async (req, res) => {
    console.log(req.body)
    const db = await getDb()
    const dbUser = await db.collection('user').findOne( { user: req.body.user, password: req.body.password})
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
}



export const mailCheck = async (req, res) => {

}
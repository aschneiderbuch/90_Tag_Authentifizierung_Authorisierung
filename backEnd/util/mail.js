import nodemailer from 'nodemailer'

// Mailtrap.io  free Testing Dashboard
// mailServer Config
const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})


export const sendMail = (address, content) => {
    const message = {
        from: 'senderServer@Server.com',
        to: address,    // fragen wir von FrontEnd ab beim Login
        subject: 'einmal Passwort Authentifizierung läuft in 15 Min ab',
        text: 'Ihr angefordertes einmal Passwort zum einwählen',
        html: `<h1>${content.secret}</h1> 
        <h3>${content.token}</h3>`  // ! .token raus nehmen, nur zum testen
        // denn wird nur in lokalStorage gespeichert
    }
    
    transport.sendMail(message, (err, info) => {
        try {
            if (err) {
                console.log(err)
                return
            }
            console.log(info)
        } catch (err) {
            console.log(err)
            // oder console.error(err)    // dann taucht es in Console rot auf
        }
    })
}




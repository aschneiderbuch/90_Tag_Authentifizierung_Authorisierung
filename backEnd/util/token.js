import jwt from 'jsonwebtoken'

export const createToken = (user) => {
  const token = jwt.sign({ user: user._id },      // ! macht das Token mit dem user._id Value von MongoDb verschlüsselt wird
    process.env.JWT_SECRET,         // ! macht das Token mit dem JWT_SECRET verschlüsselt wird
    { expiresIn: '1h' })             // ! macht das Token nach 1h ungültig ist

  return token           //  Token wird zurückgegeben
}



// ? mit try? 
export const verifyToken = (token) => {
  //  try { 
  const result = jwt.verify(token, process.env.JWT_SECRET)     // ! der Token wird mit dem JWT_SECRET entschlüsselt
  // bzw. JWT_SECRET wird geprüft und ob Hash vom Token übereinstimmt
  // damit kann erkannt werden ob payload verändert wurde
  return result
  //   } catch (error) {
  //     console.log(error)
  //   return false
  //   }
}



// ! noch wegen Email versand abändern
// !      1. secret = Email Code   + 2. JWT_MAIL_SECRET

// 6 Stellen Zufallszahl+a-Z generieren für Email Code
const createSecret = () => {
  const auswahlBereich = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let secret = ''
  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * auswahlBereich.length) // .length weil ja random nur 0 oder 1 sein
    secret += auswahlBereich[index]
  }
  console.log(secret)
  return secret
}

// claim = user     gekommt input   mit claim sagen wir, 
// das input allgemeiner ist und man nicht auf den input schließen kann
export const createMailToken = (claim) => {
  const secret = createSecret()
  const token = jwt.sign(claim, secret + process.env.JWT_MAIL_SECRET, { expiresIn: '15m' })
  return { secret, token }
}

// ! verifyMailToken     -> später dann noch eine extra Route zum prüfen des Tokens
export const verifyMailToken = (token, secret) => {
// console.log('-->token split'+token.split(':')[2].replace(/"/gi, ' ').replace(/}/gi, ' ' ).trim(''))
// token = token.split(':')[2].replace(/"/gi, ' ').replace(/}/gi, ' ' ).trim('')
  console.log('im verifyMailToken funk',token, secret)
  
  const result = jwt.verify(token, secret + process.env.JWT_MAIL_SECRET)
  return result
}

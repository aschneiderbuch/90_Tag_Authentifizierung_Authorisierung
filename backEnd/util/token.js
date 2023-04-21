import jwt from 'jsonwebtoken'

export const createToken = ( user ) => {
    const token = jwt.sign ( { user: user._id } ,      // ! macht das Token mit dem user._id Value von MongoDb verschlüsselt wird
        process.env.JWT_SECRET,         // ! macht das Token mit dem JWT_SECRET verschlüsselt wird
        { expiresIn: '1h' })             // ! macht das Token nach 1h ungültig ist

        return token           //  Token wird zurückgegeben
}



// ? mit try? 
export const verifyToken = (token) => {
    try { 
        const result = jwt.verify(token, process.env.JWT_SECRET)     // ! der Token wird mit dem JWT_SECRET entschlüsselt
        // bzw. JWT_SECRET wird geprüft und ob Hash vom Token übereinstimmt
        // damit kann erkannt werden ob payload verändert wurde
        return result
    } catch (error) {
        console.log(error)
        return false
    }
}




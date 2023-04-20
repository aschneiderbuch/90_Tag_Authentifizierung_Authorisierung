import { MongoClient } from 'mongodb'

const URL = process.env.MONGO_URI
const DB = process.env.MONGO_DB

const client = new MongoClient(URL)

let db 

export const getDb = async () => {
    if (db) {
        return db
    }
    await client.connect()
    db = client.db(DB)
    return db
}
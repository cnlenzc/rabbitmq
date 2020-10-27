const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'
const dbName = 'my-logs'

async function connect () {
  const client = new MongoClient(url, { useUnifiedTopology: true })
  await client.connect()
  return client.db(dbName)
}

async function insert (table, content) {
  const db = await connect()
  logInfo('mongo connect')
  const ret = await db.collection(table).insertOne(content)
  logInfo('mongo insert', ret.insertedId.toString())
}

module.exports = {
  insert
}

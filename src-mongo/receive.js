const amqp = require('amqplib')

require('./global')
const { insert } = require('./mongo-insert')

async function consume(queue, callback) {
  const conn = await amqp.connect('amqp://localhost')
  const channel = await conn.createChannel()
  channel.assertQueue(queue, { durable: false })
  channel.prefetch(1)
  const callbackAck = async message => {
    try {
      await callback(message)
    } catch (erro) {
      logError('Erro ao consumir mensagem', erro)
    } finally {
      channel.ack(message)
    }
  }
  channel.consume(queue, callbackAck, { noAck: false })
  logInfo('Escutando...')
}

async function processaMensagem(message) {
  logInfo('Recebeu mensagem:', message.content.toString())
  await insert('log', { mensagem: message.content.toString() })
}

async function main() {
  try {
    logInfo('Inicio')
    await consume('fila-k', processaMensagem)
  } catch (err) {
    console.error('Erro:', err)
    process.exit(1)
  }
}

main()

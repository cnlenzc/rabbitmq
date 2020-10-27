const amqp = require('amqplib')

require('./global')

async function send(queue, message) {
  const conn = await amqp.connect('amqp://localhost')
  const channel = await conn.createChannel()
  channel.assertQueue(queue, { durable: false })
  channel.sendToQueue(queue, Buffer.from(message))
  logInfo('Enviou mensagem:', message)
}

async function main() {
  try {
    for (let i = 0; i < 10; i++) {
      await send('fila-k', 'oi ' + i + ' ' + horario())
    }
    await sleep(500)
    process.exit(0)
  } catch (err) {
    console.error('Erro:', err)
    process.exit(1)
  }
}

main()

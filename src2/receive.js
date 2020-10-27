const amqp = require('amqplib')
const moment = require('moment')

const horario = () => moment().format('HH:mm:ss.SSS')
const logInfo = (...args) => console.log(horario(), ...args)

async function consume(queue, callback) {
  const conn = await amqp.connect('amqp://localhost')
  logInfo('Conectou')
  const channel = await conn.createChannel()
  logInfo('Criou canal')
  channel.assertQueue(queue, { durable: false })
  logInfo('Criou fila')
  channel.consume(queue, callback, { noAck: true })
  logInfo('Escutando...')
}

function processaMensagem(message) {
  logInfo('Recebeu mensagem:', message.content.toString())
}

async function main() {
  try {
    logInfo('Inicio')
    await consume('fila-x', processaMensagem)
  } catch (err) {
    console.error('Erro:', err)
    process.exit(1)
  }
}

main()

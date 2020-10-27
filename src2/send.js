const amqp = require('amqplib')
const moment = require('moment')

const horario = () => moment().format('HH:mm:ss.SSS')
const logInfo = (...args) => console.log(horario(), ...args)
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function send (queue, message) {
  const conn = await amqp.connect('amqp://localhost')
  logInfo('Conectou')
  const channel = await conn.createChannel()
  logInfo('Criou canal')
  channel.assertQueue(queue, { durable: false })
  logInfo('Criou fila')
  channel.sendToQueue(queue, Buffer.from(message))
  logInfo('Enviou mensagem:', message)
}

async function main () {
  try {
    logInfo('Inicio')
    for (let i = 0; i < 10; i++) {
      await send('fila-x', 'oiiii ' + i)
    }
    logInfo('sleep')
    await sleep(500)
    logInfo('Fim')
    process.exit(0)
  } catch (err) {
    console.error('Erro:', err)
    process.exit(1)
  }
}

main()

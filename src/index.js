import readline from 'readline'
import io from 'socket.io-client'

/*
*
* Using readline for user input
* See docs here:
* https://nodejs.org/api/readline.html
*
*/

/*
*
* Using Socket.io for web socket communication
* See docs here:
* https://socket.io/docs/
*
*/

const socket = io('http://localhost:5000')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.setPrompt('main_menu> ')
rl.prompt()

rl.on('line', (input) => {
  rl.write(`Received: ${input}`)
  rl.prompt()
})

socket.on('connection', (socket) => {
  rl.write('Connected')
})

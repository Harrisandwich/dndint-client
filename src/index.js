import readline from 'readline'
import io from 'socket.io-client'
import parseCommand from './parse-command'


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
let connected = false
let appstate = 'menu'
const socket = io('http://localhost:5000')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

socket.on('connect', (resp) => {
  console.log('Connected to server')
  console.log('Welcome! Use "/help" to see a list of available commands!')
  rl.setPrompt('Main Menu: ')
  rl.prompt()
  connected = true
})


rl.on('line', (input) => {
  if (connected) {
    const command = parseCommand(input)
    if (command) {
      socket.emit('command', {
        command,
        appstate,
      })
    }
  }
})

socket.on('command-response', (resp) => {
  console.log(resp.output)
  rl.prompt()
})

let secondsWaited = 0
const connectionInterval = setInterval(() => {
  if (!connected) {
    console.log('Trying to connect...')
    if (secondsWaited > 10) {
      clearInterval(connectionInterval)
      console.log('Could not connect. Try again later')
    } else {
      secondsWaited += 1
    }
  } else {
    clearInterval(connectionInterval)
    rl.prompt()
  }
}, 1000)

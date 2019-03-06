#!/usr/bin/env node

import readline from 'readline'
import io from 'socket.io-client'
import dotenv from 'dotenv'
import parseCommand from './parse-command'


dotenv.load()

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
const socketUrl = false ? process.env.HEROKU_SERVER_URL : process.env.LOCAL_SERVER_URL
const socket = io(socketUrl)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

socket.on('connect', () => {
  console.log('Connected to server')
  connected = true
})


rl.on('line', (input) => {
  if (connected) {
    const payload = parseCommand(input)
    if (payload) {
      socket.emit('command', payload)
    }
  }
})

socket.on('command-response', (resp) => {
  console.log(resp.output)
  rl.prompt()
})

socket.on('error', (resp) => {
  console.log(resp.output)
  rl.prompt()
})

socket.on('set-appstate', (resp) => {
  console.log('Remember: You can use "/help" to see a list of available commands!')
  switch (resp.state) {
    case 'menu':
      rl.setPrompt('Main Menu: ')
      break
    case 'lobby':
      rl.setPrompt(`${resp.displayName}-${resp.roomCode}: `)
      break
    case 'playing':
      rl.setPrompt(`${resp.name}: `)
      break
    default:
      rl.setPrompt('Main Menu: ')
  }
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

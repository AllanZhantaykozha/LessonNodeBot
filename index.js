import TelegramApi from 'node-telegram-bot-api'
import { gameOptions, againOptions } from './options.js'

const token = '5600467020:AAGArbsaJFOUy8OLfY9wpVbyUOrNte3glVg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatID) => {
    await bot.sendMessage(chatID, 'Сейчас я загадая цифру от 0 до 9, а ты должен угадать ее!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatID] = randomNumber
    await bot.sendMessage(chatID, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Информация о боте'},
        {command: '/game', description: 'Игра'}
    ])

    bot.on('message', async msg => {
        const username = msg.chat
        const text = msg.text
        const chatID = msg.chat.id

        if (text === '/start') {
            await bot.sendSticker(chatID, 'https://tgram.ru/wiki/stickers/img/MemeS1ick3r/gif/7.gif')
            return bot.sendMessage(chatID, `Добро пожаловать на мой телеграм канал ${username.first_name} ${username.last_name}`)
        } 
        if (text === '/info') {
            return bot.sendMessage(chatID, `Это телеграм создан для обучение nodejs`)
        }

        if (text === '/game') {
            return startGame(chatID)
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
            startGame(chatId)
        } else if (parseInt(data) === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал, цифра ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал, цифра ${chats[chatId]}`, againOptions)
        }
        
    })
}

start()


import Router from 'express'
import express from 'express'
import socketServer from '../app.js';
import __dirname from "../utils.js"
import Chats from '../dao/dbManagers/chats.js';

const app = express()

app.use(express.json());
app.use(express.static(__dirname + "/public"))


const chatsManager = new Chats('./chats');


const router = Router();

router.post("/", async (req, res) => {
    const { user, message } = req.body

    const newMessage = await chatsManager.saveMessages(user, message)

    socketServer.emit("newMessage", newMessage)

    res.send(({ status: "success", payload: newMessage }))
})

router.get('/', async (req, res) => {
    let chats = await chatsManager.getAll();
    if (!chats) return res.status(404).json({ status: "No se encontraron Chats" })
    res.send({ status: "success", payload: chats })
})

export default router
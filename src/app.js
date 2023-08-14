import express from "express";
import __dirname from './utils.js'
import viewRouter from './routes/views.router.js'
import productsRouter from './routes/product.router.js'
import cartsRouter from './routes/cart.router.js'
import chatsRouter from './routes/chat.router.js'
import sessionRouter from "./routes/sessions.router.js";
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import { Server } from 'socket.io'
import passport from "passport";
import initializedPassport from "./config/passport.middleware.js";
import initPassportGithub from "./config/passportGithub.config.js";
import cookieParser from 'cookie-parser'


const app = express();
const PORT = 8080;


const connection = mongoose.connect(
    "mongodb+srv://Aruzuhed:Coder123@passportjwt.wgcwgdr.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//passport
initializedPassport();
initPassportGithub();
app.use(passport.initialize())
app.use(cookieParser())

// uso de json con postman
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', viewRouter)


// rutas del router
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/chat', chatsRouter)
app.use('/api/sessions', sessionRouter)

const server = app.listen(PORT, () => {
    console.log("Servidor levantado en http://localhost:8080")
})

const socketServer = new Server(server)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})
export default socketServer

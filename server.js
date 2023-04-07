const express = require('express')
const {createServer} = require('http')
const {Server} = require('socket.io')
const path = require('path')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => {
//     res.sendFile(__dirname, 'index.html');
// });

io.on('connection', (socket)=>{
    console.log('Connection Done..!!');

    socket.on('create-room', ({username, room})=>{
        socket.join(room)
        io.to(room).emit('room-created', room ,username)
    })

    socket.on('join-room', ({username, room})=>{
        socket.join(room)
        io.to(room).emit('room-joined', room , username)
    })
})


const PORT = process.env.PORT || 3000

httpServer.listen(PORT, ()=>{
    console.log(`Server is Running on port no : ${PORT}`);
})
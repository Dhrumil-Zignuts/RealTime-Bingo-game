const express = require('express')
const mongoose = require('mongoose')
const { createServer } = require('http')
const { Server } = require('socket.io')
const path = require('path')
const { create } = require('domain')

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/', (req, res) => {
//     res.sendFile(__dirname, 'index.html');
// });
io.on('connection', (socket) => {
    console.log('Connection Done..!!');
    socket.on('create-room', async ({ username, room }) => {
        socket.join(room)
        const data = {
            username: username,
            room : room,
            socketID : socket.id
        }
        try{
            const user = await MyModel.create(data)
            const users = await MyModel.find({ room : room})
            io.to(room).emit('room-created', users)
        }catch(err){
            console.log(err);
        }

    })
    socket.on('join-room', async ({ username, room }) => {
        socket.join(room)
        const data = {
            username: username,
            room : room,
            socketID : socket.id
        }
        try{
            const user = await MyModel.create(data)
            const users = await MyModel.find({ room : room})
            io.to(room).emit('room-joined', users)
        }catch(err){
            console.log(err);
        }
    })

    socket.on('user-clicked', (data) => {
        console.log('data: ', data);
        io.to(data.room).emit('user-move', data)
    })

    socket.on('winner', (data) => {
        io.to(data.room).emit('winner', data)
    })

    // socket.on("disconnect", async (reason) => {
    //     console.log('reason: ', reason);
    //     try{
    //         const disconnectedUser = await MyModel.findOne({socketID : socket.id})
    //         const deleteUser = await MyModel.deleteOne({socketID : socket.id})
    //         console.log('disconnectedUser: ', disconnectedUser);
    //         const users = await MyModel.find({ room : disconnectedUser.room})
    //         console.log('users: ', users);
    //         io.to(disconnectedUser.room).emit('room-joined', users)
    //     }catch(err){
    //         console.log(err);
    //     }
    //   });
})


const MyModel = mongoose.model('Users', new mongoose.Schema({ username: String, room : String, socketID : String }));
mongoose.connect('mongodb+srv://dhrumilZignuts:Zignuts123@zignuts-technology.zveo5bz.mongodb.net/BingoUsers?retryWrites=true&w=majority');


const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {

    console.log(`Server is Running on port no : ${PORT}`);
})
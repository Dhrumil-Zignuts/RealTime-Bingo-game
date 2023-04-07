$(document).ready(function () {
    const socket = io();
    $('#createRoom').on('click', function () {
        const createRoomData = {
            username: $('#createUserName').val(),
            room: $('#createRoomName').val()
        }
        console.log('createRoomdata: ', createRoomData);
        socket.emit('create-room', createRoomData)
    })

    socket.on('room-created', (room, username) => {
       
        console.log(`${room} is Created by ${username}`);
        const array = []
        array.push(username)
        localStorage.setItem("Dhrumil", JSON.stringify(array))
        $('#tableBody').append(`
        <tr>
            <td>${username}</td>
        </tr>`)
        $('#exampleModal').modal('hide')
         $('#home').css('display', 'none')
        $('#game').css('display', 'block')
    })

    $('#joinRoom').on('click', function(){
        const joinUserData = {
            username : $('#joinUserName').val(),
            room : $('#joinRoomName').val()
        }
        console.log('joinUserData: ', joinUserData);
        socket.emit('join-room', joinUserData)
    })

    socket.on('room-joined', (room, username) => {
       
        console.log(`${room} is Joined by ${username}`);
        const data = JSON.parse(localStorage.getItem('Dhrumil'))
        localStorage.setItem('Dhrumil', JSON.stringify([...data, username]))
        $('#tableBody').append(`
        <tr>
            <td>${username}</td>
        </tr>`)
        $('#exampleModal2').modal('hide')
         $('#home').css('display', 'none')
        $('#game').css('display', 'block')
    })
})
$(document).ready(function () {
    const socket = io();
    let myUsers

    let username
    let room
    let connectedUsers
    $('#createRoom').on('click', function () {
        username = $('#createUserName').val()
        room = $('#createRoomName').val()

        const createRoomData = {
            username: username,
            room: room
        }
        socket.emit('create-room', createRoomData)
    })

    socket.on('room-created', (users) => {
        $('#tableBody').empty();
        for (let i = 0; i < users.length; i++) {
            $('#tableBody').append(`
                <tr>
                    <td>${users[i].username}</td>
                </tr>`)

        }
        $('#exampleModal').modal('hide')
        $('#home').css('display', 'none')
        $('#game').css('display', 'block')
    })

    $('#joinRoom').on('click', function () {
        username = $('#joinUserName').val()
        room = $('#joinRoomName').val()
        const joinUserData = {
            username: username,
            room: room
        }
        // 
        socket.emit('join-room', joinUserData)
    })

    socket.on('room-joined', (users) => {
        myUsers = users
        $('#tableBody').empty();
        for (let i = 0; i < users.length; i++) {
            $('#tableBody').append(`
                <tr>
                    <td>${users[i].username}</td>
                </tr>`)
        }
        $('#exampleModal2').modal('hide')
        $('#home').css('display', 'none')
        $('#game').css('display', 'block')
        // $('#jugad').val(JSON.stringify(users))
        $('#playerTurn').html(`${myUsers[turn].username}'s Turn`)
    })


    function getTable() {
        let arr = new Array(25);

        // Fill the array with numbers from 1 to 25
        for (let i = 0; i < arr.length; i++) {
            arr[i] = i + 1;
        }

        // Shuffle the array using Fisher-Yates shuffle algorithm
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        for (let i = 0; i < arr.length; i++) {
            $('.main-grid').append(`
                <button class="bingo-btn btn btn-secondary text-decoration-none blocks ${arr[i]}" id="${i}" data-id = ${arr[i]} > ${arr[i]} </button>
            `)
        }
    }
    getTable()

    let clickedBtn = []
    let combination = [
        [0, 1, 2, 3, 4],
        [0, 5, 10, 15, 20],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ]


    let turn = 0
    // let usersdata = $('#jugad').val()
    // let userdata = eval(usersdata)
    $('.bingo-btn').on('click', function () {
        console.log(myUsers);
        console.log(username);
        console.log('This is a J: ', turn);
        for (let i = 0 ; i < myUsers.length; i++) {
            if (username === myUsers[turn].username) {
                console.log('username: ', username);
                console.log('userdata[i].username: ', myUsers[turn].username);
                const id = $(this).data('id');
                if( turn < myUsers.length - 1 ){
                    turn = turn + 1
                    const data = {
                        id: id,
                        username: username,
                        room: room,
                        a : turn
                    }
                    console.log('turn: ', turn);
                    socket.emit('user-clicked', data)
                }else{
                    turn = 0
                    console.log('turn: ', turn);
                    const data = {
                        id: id,
                        username: username,
                        room: room,
                        a : turn
                    }
                    socket.emit('user-clicked', data)
                }
                break
            }else{
                continue
            }
        }
    })


    socket.on('user-move', (data) => {
        console.log('data: ', data);
        turn = data.a
        $('#playerTurn').html(`${myUsers[turn].username}'s Turn`)
        $(`.${data.id}`).toggleClass('btn-secondary btn-success');
        // $(`.${data.id}`).prop('disabled', true);
        // 

        // add index in array
        const index = $(`.${data.id}`).attr('id')
        console.log('index: ', index);
        clickedBtn.push(index)


        // add move of user in table 
        $('#tableMoves').append(`
            <tr>
                <td>${data.username}</td>
                <td>${data.id}</td>
            </tr>
        `)

        let bingoCount = 0
        for (let j = 0; j < combination.length; j++) {
            let count = 0
            for (let k = 0; k < combination[j].length; k++) {
                for (let i = 0; i < clickedBtn.length; i++) {
                    if (clickedBtn[i] == combination[j][k]) {
                        count++
                    } else {
                        continue
                    }
                }
                if (count == 5) {
                    bingoCount++
                } else if (count == 0 && k > 0) {
                    break
                }
            }


        }
        if (bingoCount == 1) {
            $('#bingoCount').html('B')
        } else if (bingoCount == 2) {
            $('#bingoCount').html('BI')
        } else if (bingoCount == 3) {
            $('#bingoCount').html('BIN')
        } else if (bingoCount == 4) {
            $('#bingoCount').html('BING')
        } else if (bingoCount == 5) {
            $('#bingoCount').html('BINGO')
            winner = {
                username: username,
                room: room
            }
            socket.emit('winner', data)
        }
    })

    socket.on('winner', (data) => {
        $('#exampleModal3').modal('show')
        $('#winner').html(`Congratulation Winner is ${data.username}`)
    })



})
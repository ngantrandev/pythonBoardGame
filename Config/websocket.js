import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import gameManager from "../Asset/GameManager.js";
import gameUIManager from "../Asset/GameUIManager.js";
import roomManager from "../Asset/RoomManager.js";
import soundManager from "../Asset/SoundManager.js";
const socket = io("ws://192.168.126.106:8000/");

socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("message", {})
    })

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
socket.on("error", (error) => {
    console.error("Socket error:", error);
});
socket.on('on_user_join_room',(data)=>{
    console.log(data.userName + ' has joined the room');
    roomManager.SetRoomList( data.list_user);
    // console.log(data);
    // console.log(roomManager.GetListInRoom());
})
socket.on("on_user_leave_room",(data)=>{
    console.log(data.userName + ' has leaved the room');
    // gameManager.GetSceneCurrent().deletePlayer(data.userName);
    roomManager.RemovePlayerInRoom(data.userName);
    // console.log(roomManager.GetListInRoom());
})
// Tạo phòng
socket.on("res_create_room",(data)=>{
    // console.log(data.room.creator + ' has joined the room');
    console.log(data);
    // roomManager.AddPlayerInRoom(data);
    gameManager.JoinRoom(data.room.roomId);
    socket.emit('get_rooms');
    gameUIManager.DestroyDialog();
})
socket.on('rooms',(data)=>{
    // console.log(data);
    if(roomManager.GetId()!=undefined||roomManager.GetId()!=null){
        console.log(roomManager.GetId());
        data.forEach(room => {
        if(roomManager.GetId()==room.room_id){
            roomManager.SetRoomList(room.users);
            // console.log(roomManager.GetListInRoom());
        }
        if(room.creator==gameManager.getCookie('username')){
            roomManager.SetHost(true);
        }
    });
    }
})
//Vô phòng 
socket.on('res_join_room',(data)=>{
    // console.log(data);
    data.forEach(user => {
        roomManager.AddPlayerInRoom(user);
        // console.log(gameManager.getCookie('username'));
    if(user.full_name==gameManager.getCookie('username'));
        roomManager.SetUser(user);
    });

});
//Lắc xí ngầu
socket.on("on_user_start_roll", (data)=>{
    console.log(data);
    gameManager.PlayerStartRoll();
    gameUIManager.GetButtons().listButton.find(({ name }) => name === "btnDice")['button'].HideButton()
});
socket.on("on_user_done_roll",(data)=>{
    console.log(data);
    gameUIManager.GetButtons().listButton.find(({ name }) => name === "btnDice")['button'].HideButton()
    gameManager.SetDiceNumber(data.number1,data.number2);
    gameManager.SetPlayerMove();
})
//Bắt đầu game
socket.on("res_start_game",(data)=>{
    if(data.success){
        roomManager.SetRoomListPlayerOnBoard(data.data);
        roomManager.SetRoomStart(true);
        roomManager.SetTurnCurrent(1);
        gameManager.WaitTurn();
        soundManager.PlayLoopMusic('BG');
    }
})

export default socket;
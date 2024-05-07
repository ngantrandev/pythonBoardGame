import gameUIManager from "./GameUIManager.js";
import {listCard} from "./Card.js";
import { ListPlayer } from "../Player/Player.js";
import Board from "./Board.js";
import SceneGame from "../Scene/scenGame.js";
import SceneHome from "../Scene/sceneHome.js";
import SceneSetting from "../Scene/sceneSetting.js"
import Dice from "./Dice.js";
let instance;
class GameManager{
    static instance = null;

    static getInstance() {
      if (!GameManager.instance) {
        GameManager.instance = new Singleton();
      }
  
      return GameManager.instance;
    }
    static timeGame ={timeanswer:{set:10,default:10},
                  timewaitturn:{set:5,default:5},
                  timeroll:{set:1,default:5}};
    static timeroll;
    static sceneCurrent;
    static canvas;
    static DiceNumber = [1,5];
    static stepcurrent = [0,0,0,0];
    static listplayer;
    static idRoom;
    static turn =0;
    constructor() {
      if (GameManager.instance) {
        throw new Error("This class is a Singleton!");
      }
      GameManager.canvas = document.getElementById('app');
      // Initialize the class properties here
    }
    Resize(){
      GameManager.canvas = document.getElementById('app');
    }
    GetCanvas(){
      GameManager.canvas.width  = window.innerWidth;
      GameManager.canvas.height = window.innerHeight;
      return GameManager.canvas;
    }
    GetSceneCurrent(){
        return GameManager.sceneCurrent;
    }
    CreateListPlayer(){
      GameManager.listplayer = new ListPlayer();
      return GameManager.listplayer;
    }
    GetListPlayer(){
      return GameManager.listplayer;
    }
    StartSceneGame(){
      GameManager.sceneCurrent = new SceneGame();
      // gameUIManager.SetButtonScene(GameManager.sceneCurrent.GetButtons());
    }
    StartSceneHome(){
      GameManager.sceneCurrent = new SceneHome();
    }
    StartSceenSetting(){
      GameManager.sceneCurrent = new SceneSetting();
    }
    RandomDice(){
      return Math.round(Math.random() * (6 - 1) + 1);
    }
    Roll_Dice(){
      gameUIManager.GetButtons().listButton.find(({ name }) => name === "btnDice")['button'].HideButton();
      this.Dice_Left = gameManager.RandomDice();
      this.Dice_right = gameManager.RandomDice();
      GameManager.DiceNumber =[];
      GameManager.timeroll = setTimeout(()=>{
        GameManager.DiceNumber = [this.Dice_Left,this.Dice_right];

        var i = GameManager.DiceNumber[0]+GameManager.DiceNumber[1];

        GameManager.listplayer.list_[GameManager.turn].Run(i);
        listCard[i].Open(true);
        GameManager.stepcurrent[GameManager.turn] =i;
      },GameManager.timeGame.timeroll.set*1000);
    }
    NextTurn(){
      if(GameManager.turn==3){
        GameManager.turn = 0;
      }else
        GameManager.turn++;
    }
    ResetDice(){
      clearTimeout(GameManager.timeroll);
      GameManager.turn = 0;
      GameManager.DiceNumber = [gameManager.RandomDice(),gameManager.RandomDice()];
      GameManager.sceneCurrent.diceDialog.ResetDice();
    }
    GetDiceNumber(){
      return GameManager.DiceNumber;
    }
    GetIdRoom(){
      return GameManager.idRoom;
    }
    SetIdRoom(id){
      GameManager.idRoom = id;
      this.StartSceneGame();
    }
    GetDataRoom(){
      var Rooms=[];
      //Fake Data Room
      for(var i=0;i<5;i++){
          var room = {'id':'Room'+i,'member':Math.round(Math.round(Math.random() * (4 - 1) + 1))};
          Rooms.push(room);
      }
      return Rooms;
    }
    ChangeData(id){
      // alert(id);
      // gameUIManager.GetDialog().UpdateList();
      this.StartSceneGame();
    }
    CountDown(){
      GameManager.timeGame.timeanswer.set--;
    }
    SetTimeAnswer(){
     let time = setInterval(()=>{gameManager.CountDown();  
      console.log(GameManager.timeGame.timeanswer.set);
      if(GameManager.timeGame.timeanswer.set==0){
        GameManager.timeGame.timeanswer.set=GameManager.timeGame.timeanswer.default;
        clearInterval(time);
        this.NextTurn();
        gameUIManager.DestroyDialog();
        gameUIManager.GetButtons().listButton.find(({ name }) => name === "btnDice")['button'].ShowButton();
      }},1000);
    }
    GetTurn(){
      return GameManager.turn;
    }
    GetTimeAnswer(){
      return GameManager.timeGame.timeanswer;
    }
}
const gameManager = Object.freeze(new GameManager());
export default gameManager;

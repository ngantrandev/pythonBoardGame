import { listScene } from "../Scene/scenebase.js";
import gameUIManager from "./GameUIManager.js";
import {listCard} from "./Card.js";
import { ListPlayer } from "../Player/Player.js";
import Board from "./Board.js";

let instance;
class GameManager{
    static instance = null;

    static getInstance() {
      if (!GameManager.instance) {
        GameManager.instance = new Singleton();
      }
  
      return GameManager.instance;
    }
    static sceneCurrent;
    static canvas;
    static DiceNumber = [1,5];
    static stepcurrent = 0;
    static listplayer;
    constructor() {
      if (GameManager.instance) {
        throw new Error("This class is a Singleton!");
      }
      GameManager.sceneCurrent=0;
      GameManager.canvas = document.getElementById('app');
      // Initialize the class properties here
    }
    Resize(){
      GameManager.canvas = document.getElementById('app');
      Board.Resize();
    }
    GetCanvas(){
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
    SetSceneCurrent(i){
      gameUIManager.SetButtonScene(listScene[i].GetListButton());
      GameManager.sceneCurrent=i;
    }
    Roll_Dice(){
      gameUIManager.GetButtons().listButton.find(({ name }) => name === "btnDice")['button'].HideButton();
      this.Dice_Left = Math.round(Math.random() * (6 - 1) + 1);
      this.Dice_right = Math.round(Math.random() * (6 - 1) + 1);
      GameManager.DiceNumber =[];
      setTimeout(()=>{
        GameManager.DiceNumber = [this.Dice_Left,this.Dice_right];
        // console.log(GameManager.DiceNumber[0]+GameManager.DiceNumber[1]);
        var i = GameManager.DiceNumber[0]+GameManager.DiceNumber[1];
        // console.log(i);
        // console.log(GameManager.listplayer.getPlayer('Player1'));
        GameManager.listplayer.list_[0].Run(i);
        listCard[i].Open(true);
        GameManager.stepcurrent =i;  
      },5000);
    }
    GetDiceNumber(){
      return GameManager.DiceNumber;
    }
}
const gameManager = Object.freeze(new GameManager());
export default gameManager;

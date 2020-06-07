import Card from "../helpers/card";
import Zone from "../helpers/zone";
import Dealer from "../helpers/dealer";
import io from "socket.io-client";

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
  }

  preload() {
    this.load.image("cyanCardFront", "src/assets/CyanCardFront.png");
    this.load.image("cyanCardBack", "src/assets/CyanCardBack.png");
    this.load.image("magentaCardFront", "src/assets/MagentaCardFront.png");
    this.load.image("magentaCardBack", "src/assets/MagentaCardBack.png");
  }

  create() {
    this.isPlayerA = false;
    this.opponentCards = [];

    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);

    this.dealer = new Dealer(this);

    this.socket = io("http://localhost:4000");

    this.socket.on("connect", () => {
      console.log("connected!");
    });

    this.socket.on("isPlayerA", () => {
      this.isPlayerA = true;
    });

    this.socket.on("dealCards", () => {
      this.dealer.dealCards();
      this.dealText.disableInteractive();
    });

    // this.dealCard = () => {
    //   for (let i = 0; i < 5; i++) {
    //     let playerCard = new Card(this);
    //     playerCard.render(475 + i * 100, 650, "cyanCardFront");
    //   }
    // };

    this.dealText = this.add
      .text(75, 350, ["DEAL CARDS"])
      .setFontSize(18)
      .setFontFamily("Trebuchet MS")
      .setColor("#00FFFF")
      .setInteractive();

    this.dealText.on("pointerdown", (e) => {
      this.socket.emit("dealCards");
    });

    this.dealText.on("pointerover", (e) => {
      this.dealText.setColor("#ff69b4");
      this.game.canvas.style.cursor = "pointer";
    });

    this.dealText.on("pointerout", (e) => {
      this.dealText.setColor("#00ffff");
      this.game.canvas.style.cursor = "default";
    });

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.setTint(0xff69b4);
      this.children.bringToTop(gameObject);
    });

    this.input.on("dragend", (pointer, gameObject, dropped) => {
      gameObject.setTint();
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      dropZone.data.values.cards++;
      let first = dropZone.x - 350;
      let second = dropZone.data.values.cards * 100;
      gameObject.x = first + second;
      gameObject.y = dropZone.y;
      gameObject.disableInteractive();
    });
  }

  update() {}
}

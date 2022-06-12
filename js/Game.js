import { Player, Position } from './Player.js';

// TODO: Creer une classe enemy pour integrer les enemy plus facilement esseyer aussi d'utiliser le polymorphisme

export class Game {
    constructor(gridWidth, gridHeight) {
        this.player = new Player(new Position(Math.round(gridWidth / 2), Math.round(gridHeight / 2)), 40);
        this.enemies = [];

        this.playerIMG = "<img src='./img/Game/player/Fin.png' alt='Fin' width='28'>";
        this.enemyIMG = "<img src='./img/Game/player/Fin.png' alt='Monster'>";

        // Info sur la partie
        this.isGameOver = true;
        // Piege restant
        this.trapCount = 0;
        // Piege declencher
        this.trapTriggered = 0;
        // Tresor ramasser
        this.treasurePicked = 0;
        // Coeur ramasser
        this.heartPicked = 0;
        // Bombe normale
        this.basicBombPicked = 0;
        // Bombe en or
        this.goldenBombPicked = 0;
        // Nombre de mechant
        this.enemiesCount = 0;
        // Niveau actuel
        this.gameLevel = 0;

        // Taille de la grille
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;

        // Elements visibles
        // Tableau du jeu
        this.gameTable = document.getElementById("game-table");
        // Affichage de la vie restante
        this.health = document.getElementById("player-health");
        // Barre de vie
        this.healthBar = document.getElementById("health-bar");
        // Affichage du score
        this.score = document.getElementById("player-score");
        // Inventaire
        this.inventory = document.getElementById("inventory");
        // Popup de fin de partie
        this.endGameMessage = document.getElementById("end-of-game");
        // Affichage du score dans le popup de fin de parti
        this.finalScore = document.getElementById("final-score");

        // Comptes d'elements
        this.hearts = 0;
        this.bombs = 0;
        this.treasures = 0;

        // Valeurs maximales
        this.maxTreasures = 25;
        this.maxHearts = 6;
        this.maxBombs = 6;
        this.maxGoldenBombs = 4;
        this.maxEnemies = 3;

        this.initGameTable();
    }

    initGameTable() {
        this.gameLevel++;
        this.resetItemsCount();
        this.gameTable.innerHTML = "";
        this.spawnItems();
        this.spawnEnemies();
        this.isGameOver = false;
    }


    updateGameStatus() {
        if (this.getObjectAtPosition(this.player.position) != null) {

            switch (this.getObjectAtPosition(this.player.position).alt) {
                case "Golden chest": {
                    this.player.score += 1000;
                    this.score.textContent = this.player.score;
                    this.treasurePicked++;
                    this.treasures--;
                    break;
                }
                case "Spike": {
                    this.player.health--;
                    this.trapTriggered++;
                    this.player.score -= 50;
                    break;
                }
                case "Heart": {
                    this.player.health = this.player.health + 5 > this.player.maxHealth ? this.player.maxHealth : this.player.health + 5;
                    this.heartPicked++;
                    break;
                }
                case "Basic bomb": {
                    if (this.player.addItem(this.getObjectAtPosition(this.player.position))) {
                        this.basicBombPicked++;
                    }
                    break;
                }
                case "Golden bomb": {
                    if (this.player.addItem(this.getObjectAtPosition(this.player.position))) {
                        this.basicBombPicked++;
                    }
                    break;
                }
                case "Monster": {
                    this.isGameOver = true;
                    this.gameOver()
                }
            }
        } else {
            this.player.score -= 10;
        }
        this.moveEnemies();
        this.score.innerText = this.player.score;
        this.health.innerText = this.player.health + '/' + this.player.maxHealth;
        this.healthBar.style.width = this.player.getHealthInPercent() + '%';
        if (this.player.health == 0) {
            this.gameOver();
        } else if (this.treasures == 0) {
            this.resetItemsCount();
            this.initGameTable();
        }
    }

    getObjectAtPosition(position) {
        return this.gameTable.rows[position.y].cells[position.x].firstElementChild;
    }

    getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }

    resetItemsCount() {
        this.hearts = 0;
        this.bombs = 0;
        this.treasures = 0;
        this.enemiesCount = 0;
        if (this.player.health < 20) {
            this.player.health = 25;
            this.updateGameStatus();
        }
    }



    useItem(number) {
        if (this.player.items[number].innerHTML != "") {
            switch (this.player.items[number].firstChild.alt) {
                case "Basic bomb": {
                    this.useBomb(false);
                    break;
                }
                case "Golden bomb": {
                    this.useBomb(true);
                    break;
                }
            }
            this.player.items[number].innerHTML = "";
            return true;
        }
        return false;
    }

    useBomb(isGolden) {
        let radius = 2;
        let playerPos = this.player.position;

        for (let i = playerPos.y - radius; i <= playerPos.y + radius; i++) {

            for (let j = playerPos.x - radius; j <= playerPos.x + radius; j++) {

                if (i != playerPos.y || j != playerPos.x) {
                    if (j >= 0 && i >= 0 && j < this.gridWidth && i < this.gridHeight) {
                        let cell = this.gameTable.rows[i].cells[j];
                        if (cell.childElementCount > 0) {

                            if (!isGolden) {

                                if (cell.firstChild.alt == "Golden chest") {
                                    this.treasures--;
                                }
                                cell.innerHTML = "";

                            } else {

                                if (cell.firstChild.alt == "Spike") {
                                    cell.innerHTML = "";
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!isGolden) {
            this.player.health--;
        }
    }


    handlePlayerInput(key) {
        if (!this.isGameOver) {
            this.gameTable.rows[this.player.position.y].cells[this.player.position.x].removeChild(this.player.img);
            switch (key) {
                case "ArrowUp": {
                    if (this.player.position.y > 0) {
                        this.player.position.y--;
                    }
                    break;
                }
                case "ArrowDown": {
                    if (this.player.position.y < this.gridHeight - 1) {
                        this.player.position.y++;
                    }
                    break;
                }
                case "ArrowLeft": {
                    if (this.player.position.x > 0) {
                        this.player.position.x--;
                    }
                    break;
                }
                case "ArrowRight": {
                    if (this.player.position.x < this.gridWidth - 1) {
                        this.player.position.x++;
                    }
                    break;
                }
                case "Space": {
                    this.gameOver();
                    break;
                }
                case "Digit1": {
                    this.useItem(0);
                    break;
                }
                case "Digit2": {
                    this.useItem(1);
                    break;
                }
                case "Digit3": {
                    this.useItem(2);
                    break;
                }
            }
            this.updateGameStatus();
            this.gameTable.rows[this.player.position.y].cells[this.player.position.x].innerHTML = "";
            this.gameTable.rows[this.player.position.y].cells[this.player.position.x].appendChild(this.player.img);

        }
    }

    gameOver() {
        this.isGameOver = true;
        this.finalScore.innerText = this.player.score;
        this.endGameMessage.style.visibility = "visible";
        document.getElementById("retry-button").focus();
    }

    spawnItems() {
        for (let i = 0; i < this.gridHeight; i++) {
            let row = this.gameTable.insertRow(i);
            for (let j = 0; j < this.gridWidth; j++) {
                let cell = row.insertCell(j);

                if (this.player.position.x == j && this.player.position.y == i) {
                    cell.appendChild(this.player.img);
                } else {
                    let randomNumber = this.getRandomNumber(99);
                    let tile = document.createElement("img");
                    tile.width = 32;

                    // Tresor
                    if (randomNumber >= 90 && this.treasures < this.maxTreasures) {
                        this.treasures++;
                        tile.src = "img/Game/items/golden_chest.png";
                        tile.alt = "Golden chest";
                    }

                    // Coeur
                    else if (randomNumber == 89 && this.hearts < this.maxHearts) {
                        this.hearts++;
                        tile.src = "img/Game/items/heart.png";
                        tile.alt = "Heart";
                    }

                    // Bombe de base
                    else if (randomNumber == 88 && this.bombs < this.maxBombs) {
                        if (this.getRandomNumber(9) > 3) {
                            tile.src = "img/Game/items/basic_bomb.png";
                            tile.alt = "Basic bomb";
                        }
                        // Bombe en or
                        else {
                            tile.src = "img/Game/items/golden_bomb.png";
                            tile.alt = "Golden bomb";
                        }
                        this.bombs++;
                    }

                    // Piege
                    else {
                        this.trapCount++;
                        tile.src = "img/Game/items/spike.png";
                        tile.alt = "Spike";
                    }
                    cell.appendChild(tile);
                }
            }

        }
    }

    spawnEnemies() {
        this.enemies = [];
        if (this.gameLevel > 1) {
            for (let i = 0; i < this.gameLevel - 1; i++) {

                if(this.enemiesCount >= this.maxEnemies)
                    break;
                let spawnPos;
                do {
                    spawnPos = new Position(this.getRandomNumber(this.gridWidth), this.getRandomNumber(this.gridHeight));
                } while (spawnPos.x == this.player.position.x && spawnPos.y == this.player.position.y);
                this.enemiesCount++;
                console.log("x: " + spawnPos.x + " y: " + spawnPos.y);
                this.gameTable.rows[spawnPos.y].cells[spawnPos.x].innerHTML = "";
                this.gameTable.rows[spawnPos.y].cells[spawnPos.x].innerHTML = this.enemyIMG;
                this.enemies.push(spawnPos);
            }
        }
    }

    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            let pos = this.enemies[i];
            this.gameTable.rows[this.enemies[i].y].cells[this.enemies[i].x].innerHTML = "";
            let randomNum = this.getRandomNumber(4);
            switch (randomNum) {
                case 0: {
                    pos.x = pos.x + 1 >= this.gridWidth - 1 ? pos.x : pos.x + 1;
                    break;
                }
                case 1: {
                    pos.x = pos.x - 1 <= 0 ? 0 : pos.x - 1;
                    break;
                }
                case 2: {
                    pos.y = pos.y + 1 >= this.gridHeight - 1 ? this.gridHeight - 1 : pos.y + 1;
                    break;
                }
                case 3: {
                    pos.y = pos.y - 1 <= 0 ? 0 : pos.y - 1;
                }
            }
            let item = this.getObjectAtPosition(pos);
            if(item != null)
                this.enemyPickUpItem(item);
            this.gameTable.rows[pos.y].cells[pos.x].innerHTML = this.enemyIMG;
            this.enemies[i] = pos;
        }
    }

    enemyPickUpItem(item){
        switch(item.alt){
            case "Golden chest":{
                this.treasures--;
                break;
            }
            case "Fin":{
                this.gameOver();
            }
        }
    }
}
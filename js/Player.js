export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Player {
    constructor(position, health) {
        this.position = position;
        this.maxHealth = health;
        this.health = this.maxHealth;
        this.score = 0;
        this.img = document.createElement("img");
        this.img.src = "img/Game/player/Fin.png";
        this.img.alt = "Fin";
        this.img.width = 28;
        this.items = [document.getElementById("inv-1"), document.getElementById("inv-2"), document.getElementById("inv-3")];
    }

    getHealthInPercent() {
        return this.health / this.maxHealth * 100;
    }

    addItem(item) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].innerHTML == "") {
                this.items[i].append(item);
                return true;
            }
        }
        return false;
    }

}


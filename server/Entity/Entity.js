let MathUtils = require('../Utils/MathUtils');
let GameUtils = require('../Utils/GameUtils');

class Entity {
    constructor() {
        this.id = MathUtils.guid();

        this.posX = 0.1;
        this.posY = 0.0;

        this.sprite = 'bunny';
        this.width = 30;
        this.height = 45;

        this.text = {
            content: '',
            style: {}
        };

        this.ttl = -1;
        this.type = ['BaseEntity'];
    }

    onTick() {
        if (this.ttl === 0) {
            GameUtils.despawnEntity(id);
        } else if (this.ttl > 0) {
            this.ttl--;
        }
    }

    generatePacket() {
        let packet = {
            id: this.id,
            posX: this.posX,
            posY: this.posY,
            sprite: this.sprite,
            width: this.width,
            height: this.height,
            text: this.text,
            type: this.type
        };

        return packet;
    }
}

module.exports = Entity;
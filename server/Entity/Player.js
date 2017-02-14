let LiveEntity = require('./LiveEntity');
let ServerUtils = require('../Utils/ServerUtils');
let MathUtils = require('../Utils/MathUtils');

class Player extends LiveEntity {

    /**
     * @return {string}
     */
    get Hostname() {
        if (this.hostname === null) {
            return this.ip;
        }
        return this.hostname;
    }

    /**
     * @return {string}
     */
    get Nickname() {
        if (this.nickname === null) {
            return this.Hostname;
        }
        return this.nickname;
    }


    constructor() {
        super();

        this.socket = null;
        this.ip = null;
        this.hostname = null;
        this.nickname = null;
        this.input = {
            keyboard: new Map(),
            mouse: {
                isDown: false,
                position: {
                    x: 0,
                    y: 0
                }
            }
        };

        this.text  = {
            content: '{nickname}\n{hp.current} \\ {hp.max}',
            style: {
                align: 'center'
            }
        };

        this.camera = {
            target: null,
            x: 0,
            y: 0
        };
        this.type.push('BasePlayer');
    }

    onTick() {
        super.onTick();

        let keyboard = this.input.keyboard;


        if (keyboard.has(87) && keyboard.has(83) && keyboard.has(65) && keyboard.has(68)) {

            let vX = 0;
            let vY = 0;

            if (keyboard.get(87) === true) {
                vY -= 1.0;
            }

            if (keyboard.get(83) === true) {
                vY += 1.0;
            }

            if (keyboard.get(65) === true) {
                vX -= 1.0;
            }

            if (keyboard.get(68) === true) {
                vX += 1.0;
            }

            let normVec = MathUtils.normalize(vX, vY);

            vX = normVec.vX;
            vY = normVec.vY;

            this.movement.vX = vX;
            this.movement.vY = vY;
        }

        if (this.input.mouse.isDown === true) {
            console.log(this.input.mouse.position.x + ' - ' + this.input.mouse.position.y)
        }
    }

    onDie (source) {
        console.log('Игрок [' + this.Nickname + '] умер.');
    }

    onConnect(socket) {
        this.socket = socket;
        this.ip = ServerUtils.getClientIp(socket);

        ServerUtils.getClientHostname(this.ip, (ip) => {
            this.hostname = ip;
        });

        console.log('Игрок [' + this.Nickname + '] подключился.');
    }

    onDisconnect(socket) {

        this.socket = null;
        console.log('Игрок [' + this.Nickname + '] отключился.');
    }


    generatePacket() {
        let packet = super.generatePacket();

        packet['nickname'] = this.Nickname;

        return packet;
    }
}

module.exports = Player;
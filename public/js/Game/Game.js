//Aliases
var Loader = PIXI.loader,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Resources = PIXI.loader.resources;

var Game = {
    renderer: undefined,
    stage: undefined,
    socket: Socket,
    textInfo: undefined,
    keyboard: undefined,
    inputTimer: undefined,
    gameCanvas: null,
    effectTextures: { },

    UI: {
        nicknameBox: document.getElementById('nickname'),
        hpBar: {
            bar: document.getElementById("hpBar"),
            status: document.getElementById("hpStatus")
        },
    },

    player: {
        id: null
    },

    globalEntityMap: new Map(),
    globalTextureMap: new Map(),

    textBindingList: { },
    entityList: { },
    camera: {
        id: null,
        x: 0,
        y: 0
    },

    init: function (element, backgroundColor) {
        // HTML Canvas
        this.gameCanvas = document.getElementById(element);
        if (this.gameCanvas === null) {
            throw "Invalid Element ID.";
        }

        // Html Вывод текста
        this.textInfo = document.getElementById("textInfo");
        if (this.textInfo === null) {
            throw "Element ID 'textInfo' not found.";
        }

        // Инициализация PIXI
        this.renderer = new PIXI.Application(Game.gameCanvas.clientWidth, Game.gameCanvas.clientHeight, {view: Game.gameCanvas, backgroundColor: backgroundColor}, false);
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        // Контейнер для рисования
        this.stage = this.renderer.stage;

        // Инициализация клавиатуры и мышки
        Game.keyboard = {
            up: Key(87),
            down: Key(83),
            left: Key(65),
            right: Key(68),
            shift: Key(16)
        };
        Mouse.init();

        window.onresize = function () {
            Game.renderer.renderer.resize(Game.gameCanvas.clientWidth, Game.gameCanvas.clientHeight);
        };

        // Загрузка текстур
        PIXI.loader
            .add('spritesheet', 'image/mc.json')
            .add("image/bunny.png")
            .add("image/bullet.png")
            .load(function () {

                // Эфекты
                Game.effectTextures['explosion'] = [];
                for (var i = 0; i < 26; i++) {
                    var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i + 1) + '.png');
                    Game.effectTextures['explosion'].push(texture);
                }

                // Сокет
                Game.socket.init();

                // Отправка ввода
                Game.inputTimer = setInterval(Game.inputLoop, 25);

                // Рендер
                Game.renderer.ticker.add(Game.renderLoop);
            });

    },

    renderLoop: function (delta) {

        // Камера
        if (Game.camera.id !== null) {
            if (Game.globalEntityMap.has(Game.camera.id)) {
                Game.camera.x = Game.globalEntityMap.get(Game.camera.id).posX;
                Game.camera.y = Game.globalEntityMap.get(Game.camera.id).posY;
            }
        }

        Game.stage.pivot.x = Game.camera.x;
        Game.stage.pivot.y = Game.camera.y;
        Game.stage.position.x = Game.renderer.renderer.width / 2;
        Game.stage.position.y = Game.renderer.renderer.height / 2;

        // Ник и ХП
        if (Game.player.id !== null){
            if (Game.globalEntityMap.has(Game.player.id)){

                let player = Game.globalEntityMap.get(Game.player.id);

                let nickname = player.nickname;
                if (Game.UI.nicknameBox.innerText !== nickname){
                    Game.UI.nicknameBox.innerText = nickname;
                }

                let hp = player.hp;
                if (Game.UI.hpBar.status.innerText !== hp.current + ' / ' + hp.max) {
                    Game.UI.hpBar.status.innerText = hp.current;
                    Game.UI.hpBar.bar.style.width = (100 / hp.max * hp.current) + '%';
                }
            }
        }



        for (var entityBindingId in Game.textBindingList) {
            if (Game.textBindingList.hasOwnProperty(entityBindingId) &&
                Game.entityList.hasOwnProperty(entityBindingId)) {
                var text = Game.textBindingList[entityBindingId];
                if (text.hasOwnProperty('renderText')) {
                    if (text.renderText != null) {
                        // Change text
                        if (text.renderText.text != text.text) {
                            text.renderText.text = text.text;
                        }
                    } else {
                        // Add text
                        text.renderText = new PIXI.Text(text.text);
                        text.renderText.x = Game.entityList[entityBindingId].x;
                        text.renderText.y = Game.entityList[entityBindingId].y;
                        Game.stage.addChild(text.renderText);
                    }
                } else {
                    // Add text
                    text.renderText = new PIXI.Text(text.text);
                    text.renderText.x = Game.entityList[entityBindingId].x;
                    text.renderText.y = Game.entityList[entityBindingId].y;
                    Game.stage.addChild(text.renderText);
                }

                text.renderText.x = Game.entityList[entityBindingId].x;
                text.renderText.y = Game.entityList[entityBindingId].y;
            }
        }


    },

    inputLoop: function () {
        Socket.socket.emit('clientInput', {
            left: Game.keyboard.left.isDown,
            up: Game.keyboard.up.isDown,
            right: Game.keyboard.right.isDown,
            down: Game.keyboard.down.isDown,
            shift: Game.keyboard.shift.isDown,
            Mouse: {
                isDown: Mouse.isDown,
                position: Mouse.position
            }
        });
    }
};


Game.init('gameCanvas', 0xE9FFC7);
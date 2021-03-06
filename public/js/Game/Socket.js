 Socket = {
    socket: undefined,

    init: function () {
        this.socket = io.connect();

        // Подключился
        this.socket.on('connect', () => {
            Game.UI.textStatus.innerText = "Online";
        });

        // Отключился
        this.socket.on('disconnect', () => {
            Game.UI.textStatus.innerText = "Offline";
        });

        // Подготовка клиента
        this.socket.on('clientRunUp', (packet) => {
            let textureMap = packet.textureMap;
            let entityMap = packet.entityMap;
            let playerControlId = packet.playerControlId;

            Object.keys(textureMap).map(function(key, index) {
                let texture = textureMap[key];
                PIXI.Texture.addTextureToCache(GameUtils.getTextureFromBase64(texture), key);
            });


            GameUtils.clearEntityList();
            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];
                GameUtils.addEntity(entity);
            });

            Input.setupKeys(packet.inputReq);

            Game.player.id = playerControlId;
        });

        // Получение обновлений для сущностей
        this.socket.on('clientEntityMapUpdate', (packet) => {
            let entityMap = packet.entityMap;

            Object.keys(entityMap).map(function(key, index) {
                let entity = entityMap[key];

                GameUtils.updateEntity(entity);
            });
        });

        // Спавн сущности
        this.socket.on('spawnEntity', (packet) => {
            GameUtils.addEntity(packet);
        });

        // Удаление сущности
        this.socket.on('despawnEntity', (packet) => {
            GameUtils.deleteEntityById(packet);
        });

        // Установка камеры
        this.socket.on('bindCamera', (packet) => {
            GameUtils.bindCamera(packet.camera);
        });

        Chat.initIO(this.socket);

        // Эффекты
        this.socket.on('spawnEffect', (packet) => {
            GameUtils.spawnEffect(packet);
        });
    }
};
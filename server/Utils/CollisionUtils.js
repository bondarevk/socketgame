let MathUtils = require('./MathUtils');

let CollisionUtils = {


    getEntityCollisions: (e1) => {
        let collisions = [];

        global.Server.globalEntityMap.forEach((e2, id, map) => {

            if (e1.collisionEnabled === true) {
                if (CollisionUtils.checkEntityCollision(e1, e2)) {
                    collisions.push(collisions);
                }
            }

        });

    },

    checkEntityCollision: (e1, e2) => {
        function AABB(entity) {
            return {
                x: entity.posX - entity.width / 2 ,
                y: entity.posY -  entity.height / 2,
                width : entity.width,
                height: entity.height
            };
        }
    }
};

module.exports = CollisionUtils;
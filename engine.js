// SIDEKICK MULTIVERSE - CORE ENGINE
const { Engine, Render, World, Bodies, Composite } = Matter;

const SM_CONFIG = {
    gravity: 1,
    floorHeight: 50,
    avatarScale: 0.5,
    walkingSpeed: 2
};

class GameEngine {
    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true,
            resolution: window.devicePixelRatio || 1
        });

        document.getElementById('game-container').appendChild(this.app.view);

        // Physics
        this.physicsEngine = Engine.create({
            gravity: { x: 0, y: SM_CONFIG.gravity }
        });

        this.avatars = new Map();
        
        this.setupWorld();
        this.startLoop();
    }

    setupWorld() {
        const floor = Bodies.rectangle(
            window.innerWidth / 2,
            window.innerHeight - SM_CONFIG.floorHeight / 2,
            window.innerWidth,
            SM_CONFIG.floorHeight,
            { isStatic: true }
        );

        Composite.add(this.physicsEngine.world, [floor]);
    }

    addAvatar(userId, username) {
        if (this.avatars.has(userId)) return;

        const avatar = new Avatar(this, userId, username);
        this.avatars.set(userId, avatar);
    }

    startLoop() {
        this.app.ticker.add((delta) => {
            Engine.update(this.physicsEngine, delta * (1000 / 60));
            this.avatars.forEach(avatar => avatar.update(delta));
        });
    }
}

class Avatar {
    constructor(engine, userId, username) {
        this.engine = engine;
        this.userId = userId;
        this.username = username;

        // Visuals (Pixi)
        this.container = new PIXI.Container();
        
        // Name Label
        this.label = new PIXI.Text(username, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xffffff,
            align: 'center'
        });
        this.label.anchor.set(0.5, 1);
        this.label.y = -60;
        this.container.addChild(this.label);

        // Placeholder body (will be replaced by modular sprites)
        this.bodyGraphics = new PIXI.Graphics();
        this.bodyGraphics.beginFill(0x00f2ff);
        this.bodyGraphics.drawRect(-15, -50, 30, 50);
        this.bodyGraphics.endFill();
        this.container.addChild(this.bodyGraphics);

        this.engine.app.stage.addChild(this.container);

        // Physics (Matter)
        this.physicsBody = Bodies.rectangle(
            Math.random() * window.innerWidth,
            0,
            30,
            50,
            { friction: 0.1, restitution: 0.3 }
        );
        Composite.add(this.engine.physicsEngine.world, [this.physicsBody]);
    }

    update() {
        this.container.x = this.physicsBody.position.x;
        this.container.y = this.physicsBody.position.y;
        this.container.rotation = this.physicsBody.angle;

        // Random walking logic
        if (Math.random() < 0.01) {
            const force = (Math.random() - 0.5) * 0.005;
            Matter.Body.applyForce(this.physicsBody, this.physicsBody.position, { x: force, y: 0 });
        }
    }
}

// Global initialization
window.addEventListener('load', () => {
    window.SM = new GameEngine();
    
    // LUMIA STREAM INTEGRATION
    if (typeof Overlay !== 'undefined') {
        Overlay.on('alert', (data) => {
            const userId = data.username || data.name;
            if (userId) SM.addAvatar(userId.toLowerCase(), userId);
        });

        Overlay.on('chat', (data) => {
            if (!data || !data.message) return;
            const msg = data.message.toLowerCase();
            const username = data.username;
            const userId = username.toLowerCase();

            // Spawn avatar on first chat
            if (!SM.avatars.has(userId)) {
                SM.addAvatar(userId, username);
            }

            // Command Listener
            if (msg.startsWith('!buildavatar')) {
                // Future: Trigger Builder UI
                console.log(`Builder triggered for ${username}`);
            }
        });
    }
});

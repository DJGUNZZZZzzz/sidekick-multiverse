// Sidekick Multiverse: Ultimate Mage Engine (v3.1.2)
// Status: [ROBUST FALLBACK MODE]
// Asset: mage_ultimate.png (Target: 1920x1024)

(function() {
    if (window.SM_ENGINE_LOADED) return;
    window.SM_ENGINE_LOADED = true;
    window.SM_INSTANCE_ID = Date.now();

    var SM_CONFIG = {
        gravity: 0.8, 
        floorOffset: 40,
        avatarScale: 2.0,
        fps: 8
    };

    var CHAR_TEMPLATES = {
        MAGE: {
            frameW: 135,
            frameH: 156,
            frameOffsetX: 2,
            cols: 6,
            rows: 8,
            animations: {
                IDLE:    { assetKey: 'mage_idle',      row: 0, frames: 6, loop: true,  speed: 0.08 },
                WALK:    { assetKey: 'mage_walk',      row: 1, frames: 6, loop: true,  speed: 0.12 },
                JUMP:    { assetKey: 'mage_jump',      row: 2, frames: 6, loop: false, speed: 0.15 },
                ATTACK:  { assetKey: 'mage_attack',    row: 3, frames: 6, loop: false, speed: 0.15 },
                CAST1:   { assetKey: 'mage_cast1',     row: 4, frames: 6, loop: true,  speed: 0.10 },
                CAST2:   { assetKey: 'mage_cast2',     row: 5, frames: 6, loop: true,  speed: 0.10 },
                DASH:    { assetKey: 'mage_fireball',  row: 6, frames: 6, loop: true,  speed: 0.20 },
                EMOTE:   { assetKey: 'mage_emote',     row: 7, frames: 6, loop: false, speed: 0.08 },
                WIND:    { assetKey: 'mage_wind',      row: 0, frames: 6, loop: true,  speed: 0.10 } // Special case
            }
        },
        DJGUNZ: {
            frameW: 135, // Using identical safe-crop dimensions
            frameH: 154, // DJGUNZ is drawn deeper in his grid cell
            frameOffsetX: 2, // Default horizontal offset
            frameOffsetY: 8, // Shift crop box further down to catch his shoes completely
            cols: 6,
            rows: 8,
            animations: {
                IDLE:    { assetKey: 'gunz_idle',      row: 0, frames: 6, loop: true,  speed: 0.08 },
                WALK:    { assetKey: 'gunz_walk',      row: 0, frames: 6, loop: true,  speed: 0.14 },
                DASH:    { assetKey: 'gunz_run',       row: 0, frames: 6, loop: true,  speed: 0.22 },
                JUMP:    { assetKey: 'gunz_roll',      row: 0, frames: 6, loop: false, speed: 0.15 },
                EMOTE:   { assetKey: 'gunz_invest',    row: 0, frames: 6, loop: false, speed: 0.08 }
            }
        }
    };



    // --- LIBRARY LOADER ---
    function SM_LOAD_LIBS(callback) {
        console.log("SM_ENGINE: Loading libraries...");
        var libs = [
            { id: 'PIXI', src: 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.4/pixi.min.js' },
            { id: 'Matter', src: 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js' }
        ];
        var loaded = 0;
        libs.forEach(function(lib) {
            if (window[lib.id]) { 
                console.log("SM_ENGINE: Library already present:", lib.id);
                loaded++; 
                if (loaded === libs.length) callback(); 
                return; 
            }
            console.log("SM_ENGINE: Fetching script:", lib.src);
            var script = document.createElement('script');
            script.src = lib.src;
            script.onload = function() { 
                console.log("SM_ENGINE: Library loaded:", lib.id);
                loaded++; 
                if (loaded === libs.length) callback(); 
            };
            script.onerror = function() { console.error("SM_ENGINE: Failed to load library:", lib.id); };
            document.head.appendChild(script);
        });
    }



    // --- ENGINE ---
    function GameEngine() {
        this.app = null;
        this.avatars = [];
    }

    GameEngine.prototype.init = function() {
        var self = this;
        console.log("GameEngine: Starting initialization...");
        SM_LOAD_LIBS(() => {
            console.log("GameEngine: Libraries ready. Proceeding to setupEngine...");
            self.setupEngine();
        });
    };

    GameEngine.prototype.setupEngine = function() {
        console.log("GameEngine: Setting up PIXI Application...");
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            antialias: true,
            premultipliedAlpha: false  // Critical for alpha-based chroma key
        });
        this.app.game = this; // Store reference for Avatars
        this.app.view.style.background = 'transparent';
        document.body.appendChild(this.app.view);

        console.log("GameEngine: Initializing Matter.js physics...");
        this.physics = Matter.Engine.create();
        this.physics.gravity.y = SM_CONFIG.gravity;

        this.setupFilters(); // Re-activate the chroma key shader
        this.setupWorld();
        this.loadAssets();
    };

    GameEngine.prototype.setupWorld = function() {
        var floorY = window.innerHeight - SM_CONFIG.floorOffset;
        var floor = Matter.Bodies.rectangle(window.innerWidth/2, floorY + 100, window.innerWidth*2, 200, { isStatic: true });
        Matter.Composite.add(this.physics.world, [floor]);
    };

    // --- ASSETS (v8.0 - GitHub Pages Hosted) ---
    // Instead of base64 embedding (which exceeds Lumia's text limit)
    // or Lumia's CDN (which corrupts the PNG decode), we load directly
    // from your raw GitHub repository.
    
    var GITHUB_BASE_URL = "https://raw.githubusercontent.com/DJGUNZZZZzzz/sidekick-multiverse/main/";

    // Using the exact filenames that were successfully uploaded to the repository,
    // encoded so they form valid URLs.
    var SM_MAGE_ASSETS = {
        "mage_idle": GITHUB_BASE_URL + "Mage%20IDLE%20Sprite%20Sheet.png",
        "mage_walk": GITHUB_BASE_URL + "Mage%20WALKING%20Sprite%20Sheet.png",
        "mage_jump": GITHUB_BASE_URL + "Mage%20JUMPING%20Sprite%20Sheet.png",
        "mage_attack": GITHUB_BASE_URL + "Mage%20ATTACKING%20Sprite%20Sheet.png.png", // Note the double extension
        "mage_cast1": GITHUB_BASE_URL + "Mage%20CASTING%20SPELL%201%20Sprite%20Sheet.png",
        "mage_cast2": GITHUB_BASE_URL + "Mage%20CASTING%20SPELL%202%20Sprite%20Sheet.png",
        "mage_emote": GITHUB_BASE_URL + "Mage%20EMOTE%20POSE%20Sprite%20Sheet.png",
        "mage_fireball": GITHUB_BASE_URL + "Mage%20FIREBALL%20MOVEMENT%20Sprite%20Sheet.png",
        "mage_wind": GITHUB_BASE_URL + "Mage%20WIND%20SPELL%20Sprite%20Sheet.png"
    };

    var SM_DJGUNZ_ASSETS = {
        "gunz_idle": GITHUB_BASE_URL + "GUNZ%20Sprite%20sheet%20IDLE.png",
        "gunz_walk": GITHUB_BASE_URL + "GUNZ%20WALKNG.jpg",
        "gunz_run": GITHUB_BASE_URL + "GUNZ%20Sprite%20sheet%20RUN.png",
        "gunz_roll": GITHUB_BASE_URL + "GUNZ%20Sprite%20sheet%20ACTION%20ROLL.png",
        "gunz_invest": GITHUB_BASE_URL + "GUNZ%20Sprite%20sheet%20INVESTIGATING.png"
    };

    // Combine all assets for the unified loader
    var SM_ALL_ASSETS = Object.assign({}, SM_MAGE_ASSETS, SM_DJGUNZ_ASSETS);

    GameEngine.prototype.loadAssets = function() {
        var self = this;
        this.textures = {};
        
        console.log("GameEngine: Starting GitHub asset load with PIXI v7 Assets API...");
        
        var assetKeys = [];
        
        Object.keys(SM_ALL_ASSETS).forEach(function(key) {
            console.log("GameEngine: Queuing texture:", key, SM_ALL_ASSETS[key]);
            PIXI.Assets.add(key, SM_ALL_ASSETS[key]);
            assetKeys.push(key);
        });

        PIXI.Assets.load(assetKeys).then(function(textures) {
            console.log("GameEngine: PIXI Assets finished loading.");
            
            var allLoaded = true;
            Object.keys(SM_ALL_ASSETS).forEach(function(key) {
                if (textures[key]) {
                    self.textures[key] = textures[key].baseTexture;
                    console.log("GameEngine: Loaded texture:", key);
                } else {
                    console.error("GameEngine: Failed to load texture:", key);
                    allLoaded = false;
                }
            });

            if (allLoaded) {
                console.log("GameEngine: All GitHub textures loaded successfully.");
                self.initAvatars();
                self.app.ticker.add(function(delta) { self.update(delta); });
            } else {
                console.error("GameEngine: Some assets failed to load from GitHub. Avatars will not initialize.");
            }
        }).catch(function(err) {
            console.error("GameEngine: Fatal error loading assets:", err);
        });
    };

    GameEngine.prototype.initAvatars = function() {
        console.log("GameEngine: Spawning dual avatars...");
        
        var mageAvatar = new Avatar(this.app, this.physics, "Mage", "MAGE");
        this.app.stage.addChild(mageAvatar.container);
        this.avatars.push(mageAvatar);
        
        var gunzAvatar = new Avatar(this.app, this.physics, "DJGunz", "DJGUNZ");
        this.app.stage.addChild(gunzAvatar.container);
        this.avatars.push(gunzAvatar);
        
        window.avatar = mageAvatar; // Keep for legacy compat
    };

    GameEngine.prototype.setupFilters = function() {
        console.log("GameEngine: Compiling Checkerboard Chroma-Key Shader...");
        // Shader to detect and remove the fake checkerboard background
        // The background consists of white (1.0, 1.0, 1.0) and light grey (e.g. 0.8, 0.8, 0.8) blocks.
        // We calculate the distance from pure white. If it's very close to white or light grey, we discard it.
        var fragStr = `
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                
                // If pixel is entirely transparent already, keep it
                if (color.a == 0.0) {
                    gl_FragColor = color;
                    return;
                }
                
                // Fake transparency checkerboards are usually white and light grey.
                // We check if the RGB channels are very close to each other (grayscale)
                // and if the overall brightness is very high.
                float maxDec = max(max(color.r, color.g), color.b);
                float minDec = min(min(color.r, color.g), color.b);
                float difference = maxDec - minDec;
                
                // If it's grayscale (low difference) AND bright (light grey or white), discard it
                // Adjusted to 0.15 threshold for JPEG compression artifacts, and >0.6 brightness to catch dark greys
                if (difference < 0.15 && color.r > 0.6) {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                } else {
                    gl_FragColor = color;
                }
            }
        `;
        
        try {
            this.chromaFilter = new PIXI.Filter(null, fragStr);
            console.log("GameEngine: Shader compiled successfully.");
        } catch(e) {
            console.error("GameEngine: Failed to compile shader:", e);
            this.chromaFilter = null;
        }
    };

    GameEngine.prototype.update = function(delta) {
        Matter.Engine.update(this.physics, 16.666 * delta);
        this.avatars.forEach(av => av.update(delta));
    };

    // --- AVATAR ---
    function Avatar(app, physics, name, templateKey) {
        console.log("Avatar: Creating new character...", name, "(" + templateKey + ")");
        this.app = app;
        this.physics = physics;
        this.name = name;
        this.templateKey = templateKey;
        this.config = CHAR_TEMPLATES[templateKey];

        if (!this.config) {
            console.error("Avatar: FAILED to find template for", templateKey);
        }

        this.state = 'IDLE';
        this.frame = 0;
        this.frameTimer = 0;
        
        // --- AI LOGIC ---
        this.aiTimer = 60; // Start with a brief idle
        this.walkDir = 0; // -1 (left), 0 (stationary), 1 (right)
        
        this.container = new PIXI.Container();
        this.body = Matter.Bodies.rectangle(Math.random() * window.innerWidth, -200, 60, 100, { 
            inertia: Infinity, friction: 0.5, collisionFilter: { group: -1 } 
        });
        
        Matter.Composite.add(this.physics.world, [this.body]);
        console.log("Avatar: Physics body added. Setting up graphics...");
        this.setupGraphics();
    }

    Avatar.prototype.setupGraphics = function() {
        this.sliceTextures();
        this.sprite = new PIXI.Sprite(this.textures.IDLE[0]);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(SM_CONFIG.avatarScale);
        
        // Apply chroma key filter if it successfully compiled
        if (this.app.game.chromaFilter) {
            this.sprite.filters = [this.app.game.chromaFilter];
        }

        this.container.addChild(this.sprite);

        this.label = new PIXI.Text(this.name, { fontSize: 12, fill: 0xffffff, stroke: 0x000000, strokeThickness: 3 });
        this.label.anchor.set(0.5, 1);
        this.label.y = -Math.floor(this.config.frameH * SM_CONFIG.avatarScale) - 5;
        this.container.addChild(this.label);
    };

    Avatar.prototype.sliceTextures = function() {
        this.textures = {};
        var animations = this.config.animations;
        // Use the game instance textures
        var textures = this.app.game.textures;
        console.log("Avatar: Starting texture slicing for", this.name);

        for (var state in animations) {
            var anim = animations[state];
            var base = textures[anim.assetKey];
            if (!base) {
                console.warn("Avatar: Base texture NOT FOUND for state:", state, "key:", anim.assetKey);
                continue;
            }

            this.textures[state] = [];
            console.log("Avatar: Slicing", anim.frames, "frames for", state);
            for (var i = 0; i < anim.frames; i++) {
                // Determine the mathematically exact spacing per column for the loaded image
                // e.g. 832px / 6 cols = 138.666px per cell
                var spacingX = base.width / this.config.cols;
                
                // We use a safe crop width of 132px (out of ~138px) to preserve the wand 
                // while leaving just enough margin to avoid grabbing bleeding artifacts.
                var safeCropWidth = 132; 
                
                // A fixed offset shifts the camera slightly right to center the Mage
                var offsetX = 4;
                var x = Math.floor((i * spacingX) + offsetX);
                
                // Rows are strictly 156 pixels tall (1248px / 8 rows).
                var baseY = anim.row * 156; 
                // We add an optional vertical offset to shift the crop box down (e.g. to catch DJGUNZ's feet)
                var offsetY = this.config.frameOffsetY || 0;
                var y = baseY + offsetY;
                
                // Ensure we don't accidentally ask PIXI to slice beyond the texture bounds
                var sliceWidth = safeCropWidth;
                if (x + sliceWidth > base.width) {
                    sliceWidth = base.width - x;
                }
                var sliceHeight = this.config.frameH;
                if (y + sliceHeight > base.height) {
                    sliceHeight = base.height - y;
                }
                
                var rect = new PIXI.Rectangle(x, y, sliceWidth, sliceHeight);
                this.textures[state].push(new PIXI.Texture(base, rect));
            }
        }
        console.log("Avatar: Slicing complete for", this.name);
    };

    Avatar.prototype.update = function(delta) {
        this.container.x = this.body.position.x;
        this.container.y = this.body.position.y;
        
        // --- AUTONOMOUS AI LOGIC ---
        var isMoving = false;
        var onGround = Math.abs(this.body.velocity.y) < 1.0 && this.body.position.y > (window.innerHeight - SM_CONFIG.floorOffset - 150);
        
        this.aiTimer -= delta;

        // Dynamically figure out what "Action" states this specific character has
        var allKeys = Object.keys(this.config.animations);
        var actionStates = allKeys.filter(k => !['IDLE', 'WALK', 'JUMP'].includes(k));
        var inAction = actionStates.includes(this.state);

        if (!inAction) {
            
            // Time to pick a new action
            if (this.aiTimer <= 0) {
                var rand = Math.random();
                if (rand < 0.35) {
                    // Walk in a random direction
                    this.walkDir = Math.random() > 0.5 ? 1 : -1;
                    this.aiTimer = 60 + Math.random() * 180; // Walk for 1-4 seconds
                } else if (rand < 0.6) {
                    // Stand Idle
                    this.walkDir = 0;
                    this.aiTimer = 60 + Math.random() * 120; // Idle for 1-3 seconds
                } else if (rand < 0.8 && onGround && actionStates.length > 0) {
                    // Cast a Spell / Attack / Emote / Dash depending on what they have
                    this.walkDir = 0;
                    this.setState(actionStates[Math.floor(Math.random() * actionStates.length)]);
                    this.aiTimer = 30; // Wait before next state picks up
                } else if (onGround && this.config.animations['JUMP']) {
                    // Jump (can keep walking momentum)
                    Matter.Body.setVelocity(this.body, { x: this.body.velocity.x, y: -18 });
                    this.aiTimer = 30 + Math.random() * 60; 
                } else {
                    this.aiTimer = 60; // Fallback
                }
            }

            // Apply horizontal walking movement if active
            if (this.walkDir !== 0) {
                // Reverse direction if hitting the edge of the screen
                if (this.body.position.x < 100) this.walkDir = 1;
                if (this.body.position.x > window.innerWidth - 100) this.walkDir = -1;

                Matter.Body.setVelocity(this.body, { x: 3 * this.walkDir, y: this.body.velocity.y });
                this.sprite.scale.x = this.walkDir * SM_CONFIG.avatarScale; // Face direction
                isMoving = true;
            } else {
                Matter.Body.setVelocity(this.body, { x: 0, y: this.body.velocity.y }); // Stop sliding
            }

            // Decide resting state if not processing a special action
            if (!actionStates.includes(this.state)) {
                if (!onGround) {
                    this.setState('JUMP');
                } else if (isMoving) {
                    this.setState('WALK');
                } else {
                    this.setState('IDLE');
                }
            }
        } else {
            // Stop horizontal sliding when casting a spell or attacking
            Matter.Body.setVelocity(this.body, { x: 0, y: this.body.velocity.y });
            
            // Lock until animation completes its cycle
            if (this.frame >= this.config.animations[this.state].frames - 1) {
                this.setState('IDLE');
            }
        }

        this.updateAnim(delta);
    };

    Avatar.prototype.updateAnim = function(delta) {
        var anim = this.config.animations[this.state];
        if (!anim) return;

        // Base animation speed is controlled by delta. 
        // A delta of 1 is roughly 1/60th of a second.
        // The speed multiplier defines how fast the frames advance.
        this.frameTimer += delta * anim.speed;
        
        // Threshold is roughly frames per tick to change.
        if (this.frameTimer >= 1.0) {
            this.frameTimer -= 1.0; 
            this.frame++;

            if (this.frame >= anim.frames) {
                if (anim.loop) {
                    this.frame = 0;
                } else {
                    this.frame = anim.frames - 1;
                }
            }
            if (this.textures[this.state] && this.textures[this.state][this.frame]) {
                this.sprite.texture = this.textures[this.state][this.frame];
            }
        }
    };

    Avatar.prototype.setState = function(newState) {
        if (this.state === newState) return;
        this.state = newState;
        this.frame = 0;
        this.frameTimer = 0;
        if (this.textures[this.state] && this.textures[this.state][0]) {
            this.sprite.texture = this.textures[this.state][0];
        }
    };

    window.GameEngine = GameEngine;

    // --- AUTO-INITIALIZE ---
    window.addEventListener('load', () => {
        console.log("SM_ENGINE: Auto-initializing...");
        window.game = new GameEngine();
        window.game.init();
    });
})();

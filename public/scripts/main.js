
(function() {
  
  var STAGE_HEIGHT = 480;
  var STAGE_WIDTH = 800;
  var GAME_ASSET = {
    IMAGES: {
      bass_god: '/assets/images/bass_god.png',
      bass_cannon: '/assets/images/cannon_fire.png',
      bass_coin: '/assets/images/bass_coin.png',
      // bg: '/assets/images/bg32_32.png',
      enemy: '/assets/images/enemy.png',
      ground: '/assets/images/ground.jpg',
      ground2: '/assets/images/ground2.jpg',
      ground3: '/assets/images/ground3.jpg',
      bd: '/assets/images/backdrop.png',
      gameover: '/assets/images/gameover.png'
    }
  };
  var game;
  var player;
  var intervals = [];
  var enemies = [];
  var enemy;




  window.onload = function(){
  
    enchant();
    game = new Core(STAGE_WIDTH, STAGE_HEIGHT);
    game.fps = 60;
    game.gravity = 1;
    preloadAssets();
    game.onload = gameInit;

    game.onenterframe = gameLoop;

    game.start();
    
  }
  function gameInit() {
    backdrop = new Sprite(762,488);
    var ground = new Sprite(243,40);
    var ground2 = new Sprite(243,40);
    var ground3 = new Sprite(243,40);
    player = new Sprite(150,101);
    // bass_cannon = new Sprite(34,24);
    bass_coin = new Sprite(34,34);

    // ENEMY CLASS
    var Enemy = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this, 100, 100);
        this.image = game.assets[GAME_ASSET.IMAGES.enemy];
        this.x = x;
        this.y = y;
        this.frame = 3;
        game.rootScene.addChild(this);

        this.direction = 0;
        this.speed = 10;

        this.addEventListener('enterframe',function(){
          this.x -= this.speed * Math.cos(this.direction);
          this.x += this.speed * Math.sin(this.direction);

          if(this.x < 0) {
            this.remove();
          }
        });
      },
      remove: function() {
        game.rootScene.removeChild(this);
        delete enemies[this.key];
        delete this;
      }
    });
    // BASS_CANNON CLASS
    var BassCannon = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this,34,24);
        this.image = game.assets[GAME_ASSET.IMAGES.bass_cannon];
        this.x = x;
        this.y = y;
        this.frame = 3;

        game.rootScene.addChild(this);

        this.addEventListener('enterframe',function(){
          for(var i in enemies){
            if(enemies[i].intersect(this)){
              this.remove();
              enemies[i].remove();
            }
          }
        });
      }
    });
    game.rootScene.addEventListener('enterframe', function(){
      if(Math.random()*100 < 10) {
        // var y = Math.random()*320;
        var enemy = new Enemy(STAGE_WIDTH, 340);
        enemy.key = game.frame;
        enemies[game.frame] = enemy;
        // console.log(enemies);
        // enemy.tl.moveBy(-800, 0, 100);   // move right 
      }

      if(game.input.right) {
        var bass_cannon = new BassCannon(300,300);
        bass_cannon.y = player.y+30;
        bass_cannon.x = player.x +150;
        bass_cannon.tl.moveBy(STAGE_WIDTH, 0, 50);
      // game.assets['/assets/sfx/bass_cannon_aduio.wav'].play();
      console.log('wub');
    }

    });

    
    ground.x = 0;
    ground2.y += STAGE_HEIGHT -40;
    ground2.x = 700;
    ground3.y += STAGE_HEIGHT -40;
    ground3.x = 800;
    bass_coin.y = player.y + 200;
    bass_coin.x = 600;

    backdrop.image = game.assets[GAME_ASSET.IMAGES.bd];
    ground.image = game.assets[GAME_ASSET.IMAGES.ground];
    ground2.image = game.assets[GAME_ASSET.IMAGES.ground2];
    ground3.image = game.assets[GAME_ASSET.IMAGES.ground3];
    player.image = game.assets[GAME_ASSET.IMAGES.bass_god];
    // bass_cannon.image = game.assets[GAME_ASSET.IMAGES.bass_cannon];
    bass_coin.image = game.assets[GAME_ASSET.IMAGES.bass_coin];
   
    game.rootScene.addChild(player);
    // spawnEnemy();
    // spawnCoins();




    ground.y += STAGE_HEIGHT -40;
    
    ground.width = STAGE_WIDTH;

    // calculate distance
 
  }
  function preloadAssets() {
    // game.preload(GAME_ASSET.AUDIO.bass_cannon_audio.wav);
    game.preload(GAME_ASSET.IMAGES.bd);
    game.preload(GAME_ASSET.IMAGES.ground);
    game.preload(GAME_ASSET.IMAGES.ground2);
    game.preload(GAME_ASSET.IMAGES.ground3);
    game.preload(GAME_ASSET.IMAGES.bass_god);
    game.preload(GAME_ASSET.IMAGES.bass_cannon);
    game.preload(GAME_ASSET.IMAGES.bass_coin);
    game.preload(GAME_ASSET.IMAGES.enemy);
    game.preload(GAME_ASSET.IMAGES.gameover);
  }

  function gameLoop(event) {

    if(player === undefined) {
      return;
    }

    player.y = 340;
    var ground = 200;
    player.gravity = 1;

    // sprite jumps when up arrow is pushed
    if(game.input.up) {
      player.y = player.y - 200;
      console.log('jump test');
    }

    // sprite falls to ground
    if(player.y < ground) {
      player.y += player.gravity;
    }
  



    // if player presses key, fire bass cannon
    // if(game.input.right) {
    //   game.rootScene.addChild(bass_cannon);
    //   bass_cannon.y = player.y+30;
    //   bass_cannon.x = player.x +150;
    //   bass_cannon.tl.moveBy(STAGE_WIDTH, 0, 50);
    //   // game.assets['/assets/sfx/bass_cannon_aduio.wav'].play();
    //   console.log('wub');
    // }
   



    bass_coin.tl.moveBy(-600, 0, 100);   // move right 
          // .scaleTo(-1, 1, 10)      // turn left
          // .moveBy(0, 0, 10)     // move left
          // .scaleTo(1, 1, 10)       // turn right
          // .loop();                 // loop it     
    // bass_coin.tl.moveBy(-STAGE_WIDTH, 0, 100)   // move right       
    
    ////////// sprite collision//////////////
    // bass_cannon hits enemy
    // console.log('enemies.length' + enemies.length);
    // for(var i=0; i<enemies.length;i++) {
    //   console.log('enemies i ' + enemies[i]);
    //   if(enemies[i].intersect(bass_cannon)){
    //     enemies[i].remove();
    //   }
    //   if(player.intersect(enemies[i])) {
    //     game.rootScene.removeChild(player);
    //     gameOver(); 
    //     // console.log('dedz');
    //   } 
    // }
    // enemy hits player
    // if(player.intersect(enemy)) {
    //   game.rootScene.removeChild(player);
    //   gameOver(); 
    //   // console.log('dedz');
    // } 
    
    // if player intersects coin
    // if(player.intersect(bass_coin)) {
    //   game.rootScene.removeChild(bass_coin);
    //   console.log('ka-ching!');
    // }
  }


  function removeEnemy(enemy) {
    game.rootScene.removeChild(enemy);
    console.log('pwn');
    delete enemy;
  }

  function spawnEnemy() {
    enemy = new Sprite(100,100);

    enemy.y = 340;
    enemy.x = 800;
    game.rootScene.addChild(enemy);
    enemy.image = game.assets[GAME_ASSET.IMAGES.enemy];

    // enemy.x = 600;
    enemy.tl.moveBy(-1000, 0, 100);   // moves enemy to the left

    console.log('meow');
  }

  function spawnCoins() {
    game.rootScene.addChild(bass_coin);
  }

  function gameOver() {
 
    var gameover = new Sprite(300,75);
    gameover.image = game.assets[GAME_ASSET.IMAGES.gameover];
    game.rootScene.addChild(gameover);
    game.stop();
    console.log('You dropped the bass m8. GAMEOVER');
  }


})();
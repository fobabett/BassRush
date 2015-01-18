
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
    game.score = 0;
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
    // player = new Sprite(150,101);
    // bass_cannon = new Sprite(34,24);
    bass_coin = new Sprite(34,34);
    // scoreLabel = new ScoreLabel(8,8);
    // game.rootScene.addChild(scoreLabel);
    // PLAYER CLASS
    var Player = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y){
        enchant.Sprite.call(this,150,101);
        this.image = game.assets[GAME_ASSET.IMAGES.bass_god];
        this.x = x;
        this.y = y;
        this.frame = 0;
        game.rootScene.addChild(this);

        this.addEventListener('enterframe',function(){

        });
      }
    });
    var player = new Player(50,340);

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
        this.speed = 20;

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
      if(Math.random()*1000 < 10) {
        var enemy = new Enemy(STAGE_WIDTH, 340);
        enemy.key = game.frame;
        enemies[game.frame] = enemy;
      }

      if(game.input.right) {
        var bass_cannon = new BassCannon(300,300);
        bass_cannon.y = player.y+30;
        bass_cannon.x = player.x +150;
        bass_cannon.tl.moveBy(STAGE_WIDTH, 0, 50);
      // game.assets['/assets/sfx/bass_cannon_aduio.wav'].play();
        console.log('wub');
      }

      // enemy hits player
      for(var i in enemies){
        if(player.intersect(enemies[i])){
          game.rootScene.removeChild(player);
          gameOver();
        }
      }

      var ground = 340;
      player.gravity = 10;

      // sprite jumps when up arrow is pushed
      if(game.input.up) {
        player.y -= 60;
        console.log('jump test');
      }
  
      // sprite falls to ground
      if(player.y < ground) {
        player.y += player.gravity;
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
    bass_coin.image = game.assets[GAME_ASSET.IMAGES.bass_coin];
   
    game.rootScene.addChild(player);




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

(function() {
  
  var STAGE_HEIGHT = 480;
  var STAGE_WIDTH = 800;
  var GAME_ASSET = {
    IMAGES: {
      bass_god: '/assets/images/bass_god1.png',
      bass_cannon: '/assets/images/cannon_fire.png',
      bass_coin: '/assets/images/bass_coin.png',
      power_up_sf: '/assets/images/sausage_fattener_pu.png',
      sausage_banner: '/assets/images/bass_pu_banner.png',
      green_lasers: '/assets/images/green_lasers.png',
      red_lasers: '/assets/images/red_lasers.png',
      // bg: '/assets/images/bg32_32.png',
      enemy: '/assets/images/enemy.png',
      ground: '/assets/images/ground.png',
      bd: '/assets/images/backdrop.png',
      gameover: '/assets/images/gameover.png'
    },
    AUDIO: {
      theme_song: '/assets/audio/bass_rush_wip.mp3'
    }
  };
  var game;
  var player;
  var intervals = [];
  var enemies = [];
  var enemy;
  var coins =[];
  





  window.onload = function(){
  
    enchant();
    game = new Core(STAGE_WIDTH, STAGE_HEIGHT);
    game.fps = 60;
    game.gravity = 15;
    game.coins = 0;
    preloadAssets();
    game.preload('/assets/audio/bass_rush_wip.mp3', '/assets/sfx/bass_cannon_audio.wav', '/assets/sfx/coin5.wav', '/assets/sfx/zombie_die.wav', '/assets/sfx/DamnSon.wav', '/assets/sfx/laser_audio.wav');
    
    game.onload = gameInit;
    

    game.onenterframe = gameLoop;

    game.start();
    
  }
  function gameInit() {
    coinLabel = new Label("Coins: 0");
    coinLabel.color = "yellow";
    coinLabel.font = "28px monospace";
    game.rootScene.addChild(coinLabel);

    distanceLabel = new Label("Distance: 0");
    distanceLabel.y = 30;
    distanceLabel.color = "white";
    distanceLabel.font = "28px monospace";
    game.rootScene.addChild(distanceLabel);

    coinLabel.addEventListener('enterframe', function(){
      this.text = "Coins: "+game.coins;
    });

    distanceLabel.addEventListener('enterframe', function(){
      this.text = "Distance: " + game.frame + " m";
    });

    game.theme_song = game.assets['/assets/audio/bass_rush_wip.mp3'];
    game.damn_son = game.assets['/assets/sfx/DamnSon.wav'];
    game.laser = game.assets['/assets/sfx/laser_audio.wav'];
    game.bass_cannon_wub = game.assets['/assets/sfx/bass_cannon_audio.wav'];
    game.coin_sfx = game.assets['/assets/sfx/coin5.wav'];
    game.zombie_die = game.assets['/assets/sfx/zombie_die.wav'];
    // game.theme_song.play();
    backdrop = new Sprite(762,488);

    var ground = new Sprite(60,60);
    ground.image = game.assets[GAME_ASSET.IMAGES.ground];
    // game.rootScene.addChild(ground);
    ground.y = 420;
    // player = new Sprite(150,101);
    // bass_cannon = new Sprite(34,24);
    // bass_coin = new Sprite(34,34);
    // scoreLabel = new ScoreLabel(8,8);
    // game.rootScene.addChild(scoreLabel);

    // // GROUND CLASS
    // var Ground = enchant.Class.create(enchant.Sprite, {
    //   initialize: function(x,y){
    //     enchant.Sprite.call(this,60,60);
    //     this.image = game.assets[GAME_ASSET.IMAGES.ground];
    //     this.x = x;
    //     this.y = y;
    //     this.frame = 4;
    //     game.rootScene.addChild(this);
    //     // this.frame = [6, 6, 7, 7];

    //     this.addEventListener('enterframe',function(){

    //     });
    //   }
    // });


    // PLAYER CLASS
    var Player = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y){
        enchant.Sprite.call(this,150,101);
        this.image = game.assets[GAME_ASSET.IMAGES.bass_god];
        this.x = x;
        this.y = y;
        this.frame++;
        game.rootScene.addChild(this);
        // this.frame = [6, 6, 7, 7];

        this.addEventListener('enterframe',function(){

        });
      }
    });
    var player = new Player(50,320);
    player.frame = [6,6,7,7];

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
        this.direction = 0;
        this.speed = 10;

        this.x += this.speed * Math.cos(this.direction);

        


        game.rootScene.addChild(this);

        this.addEventListener('enterframe',function(){
          for(var i in enemies){
            if(enemies[i].intersect(this)){
              game.zombie_die.play();
              enemies[i].remove();
              this.remove();
            }
          }

          if(this.x > STAGE_WIDTH){
            this.remove();
          }

        });
      }
    });

    // COIN CLASS
    var Coins = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this,34,34);
        this.image = game.assets[GAME_ASSET.IMAGES.bass_coin];
        this.x = x;
        this.y = y;
        this.frame = 3;
        this.direction = 0;
        this.speed = 10;

        this.addEventListener('enterframe',function(){
          this.x -= this.speed * Math.cos(this.direction);
          this.x += this.speed * Math.sin(this.direction);

          if(this.x < 0) {
            this.remove();
          }

          if(this.intersect(player)){
            game.coins++
            game.coin_sfx.play();
            this.remove();
          }

          if(this.x > STAGE_WIDTH){
            this.remove();
          }
        });

        game.rootScene.addChild(this);
      }
    });

    // POWER UPS
    var Sausage = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this,40,65);
        this.image = game.assets[GAME_ASSET.IMAGES.power_up_sf];
        this.x = x;
        this.y = y;
        this.frame = 3;
        this.direction = 0;
        this.speed = 10;

        this.addEventListener('enterframe',function(){
          this.x -= this.speed * Math.cos(this.direction);
          this.x += this.speed * Math.sin(this.direction);

          if(this.x < 0) {
            this.remove();
          }

          if(this.intersect(player)){
            var bass_banner = new BassBanner(0,100);
            game.damn_son.play();
            console.log('damn son');
            this.remove();
            setTimeout(function() {
              bass_banner.remove();
            }, 1000);
          }

          if(this.x > STAGE_WIDTH){
            this.remove();
          }
        });

        game.rootScene.addChild(this);
      }
    });

    var BassBanner = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this,800,333);
        this.image = game.assets[GAME_ASSET.IMAGES.sausage_banner];
        this.x = x;
        this.y = y;

        game.rootScene.addChild(this);

        // setTimeout(function() {
        //   this.remove();
        // }, 5000);
      }
    });

    // LASER CLASS
    var Lasers = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this,1000,333);
        this.image = game.assets[GAME_ASSET.IMAGES.green_lasers];
        this.x = x;
        this.y = y;
        this.frame = 3;
        this.direction = 0;
        this.speed = 10;   

        game.rootScene.addChild(this);

      }
    });

    game.rootScene.addEventListener('enterframe', function(){
      // generates enemies
      if(Math.random()*1000 < 10) {
        var enemy = new Enemy(STAGE_WIDTH, 320);
        enemy.key = game.frame;
        enemies[game.frame] = enemy;
      }
      // generates coins
          if(Math.random()*1000 < 10) {
            var y = Math.random()*100;
            var bass_coin = new Coins(STAGE_WIDTH, y);

            bass_coin.tl.moveBy(0, 0, 5)   // move right
            .scaleTo(-1, 1, 10)      // turn left
            .moveBy(0, 0, 5)     // move left
            .scaleTo(1, 1, 10)       // turn right
            .loop(); 
      };
      // generates powerups
      if(Math.random()*10000 < 10) {
        var y = Math.random()*100;
        var fat_bass_power_up = new Sausage(STAGE_WIDTH, y);
      }

      // // LASERSSSSSS ////////
      if(Math.random()*1000 < 10) {
        var green_lasers = new Lasers(0,50);
        game.laser.play();

        setInterval(function() {
          green_lasers.remove();
        },100);
      };
      if(Math.random()*1000 < 10) {
        var red_lasers = new Sprite(1000,333);
        red_lasers.y = 100;
        red_lasers.x = -20;
        red_lasers.image = game.assets[GAME_ASSET.IMAGES.red_lasers];
        game.rootScene.addChild(red_lasers);
        game.laser.play();

        setInterval(function() {
          red_lasers.remove();
        },100);

      };
      

      if(game.input.right) {
        var bass_cannon = new BassCannon(300,300);
        bass_cannon.y = player.y+30;
        bass_cannon.x = player.x +150;
        bass_cannon.tl.moveBy(STAGE_WIDTH, 0, 50);
        game.bass_cannon_wub.play();
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

      // sprite jumps when up arrow is pushed
      if(game.input.up) {
        player.y -= 60;
        console.log('jump test');
      }
  
      // sprite falls to ground
      if(player.y < 320) {
        player.y += game.gravity;
      }
    });

    
    ground.x = 0;
  


    backdrop.image = game.assets[GAME_ASSET.IMAGES.bd];
    ground.image = game.assets[GAME_ASSET.IMAGES.ground];
    
   
    game.rootScene.addChild(player);




    ground.y += STAGE_HEIGHT -40;
    
    ground.width = STAGE_WIDTH;

    // calculate distance
 
  }
  function preloadAssets() {
    game.preload(GAME_ASSET.AUDIO.theme_song);
    game.preload(GAME_ASSET.IMAGES.green_lasers);
    game.preload(GAME_ASSET.IMAGES.red_lasers);
    // game.preload(GAME_ASSET.IMAGES.lasers);
    game.preload(GAME_ASSET.IMAGES.bd);
    game.preload(GAME_ASSET.IMAGES.ground);
    game.preload(GAME_ASSET.IMAGES.bass_god);
    game.preload(GAME_ASSET.IMAGES.bass_cannon);
    game.preload(GAME_ASSET.IMAGES.bass_coin);
    game.preload(GAME_ASSET.IMAGES.power_up_sf);
    game.preload(GAME_ASSET.IMAGES.sausage_banner);
    game.preload(GAME_ASSET.IMAGES.enemy);
    game.preload(GAME_ASSET.IMAGES.gameover);
  }

  function gameLoop(event) {

  }


  function gameOver() {
 
    var gameover = new Sprite(800,333);
    gameover.y = 50;
    gameover.image = game.assets[GAME_ASSET.IMAGES.gameover];
    game.rootScene.addChild(gameover);
    game.theme_song.stop();
    game.stop();
    console.log('You dropped the bass m8. GAMEOVER');
  }


})();
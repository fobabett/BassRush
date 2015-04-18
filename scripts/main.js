
(function() {
  
  var STAGE_HEIGHT = 480;
  var STAGE_WIDTH = 800;
  var GAME_ASSET = {
    IMAGES: {
      logo: '../assets/images/bassRushLogo.png',
      bass_god: '../assets/images/bass_god1.png',
      bass_cannon: '../assets/images/cannon_fire.png',
      cannon_powerup: '../assets/images/power_up_fire.png',
      bass_coin: '../assets/images/bass_coin.png',
      obstacle: '../assets/images/obstacle.png',
      power_up_sf: '../assets/images/sausage_fattener_pu.png',
      sausage_banner: '../assets/images/bass_pu_banner.png',
      green_lasers: '../assets/images/green_lasers.png',
      red_lasers: '../assets/images/red_lasers.png',
      // bg: '/assets/images/backdrop.png',
      enemy: '../assets/images/enemy.png',
      ground: '../assets/images/ground.png',
      bd: '../assets/images/backdrop.png',
      gameover: '../assets/images/gameover.png'
    },
    AUDIO: {
      theme_song: '../assets/audio/bass_rush_wip.mp3'
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
    game.preload('../assets/audio/bass_rush_wip.mp3', '../assets/sfx/bass_cannon_audio.wav', '../assets/sfx/coin5.wav', '../assets/sfx/zombie_die.wav', '../assets/sfx/DamnSon.wav', '/assets/sfx/laser_audio.wav', '/assets/sfx/gameover_audio.wav', '/assets/sfx/footsteps.wav', '/assets/images/bassRushLogo.png');
    
    // game.onload = gameInit;
    game.onload = gameMenu;
    

    game.onenterframe = gameLoop;

    
    game.start();
    
  }
  function gameMenu() {
    logo = new Sprite(500,330);
    game.theme_song = game.assets['../assets/audio/bass_rush_wip.mp3'];
    game.theme_song.play();

    logo.image = game.assets['../assets/images/bassRushLogo.png'];
    game.rootScene.addChild(logo);
    logo.x = 150;

    startLabel = new Label("Press ENTER to start");
      startLabel.color = "white";
      startLabel.font = "20px monospace";
      startLabel.x = 280;
      startLabel.y = 300;

    setInterval(function() {
      
      game.rootScene.addChild(startLabel); 
    },11000);

    game.addEventListener('keydown', function(e) {
      // game.keybind(13,'up');
      if(game.input.left) {
        game.rootScene.removeChild(startLabel);

        game.rootScene.removeChild(logo);
        gameInit();
        game.theme_song.stop();
      }
    });

  }
  function gameInit() {
    // logo = new Sprite(500,330);

    // logo.image = game.assets['/assets/images/bassRushLogo.png'];
    // game.rootScene.addChild(logo);
    
    
   
   

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
      this.text = "Coins: "+ game.coins;
    });

    distanceLabel.addEventListener('enterframe', function(){
      this.text = "Distance: " + game.frame + " m";
    });

    game.theme_song = game.assets['../assets/audio/bass_rush_wip.mp3'];
    game.footsteps = game.assets['../assets/sfx/footsteps.wav'];
    game.damn_son = game.assets['../assets/sfx/DamnSon.wav'];
    game.laser = game.assets['../assets/sfx/laser_audio.wav'];
    game.bass_cannon_wub = game.assets['../assets/sfx/bass_cannon_audio.wav'];
    game.coin_sfx = game.assets['../assets/sfx/coin5.wav'];
    game.zombie_die = game.assets['../assets/sfx/zombie_die.wav'];
    game.gameover = game.assets['../assets/sfx/gameover_audio.wav'];
    // game.theme_song.play();
    game.footsteps.play();
    

    // backdrop = new Sprite(800,281);
    // backdrop.y = 140;

    // var ground = new Sprite(60,60);
    // ground.image = game.assets[GAME_ASSET.IMAGES.ground];
    // // game.rootScene.addChild(backdrop);
    // ground.y = 420;

    // REASSIGN KEYS
    game.keybind(32, 'up');  //spacebar 
    game.keybind(13, 'right'); //enter key
  

    // BACKGROUND CLASS
    var Background = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y){
        enchant.Sprite.call(this,800,281);
        this.image = game.assets[GAME_ASSET.IMAGES.bd];
        this.x = x;
        this.y = y;

        this.addEventListener('enterframe',function(){
          this.x--;
          if(this.x < -300 ) {
            this.x = 0;
          }
        });

        game.rootScene.addChild(this);
      }
    });
    
    // var background = new Background(0,140);




    // PLAYER CLASS
    var Player = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y){
        enchant.Sprite.call(this,150,101);
        this.image = game.assets[GAME_ASSET.IMAGES.bass_god];
        this.x = x;
        this.y = y;
        this.frame++;
        this.speed = 5;
        this.age = 0;
        game.rootScene.addChild(this);
        // this.frame = [6, 6, 7, 7];

        this.addEventListener('enterframe',function(){

        });
      }
    });
    var player = new Player(50,320);
    player.frame = [1,1,2,3,3];

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
        this.powerup = false;
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

          if(this.powerup === true) {
            console.log('powerup');
            this.image = game.assets[GAME_ASSET_IMAGES.cannon_powerup];
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

    // OBSTACLES
    var Obstacles = enchant.Class.create(enchant.Sprite, {
      initialize: function(x,y) {
        enchant.Sprite.call(this,35,24);
        this.image = game.assets[GAME_ASSET.IMAGES.obstacle];
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
            
            player.remove();
            gameOver();
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
        enchant.Sprite.call(this,70,154);
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
            // bass_cannon.powerup = true;
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
      // Loop footsteps
      if (game.footsteps.currentTime >= game.footsteps.duration ){
        game.footsteps.play();
       }
      // generates enemies
      if(Math.random()*1000 < 10) {
        var enemy = new Enemy(STAGE_WIDTH, 320);
        enemy.key = game.frame;
        enemies[game.frame] = enemy;
      }
       // generates obstacles
      if(Math.random()*1000 < 10) {
        var y = Math.random()*200;
        var obstacles = new Obstacles(STAGE_WIDTH, y);
        
      }
      // generates coins
          if(Math.random()*100 < 10) {
            var y = Math.random()*220;
            var bass_coin = new Coins(STAGE_WIDTH, y);

            bass_coin.tl.moveBy(0, 0, 5)   // move right
            .scaleTo(-1, 1, 10)      // turn left
            .moveBy(0, 0, 5)     // move left
            .scaleTo(1, 1, 10)       // turn right
            .loop(); 
      };
      // generates powerups
      if(Math.random()*1000 < 1) {
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

      var ground = 320;

      // sprite jumps when spacebar is pressed
      if(game.input.up) {
        player.y -= 40;
      }
  
      // sprite falls to ground
      if(player.y < ground) {
        player.y += game.gravity;
      }
    });

 
  


    
   
    
   
    // game.rootScene.addChild(player);





    // calculate distance
 
  }
  function preloadAssets() {
    game.preload(GAME_ASSET.IMAGES.logo);
    game.preload(GAME_ASSET.AUDIO.theme_song);
    game.preload(GAME_ASSET.IMAGES.green_lasers);
    game.preload(GAME_ASSET.IMAGES.red_lasers);
    game.preload(GAME_ASSET.IMAGES.obstacle);
    // game.preload(GAME_ASSET.IMAGES.lasers);
    game.preload(GAME_ASSET.IMAGES.bd);
    game.preload(GAME_ASSET.IMAGES.ground);
    game.preload(GAME_ASSET.IMAGES.bass_god);
    game.preload(GAME_ASSET.IMAGES.bass_cannon);
    game.preload(GAME_ASSET.IMAGES.cannon_powerup);
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
    // game.theme_song.stop();
    game.footsteps.stop();
    game.gameover.play();
    game.stop();
    console.log('You dropped the bass m8. GAMEOVER');
  }


})();
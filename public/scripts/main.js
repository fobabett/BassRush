 
(function() {
  
  var STAGE_HEIGHT = 480;
  var STAGE_WIDTH = 640;
  // var GROUND_Y = 450;
  var GAME_ASSET = {
    IMAGES: {
      blah: '/assets/images/mario.png',
      bg: '/assets/images/bg32_32.png',
      enemy: '/assets/images/enemy.png'
    }
  };
  var game;
  var player;


  window.onload = function(){
  
    enchant();
    game = new Core(STAGE_WIDTH, STAGE_HEIGHT);
    game.fps = 60;
    game.gravity = 1;
    // game.ground = new Sprite(STAGE_WIDTH, 200);
    preloadAssets();
    game.onload = gameInit;

    game.onenterframe = gameLoop;

    game.start();
    
  }
  function gameInit() {
    var bg = new Sprite(STAGE_WIDTH, STAGE_HEIGHT);
    player = new Sprite(400,346);
    enemy = new Sprite(242,242);
    player.scale(.2); //use smaller decimals for smaller sizing
    enemy.scale(.3);
    enemy.y = 260;
    enemy.x = 400;


    bg.image = game.assets[GAME_ASSET.IMAGES.bg];
    player.image = game.assets[GAME_ASSET.IMAGES.blah];
    enemy.image = game.assets[GAME_ASSET.IMAGES.enemy];
    game.rootScene.addChild(bg);
    game.rootScene.addChild(player);
    game.rootScene.addChild(enemy);
   
    // console.log(player,bg);
  }
  function preloadAssets() {
    game.preload(GAME_ASSET.IMAGES.bg);
    game.preload(GAME_ASSET.IMAGES.blah);
    game.preload(GAME_ASSET.IMAGES.enemy);
  }

  function gameLoop(event) {
    if(player === undefined) {
      return;
    }
    player.y = 205;
    var ground = 200;
    player.gravity = 5;
    // sprite jumps when up arrow is pushed
    if(game.input.up) {
      player.y = player.y - 100;
      console.log('jump test');
    }
    // sprite falls to ground
    if(player.y < ground) {
      player.y += player.gravity;
    }
    
    // randomize enemy movements
     enemy.tl.moveBy(200, 0, 150)   // move right 
            .scaleTo(-.3, .3, 10)      // turn left
            .moveBy(-288, 0, 150)     // move left
            .scaleTo(.3, .3, 10)       // turn right
            .loop();                 // loop it
    

  }


})();
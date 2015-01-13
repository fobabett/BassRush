 
(function() {
  
  var STAGE_HEIGHT = 480;
  var STAGE_WIDTH = 800;
  // var GROUND_Y = 450;
  var GAME_ASSET = {
    IMAGES: {
      blah: '/assets/images/mario.png',
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
    backdrop = new Sprite(762,488);
    var ground = new Sprite(243,40);
    var ground2 = new Sprite(243,40);
    var ground3 = new Sprite(243,40);
    player = new Sprite(115,100);
    enemy = new Sprite(100,100);
    // player.scale(.2); //use smaller decimals for smaller sizing
    // enemy.scale(.3);
    enemy.y = 340;
    enemy.x = 400;
    ground.x = 0;
    ground2.y += STAGE_HEIGHT -40;
    ground2.x = 700;
    ground3.y += STAGE_HEIGHT -40;
    ground3.x = 800;

    backdrop.image = game.assets[GAME_ASSET.IMAGES.bd];
    ground.image = game.assets[GAME_ASSET.IMAGES.ground];
    ground2.image = game.assets[GAME_ASSET.IMAGES.ground2];
    ground3.image = game.assets[GAME_ASSET.IMAGES.ground3];
    player.image = game.assets[GAME_ASSET.IMAGES.blah];
    enemy.image = game.assets[GAME_ASSET.IMAGES.enemy];
    game.rootScene.addChild(backdrop);
    game.rootScene.addChild(ground);
    // game.rootScene.addChild(ground2);
    // game.rootScene.addChild(ground3);
    game.rootScene.addChild(player);
    game.rootScene.addChild(enemy);

    // for(var i=1; i<900; i++) {
    //   if(i === 900) {
    //     game.rootScene.addChild(enemy);
    //   }
    // }

    if(backdrop.x < STAGE_WIDTH) {
      backdrop.tl.moveBy(-STAGE_WIDTH, 0, 300)
            // .loop();                 // loop it
    }
    if(ground.x >=0) {
      ground.tl.moveBy(-STAGE_WIDTH, 0, 100);
      if(ground.x <0){
        game.rootScene.addChild(ground2);
      }
    }
 
   

    ground.y += STAGE_HEIGHT -40;
    
    ground.width = STAGE_WIDTH;

    // calculate distance
 
  }
  function preloadAssets() {
    game.preload(GAME_ASSET.IMAGES.bd);
    game.preload(GAME_ASSET.IMAGES.ground);
    game.preload(GAME_ASSET.IMAGES.ground2);
    game.preload(GAME_ASSET.IMAGES.ground3);
    game.preload(GAME_ASSET.IMAGES.blah);
    game.preload(GAME_ASSET.IMAGES.enemy);
    game.preload(GAME_ASSET.IMAGES.gameover);
  }

  function Background() {
    this.speed - 1;

    backdrop.x += this.speed;
  }

  function gameLoop(event) {

    // for(var i=1; i<900; i++) {
    //   if(i === 1) {
    //     game.rootScene.addChild(enemy);
    //   }
    // }


    if(player === undefined) {
      return;
    }
    player.y = 340;
    var ground = 200;
    player.gravity = 5;
    // sprite jumps when up arrow is pushed
    if(game.input.up) {
      player.y = player.y - 200;
      console.log('jump test');
    }
    // sprite falls to ground
    if(player.y < ground) {
      player.y += player.gravity;
    }
    
    // randomize enemy movements
     enemy.tl.moveBy(-STAGE_WIDTH, 0, 100);   // move right 
            // .scaleTo(-1, 1, 10)      // turn left
            // .moveBy(200, 0, 90)     // move left
            // .scaleTo(1, 1, 10)       // turn right
            // .loop();                 // loop it

    // sprite intersect test
    if(player.intersect(enemy)) {
      game.rootScene.removeChild(player);
      gameOver(); 
      console.log('dedz');

    } else {
      console.log('not dedz');
    }
  }
  function gameOver() {
    // game.rootScene.addEventListener(enchant.Event.TOUCH_END, function() {
    //   window.location.reload();
    // });
    var gameover = new Sprite(300,75);
    gameover.image = game.assets[GAME_ASSET.IMAGES.gameover];
    game.rootScene.addChild(gameover);
    game.stop();
    // alert('You dropped the bass m8. GAMEOVER');
  }


})();
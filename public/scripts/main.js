 
(function() {
  
  var STAGE_HEIGHT = 480;
  var STAGE_WIDTH = 640;
  var game;


  window.onload = function(){
  
    enchant();
    game = new Core(STAGE_WIDTH, STAGE_HEIGHT);
    game.fps = 60;
    preloadAssets();
    game.onload = gameInit;

    game.start();
    
  }
  function gameInit() {
    var player = new Sprite(290,290);

    player.image = game.assets['/assets/images/blah.jpg'];
    game.rootScene.addChild(player);
    console.log(player);
  }
  function preloadAssets() {
    game.preload('/assets/images/blah.jpg');
  }

})();
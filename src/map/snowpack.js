import Keyboard from 'pixi.js-keyboard';
import { 
  utils,
  Application,
  loader,
  Sprite,
} from "@/pixi/alias";

export function map() {

  // Verify exists support for WEBGL
  if(!utils.isWebGLSupported()){
    throw new Error("WEBGL is required!");
  }

  //Create a Pixi Application
  let app = new Application({ 
      width: window.innerWidth, 
      height: window.innerHeight,                       
      antialias: true, 
      transparent: false, 
      resolution: 1
    }
  );
  let stage = app.stage; // Simple alias
  
  // Resize window. Remove listener with not exists app
  window.addEventListener("resize", function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
  
  //Add the canvas that Pixi automatically created for you to the HTML document
  document.body.appendChild(app.view);
  
  // Loader for images/etc...
  loader.shared
    .add('snowpack', 'src/assets/images/snowpack.png')
    .add('pixijs', 'src/assets/images/pixi.png')
    .load(setup);
  
  //Define any variables that are used in more than one function
  let snowpack, other, state;
  
  function play(delta) {
    const speed = 2 * delta; // Speed default 2 + Deltatime
    
    // Keyboard
    if (Keyboard.isKeyDown('ArrowLeft', 'KeyA'))
      snowpack.x -= speed;
    if (Keyboard.isKeyDown('ArrowRight', 'KeyD'))
      snowpack.x += speed;
    
    if (Keyboard.isKeyDown('ArrowUp', 'KeyW'))
      snowpack.y -= speed;
    if (Keyboard.isKeyDown('ArrowDown', 'KeyS'))
      snowpack.y += speed;
  }
   
  function setup(loader, resources) {
  
    //Create referencial snowpack sprite
    other = new Sprite(resources.pixijs.texture);
    other.x = 100;
    other.y = 100;
    other.width = 60;
    other.height = 60;
    stage.addChild(other);

    //Create the snowpack sprite 
    snowpack = new Sprite(resources.snowpack.texture);
    snowpack.y = 96; 
    snowpack.width = 100;
    snowpack.height = 100;
    stage.addChild(snowpack);
  
    // Center initial player position
    stage.position.set(app.renderer.screen.width/2, app.renderer.screen.height/2);
  
    // Define runtime function
    state = play;
   
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
  }
  
  function gameLoop(delta){
  
    //Move the cat 1 pixel 
    state(delta);
  
    // Set fixed camera in player
    stage.pivot.set(snowpack.x, snowpack.y);
    
    Keyboard.update(); // Keyboard listener
  }
}

var mario,marioAnimation,marioCollided;
var ground,groundImage,invisibleGround;
var backGround,backGroundImg;
var obstacle,obAnimation,obstacleGroup;
var brick,brickImg,brickGroup;

var gameState="PLAY";
var score=0; 
var gameOver,gameOverImg,restart,restartImg;
var speed=-5;
var jumpSound,dieSound,checkPostSound;


function preload(){
  
  marioAnimation=loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  marioCollided=loadAnimation("collided.png");

  groundImage=loadImage("ground2.png");
  backGroundImg=loadImage("bg.png");
  
  obAnimation=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  brickImg=loadImage("brick.png");
  
  gameOverImg=loadImage("gameOver.png");
  resetImg=loadImage("restart.png");
  
  jumpSound=loadSound("jump.mp3");
  dieSound=loadSound("die.mp3");
  checkPostSound=loadSound("checkPoint.mp3");
  gameSound=loadSound("game.mp3");
}



function setup(){
  createCanvas(600,400);
  
  backGround=createSprite(300,200);
  backGround.addImage("bg",backGroundImg);
  backGround.scale=1.1;
  
  mario= createSprite(100,0);
  mario.addAnimation("m",marioAnimation);
  mario.scale=2.5;
  mario.setCollider("circle",0,0,10)
  
   invisibleGround=createSprite(300,390,600,120);
  invisibleGround.visible=false;
  
  ground=createSprite(300,380);
  ground.velocityX=speed;
  ground.addImage("g",groundImage);
  
  obstacleGroup=createGroup();
  brickGroup=createGroup();

   gameOver=createSprite(300,200);
   gameOver.addImage(gameOverImg);
     
  reset=createSprite(300,250);
  reset.addImage(resetImg);
    
}


function draw(){
  background(180);
 
  //Reseting the ground
  if(ground.x<0){
    ground.x=ground.width/2;
  }
  
  //Play State
    if(gameState==="PLAY"){
        
      
      
       //mario Jump
        if(keyDown("space")&&mario.y>100){
          mario.velocityY=-10;
          jumpSound.play();
        }
        //Gravity
        mario.velocityY=mario.velocityY+0.5;

    //Making clouds and obstacles
    spawnObstacles();
    spawnbricks();

      //Score
      if(mario.isTouching(brickGroup  )){
        score=score+1;
        for (i=0;i<brickGroup.length;i++){
          if(brickGroup[i].isTouching(mario)){
            brickGroup[i].destroy();
          }
        }

      }

      //Game over condition
      if(mario.isTouching(obstacleGroup)){
         gameState="END";
        dieSound.play();
      }

      gameOver.visible=false;
      reset.visible=false;
      mario.depth=mario.depth+5;

    }
  
  //End State
  if(gameState==="END"){ 
      
      mario.velocityY=0;    
      ground.velocityX=0;
      obstacleGroup.setVelocityXEach(0);
      brickGroup.setVelocityXEach(0);
    
  
      gameOver.visible=true;
      reset.visible=true;
      
     
      mario.addAnimation("m",marioCollided);
      obstacleGroup.setLifetimeEach(-1);
      brickGroup.setLifetimeEach(-1);
    
    
   if(mousePressedOver(reset)) {
      restart();
    }
    
  }
   mario.collide(invisibleGround);
  drawSprites();
  
  
  fill("black");
  text("SCORE:"+score,500,100);
}

function spawnbricks(){
  if(frameCount%50===0){
    brick=createSprite(600,Math.round(random(50,200)));
    brick.velocityX=speed  ;        
    brick.addImage("brick",brickImg);
    brick.lifetime=200;
    brick.addToGroup(brickGroup);
  }
}

function spawnObstacles(){
  
  if(frameCount%80===0){
   obstacle= createSprite(600,320);
    obstacle.addAnimation("opening",obAnimation);
    obstacle.velocityX=speed;
    obstacle.lifetime=200;
    obstacle.addToGroup(obstacleGroup);
}
 
}

function restart(){
  score=0;
  gameState="PLAY";
  
  obstacleGroup.destroyEach();
  brickGroup.destroyEach();
  
  ground.velocityX=speed;
  mario.addAnimation("m",marioAnimation);
  
}
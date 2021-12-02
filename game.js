var WIDTH = document.getElementById("mycanvas").width;
var HEIGHT = document.getElementById("mycanvas").height;
var context = document.getElementById("mycanvas").getContext('2d');
var canvas = document.getElementById("mycanvas");

class Player{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width,
        this.height=height,
        this.color=ShipColor
        this.turretWidth=10
        this.points=0;
        this.update();
      
        this.middle=(this.width-this.turretWidth)/2;

    }
    update(){
        this.body={x:this.x, y:this.y,width: this.width,height: this.height}
        this.middleSide={x:this.x+this.middle,y: this.y, width:this.turretWidth,height: this.height*2.2}
        this.leftSide={x:this.x,y: this.y,width: this.turretWidth,height: this.height*1.5}
        this.rigthSide={x:this.x+this.width-this.turretWidth,y: this.y,width: this.turretWidth,height: this.height*1.5}


        this.middleTurretX=this.x+this.width/2-1;
        this.middleTurretY=this.y+this.height*2-10;

        this.leftTurretX=this.x+this.middle-this.width/2+this.turretWidth/2+3;
        this.leftTurretY=this.y+this.height*1.5-10;

        this.rigthTurretX=this.x+this.middle+this.width/2+this.turretWidth/2-5;
        this.rigthTurretY=this.y+this.height*1.5-10;
        
    }
    draw(){       
        context.beginPath();
        context.rect(this.middleSide.x,this.middleSide.y,this.middleSide.width,this.middleSide.height);
        context.rect(this.rigthSide.x, this.rigthSide.y, this.rigthSide.width, this.rigthSide.height);
        context.rect(this.leftSide.x, this.leftSide.y, this.leftSide.width, this.leftSide.height);      
        context.fillStyle = this.color;
        context.fill();
        
    }
    moveLeft(units){
        this.x-=units;
    }
    moveRight(units){
        this.x+=units;
    }
    moveUp(units){
        this.y-=units;
    }
    moveDown(units){
        this.y+=units;
    }
    
}

class Bullet{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=3,
        this.height=17,
        this.color=BulletColor;
    }
    draw(){
        
        context.beginPath();      
        context.rect(this.x, this.y, this.width, this.height);
        context.fillStyle = this.color;
        context.fill();
    }
    update()
    {
        this.y+=5;

    }
}
class EnemyShooter{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=ShipColor;
        if(Math.random()*10%2==0){
            this.direction=true
        }

    }
    draw(){
        
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2);
        context.fillStyle=this.color;
        context.fill();
        context.closePath();
    }
    update(){
        if(this.direction){            
            if(this.x-this.radius<0)
                this.direction=false;
            else{
                this.x-=2;
            }
        }
        else{            
            if(this.x+this.radius>WIDTH)
                this.direction=true;
            else{
                this.x+=2;
            }
        }
        
    }


}

class EnemyBall{
    constructor(x,y,radius,angle,speed,health){
        this.x=x;
        this.y=y;
        this.angle=angle;
        this.speed=speed;
        this.radius=radius;
        this.isSpawned=false;
        this.health=health;
        this.MaxHealth=health;
        this.color=EnemyballColor;
    }
    draw(){
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2);
        context.fillStyle=this.color;
        context.fill();
        context.closePath();
    }
    update(){
        if(this.x-this.radius<0){
            this.angle=-180-this.angle;
        }
        else if(this.x+this.radius>WIDTH){
            this.angle=180-this.angle;
        }
        if(this.y-this.radius<0){
            this.angle=-360-this.angle;
        }
        else if(this.y+this.radius>HEIGHT && this.isSpawned){
            this.angle=360-this.angle;
        }
        this.x=(this.x+Math.cos(this.angle* (Math.PI/180))*this.speed);
        this.y=(this.y+Math.sin(-this.angle* (Math.PI/180))*this.speed);
        if(this.health>7)
            this.radius=this.health;
    }
}


var gameIsRunning=false;
var moveLeft=false;
var moveRight=false;
var moveUp=false;
var moveDown=false;


const pWidth=40;
const ShipColor="#eb1346";

const EnemyballColor="#0095BD";
const BulletColor="#e31445";

const AbilityAtEvery=100
const AbilityDuration=4
const EnemyInitialShootSpeed=1300;
const SpeedUpMultiplier=3.5;

var Bullets=new Array();
var EnemyBalls=new Array();

var AutoShoot=false;

var enemyShooter = new EnemyShooter(WIDTH/2,HEIGHT+50,100);
var player=new Player((WIDTH-pWidth)/2,10,pWidth,20);

var SpecialAbilityReady=false;

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if(!gameIsRunning){
        player=new Player((WIDTH-pWidth)/2,10,pWidth,20);
        Bullets=new Array();
        EnemyBalls=new Array();
        PointsGoal=AbilityAtEvery;
        
        context.strokeStyle="#FFFFFF"
        context.font = "30px Arial";
        SpecialAbilityReady=false;
        context.strokeText("Hello!", 310,HEIGHT/2);
        context.strokeText("Press X To Start!", 230,HEIGHT/2+30);
        return
    }
    for(var i=0;i<Bullets.length;i++){
        Bullets[i].draw();
        Bullets[i].update();
        if(Bullets[i].y>HEIGHT){
            Bullets.splice(i, 1);
        }
    }
    
    player.draw();
    player.update();
    for(var i=0;i<EnemyBalls.length;i++){
        EnemyBalls[i].draw();
        EnemyBalls[i].update();
        if(!EnemyBalls[i].isSpawned && EnemyBalls[i].y+EnemyBalls[i].radius<HEIGHT)
        {
            EnemyBalls[i].isSpawned=true;
        }
    }
    checkHitBalls();
    checkPlayerHit();
    
    if(!gameIsRunning){
        return;
    }

    enemyShooter.draw();
    enemyShooter.update();
    context.closePath();
    if(moveLeft && player.x>0)
        player.moveLeft(3)
    if(moveRight && player.x+player.width<WIDTH)
        player.moveRight(3)

    if(moveUp && player.y>0)
        player.moveUp(3)
    if(moveDown && player.middleTurretY+20<HEIGHT)
        player.moveDown(3)
}


var PointsGoal=AbilityAtEvery;
function checkHitBalls(){
    Bullets.forEach(bullet => {
        EnemyBalls.forEach(ball=>{
            if(Colliding(ball,bullet) && ball.isSpawned){
                ball.health-=8;
                Bullets.splice(Bullets.indexOf(bullet),1);
                if(ball.health<=0){
                    EnemyBalls.splice(EnemyBalls.indexOf(ball),1);
                    var pointsToGain=Math.floor(ball.MaxHealth/10);
                    if(spointsToGain=0)
                        pointsToGain++;
                    player.points+=pointsToGain;

                    if(player.points<150){
                        clearInterval(enemyShootInterval);
                        enemyShootInterval=setInterval(enemyShoot,EnemyInitialShootSpeed-(SpeedUpMultiplier*player.points))
                    }
                    if(player.points>=PointsGoal){
                        PointsGoal+=AbilityAtEvery;
                        SpecialAbilityReady=true;
                    }
                }
                updatePoints();
            }
        })
    });
}

function checkPlayerHit(){
    EnemyBalls.forEach(ball => {
        if(Colliding(ball,player.middleSide)||Colliding(ball,player.leftSide||
           Colliding(ball,player.rigthSide))){
               gameIsRunning=false;
            }
    });
}

function enemyShoot(){
    if(gameIsRunning){
        var RandomAngle=Math.random()*1000%120+30;
        var RandomSize=Math.random()*1000%60+7;
        var enemyBall=new EnemyBall(enemyShooter.x,enemyShooter.y-50,RandomSize,RandomAngle,70/RandomSize,RandomSize);
        EnemyBalls.push(enemyBall);
    }
}


var previousTime=null;
var delay=250;
var shootIntervalID;
document.onkeydown = function(event) {
	if (event.keyCode == 65) 
		moveLeft=true;		
    else if ( event.keyCode==68)
        moveRight=true;	
    else if (event.keyCode==87)
        moveUp=true;
    else if (event.keyCode==83)
        moveDown=true ;
    else if(event.keyCode==32 && SpecialAbilityReady){
        SpecialAbilityReady=false;
        delay=20;
        var startTime = new Date().getTime();
        var interval = setInterval(function(){
            if(new Date().getTime() - startTime > AbilityDuration*1000 || !gameIsRunning){
                clearInterval(interval);
                return;
            }
            
            Shoot();
        }, delay); 
        delay=250;
    }
    else if (event.keyCode==81 && gameIsRunning){
        
        if(!AutoShoot){
            shootIntervalID=setInterval(Shoot,delay);
        }
        else{
            clearInterval(shootIntervalID);
        }
        AutoShoot=!AutoShoot;                
    }
    else if(!gameIsRunning&&event.keyCode==88){
        gameIsRunning=true;
        player.points=0;
        updatePoints();
    }
    else if(event.keyCode==75 &&gameIsRunning && !AutoShoot){
        if(performance.now()-previousTime<delay && previousTime!=null){
            return;
        }
        Shoot();
        previousTime=performance.now();
    }
}
canvas.onmousedown=function(event){
    if((performance.now()-previousTime<delay && previousTime!=null)||!gameIsRunning||AutoShoot){
        return;
    }   
    Shoot();
    previousTime=performance.now();   
}

document.onkeyup=function(event){
    if (event.keyCode == 65) 
        moveLeft=false;		
    else if (event.keyCode==68)
        moveRight=false;
    else if (event.keyCode==87)
        moveUp=false;
    else if (event.keyCode==83)
        moveDown=false; 
}


function Shoot(){
    var b1=new Bullet(player.leftTurretX,player.leftTurretY);
    var b2=new Bullet(player.rigthTurretX,player.rigthTurretY);
    var b3=new Bullet(player.middleTurretX,player.middleTurretY);
    Bullets.push(b3,b2,b1);
}


function Colliding(circle ,rect){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

var pointsDisplay=document.getElementById("pointsDisplay")
function updatePoints(){
    pointsDisplay.innerText="Points : "+player.points;
}


setInterval(draw, 10);
var enemyShootInterval=setInterval(enemyShoot, 1300);


var canvas,ctx;

var CARRE=5;
var FRAME_PER_SECOND=60;
var VITESSE_VAISSEAU=3;
var VITESSE_ALIEN=1;
var VITESSE_BULLET=30;
var MAX_FREQ_SHOT=15;
var aliens = [];
var shoot_frame_count=0;
var vaisseau;
var alienConstructors=[];


var points = 0;
var bullet=[];
var keyPressed=[];

var sens = 1;
var inc_done = false;

const STATE = {
    PAUSE: 'pause',
    PLAY: 'play',
    WIN: 'win',
    LOST: 'lost'
}
var game_state = STATE.PLAY;


function random_color(){
	let choices = ['red', 'purple', 'grey', 'teal', 'lightblue', 'gold', 'goldenrod', 'green', 'LightCoral', 'LightSkyBlue', 'PaleVioletRed'];
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function Bullet(x,y,color){
	this.x=x;
	this.y=y;
	this.color=color;
	this.collide=false;
	this.move=function(){
		this.y-=VITESSE_BULLET;
		if ( this.y < 0 ){
			this.collide = true;
		}
	}

	this.render=function(ctx){
		if (this.collide){
			return;
		}
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.fillRect(this.x,this.y,CARRE,2*CARRE);
		ctx.closePath();
	}
	this.destroy=function(){
		this.collide=true;
	}
}


function inc_all_aliens_y(){
	if (!inc_done){
		for(let z in aliens){
			for (let i in aliens[z]){
				aliens[z][i].update_y();
			}
		}
		inc_done = true;
	}
}

function Alien(x,y,color){
	this.x=x;
	this.y=y;
	this.color=color;
	var _width=15;
	this.killed=false;
	this.points = 20;
	this.render=function(ctx){
		if (this.killed){
			return;
		}
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.fillRect((this.x-1)*CARRE,(this.y-4)*CARRE,3*CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y-3)*CARRE,7*CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y-2)*CARRE,9*CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y-1)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x)*CARRE,(this.y-1)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+3)*CARRE,(this.y-1)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y)*CARRE,9*CARRE,CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y+1)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x+1)*CARRE,(this.y+1)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x)*CARRE,(this.y+2)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y+2)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y+2)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y+3)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+4)*CARRE,(this.y+3)*CARRE,CARRE,CARRE);

		ctx.closePath();
	}


	this.getWidth=function(){
		return _width;
	}
	this.verifyCollide=function(){
		if(this.killed){
			return;
		}
		for (let i in bullet){
			if (bullet.hasOwnProperty(i)){
				if (this.testCollide(bullet[i])){
					bullet.splice(i,1);
					this.killed=true;
					points += this.points;
				}
			}
		}
	}
	this.testCollide=function(bullet){
		let ny=(this.y+3)*CARRE;
		if (bullet.y < ny){
			if (bullet.x > (this.x-4)*CARRE && bullet.x < (this.x+5)*CARRE){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	this.changecolor=function(color){
		this.color=color;
	}

	this.update_y=function(){
		this.y+=1;
	}
	this.move=function(){
		this.x += sens;
		if (this.x >= ((canvas.width/CARRE)-4) || this.x <= 4){
			sens = sens * -1;
			this.x += sens;
			inc_all_aliens_y();
		}
	}
}

function Alien1(x,y,color){
	this.x=x;
	this.y=y;
	this.color=color;
	this.killed=false;
	var _width=15;
	this.points = 15;
	this.render=function(ctx){
		if (this.killed){
			return;
		}
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.fillRect((this.x-3)*CARRE,(this.y-4)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+3)*CARRE,(this.y-4)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y-3)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y-3)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y-2)*CARRE,7*CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y-1)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x-1)*CARRE,(this.y-1)*CARRE,3*CARRE,CARRE);
		ctx.fillRect((this.x+3)*CARRE,(this.y-1)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x-5)*CARRE,this.y*CARRE,11*CARRE,CARRE);
		ctx.fillRect((this.x-5)*CARRE,(this.y+1)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x+5)*CARRE,(this.y+1)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y+1)*CARRE,7*CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y+2)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+3)*CARRE,(this.y+2)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y+3)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x+1)*CARRE,(this.y+3)*CARRE,2*CARRE,CARRE);

		ctx.closePath();
	}
	this.getWidth=function(){
		return _width;
	}
	this.verifyCollide=function(){
		if(this.killed){
			return;
		}
		for (let i in bullet){
			if (bullet.hasOwnProperty(i)){
				if (this.testCollide(bullet[i])) {
					bullet.splice(i,1);
					this.killed=true;
					points +=this.points;
				}
			}
		}
	}

	this.update_y=function(){
		this.y+=1;
	}
	this.testCollide=function(bullet){
		let ny=(this.y+3)*CARRE;
		if (bullet.y < ny){
			if (bullet.x > (this.x-5)*CARRE && bullet.x < (this.x+6)*CARRE){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	this.changecolor=function(color){
		this.color=color;
	}
	this.move=function(){
		this.x += sens;
		if (this.x >= ((canvas.width/CARRE)-4) || this.x <= 4){
			sens = sens * -1;
			this.x += sens;
			inc_all_aliens_y();
		}
	}
}
function Alien2(x,y,color){
	this.x=x;
	this.y=y;
	this.color=color;
	this.killed=false;
	var _width=15;
	this.points = 10;
	this.render=function(ctx){
		if (this.killed){
			return;
		}
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.fillRect((this.x-1)*CARRE,(this.y-3)*CARRE,3*CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y-2)*CARRE,7*CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y-1)*CARRE,9*CARRE,CARRE);
		ctx.fillRect((this.x-5)*CARRE,(this.y)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x-6)*CARRE,(this.y+1)*CARRE,13*CARRE,CARRE);
		ctx.fillRect((this.x+4)*CARRE,(this.y)*CARRE,2*CARRE,CARRE);
		ctx.fillRect((this.x)*CARRE,(this.y)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y+2)*CARRE,3*CARRE,CARRE);
		ctx.fillRect((this.x)*CARRE,(this.y+2)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y+2)*CARRE,3*CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y+3)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+3)*CARRE,(this.y+3)*CARRE,CARRE,CARRE);

		ctx.closePath();
	}

	this.update_y=function(){
		this.y+=1;
	}
	this.getWidth=function(){
		return _width;
	}
	this.verifyCollide=function(){
		if (this.killed){
			return;
		}
		for (let i in bullet){
			if (bullet.hasOwnProperty(i)){
				if (this.testCollide(bullet[i])){
					bullet.splice(i,1);
					this.killed=true;
					points += this.points;
				}
			}
		}
	}
	this.testCollide=function(bullet){
		let ny=(this.y+3)*CARRE;
		if (bullet.y < ny){
			if (bullet.x >= (this.x-6)*CARRE && bullet.x <= (this.x+7)*CARRE){
				bullet.destroy();
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	this.changecolor=function(color){
		this.color=color;
	}
	this.move=function(){
		this.x += sens;
		if (this.x >= ((canvas.width/CARRE)-4) || this.x <= 4){
			sens = sens * -1;
			this.x += sens;
			inc_all_aliens_y();
		}
	}
}

function Vaisseau(x,y,color){
	this.x=x;
	this.y=y;
	this.render=function(ctx){
		ctx.beginPath();
		ctx.fillStyle="#fff";
		ctx.fillRect((this.x-5)*CARRE,(this.y)*CARRE,CARRE,5*CARRE);
		ctx.fillRect((this.x-4)*CARRE,(this.y+2)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y-3)*CARRE,CARRE,6*CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y-1)*CARRE,CARRE,5*CARRE);
		ctx.fillRect((this.x-1)*CARRE,(this.y-3)*CARRE,CARRE,7*CARRE);
		ctx.fillRect((this.x)*CARRE,(this.y-6)*CARRE,CARRE,11*CARRE);
		ctx.fillRect((this.x+1)*CARRE,(this.y-3)*CARRE,CARRE,7*CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y-1)*CARRE,CARRE,5*CARRE);
		ctx.fillRect((this.x+3)*CARRE,(this.y-3)*CARRE,CARRE,6*CARRE);
		ctx.fillRect((this.x+4)*CARRE,(this.y+2)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x+5)*CARRE,(this.y)*CARRE,CARRE,5*CARRE);

		ctx.fillStyle="#f00";
		ctx.fillRect((this.x-5)*CARRE,(this.y)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-3)*CARRE,(this.y-3)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y+3)*CARRE,2*CARRE,CARRE)
		ctx.fillRect((this.x-1)*CARRE,(this.y)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x)*CARRE,(this.y-1)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x+1)*CARRE,(this.y)*CARRE,CARRE,2*CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y+3)*CARRE,2*CARRE,CARRE)
		ctx.fillRect((this.x+3)*CARRE,(this.y-3)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+5)*CARRE,(this.y)*CARRE,CARRE,CARRE);

		ctx.fillStyle="#00f";
		ctx.fillRect((this.x-3)*CARRE,this.y*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x-2)*CARRE,(this.y-1)*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+3)*CARRE,this.y*CARRE,CARRE,CARRE);
		ctx.fillRect((this.x+2)*CARRE,(this.y-1)*CARRE,CARRE,CARRE);
		ctx.closePath();
	}
	this.move=function(x){
		let nx=this.x+x;
		if (nx < 5 || nx >= (canvas.width/CARRE)-5){
			nx=this.x;
		}
		this.x=nx;
	}

	this.shoot=function(){
		if (shoot_frame_count === 1){
			bullet.push(new Bullet((this.x)*CARRE,(this.y-7)*CARRE,"#f00"));
		}
	}
}
function init() {
	canvas = document.getElementById('toile');
	ctx = this.canvas.getContext('2d');
	canvas.width = document.body.clientWidth;

	alienConstructors.push(Alien);
	alienConstructors.push(Alien1);
	alienConstructors.push(Alien2);
	let bottom=parseInt(canvas.height/CARRE);
	aliens=[];
	let inute;
	for (let k in alienConstructors) {
		inute=new alienConstructors[k](0,0,"#000").getWidth();
		let taille_alien=parseInt(canvas.width/(CARRE*(inute+1)+5));
		let tmp=[];
		for (let j = 0; j<taille_alien; j++){
			tmp.push(new alienConstructors[k](inute+ (j * inute), (10 * (k))+10, random_color()));
		}
		aliens.push(tmp);
	}
	//Bindings key
	vaisseau=new Vaisseau(canvas.width/(2*CARRE),bottom-5);
}

function handleInputUser(){
	console.log("User input");
	shoot_frame_count=(shoot_frame_count+ 1)% MAX_FREQ_SHOT;
	//Escape
	if(keyPressed[27]) {
		if (game_state == STATE.PLAY){
			game_state = STATE.PAUSE;
		}else{
			if (game_state == STATE.PAUSE){
				game_state = STATE.PLAY;
			}
		}
		return;
	}
	if (game_state == STATE.PLAY){
		//Gauche
		if (keyPressed[37]) {
			vaisseau.move(-VITESSE_VAISSEAU);
		}
		//Up
		if(keyPressed[38]) {

		}
		// Right
		if(keyPressed[39]) {
			vaisseau.move(VITESSE_VAISSEAU);
		}
		//Bottom
		if(keyPressed[40]) {

		}

		//Enter
		if(keyPressed[13]) {

		}
		//Space
		if(keyPressed[32]) {
			vaisseau.shoot();
		}else{
			shoot_frame_count=0;
		}
	}
}

function update(){
	handleInputUser();
	if (game_state == STATE.PLAY){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		inc_done = false;
		/* Render aliens */
		for (let z in aliens){
			if (aliens.hasOwnProperty(z)){
			aliens[z] = aliens[z].filter(alien => ! alien.killed );
				for (let k in aliens[z]){
					if (aliens[z].hasOwnProperty(k)){
						aliens[z][k].move();
						aliens[z][k].verifyCollide();
						aliens[z][k].render(ctx);
					}
				}
			}
		}
		// Render Ship
		vaisseau.render(ctx);
		for (let z in bullet){
			if (bullet.hasOwnProperty(z)){
				bullet[z].move();
				bullet[z].render(ctx);
			}
		}
	
		bullet = bullet.filter( bullet => ! bullet.collide);
		// Render bullet
	}
	setTimeout(update, 1000/FRAME_PER_SECOND);
}

(function(){
	init();

   document.addEventListener('keydown',function(e){
	   keyPressed[e.keyCode]=true;
   });
	document.addEventListener('keyup',function(e){
		keyPressed[e.keyCode]=false;
	});
	vaisseau.render(ctx);

	window.requestAnimationFrame(update);
})();


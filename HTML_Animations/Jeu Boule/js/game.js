var c=document.getElementById('canvas');
var ctx = c.getContext('2d');

var width=c.width=400;
var height=c.height=400;
var tabBall=[];
var color=['blue','red','purple','green','yellow','#0FC'];
var nbBoule=20;
var bouleR=10;
var facteur=3;
var game;
var isClicked=false;
var countOk=0;
var countSeuil=Math.floor(nbBoule*0.70);
var timer=2500; //ms

var resultat=[];
function random(min, max){
	var num=Math.floor(Math.random() * (max - min +1)) + min;
	
	return (num==0) ? random(min,max):num;
}

function Boule(x,y,vx,vy,r,couleur,isStop){
	// Positions & vitesses
	this.x=x;
	this.y=y;
	this.vx=vx;
	this.vy=vy;

	// Rayon
	this.r=r;

	//Couleur
	this.color=couleur;
	this.isStop=isStop;
}
// Obj
Boule.prototype={
	move : function(){
		var tmpX=this.x+this.vx;
		var tmpY=this.y+this.vy;
		if ((tmpX-this.r<=0) || (tmpX+this.r>=c.width)){
			this.vx*=-1;
		}
		if ((tmpY-this.r<=0) || (tmpY+this.r>=c.height)){
			this.vy*=-1;
		}
		this.collision();
		this.x+=this.vx;
		this.y+=this.vy;
	},
	draw :function(){
		ctx.beginPath();
		ctx.fillStyle=this.color;
		ctx.arc(this.x ,this.y ,this.r ,0 , 2*Math.PI);
		ctx.fill();	
	},
	gros : function(){
		this.vx=0;
		this.vy=0;
		this.r=facteur*bouleR;
		this.isStop=true;
		countOk+=1;
		this.setStop();
	},setStop: function(){
		removeBoule(this);
	},
	collision : function(){
		for (var i=0;i<tabBall.length;i++){
			if (!(this === tabBall[i])){
				var dx=Math.abs(this.x - tabBall[i].x);
				var dy=Math.abs(this.y - tabBall[i].y);
				var distance=Math.sqrt(dx*dx + dy*dy);
				if (distance<=this.r + tabBall[i].r ){
					if ((tabBall[i].isStop) && !(this.isStop)){
						this.gros();
					}
				}
			}
		}
	}
};
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
//var reference=new Boule(c.width*0.5,c.height*0.5,0,0,bouleR*2,'grey',true);
//tabBall.push(reference);
c.addEventListener('click',function(event){
	var pos=getMousePos(c,event);
	if (!isClicked){
		var ref=new Boule(pos.x,pos.y,0,0,facteur*bouleR,'grey',true);
		tabBall.push(ref);
		removeBoule(ref);
		isClicked=true;
	}
},false);
function init(){
	$('#param').append("<p> Nombre boules "+nbBoule+".</p>");
	$('#param').append("<p> Seuil "+countSeuil+".</p>");
	for (var i=0;i<nbBoule;i++){
		tabBall.push(new Boule(random(bouleR,c.width-bouleR),random(bouleR,c.height-bouleR),random(-4,4),random(-4,4),bouleR,color[random(0,color.length)],false));
	}
	game=setInterval(play,35);
}


function removeBoule(obj){
	setTimeout(function(){
		for (var i=0;i<tabBall.length;i++){
			if (obj === tabBall[i]){
				tabBall.splice(i,1);
			}
		}
	},timer);
}
function play(){
	var isStoped=true;
	ctx.clearRect(0,0,c.width,c.height);	
	for (var i=0;i<tabBall.length;i++){
		tabBall[i].move();
		tabBall[i].collision();
		tabBall[i].draw();
		if (tabBall[i].isStop || !isClicked){
			isStoped&=false;
		}
	}
	if(isStoped){
		Stop();
	}
}

function Stop(){
	clearInterval(game);
	var msg="";
	if (countOk>=countSeuil){
		msg="Vous avez gagné";
	}else{
		msg="Perdu...";
	}
	$('#result').append("<h1>"+msg+"</h1>");
}


function reload(){
	window.location=window.location;
}
init();

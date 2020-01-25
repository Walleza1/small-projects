var canvas,ctx;
var carre_size_px,grid;
var FRAME_PER_SECOND=15;
var INITIAL_SNAKE_SIZE=4;
function Case(x,y,carre_size){
    this.x=x;
    this.y=y;
    this.carre_size=carre_size;
    this.render=function(ctx,type){
        ctx.beginPath();
        if (type=="tete"){
            ctx.fillStyle="#f00";
        }else{
            if (type=="normal"){
                ctx.fillStyle="#000";
            }
            if (type=="bonus"){
                ctx.fillStyle="#00f";
            }
        }
        ctx.fillRect(this.x*this.carre_size,this.y*this.carre_size,this.carre_size,this.carre_size);
        ctx.closePath();
    }
}
function Snake(x,y,size,carre_size,box_width,box_height){
    this.x=x;
    this.y=y;
    this.direction=1;
    this.size=size;
    this.carre_size=carre_size;
    this.score=0;
    this.path=[];
    this.pause=false;
    this.perdu=false;
    this.bonus=undefined;
    let nx,ny;
    // Remplissage bonus
    nx=Math.floor(Math.random() * box_width);
    ny=Math.floor(Math.random() * box_height);
    this.bonus=new Case(nx,ny,this.carre_size);
    // Remplissage path

    for (let i=0;i<size;i++){
        nx=(this.x)-i;
        this.path[i]=new Case(nx,this.y,this.carre_size);
    }

    this.move=function(){
        if (this.pause){
            return;
        }
        let nx,ny;
        switch(this.direction){
            case 0:
                ny=(this.y)-1;
                nx=this.x;
                break;
            case 1:
                nx=(this.x)+1;
                ny=(this.y);
                break;
            case 2:
                ny=(this.y)+1;
                nx=this.x;
                break;
            case 3:
                ny=(this.y);
                nx=(this.x)-1;
                break;
            default:
                break;
        }

        this.x=nx;
        this.y=ny;
        if (nx < 0 || nx >= box_width || ny < 0 || ny >= box_height || this.is_in_snake(nx,ny)){
            this.loose();
        }
        this.path.unshift(new Case(nx,ny,this.carre_size));
        let moving=false;
        if (typeof this.bonus != 'undefined'){
            if (this.x == this.bonus.x && this.y == this.bonus.y){
                moving=false;
                nx=Math.floor(Math.random() * box_width);
                ny=Math.floor(Math.random() * box_height);
                this.bonus=new Case(nx,ny,this.carre_size);
            }else{
                moving=true;
            }
        }else{
            moving=true;
        }
        if (moving){
            this.path.splice(-1,1);
        }
        this.size=this.path.length;
        this.score=(this.size-INITIAL_SNAKE_SIZE)*20;
    }
    this.render=function(ctx){
        if (this.perdu){
            ctx.font = "30px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("Perdu",canvas.width/2,(canvas.height/2)-30);
            ctx.fillText("Score "+this.score,canvas.width/2,canvas.height/2);
            ctx.fillText("Appuyez sur R pour rejouer",canvas.width/2,(canvas.height/2)+30);
            return;
        }
        let tete="tete";
        for (let i in this.path){
            this.path[i].render(ctx,tete);
            tete="normal";
        }
        if (typeof this.bonus != 'undefined'){
            this.bonus.render(ctx,"bonus");
        }
        ctx.strokeRect(0,0,canvas.width,canvas.height);
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score "+this.score,15,15);
    }
    this.changeDirection=function(int){
        this.direction=int;
    }
    this.loose=function(){
        this.pause=true;
        this.perdu=true;
    }
    this.is_in_snake=function(x,y){
        for (let i in this.path){
            if (this.path[i].x == x && this.path[i].y == y){
                return true;
            }
        }
        return false;
    }
}
function init(){
    canvas=document.getElementById('toile');
    ctx=canvas.getContext('2d');
    carre_size_px=10;
    canvas.width=document.body.clientWidth;
    grid=new Snake(5,5,INITIAL_SNAKE_SIZE,carre_size_px,canvas.width/carre_size_px,canvas.height/carre_size_px);
}

function move(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    grid.move();
    grid.render(ctx);
    setTimeout(function() {
        window.requestAnimationFrame(move);
    },1000/FRAME_PER_SECOND);
}

(function(){
    document.addEventListener('keydown',function(e){
        if (typeof grid != 'undefined'){
            if (e.keyCode == 32){
                grid.pause = !grid.pause;
            }
            if (e.keyCode == 38){
                if (grid.direction != 2){
                    grid.changeDirection(0);
                }
            }
            if (e.keyCode == 39){
                if (grid.direction != 3) {
                    grid.changeDirection(1);
                }
            }
            if (e.keyCode == 40){
                if (grid.direction != 0) {
                    grid.changeDirection(2);
                }
            }
            if (e.keyCode == 37){
                if (grid.direction != 1) {
                    grid.changeDirection(3);
                }
            }
            if (e.keyCode == 82){
                grid=new Snake(5,5,INITIAL_SNAKE_SIZE,carre_size_px,canvas.width/carre_size_px,canvas.height/carre_size_px);
            }
        }
    });
    init();
    window.requestAnimationFrame(move);
})();

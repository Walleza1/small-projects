var canvas,ctx;
var carre_size_px,fenetre_height,grid;
function Ant(x,y,carre_size){
    this.x=parseInt(x);
    this.y=parseInt(y);
    this.rayon=(carre_size/2);
    this.direction=0;
    this.render=function(ctx){
        ctx.beginPath();
        ctx.arc((this.x*2*this.rayon)+this.rayon,(this.y*2*this.rayon)+this.rayon,this.rayon,0,2*Math.PI,false);
        ctx.fillStyle="#f00";
        ctx.fill();
        ctx.closePath();
    }
}
function Grid(x_width,y_width,carre_size){
    this.width=parseInt(x_width);
    this.height=parseInt(y_width);
    this.carre_size=carre_size;
    this.iteration=0;
    this.pause=false;
    this.ant=new Ant(this.width/2,this.height/2,this.carre_size);
    this.tableau=[];
    for (let k=0;k<this.width;k++){
        let tab=[];
        for (let j=0;j<this.height;j++){
            tab.push(0);
        }
        this.tableau.push(tab);
    }
    this.render=function(ctx){
        for (let colonne in this.tableau){
            for (let ligne in this.tableau[colonne]){
                ctx.beginPath();
                // Si case = 1
                if (this.tableau[colonne][ligne]){
                    ctx.fillStyle="#000";
                }else{ // si case = 0
                    ctx.fillStyle="#fff";
                }
                ctx.fillRect(colonne*this.carre_size,ligne*this.carre_size,this.carre_size,this.carre_size);
                ctx.closePath();
            }
        }
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Iteration "+this.iteration,30,30);
        this.ant.render(ctx);
    }
    this.move=function(){
        if (this.pause){
            return;
        }
        let x;
        let y;
        // Si case = 1
        if (this.tableau[this.ant.x][this.ant.y]){
            // A Gauche
            switch (this.ant.direction) {
                case 0:
                    x=this.ant.x-1;
                    y=this.ant.y;
                    break;
                case 1:
                    y=this.ant.y-1;
                    x=this.ant.x;
                    break;
                case 2:
                    x=this.ant.x+1;
                    y=this.ant.y;
                    break;
                case 3:
                    y=this.ant.y+1;
                    x=this.ant.x;
                    break;
                default:
                    break;
            }
            if (x < 0 ){x = 0;}
            if (y < 0){y=0;}
            if (x>=this.tableau.length){x=this.tableau.length-1;}
            if (y>=this.tableau[x].length){y=this.tableau[x].length-1;}

            this.tableau[this.ant.x][this.ant.y] = !this.tableau[this.ant.x][this.ant.y];

            this.ant.x=x;
            this.ant.y=y;
            this.ant.direction =((this.ant.direction - 1)+4) % 4;
        }else{ // Si case = 0
            // A droite
            switch (this.ant.direction) {
                case 0:
                    x=this.ant.x+1;
                    y=this.ant.y;
                    break;
                case 1:
                    y=this.ant.y+1;
                    x=this.ant.x;
                    break;
                case 2:
                    x=this.ant.x-1;
                    y=this.ant.y;
                    break;
                case 3:
                    y=this.ant.y-1;
                    x=this.ant.x;
                    break;
                default:
                    break;
            }
            if (x < 0 ) {x = 1;}
            if (y < 0){y=1;}
            if (x>=this.tableau.length){x=this.tableau.length-2;}
            if (y>=this.tableau[x].length){y=this.tableau[x].length-2;}

            this.tableau[this.ant.x][this.ant.y] = !this.tableau[this.ant.x][this.ant.y];

            this.ant.x=x;
            this.ant.y=y;
            this.ant.direction =((this.ant.direction + 1)+4) % 4;
        }
        this.iteration+=1;
    }
}
function init(){
    canvas=document.getElementById('toile');
    ctx=canvas.getContext('2d');
    carre_size_px=10;
    canvas.width=document.body.clientWidth;
    grid=new Grid(canvas.width/carre_size_px,canvas.height/carre_size_px,carre_size_px);
}
function move(){
    grid.move();
    grid.render(ctx);
    window.requestAnimationFrame(move);
}

(function(){
    document.addEventListener('keydown',function(e){
        if (typeof grid != 'undefined'){
            if (e.keyCode == 32){
                grid.pause = !grid.pause;
            }
        }
    });
    init();
    window.requestAnimationFrame(move);
})();
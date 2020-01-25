var CHANCE_VIVANT=0.10;
var CARRE=10;
var canvas,ctx;
var carre_size_px,grid;

function Case(etat){
    this.etat=etat;
    this.showEtat=function(){
        if (this.etat==0){
            console.log("mort");
        }else{
            console.log("vivant");
        }
    }
    this.is_vivant=function(){
        if (this.etat==0){
            return false;
        }else{
            return true;
        }
    }
    this.revive=function(){
        this.etat=1;
    }
    this.kill=function(){
        this.etat=0;
    }
}
function Grid(x_width,y_width,carre_size){
    this.width=parseInt(x_width);
    this.height=parseInt(y_width);
    this.carre_size=carre_size;
    this.iteration=0;
    this.pause=false;
    this.tableau=[];
    for(var i = 0; i <this.width ; i++) {
        this.tableau.push(new Array(this.height).fill(0))
    }
    for (let k=0;k<this.tableau.length;k++){
        for (let j=0;j<this.tableau[k].length;j++){
            if(Math.random() <= CHANCE_VIVANT){
                this.tableau[k][j]=new Case(1);
            }else{
                this.tableau[k][j]=new Case(0);
            }
        }
    }

    this.render=function(ctx){
        for (let colonne in this.tableau){
            for (let ligne in this.tableau[colonne]){
                ctx.beginPath();
                // Si case = 1
                if (this.tableau[colonne][ligne].is_vivant()){
                    ctx.fillStyle="#888";
                }else{ // si case = 0
                    ctx.fillStyle="#fff";
                }
                ctx.rect(colonne*this.carre_size,ligne*this.carre_size,this.carre_size,this.carre_size);
                ctx.fill();
                ctx.StrokeStyle="#000";
                ctx.stroke();
                ctx.closePath();
            }
        }
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Iteration "+this.iteration,30,30);
    }
    this.update=function(){
        if (this.pause){
            return;
        }
        let nb_voisins;
        for (let colonne in this.tableau){
            for (let ligne in this.tableau[colonne]) {
                nb_voisins=this.getVoisinAlive(colonne,ligne);

                if ((!this.tableau[colonne][ligne].is_vivant()) && nb_voisins === 3){
                    this.tableau[colonne][ligne].revive();
                }else{
                    if (this.tableau[colonne][ligne].is_vivant()) {
                        if (nb_voisins < 2 || nb_voisins > 3) {
                            this.tableau[colonne][ligne].kill();
                        }else{
                            this.tableau[colonne][ligne].revive();
                        }
                    }
                }
            }
        }
        this.iteration+=1;
    }
    this.is_in=function(x,y){
        if (x < 0 || x >= this.tableau.length || y < 0 || y >= this.tableau[0].length){
            return false;
        }
        return true;
    }
    this.getVoisinAlive=function(x,y){
        var nb=0;
        var x_in,y_in;
        var tab_voisin=[];
        x_in=parseInt(x)-1;
        y_in=parseInt(y)-1;
        if (this.is_in(x_in,y_in)){
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x)-1;
        y_in=parseInt(y);
        if (this.is_in(x_in,y_in)){
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x)-1;
        y_in=parseInt(y)+1;
        if (this.is_in(x_in,y_in)){
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x);
        y_in=parseInt(y)+1;
        if (this.is_in(x_in,y_in)) {
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x)+1;
        y_in=parseInt(y)+1;
        if (this.is_in(x_in,y_in)) {
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x)+1;
        y_in=parseInt(y);
        if (this.is_in(x_in,y_in)) {
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x)+1;
        y_in=parseInt(y)-1;
        if (this.is_in(x_in,y_in)) {
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        x_in=parseInt(x);
        y_in=parseInt(y)-1;
        if (this.is_in(x_in,y_in)) {
            if (this.tableau[x_in][y_in].is_vivant()){
                nb += 1;
                tab_voisin.push([x_in,y_in]);
            }
        }
        return nb;
    }
}
function init(){
    canvas=document.getElementById('toile');
    ctx=canvas.getContext('2d');
    carre_size_px=CARRE;
    canvas.width=document.body.clientWidth;
    grid=new Grid(canvas.width/carre_size_px,canvas.height/carre_size_px,carre_size_px);
}
function move(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    grid.update();
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
    grid.render(ctx);
    window.requestAnimationFrame(move);
})();

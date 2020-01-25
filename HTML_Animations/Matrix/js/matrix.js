var c=document.getElementById('canvas'),
ctx = c.getContext('2d');

// Taille
c.height=window.innerHeight;
c.width=window.innerWidth;

// Variables
var font_size=10;
var colonne=c.width / font_size;

var matrix="10";
var drops=[];

var actif=1;

document.addEventListener('keydown', function(event){
	if(event.keyCode==27){
		actif=(actif==1) ? 0:1;
		console.log("Toggle");
	}
});

// init
for (var x = 0; x<colonne;x++){
	drops[x]=1;
}

function draw(){
	if(actif ==1){
		//Black BG for the canvas
		//translucent BG to show trail
		ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
		ctx.fillRect(0, 0, c.width, c.height);


		ctx.fillStyle = "#0F0"; //green text
		ctx.font = font_size + "px arial";

		//looping over drops
		for( var i = 0; i < drops.length; i++ )
		{
			//a random chinese character to print
			var text = matrix[ Math.floor( Math.random() * matrix.length ) ];
			//x = i*font_size, y = value of drops[i]*font_size
			ctx.fillText(text, i * font_size, drops[i] * font_size);
			//sending the drop back to the top randomly after it has crossed the screen
			//adding a randomness to the reset to make the drops scattered on the Y axis
			if( drops[i] * font_size > c.height && Math.random() > 0.975 )
				drops[i] = 0;
    
			//incrementing Y coordinate
	    	drops[i]++;
		}
	}
}
setInterval( draw, 35 );

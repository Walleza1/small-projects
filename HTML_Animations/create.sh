#!/bin/bash

nom_projet=$1

mkdir $1

index="
<!DOCTYPE html>\n
<html lang='fr'>\n
<head>\n
    <meta charset='utf-8'>\n
    <title>Animation</title>\n
</head>\n
\n
<body>\n
    <canvas id='toile' width='500' height='500'></canvas>\n
</body>\n
<script src='$1.js'></script>\n
</html>"
echo $index > $1/index.html


js_init="
var canvas,ctx;\n
var carre_size_px;\n
var CARRE=10;\n
\n
function init(){\n
    canvas=document.getElementById('toile');\n
    ctx=canvas.getContext('2d');\n
    carre_size_px=CARRE;\n
    canvas.width=document.body.clientWidth;\n
}\n
\n
function move(){\n
    ctx.clearRect(0,0,canvas.width,canvas.height);\n
    window.requestAnimationFrame(move);\n
}\n
\n
(function(){\n
	init();\n
    window.requestAnimationFrame(move);\n
})();\n
"
echo $js_init > $1/$1".js"

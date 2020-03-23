#!/bin/bash

nom_projet="$1"

mkdir -p "${nom_projet}"

cat > "${nom_projet}/index.html" << EOF
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='utf-8'>
    <title>Animation</title>
</head>

<body>
    <canvas id='toile' width='500' height='500'></canvas>
</body>
<script src='${nom_projet}.js'></script>
</html>
EOF

cat > "${nom_projet}/${nom_projet}.js" << EOF
var canvas,ctx;
var carre_size_px;
var CARRE=10;

function init(){
    canvas=document.getElementById('toile');
    ctx=canvas.getContext('2d');
    carre_size_px=CARRE;
    canvas.width=document.body.clientWidth;
}
function move(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    window.requestAnimationFrame(move);
}

(function(){
	init();
    window.requestAnimationFrame(move);
})();
EOF

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

function clearCanvas(color = 'white'){
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//vykreslení hracího pole
let field = {
    square: 20,
    paint: function(){
        for(let i = 1; i <= this.square; i++){
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(i * (canvas.width / this.square), 0);
            ctx.lineTo(i * (canvas.width / this.square), canvas.height);
            ctx.moveTo(0, i * (canvas.height / this.square));
            ctx.lineTo(canvas.width, i * (canvas.height / this.square));
            ctx.stroke();
        }
    }
}
//zjištění Y polohy
function getMousePosY(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        y: evt.clientY - rect.top
    };
}
//zjištění X polohy
function getMousePosX(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left
    };
}
//vytvoření 2D pole (pole polí)
let mapping = new Array(field.square);
for (let i = 0; i < field.square; i++){
    mapping[i] = new Array(field.square);
    for (let j = 0; j < field.square; j++){
        mapping[i][j] = '';
    }
}
//náhodné vybrání začínajícího hráče
let randomize = [1, 2];
let rng = Math.floor(Math.random() * randomize.length + 1);
if(rng == 1){
    document.getElementById('player').innerHTML = 'Křížek začíná.';
}
else{
    document.getElementById('player').innerHTML = 'Kolečko začíná.';
}
//proměnná pro střídání křížku a kolečka
let citac = rng;
let game = {
    //vykreslení křížku na kliknuté místo v poli
    initX: function(){
        canvas.addEventListener('mousedown', function(evt){
            citac++;
            if(citac % 2 == 0){
                document.getElementById('player').innerHTML = 'Na tahu je kolečko.';
                let mousePosX = getMousePosX(canvas, evt);
                let mousePosY = getMousePosY(canvas, evt);
                for (let i = 0; i < field.square; i++){
                    for (let j = 0; j < field.square; j++){
                        if((mapping[i][j] == '') && ((mousePosX.x / (i + 1)) <= (canvas.width / field.square)) && ((mousePosY.y / (j + 1)) <= (canvas.width / field.square))){
                            mapping[i][j] = 'x';
                            ctx.beginPath();
                            ctx.strokeStyle = 'blue';
                            ctx.moveTo(i * (canvas.width / field.square), j * (canvas.height / field.square));
                            ctx.lineTo((i + 1) * (canvas.width / field.square), (j + 1) * (canvas.height / field.square));
                            ctx.moveTo((i + 1) * (canvas.width / field.square), j * (canvas.height / field.square));
                            ctx.lineTo(i * (canvas.width / field.square), (j + 1) * (canvas.height / field.square));
                            ctx.stroke();
                            //vyčištění canvasu pro výhru křížku
                            if(ending.endingX()){
                                repaint.repaintX();
                                document.getElementById('player').innerHTML = 'Hra skončila. Prosím obnovte stránku.';
                            }
                            return;
                        }
                    }
                }
            }
        })
    },
    //vykreslení kolečka na kliknuté místo v poli
    initO: function(){
        canvas.addEventListener('mousedown', function(evt){
            if(citac % 2 != 0){
                document.getElementById('player').innerHTML = 'Na tahu je křížek.';
                let mousePosX = getMousePosX(canvas, evt);
                let mousePosY = getMousePosY(canvas, evt);
                for (let i = 0; i < field.square; i++){
                    for (let j = 0; j < field.square; j++){
                        if((mapping[i][j] == '') && ((mousePosX.x / (i + 1)) <= (canvas.width / field.square)) && ((mousePosY.y / (j + 1)) <= (canvas.width / field.square))){
                            mapping[i][j] = 'o';
                            ctx.beginPath();
                            ctx.strokeStyle = 'red';
                            ctx.arc((i + 1) * ((canvas.width / field.square) / 2) + (i * ((canvas.width / field.square)) / 2), (j + 1) * ((canvas.height / field.square) / 2) + (j * ((canvas.height / field.square)) / 2), (canvas.width / field.square) / 2 - 2, 0, 2 * Math.PI);
                            ctx.stroke();
                            //vyčištění canvasu pro výhru kolečka
                            if(ending.endingO()){
                                repaint.repaintO();
                                document.getElementById('player').innerHTML = 'Hra skončila. Prosím obnovte stránku.';
                            }
                            return;
                        }
                    }
                }
            }
        })
    }
}
let ending = {
    //kontrola výhry křížku
    endingX: function(){
        for(let i = 0; i < field.square; i++){
            for(let j = 0; j < field.square; j++){
                //vertikální zjištění výhry křížku
                if((mapping[i][j] == 'x') && (mapping[i][j + 1] == 'x') && (mapping[i][j + 2] == 'x') && (mapping[i][j + 3] == 'x') && (mapping[i][j + 4] == 'x')){
                    return true;
                }
                //horizontální zjištění výhry křížku
                if((mapping[i][j] == 'x') && (mapping[i + 1][j] == 'x') && (mapping[i + 2][j] == 'x') && (mapping[i + 3][j] == 'x') && (mapping[i + 4][j] == 'x')){
                    return true;
                }
                //pravé diagonální zjištění vyhry křížku
                if((mapping[i][j] == 'x') && (mapping[i + 1][j - 1] == 'x') && (mapping[i + 2][j - 2] == 'x') && (mapping[i + 3][j - 3] == 'x') && (mapping[i + 4][j - 4] == 'x')){
                    return true;
                }
                //levé diagonální zjištění vyhry křížku
                if((mapping[i][j] == 'x') && (mapping[i + 1][j + 1] == 'x') && (mapping[i + 2][j + 2] == 'x') && (mapping[i + 3][j + 3] == 'x') && (mapping[i + 4][j + 4] == 'x')){
                    return true;
                }
            }
        }
    },
    //kontrola výhry kolečka
    endingO: function(){
        for(let i = 0; i < field.square; i++){
            for(let j = 0; j < field.square; j++){
                //vertikální zjištění výhry kolečka
                if((mapping[i][j] == 'o') && (mapping[i][j + 1] == 'o') && (mapping[i][j + 2] == 'o') && (mapping[i][j + 3] == 'o') && (mapping[i][j + 4] == 'o')){
                    return true;
                }
                //horizontální zjištění výhry kolečka
                if((mapping[i][j] == 'o') && (mapping[i + 1][j] == 'o') && (mapping[i + 2][j] == 'o') && (mapping[i + 3][j] == 'o') && (mapping[i + 4][j] == 'o')){
                    return true;
                }
                //pravé diagonální zjištění vyhry kolečka
                if((mapping[i][j] == 'o') && (mapping[i + 1][j - 1] == 'o') && (mapping[i + 2][j - 2] == 'o') && (mapping[i + 3][j - 3] == 'o') && (mapping[i + 4][j - 4] == 'o')){
                    return true;
                }
                //levé diagonální zjištění vyhry kolečka
                if((mapping[i][j] == 'o') && (mapping[i + 1][j + 1] == 'o') && (mapping[i + 2][j + 2] == 'o') && (mapping[i + 3][j + 3] == 'o') && (mapping[i + 4][j + 4] == 'o')){
                    return true;
                }
            }
        }
    }
}
//ukončení hry a vymazání pole aby se do něj dále nezapisovalo a navykreslovalo se do canvasu
let repaint = {
    repaintX: function(){
        clearCanvas();
        ctx.font = "30px Arial";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.fillText("Křížek vítězí. Pro restart obnovte stránku.", canvas.width/2, canvas.height/2);
        mapping = '';
    },
    repaintO: function(){
        clearCanvas();
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Kolečko vítězí. Pro restart obnovte stránku.", canvas.width/2, canvas.height/2);
        mapping = '';
    }
}
field.paint();
game.initX();
game.initO();
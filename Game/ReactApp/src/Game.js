import React, { Component } from 'react';
import CannonBall from './CannonBall.js'

class Game extends Component {

    constructor() {
        super();
        this.imageObj = new Image();
        this.imageObj.src = 'cannon.png';
        this.beerImageObj = new Image();
        this.beerImageObj.src = 'beer.png';
        this.angle=0;
        this.cannonBalls = [];
        this.cannonReady = true;
        this.cannonBallStepper = setInterval(()=>{
            this.cannonBalls.forEach((ball)=> {
                ball.moveForward();
            });
        },5);
    }
    componentDidMount() {
        var FPS = 60;
        setInterval(() => {
            this.updateCanvas();
        }, 1000/FPS);
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    onMouseMove(e) {
            //show the x y position
    // $('#status').html(e.pageX + ', ' + e.pageY);
    //calculate the angle
    var relativeX = e.pageX-400;
    var relativeY = e.pageY-600;
    this.angle = Math.atan(relativeY / relativeX) / (2 * Math.PI / 360) - 90;

    if(relativeX > 0) {
      this.angle = this.angle + 180;
    }

    if(this.angle < 0) {
      this.angle = this.angle + 360;
    }
}
onMouseClick(e) {
    if(this.cannonReady) {
        this.cannonBalls.push(new CannonBall(this.angle, 300));
        console.log("inserted ball");
        this.cannonReady = false;
        setTimeout(() => {
            this.cannonReady = true;
        },1000)
    }
}
    updateCanvas() {
    const cannonX = 400-15;
    const cannonY = 500-60;
    
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0, 800, 500);
        //draw the cannon balls
    this.cannonBalls.forEach((ball) => {
    ctx.save();
    // move to the center of the canvas
    ctx.translate(ball.x+cannonX,ball.y+cannonY);

    // rotate the canvas to the specified degrees
    ctx.rotate((ball.angle+90)*Math.PI/180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(this.beerImageObj,0,0,30,60);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();
    });

            // save the unrotated context of the canvas so we can restore it later
    // the alternative is to untranslate & unrotate after drawing
    ctx.save();
    ctx.translate(cannonX,cannonY);

    // rotate the canvas to the specified degrees
    ctx.rotate(this.angle*Math.PI/180);

    // draw the image
    // since the context is rotated, the image will be rotated also
    ctx.drawImage(this.imageObj,-20,0,40,80);

    // we’re done with the rotating so restore the unrotated context
    ctx.restore();
    }
    render() {
         return (
             <canvas onMouseMove={e => this.onMouseMove (e)} onMouseDown={e => this.onMouseClick (e)} ref="canvas" width={800} height={500}/>
         );
    }
}

export default Game;
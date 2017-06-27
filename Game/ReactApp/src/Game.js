import React, { Component } from 'react';
import CannonBall from './CannonBall.js'

    const cannonX = 400-15;
    const cannonY = 500-60;

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
            this.cannonBalls.forEach((ball, index, array)=> {
                ball.moveForward();
                if(this.isOutOfViewPort(ball)) {
                    array.splice(index,1);
                }
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

    
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0, this.props.width, this.props.height);
        //draw the cannon balls
    this.cannonBalls.forEach((ball) => {
        ctx.save();
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
             <canvas onMouseMove={e => this.onMouseMove (e)} onMouseDown={e => this.onMouseClick (e)} ref="canvas" width={this.props.width} height={this.props.height}/>
         );
    }
    isOutOfViewPort(item) {
          if(item.x+cannonX < 0 
     || item.y+cannonY < 0
     || item.x+cannonX > this.props.width 
     || item.y+cannonY > this.props.height) {
         console.log("removing at " + item.x + " " + item.y);
    return true;
  }
  else return false;
}
    }

export default Game;
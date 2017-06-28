import React, { Component } from 'react';
import CannonBall from './CannonBall.js';
import Person from './Person.js';

const cannonX = 400-15;
const cannonY = 500-60;

class Game extends Component {

    constructor() {
        super();
        this.score=0;
        this.imageObj = new Image();
        this.imageObj.src = 'cannon.png';
        this.beerImageObj = new Image();
        this.beerImageObj.src = 'beer.png';
        this.maleImageObj = new Image();
        this.maleImageObj.src = 'male.jpg';
        this.femaleImageObj = new Image(); 
        this.femaleImageObj.src = 'female.jpg'
        this.angle=0;
        this.cannonBalls = [];
        this.cannonReady = true;
        this.persons = [];
        this.personInterval = Math.floor((Math.random()*500)+1);;
        this.counterSincePerson = 100;
        this.cannonBallStepper = setInterval(()=>{
            this.cannonBalls.forEach((ball, index, array)=> {
                ball.moveForward();
                if(this.isOutOfViewPort(ball)) {
                    array.splice(index,1);
                    this.score--;
                }
                this.persons.forEach((person, index2,array2)=>{
                    if(this.overlaps(ball,person)) {
                        array2.splice(index2,1);
                        array.splice(index,1);
                        this.score++;
                    }
                });
            });
            this.persons.forEach((person, index, array)=> {
                person.moveForward();
                if(this.isOutOfViewPort(person)) {
                    array.splice(index,1);
                }

            });
            if(this.counterSincePerson >= this.personInterval) {
                var rand1 = Math.floor((Math.random()*2)+1);
                var gender;
                if(rand1 == 1) {
                    gender = "MALE";
                }
                if(rand1 == 2) {
                    gender = "FEMALE";
                }
                var speed = Math.floor((Math.random()*3)+1);
                this.persons.push(new Person(gender, speed));
                this.counterSincePerson = 0;
                this.personInterval = Math.floor((Math.random()*500)+1);;
            }
            this.counterSincePerson++;
        },5);
    }
    componentDidMount() {
        var FPS = 60;
        setInterval(() => {
            this.updateCanvas();
        }, 1000/FPS);
    }
    componentDidUpdate() {
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
        this.cannonBalls.push(new CannonBall(this.angle, 300, cannonX, cannonY));
        console.log("inserted ball");
        this.cannonReady = false;
        setTimeout(() => {
            this.cannonReady = true;
        },1000)
    }
}

overlaps(item1, item2) {

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }
        var pos1 = [ [item1.x, item1.x+30], [item1.y, item1.y+60] ],
            pos2 = [ [item2.x, item2.x+30], [item2.y, item2.y+60] ]
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
}
    updateCanvas() {

    
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0,0, this.props.width, this.props.height);

    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(this.score, this.props.width-50, this.props.height-50); 

        //draw the cannon balls
    this.cannonBalls.forEach((ball) => {
        ctx.save();
        ctx.translate(ball.x,ball.y);
        // rotate the canvas to the specified degrees
        ctx.rotate((ball.angle+90)*Math.PI/180);

        // draw the image
        // since the context is rotated, the image will be rotated also
        ctx.drawImage(this.beerImageObj,0,0,30,60);

        // we’re done with the rotating so restore the unrotated context
        ctx.restore();
    });
    this.persons.forEach((person) => {
        if(person.gender == "MALE") {
            ctx.drawImage(this.maleImageObj,person.x,person.y,30,60);
        }
        else {
            ctx.drawImage(this.femaleImageObj,person.x,person.y,30,60);
        }
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
          if(item.x < 0 
     || item.y < 0
     || item.x > this.props.width 
     || item.y > this.props.height) {
    return true;
  }
  else return false;
}
    }

export default Game;
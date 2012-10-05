/*
 * Written by all might dude Per Andersen in 2012
 * First an experiment, then a game for pils and programmering
 * 
 * Uses jquery and qjuery-rotate plugin
 * 
 * changelog:
 * 
 * 0.0.1 (current) - the cannon shoots out beer glasses
 * Experimental - the cannon shoots the letter "o" around on the screen
 * 
 * TODO: 
 * 
 * - Shoot down logos or perhaps heroes in the "looking for group"
 *   application  or members of the facebook group or whatever comes into mind
 * - collision detection and points for shooting down whatever is up there
 * - fine adjust the cannon - let the beers come out of the top of the cannon instead
 * - Window resizing and responsiveness
 * - only works in chrome due to offset position flaw when centering an element using a css hack
 * 
 */

//VARIABLES
//whether or not the cannon is ready to fire
var cannonReady = true;
// not constants at this point, htey are actially set under $(document).ready.
//but we need to rotate the cannon around a center - or more
//specifically the  point of the crossing between the cannon and the wheels...
var CENTERPOINTX = 0;
var CENTERPOINTY = 0;
//just a varuiable used during diversion of degrees and radians
var degreeInRadians = 2 * Math.PI / 360;
//how many balls have been fired?
var ballsFired = 0;
//an array of existing cannon balls
var cannonBalls = [];
//a timer is set - see the method cannonBallStep and the "class" cannonBall to understand
var cannonBallStepper = setInterval("cannonBallStep()", 5);
//we need to track the angle of the invisible line from the mouse x y
//to the cannon centerpoint x y
var angle = 0;
var cannonOffset;			


$(window).load(function() {
  init();
  
  //the handler when the mouse moves
  $(document).mousemove(function(e) {
    //show the x y position
    $('#status').html(e.pageX + ', ' + e.pageY);
    //calculate the angle
    var relativeX = e.pageX - CENTERPOINTX;
    var relativeY = e.pageY - CENTERPOINTY;
    angle = Math.atan(relativeY / relativeX) / degreeInRadians - 90;
    if(relativeX > 0) {
      angle = angle + 180;
    }

    if(angle < 0) {
      angle = angle + 360;
    }

    // $('#status').html(angle);
    //rotate the element
    $("#cannon").rotate(angle);
  });
  $(document).click(function() {
    if(cannonReady) {
      fireCannon();
    }
  });
});
$(window).resize(function() {
  init();
});

function init() {

  //center point in image 65x120y
  cannonOffset = $("#cannon").offset();
  CENTERPOINTX = cannonOffset.left +65;
  CENTERPOINTY = cannonOffset.top +120;

  //show some feedback about the centerpoint
  $("#facts").html("Centerpoint: X=" + CENTERPOINTX + " , Y=" + CENTERPOINTY);



}

function fireCannon() {
  ballsFired++;
  var cannonBall = new CannonBall(angle, ballsFired);
  cannonBalls.push(cannonBall);
  cannonReady = false;
  $('#load').html("loading");
  var timeout = setTimeout(loadCannon, 1000);
}

function loadCannon() {
  cannonReady = true;
  $('#load').html("ready");
}

function cannonBallStep() {
  cannonBalls.forEach(function(item) {
    item.moveForward();
    if(isOutOfViewPort(item)) {
      item.destroy();
    }
  });
}

function isOutOfViewPort(cannonBall) {
  var viewportHeight = $(window).height();
  var viewportWidth = $(window).width();
  
  if(cannonBall.x < 0 
     || cannonBall.y < 0
     || cannonBall.x > viewportWidth 
     || cannonBall.y > viewportHeight) {
    return true;
  }
  else return false;
}

function CannonBall(angle, numberInRow) {
  this.angle = angle - 90;
  this.number = numberInRow;
  $("body").append("<div id='ball" + this.number 
                   + "' class='cannonBall' style='position:absolute; top:"
		   + (CENTERPOINTX - 50) 
                   + "px;left:" + (CENTERPOINTY -22) 
                   + "px;'><img src='beer.png' id='beerImage" 
                   + this.number 
                   + "'></div>");
  $("#beerImage" + this.number).rotate(angle);
  this.element = $("#ball" + this.number);
  this.x = CENTERPOINTX -22;
  this.y = CENTERPOINTY - 50;
  this.moveForward = function() {
    this.x = this.x + Math.cos(degreeInRadians * this.angle);
    this.y = this.y + Math.sin(degreeInRadians * this.angle);
    this.element.css({top:this.y, left:this.x});	
  }
  
  this.destroy = function() {
    $("#ball" + this.number).remove();
  }
}

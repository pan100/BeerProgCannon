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

//Function extending the array so we can remove objects

Array.prototype.remove = function (element) 
  {
          for (var i = 0; i < this.length; i++) 
       {
              if (this[i] == element) 
          {
                      this.splice(i,1);
              }
          }
          return false;
  };

  //function for overlap detection

  var overlaps = (function () {
    function getPositions( elem ) {
        var pos, width, height;
        pos = $( elem ).position();
        width = $( elem ).width();
        height = $( elem ).height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }

    function comparePositions( p1, p2 ) {
        var r1, r2;
        r1 = p1[0] < p2[0] ? p1 : p2;
        r2 = p1[0] < p2[0] ? p2 : p1;
        return r1[1] > r2[0] || r1[0] === r2[0];
    }

    return function ( a, b ) {
        var pos1 = getPositions( a ),
            pos2 = getPositions( b );
        return comparePositions( pos1[0], pos2[0] ) && comparePositions( pos1[1], pos2[1] );
    };
})();

//VARIABLES
//whether or not the cannon is ready to fire
var cannonReady = true;
// not constants at this point, htey are actially set under $(document).ready.
//but we need to rotate the cannon around a center - or more
//specifically the  point of the crossing between the cannon and the wheels...
var CENTERPOINTX = 0;
var CENTERPOINTY = 0;
//just a variable used during diversion of degrees and radians
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

var peopleToGiveBeer = [];
var TIMEBETWEENPERSONS = 600;
var timeBeforeNextPerson = TIMEBETWEENPERSONS;
var peopleAdded = 0;


var score = 0;

$(window).load(function() {
  init();
  
  //the handler when the mouse moves
  $(document).mousemove(function(e) {
    //show the x y position
    // $('#status').html(e.pageX + ', ' + e.pageY);
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
    var itemHasHit = false;
    item.moveForward();
    peopleToGiveBeer.forEach(function(personToCheckForHit) {
      if(overlaps($("#ball" + item.number), $("#person" + personToCheckForHit.number))) {
        itemHasHit =true;
        personToCheckForHit.destroy();
        peopleToGiveBeer.remove(personToCheckForHit);
        score++;
        $('#status').html("score: " + score);
      }
    });
    if(isOutOfViewPort(item) || itemHasHit) {
      item.destroy();
      cannonBalls.remove(item);
    }
  });
  peopleToGiveBeer.forEach(function(item) {
  	item.moveForward();
  	    if(isOutOfViewPort(item)) {
      item.destroy();
      peopleToGiveBeer.remove(item);
    }
  });
  
  stepPeople();
}

function isOutOfViewPort(item) {
  var viewportHeight = $(window).height();
  var viewportWidth = $(window).width();
  
  if(item.x < 0 
     || item.y < 0
     || item.x > viewportWidth 
     || item.y > viewportHeight) {
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

  this.x = CENTERPOINTX - 22 + 160*Math.cos(degreeInRadians * this.angle);
  this.y = CENTERPOINTY - 50 + 160*Math.sin(degreeInRadians * this.angle);

  this.moveForward = function() {
    this.x = this.x + Math.cos(degreeInRadians * this.angle);
    this.y = this.y + Math.sin(degreeInRadians * this.angle);
    this.element.css({top:this.y, left:this.x});	
  }
  
  this.destroy = function() {
    $("#ball" + this.number).remove();
  }
}


function Person(angle, numberInRow, fromWhere) {
	
  //fromWhere could be from the "top", "left" or "right"
  this.fromWhere = fromWhere;
  this.angle = angle;
  this.number = numberInRow;
  
  this.top;
  this.left;
  //TODO Facebook integration
  this.imgSrc = "staticPerson.jpg"
  
  if(fromWhere == "left") {
  	this.top = 40;
  	this.left = 0;
  }
  else if(fromWhere == "right") {
  	this.top = 40;
  	this.left = window.innerWidth;
  }
  
  $("body").append("<div id='person" + this.number 
                   + "' class='person' style='position:absolute; top:"
		   + this.top 
                   + "px;left:" + this.left 
                   + "px;'><img src='"
                   + this.imgSrc
                   + "' id='personImg" 
                   + this.number 
                   + "'></div>");
  $("#personImg" + this.number).rotate(angle);
  this.element = $("#person" + this.number);

  this.x = this.left;
  this.y = this.top;

  this.moveForward = function() {
    this.x = this.x + Math.cos(degreeInRadians * this.angle);
    this.y = this.y + Math.sin(degreeInRadians * this.angle);
    this.element.css({top:this.y, left:this.x});	
  }
  
  this.destroy = function() {
    $("#person" + this.number).remove();
  }
}

function stepPeople() {
	if(timeBeforeNextPerson == 0) {
		addNewPerson();
		timeBeforeNextPerson = TIMEBETWEENPERSONS;
	}
	else timeBeforeNextPerson--;
}

function addNewPerson() {
	peopleAdded++;
	var rand = Math.floor((Math.random()*2)+1);
	if(rand == 1) {
		var person = new Person(180, peopleAdded, "right");
		peopleToGiveBeer.push(person);		
	} 
	if(rand == 2) {
		var person = new Person(0, peopleAdded, "left");
		peopleToGiveBeer.push(person);	
	}
}

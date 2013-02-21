/*
 * Settings
 */
var measures = {
	x : 800,
	y : 600
}
var degreeInRadians = 2 * Math.PI / 360;
var CENTERPOINTX = measures.x / 2;
var CENTERPOINTY = measures.y;

/*
 * Initialize
 */
var paper = Raphael(0, 0, measures.x, measures.y);

var cannon = paper.image("img/cannon.png", measures.x / 2, measures.y - 120, 65, 120);

$("svg").ready(function() {
	$(document).mousemove(function(e) {
		var relativeX = e.pageX - CENTERPOINTX;
		var relativeY = e.pageY - CENTERPOINTY;
		console.log("X = " + relativeX + " Y = " + relativeY);

		angle = Math.atan(relativeY / relativeX) / degreeInRadians - 90;
		
		if (relativeX > 0) {
			angle = angle + 180;
		}

		if (angle < 0) {
			angle = angle + 360;
		}
		
		//rotate the element
		var transformString = "r" + angle;
		console.log("transforming String: " + transformString);
		cannon.transform(transformString);
	});
});

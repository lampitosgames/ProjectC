var utils = {
	//normalize function (find where the 'value' falls percentage-wise between the min and max)
	norm: function(value, min, max) {
		return (value - min) / (max - min);
	},
	//linear interpolation function (find the value from a min and max value, and a normalized number) ((max-min) * norm + min)
	lerp: function(norm, min, max) {
		return (max - min) * norm + min;
	},
	//Map funciton that gets the normalized value of a number in one range, and returns the interpolated value in a second range
	map: function(value, sourceMin, sourceMax, destMin, destMax) {
		var n = norm(value, sourceMin, sourceMax);
		return lerp(n, destMin, destMax);
	},
	//Clamp.  Make sure a value stays between two values in a range
	clamp: function(value, min, max) {
		return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
	},
	//detect if a value is within a range
	inRange: function(value, min, max) {
		return value >= Math.min(min, max) && value <= Math.max(min, max);
	},
	//detect if two ranges overlap
	rangeIntersect: function(min0, max0, min1, max1) {
		return Math.max(min0, max0) >= Math.min(min1, max1) &&
			   Math.min(min0, max0) <= Math.min(min1, max1);
	},
	//detect if one range is fully in another range
	rangeContains: function(min0, max0, min1, max1) {
		return Math.max(min0, max0) >= Math.max(min1, max1) &&
			   Math.min(min0, max0) <= Math.min(min1, max1);
	},
	//distance between two points
	distance: function(x0, y0, x1, y1) {
		var dx = x1 - x0;
		var dy = y1 - y0;
		return Math.sqrt(dx * dx + dy * dy);
	},
	//random number within a range
	randomRange: function(min, max) {
		return min + Math.random() * (max - min);
	},
	//random integer within a range
	randomInt: function(min, max) {
		return Math.floor(min + Math.random() * (max - min + 1));
	},
	//convert degrees to radians
	inRads: function(degr) {
		return degr / 180 * Math.PI;
	},
	//convert radians to degrees
	inDegr: function(rads) {
		return rads * 180 / Math.PI;
	},
	
	/* Collision Detection */
	//detect circle-circle collision
	circleCollision: function(c0, c1) {
		return utils.distance(c0.x, c0.y, c1.x, c1.y) <= c0.radius + c1.radius;
	},
	//detect circle-point collision
	circlePointCollision: function(x, y, circle) {
		return utils.distance(x, y, circle.x, circle.y) < circle.radius;
	},
	//detect rectangle-point collision
	pointRectCollision: function(x, y, rect) {
		return utils.inRange(x, rect.x, rect.x + rect.width) && 
			   utils.inRange(y, rect.y, rect.y + rect.height);
	},
	//detect rectangle-rectangle collision
	rectCollision: function(rect0, rect1) {
		return utils.rangeIntersect(rect0.x, rect0.x + rect0.width, rect1.x, rect1.x + rect1.width) &&
			   utils.rangeIntersect(rect0.y, rect0.y + rect0.height, rect1.y, rect1.y + rect1.height);
	}
}
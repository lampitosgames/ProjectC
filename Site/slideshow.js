var slideshows = [];
var slideshow = {
	numOfPics: 0,
	currentPic: 0,
	nextActivePic: 0,
	parent: '',
	filepath: '',
	fileRoot: '',
	
	create: function(pictureCount, filepath, parentElement, fileNameRoot) {
		var obj = Object.create(this);
		obj.numOfPics = pictureCount;
		obj.filepath = filepath;
		obj.parent = parentElement;
		obj.fileRoot = fileNameRoot;
		obj.nextActivePic = 1;
		var imageDivs = "";
		for (var i=1; i<=obj.numOfPics; i++) {
			imageDivs += "<div class='slideshowDiv' id='div" + obj.fileRoot + i + "'></div>";
		}
		obj.parent.children(".slideshowPictures").html(imageDivs);
		obj.selectPicture(1);
		return obj;
	},
	
	selectPicture: function(num) {
		var number = utils.clamp(num, 1, this.numOfPics);
		var thisPicSource = this.filepath + "/lowres/" + this.fileRoot + " (" + number + ").jpg";
		$('.slideshowPic').stop();
		var thisImage = $("<a href='" + this.filepath + '/' + this.fileRoot + " (" + number + ").jpg' target='_blank'><img class='slideshowPic' src='" + thisPicSource + "'/></a>");
		thisImage.appendTo('#div' + this.fileRoot + number);
		if (this.currentPic > number) {
			console.log("1, " + num);
			$('#div' + this.fileRoot + this.currentPic).animate({left: '1024px'}, 150);
			$('#div' + this.fileRoot + number).animate({left: '0px'}, 150);
			this.currentPic = number;
		} else if (this.currentPic != number) {
			console.log("2, " + num);
			$('#div' + this.fileRoot + this.currentPic).stop().animate({left: '-1024px'}, 150);
			$('#div' + this.fileRoot + number).animate({left: '0px'}, 150);
			this.currentPic = number;
		}
	},
	
	stepPicture: function(direction) {
		//true is right, false is left
		if (direction) {
			this.nextActivePic = utils.clamp(this.nextActivePic + 1, 1, this.numOfPics);
			this.selectPicture(this.nextActivePic);
		} else {
			this.nextActivePic = utils.clamp(this.nextActivePic - 1, 1, this.numOfPics);
			this.selectPicture(this.nextActivePic);
		}
	}
}

//when a left slideshow arrow is clicked
$('html').on('click', '.articleSlideshowLeft', function() {
	console.log("clickedLeft");
	var thisRoot = $(this).parent().attr('data-filenameroot');
	for (var i=0; i<slideshows.length; i++) {
		if (thisRoot == slideshows[i].fileRoot) {
			slideshows[i].stepPicture(false);
		}
	}
});
//when a right slideshow arrow is clicked
$('html').on('click', '.articleSlideshowRight', function() {
	var thisRoot = $(this).parent().attr('data-filenameroot');
	for (var i=0; i<slideshows.length; i++) {
		if (thisRoot == slideshows[i].fileRoot) {
			slideshows[i].stepPicture(true);
		}
	}
});
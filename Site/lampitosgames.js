/* Main Homepage Code */
/** COPYRIGHT DANIEL TIMKO 2014 **/

//current highlight the user is viewing (There are 6 highlights that can be cycled through
var activeHighlight = 0;
var linkNames = ["hlLink1", "hlLink2", "hlLink3", "hlLink4", "hlLink5", "hlLink6"];

//track whether or not the sidebar currently holds focus (Focus can be acquired by rolling over the top-left hamburger button with the mouse pointer)
var sidebarFocus = false;

//when the page is loaded
$(document).ready(function() {
	//call the resize function to calculate the correct sizes for elements on the page
	resize();
	//On page load, set the first highlight to the active highlight
	setHighlight(0);
	//call the parallax reset function to prepare currently loaded parallaxing elements
	resetParallax(0);
	//place parallaxing content well below the viewframe
	parallaxTo(-10, false);
	//enable pointer events for the sidebar
	$('#navbar').css('pointer-events', 'all');
	
	//Below is the code that handles animation in the sidebar
	//on the mouseenter event for all sidebar links...
	$(".hlLink").mouseenter(function() {
		//all the links have two states: Active or inactive.  If we pretend a link is both, the correct properties will change
		//animate all of this link's settings if it isn't active
		$(this).children(".hlLinkText").css('opacity', '1.0');
		$(this).children(".hlLinkText").css('left', '32px');
		$(this).children(".hlLinkLine").css('width', '144px');
		$(this).children(".hlLinkLine").css('background-color', '#FAFAFA');
		$(this).children(".hlLinkCircle").css('background-color', 'rgba(250, 250, 250, 1)');
		//animate all of this link's settings if it IS active
		$(this).children(".hlLinkTextActive").css('opacity', '1.0');
		$(this).children(".hlLinkTextActive").css('left', '36px');
		$(this).children(".hlLinkLineActive").css('width', '144px');
	//on the mouseleave event for all sidebar links...
	}).mouseleave(function() {
		//check the sidebar's focus status.  If it is in focus, animate differently
		if (sidebarFocus) {
			//animate all of this link's settings if it isn't active
			$(this).children(".hlLinkText").css('opacity', '0.8');
			$(this).children(".hlLinkText").css('left', '32px');
			$(this).children(".hlLinkLine").css('width', '50px');
			$(this).children(".hlLinkCircle").css('background-color', 'rgba(250, 250, 250, 0)');
			//animate all of this link's settings if it IS active
			$(this).children(".hlLinkTextActive").css('opacity', '1.0');
			$(this).children(".hlLinkTextActive").css('left', '36px');
			$(this).children(".hlLinkLineActive").css('width', '122px');
		//if it isn't in focus
		} else {
			//animate all of this link's settings if it isn't active
			$(this).children(".hlLinkText").css('opacity', '0.0');
			$(this).children(".hlLinkText").css('left', '24px');
			$(this).children(".hlLinkLine").css('width', '8px');
			$(this).children(".hlLinkLine").css('background-color', '#B2B2B2');
			$(this).children(".hlLinkCircle").css('background-color', 'rgba(250, 250, 250, 0)');
			//animate all of this link's settings if it IS active
			$(this).children(".hlLinkTextActive").css('opacity', '0.8');
			$(this).children(".hlLinkTextActive").css('left', '32px');
			$(this).children(".hlLinkLineActive").css('width', '100px');
		}
	//when a sidebar link is clicked
	}).click(function() {
		//call the setHighlight method for the clicked highlight (this will set it as the active highlight, as well as perform animations)
		var thisID = $(this).attr('id');
		var number = linkNames.indexOf(thisID);
		//if parallaxing is on, and the active highlight wasn't the link that was clicked
		if (scrollLock && number != activeHighlight) {
			//get the main content pane for the clicked highlight
			var parentElement = $("#hl" + number).children(".hlContent");
			//exit parallax
			exitParallax(parentElement);
			//on a delay (wait for animation to finish), set the active highlight to the clicked highlight
			setTimeout(function() {
				setHighlight(number);
			}, 610);
		//if parallaxing is off, and the active highlight wasn't the link that was clicked
		} else if (number != activeHighlight) {
			//set the active highlight to the clicked highlight
			setHighlight(number);
		}
	});
	
	//when a view button is clicked
	$('.hlViewButton').click(function() {
		//get the content box for this element's title section
		var parent = $(this).parent();
		//if parallaxing is off
		if (!scrollLock) {
			viewClick(parent);
		}
	});
	
	//Check the URL to determine whether or not to scroll to a specific area
	var onLoadHighlight = onLoadScroll('highlight');
	//if the url variable says to scroll to highlight 1
	if (onLoadHighlight == "hl1" || onLoadHighlight == "ProjectC") {
		//turn off normal view button functionality
		viewButtonNormalBehavior = false;
		//set the proper highlight
		setHighlight(0);
		//on a slight delay
		setTimeout(function() {
			//simulate a view button click for highlight one
			var thisParent = $("#view1").parent();
			viewClick(thisParent);
		}, 300);
	} else if (onLoadHighlight == "hl2" || onLoadHighlight == "ProjectBigData") {
		//turn off normal view button functionality
		viewButtonNormalBehavior = false;
		//set the proper highlight
		setHighlight(1);
		//on a slight delay
		setTimeout(function() {
			//simulate a view button click for highlight one
			var thisParent = $("#view2").parent();
			viewClick(thisParent);
		}, 300);
	} else if (onLoadHighlight == "hl3" || onLoadHighlight == "ShapeClicker") {
		//turn off normal view button functionality
		viewButtonNormalBehavior = false;
		//set the proper highlight
		setHighlight(2);
		//on a slight delay
		setTimeout(function() {
			//simulate a view button click for highlight one
			var thisParent = $("#view3").parent();
			viewClick(thisParent);
		}, 300);
	} else if (onLoadHighlight == "hl4" || onLoadHighlight == "SOS2014") {
		//turn off normal view button functionality
		viewButtonNormalBehavior = false;
		//set the proper highlight
		setHighlight(3);
		//on a slight delay
		setTimeout(function() {
			//simulate a view button click for highlight one
			var thisParent = $("#view4").parent();
			viewClick(thisParent);
		}, 300);
	}
	if (onLoadHighlight == "hl5") {
		viewButtonNormalBehavior = false;
		setHighlight(4);
		setTimeout(function() {
			var thisParent = $("#view5").parent();
			viewClick(thisParent);
		}, 300);
	}
	if (onLoadHighlight == "hl6") {
		viewButtonNormalBehavior = false;
		setHighlight(5);
		setTimeout(function() {
			var thisParent = $("#view6").parent();
			viewClick(thisParent);
		}, 300);
	}
	
	//When the mouse pointer enters the hamburger button
	$(".hamburgerButton").mouseenter(function() {
		//set the sidebar's focus status to true
		sidebarFocus = true;
		//animate in the sidebar's background (again, the css contains the animation parameters, so .animate() isn't needed)
		$("#navbarBackground").css('left', '0px');
		//if parallaxing is on, animate the links into frame
		if (scrollLock) {
			$(".headerTitle, .highlightLinks").css('left', '0px');
			//enable pointer events for the sidebar
			$('#navbar').css('pointer-events', 'all');
		}
		//loop through each highlight link.  By animating for both inactive and active states on all links, everything will animate correctly
		$(".hlLink").each(function() {
			//animate this link's properties if it is inactive
			$(this).children(".hlLinkText").css('opacity', '0.8');
			$(this).children(".hlLinkText").css('left', '32px');
			$(this).children(".hlLinkLine").css('width', '50px');
			//animate this link's properties if it is active
			$(this).children(".hlLinkTextActive").css('opacity', '1.0');
			$(this).children(".hlLinkTextActive").css('left', '36px');
			$(this).children(".hlLinkLineActive").css('width', '122px');
			
		});
	});
	
	//When the back button is clicked
	$(".backButton").click(function() {
		//the back button only works during parallax, so if parallax is active
		if (scrollLock) {
			//get the title content box for the active highlight
			var parentElement = $("#hl" + (activeHighlight+1)).children(".hlContent");
			//exit parallax, and return to the active highlight
			exitParallax(parentElement);
		}
	});
	
	//when the mouse pointer leaves the sidebar
	$("#navbar").mouseleave(function() {
		//set the sidebar's focus status to false
		sidebarFocus = false;
		//animate the sidebar's background to out of frame
		$("#navbarBackground").css('left', '-300px');
		//if parallaxing is on, animate the whole sidebar to out of frame
		if (scrollLock) {
			$(".headerTitle, .highlightLinks").css('left', '-300px');
			//disable pointer events for the sidebar
			$('#navbar').css('pointer-events', 'none');
		}
		//loop through each highlight link
		$(".hlLink").each(function() {
			//animate this link back to default state if it is inactive
			$(this).children(".hlLinkText").css('opacity', '0.0');
			$(this).children(".hlLinkText").css('left', '24px');
			$(this).children(".hlLinkLine").css('width', '8px');
			//animate this link back to default state if it is active
			$(this).children(".hlLinkTextActive").css('opacity', '0.8');
			$(this).children(".hlLinkTextActive").css('left', '32px');
			$(this).children(".hlLinkLineActive").css('width', '100px');
		});
	});
	
	//when the mousewheel moves, check the event delta (scroll direction), and pass the direction to the scroll() function
	$(window).mousewheel(function(event, delta) {
		//if the direction of the delta is down
		if (delta < 0) {
			//call the scroll function with the down boolean (false)
			scroll(false);
		//else, the direction of the delta is up
		} else {
			//call the scroll function with the up boolean (true)
			scroll(true);
		}
		//don't do any normal mouse scroll actions
		return false;
	
	//when a key is pressed
	}).keydown(function(e) {
		//use a switch statement to determine which key was pressed (using the keycode)
		switch (e.keyCode) {
			//up directional button was pressed
			case 38:
				//if parallaxing is off
				if (!scrollLock) {
					//if the current highlight is not the first highlight
					if (activeHighlight > 0) {
						//call the setHightlight method, passing it the highlight directly above the current active highlight
						setHighlight(activeHighlight-1);
						//animate the scrollbar (bar's ability to move divided by five, because the bar is taking up one space, and there are 6 possible positions)
						var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
						//stop scrollbar animation, and set it's top value to the correct position
						$('#scrollBar').stop().animate({top: scrollBarTop * activeHighlight}, 100);
					}
				//else, parallaxing is on
				} else {
					//call the scroll function with the up boolean (true)
					scroll(true);
				}
				break;
			//down directional button was pressed
			case 40:
				//if parallaxing is off
				if (!scrollLock) {
					//if the current highlight is not the last highlight
					if (activeHighlight < 5) {
						//call the setHightlight method, passing it the highlight directly below the current active highlight
						setHighlight(activeHighlight+1);
						//animate the scrollbar
						var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
						//stop scrollbar animation, and set it's top value to the correct position
						$('#scrollBar').stop().animate({top: scrollBarTop * activeHighlight}, 100);
					}
				//else, parallaxing is on
				} else {
					//call the scroll function with the down boolean (false)
					scroll(false);
				}
				break;
			//spacebar button was pressed
			case 32:
				//if parallaxing is off
				if (!scrollLock) {
					//if the current highlight is not the last highlight
					if (activeHighlight < 5) {
						//call the setHightlight method, passing it the highlight directly below the current active highlight
						setHighlight(activeHighlight+1);
						//animate the scrollbar
						var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
						//stop scrollbar animation, and set it's top value to the correct position
						$('#scrollBar').stop().animate({top: scrollBarTop * activeHighlight}, 100);
					}
				//else, parallaxing is on
				} else {
					//call the scroll function with the down boolean (false)
					scroll(false);
				}
				break;
			//backspace button was pressed
			case 8:
				//if parallaxing is on
				if (scrollLock) {
					e.preventDefault();
					//get the title content box for the active highlight
					var parentElement = $("#hl" + (activeHighlight+1)).children(".hlContent");
					//exit parallax
					exitParallax(parentElement);
					return false;
				}
				break;
			//any other key was pressed
			default:
				//do nothing
				break;
		}
	});
});

//when the window is resized
$(window).resize(function() {
	//call the resize function
	resize();
});

//resize function.  Handles variable sizing while the page is loaded (people resize the page, because they are just mean like that)
function resize() {
	//pass long-winded references to easy-to-use variables
	//get the window height/width
	var width = $(window).width();
	var height = $(window).height();
	//get all highlight background images
	var image = $(".highlightBackgroundImage");
	//get the highlights wrapper (div that contains all the highlights)
	var hlWrapper = $("#highlightsWrapper");
	//get all the highlights themselves
	var highlight = $(".highlight");
	
	//set height and width of the highlight wrapper (and all the highlights it contains) to whatever the page's height and width are
	hlWrapper.css('width', width + 'px').css('height', height + 'px');
	highlight.css('width', width + 'px').css('height', height + 'px');
	
	//set the sidebar's height to the height of the page
	$("#navbar").css('height', height + 'px');
	//set the navbar's background to the height of the page
	$("#navbarBackground").css('height', height + 'px');
	
	//Based on ratios, resize the background image to fill the entire screen.  All images are 1920x1200 pixels
	//if the image is too tall...
	if (width / height > 1.6) {
		//keep the width
		image.css('width', width + 'px');
		//set the height to the correct value based on the width
		image.css('height', width/1.6 + 'px');
	//or, if the image is too wide...
	} else if (width / height < 1.6) {
		//set the width to the correct value based on the height
		image.css('width', height*1.6 + 'px');
		//keep the height
		image.css('height', height + 'px');
	//or, if the image is good as-is
	} else {
		//keep both the width
		image.css('width', width + 'px');
		//and the height
		image.css('height', height + 'px');
	}
	
	//if the window is too short for the sidebar, change the height dimensions of the sidebar to fit on the page
	//height of the sidebar links
	var scaledDown = 592;
	//if the page height is smaller than 700px
	if (height < 700) {
		//change the total height of the sidebar links to 542
		scaledDown = 542;
		//set the height of the highlight links to 60px
		$(".hlLink").css('height', '60px');
	//else, the page height is >= 700px
	} else {
		//change the total height of the sidebar links to 542
		scaledDown = 692;
		//set the height of the highlight links to 85px
		$(".hlLink").css('height', '85px');
	}
	
	//I calculated a bunch of things that I don't actually have the original sketches for.  Basically, this code creates equal space between the hamburger button, the title,
	//the highlight links, and the bottom of the page (the space between each is equal).  Don't ask me how though, cause I have no idea XD.  There is some obscure algebra
	//goin on here.  All I know is that it works, so thats good enough for me
	var h1 = (height - scaledDown)/2.3;
	var h2 = 0.7 * h1;
	if (height > 584) {
		$(".highlightLinks").css('margin-top', h1-50 + 'px');
		$(".headerTitle").css('margin-top', h2 + 'px');
	}
	
	//Move the scrollbar to the right edge of the page (the scrollbar is 10 pixels wide)
	$("#scrollBarWrapper").css('height', height).css('left', width-10);
	//set the dimensions of the scrollbar (should be 1/6th the height of the page)
	$('#scrollBar').css('height', height/6);
	//if parallaxing is off
	if (!scrollLock) {
		//animate the scrollbar
		//get the proper scrollbar position.  Out of six possible locations on the height of the page, with it already taking up one, divide the remainder by 5
		var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
		//stop scrollbar animation, and set it's top value to the correct position based on the current active highlight
		$('#scrollBar').stop().css('top', scrollBarTop * activeHighlight);
	}
	//center all title content boxes for highlights
	//the content box is 412px tall.  Get the proper 'top' value
	h1 = (height-412) / 2;
	//set the top value
	$(".hlContent").css("top", h1);
	
	//Update parallax
	//Determine the percentage distance down the page
	var downPage = utils.clamp(scrollStep, minScrollStep, maxScrollStep);
	//if parallax is on
	if (scrollLock) {
		//parallax to the current position
		resetParallax(downPage);
	//else, parallax is off
	} else {
		//keep the main content pane below the window
		parallaxTo(-10, false);
	}
	
	//center the top and bottom lines
	//calculate the center-top line's left value (line is 1 wide.  Divide width by two and subtract width).  Also calculate the height of the center-top line (10% of page height).
	$(".hlMidLineTop").stop().css('left', width/2 - 1 + 'px').css('height', 0.1*$(window).height());
	//calculate the center-bottom line's left value
	$(".hlMidLineBot").stop().css('left', width/2 - 1 + 'px');
	//set the top and height values for the center-bottom line.  Line during parallax is 40% of the page height tall
	$(".hlMidLineBot").stop().css('height', 0.4*$(window).height()).css('top', height-(0.4*$(window).height()) + 'px');
	//if parallaxing is off
	if (!scrollLock) {
		//set the top and height values for the center-bottom line to 10% of page height
		$(".hlMidLineBot").stop().css('height', 0.1*$(window).height()).css('top', height-(0.1*$(window).height()) + 'px');
	}
	
	//make sure that the highlight wrappers are all positioned correctly (would use the setHighlight(), but it doesn't have a flag for no animations, and it would not be practical to add one)
	switch (activeHighlight) {
		case 0:
			$('#hl1').css('top', 0-($(window).height()*0) + 'px');
			$('#hl2').css('top', 0 + 'px');
			$('#hl3').css('top', 0-($(window).height()*1) + 'px');
			$('#hl4').css('top', 0-($(window).height()*2) + 'px');
			$('#hl5').css('top', 0-($(window).height()*3) + 'px');
			$('#hl6').css('top', 0-($(window).height()*4) + 'px');
			break;
		case 1:
			$('#hl1').css('top', 0-($(window).height()*1) + 'px');
			$('#hl2').css('top', 0-($(window).height()*1) + 'px');
			$('#hl3').css('top', 0-($(window).height()*1) + 'px');
			$('#hl4').css('top', 0-($(window).height()*2) + 'px');
			$('#hl5').css('top', 0-($(window).height()*3) + 'px');
			$('#hl6').css('top', 0-($(window).height()*4) + 'px');
			break;
		case 2:
			$('#hl1').css('top', 0-($(window).height()*1) + 'px');
			$('#hl2').css('top', 0-($(window).height()*2) + 'px');
			$('#hl3').css('top', 0-($(window).height()*2) + 'px');
			$('#hl4').css('top', 0-($(window).height()*2) + 'px');
			$('#hl5').css('top', 0-($(window).height()*3) + 'px');
			$('#hl6').css('top', 0-($(window).height()*4) + 'px');
			break;
		case 3:
			$('#hl1').css('top', 0-($(window).height()*1) + 'px');
			$('#hl2').css('top', 0-($(window).height()*2) + 'px');
			$('#hl3').css('top', 0-($(window).height()*3) + 'px');
			$('#hl4').css('top', 0-($(window).height()*3) + 'px');
			$('#hl5').css('top', 0-($(window).height()*3) + 'px');
			$('#hl6').css('top', 0-($(window).height()*4) + 'px');
			break;
		case 4:
			$('#hl1').css('top', 0-($(window).height()*1) + 'px');
			$('#hl2').css('top', 0-($(window).height()*2) + 'px');
			$('#hl3').css('top', 0-($(window).height()*3) + 'px');
			$('#hl4').css('top', 0-($(window).height()*4) + 'px');
			$('#hl5').css('top', 0-($(window).height()*4) + 'px');
			$('#hl6').css('top', 0-($(window).height()*4) + 'px');
			break;
		case 5:
			$('#hl1').css('top', 0-($(window).height()*1) + 'px');
			$('#hl2').css('top', 0-($(window).height()*2) + 'px');
			$('#hl3').css('top', 0-($(window).height()*3) + 'px');
			$('#hl4').css('top', 0-($(window).height()*4) + 'px');
			$('#hl5').css('top', 0-($(window).height()*5) + 'px');
			$('#hl6').css('top', 0-($(window).height()*5) + 'px');
			break;
		default:
			break;
	}
}
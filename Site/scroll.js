/* Scrolling Code */
/** COPYRIGHT DANIEL TIMKO 2014 **/

//globals pertaining to scrolling
//How far the user has scrolled.  Starts neutral at 0.  Repurposed between parallax and non-parallax
var scrollStep = 0;
//Min/Max scrollStep value for parallaxing
var maxScrollStep = 0;
var minScrollStep = 0;
//variable determining if animations have been stopped on parallax scroll
var parallaxTitleAnimation = false;
//list of "steps down page" for each inViewParallax element.  Stores the scrollStep value when the item first appears on the page
//elements with the inViewParallax tag will begin parallaxing only when they become visible.  This is useful for elements that are an unkown distance
//down the page.  E.G. a video element for an article
var inViewParallaxSteps = [];
//Variable denoting if parallax is on or off (false is off)
var scrollLock = false;

//Variable that determines if the view button gets animated on page load (no if the page was loaded into a specific highlight)
var viewButtonNormalBehavior = true;

//handle the dragging of the scrollbar
//variable showing the state of the mouse
var mouseIsDown = false;
//position of the scrollbar in the window
var scrollBarPos = 0;

//On mousedown over the scrollbar
$('#scrollBar').mousedown(function() {
	//set the mousedown variable to true
	mouseIsDown = true;
});

//On mouseup anywhere on the page.
//The reason for this is so that the user can move the mouse anywhere on the page while scrolling IF the mouse is held down
$('html').mouseup(function() {
	//set the mousedown variable to false
	mouseIsDown = false;
	//reset the css properties.  Re-enable text highlighting and return the cursor to normal
	$('html').css({
		"-webkit-touch-callout": "all",
		"-webkit-user-select": "all",
		"-moz-user-select": "all",
		"-ms-user-select": "all",
		"user-select": "all",
		"cursor": "auto"
	});
//On mousemove anywhere on the page, pass the event to a function
}).mousemove(function(event) {
	//if the mouse is down
	if (mouseIsDown) {
		//disable text highlighting and set the cursor to the n-resize (up-down arrow)
		$('html').css({
			"-webkit-touch-callout": "none",
			"-webkit-user-select": "none",
			"-moz-user-select": "none",
			"-ms-user-select": "none",
			"user-select": "none",
			"cursor": "n-resize"
		});
		//set the position of the middle of the scrollbar to the mouse's y position
		scrollBarPos = utils.clamp(event.pageY - Math.round($('#scrollBar').height()/2), 0, $(window).height()-$('#scrollBar').height());
		//calculate dem scrolls!
		calculateScroll();
	}
});

//function to handle scrollbar's movement
function calculateScroll() {
	//height that results from subtracting the bar's height from the window's height.  Useful for calculating position
	var barHeight = $(window).height() - $('#scrollBar').height();
	//if parallaxing is enabled
	if (scrollLock) {
		//parallax to the clamped percentage value of the scrollbar position (based on mouse position).  Do not animate
		parallaxTo(utils.clamp((scrollBarPos/barHeight)*100, 0, $(window).height()-$('#scrollBar').height()), false);
	//else, parallaxing is disabled
	} else {
		//animate the scrollbar, stopping the previious animation.  This prevents the calling of setHighlight() in rapid succession
		//If the animation finishes
		$('#scrollBar').stop().animate({top: scrollBarPos}, 75, function() {
			//determine the length of each of the 6 possible scrollbar positions
			var changeHeight = barHeight/5;
			//if the scrollbar ends up in the first position
			if (scrollBarPos < changeHeight) {
				//if the first highlight is not currently active
				if (activeHighlight != 0) {
					//set the first highlight to active
					setHighlight(0);
				//else, the first highlight is active
				} else {
					//scroll the bar BACK to the position from which it was grabbed by the user.  The scrolling code is explained at length in other files
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * 0}, 100);
				}
			//else, if the scrollbar ends up in the second position
			} else if (scrollBarPos >= changeHeight && scrollBarPos < changeHeight*2) {
				//if the second highlight is not currently active
				if (activeHighlight != 1) {
					//set the second highlight to active
					setHighlight(1);
				//else, the second highlight is active
				} else {
					//scroll the bar BACK to the position from which it was grabbed by the user
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * 1}, 100);
				}
			//else, if the scrollbar ends up in the third position
			} else if (scrollBarPos >= changeHeight*2 && scrollBarPos < changeHeight*3) {
				//if the third highlight is not currently active
				if (activeHighlight != 2) {
					//set the third highlight to active
					setHighlight(2);
				//else, the third highlight is active
				} else {
					//scroll the bar BACK to the position from which it was grabbed by the user
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * 2}, 100);
				}
			//else, if the scrollbar ends up in the fourth position
			} else if (scrollBarPos >= changeHeight*3 && scrollBarPos < changeHeight*4) {
				//if the fourth highlight is not currently active
				if (activeHighlight != 3) {
					//set the fourth highlight to active
					setHighlight(3);
				//else, the fourth highlight is active
				} else {
					//scroll the bar BACK to the position from which it was grabbed by the user
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * 3}, 100);
				}
			//else, if the scrollbar ends up in the fifth position
			} else if (scrollBarPos >= changeHeight*4 && scrollBarPos < changeHeight*5) {
				//if the fifth highlight is not currently active
				if (activeHighlight != 4) {
					//set the fifth highlight to active
					setHighlight(4);
				//else, the fifth highlight is active
				} else {
					//scroll the bar BACK to the position from which it was grabbed by the user
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * 4}, 100);
				}
			//else, if the scrollbar ends up in the sixth position
			} else if (scrollBarPos >= changeHeight*5) {
				//if the sixth highlight is not currently active
				if (activeHighlight != 5) {
					//set the sixth highlight to active
					setHighlight(5);
				//else, the sixth highlight is active
				} else {
					//scroll the bar BACK to the position from which it was grabbed by the user
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * 5}, 100);
				}
			}
		});
	}
}

//scroll function.  Boolean 'dir' determines scroll direction (false = down, true = up)
function scroll(dir) {
	//if parallax is off
	if (!scrollLock) {
		//if the scroll direction is up
		if (dir) {
			//add to the scroll clicks
			scrollStep += 1;
			//if 3 clicks have been thrown in the up direction
			if (scrollStep > 2) {
				//reset the number of scroll clicks
				scrollStep = 0;
				//if the active highlight is not the first highlight
				if (activeHighlight > 0) {
					//switch to the highlight before the current active highlight
					setHighlight(activeHighlight-1);
					//animate the scrollbar
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * activeHighlight}, 100);
				}
			}
		//if the scroll direction is down
		} else {
			//subtract from the scroll clicks
			scrollStep -= 1;
			//if 3 clicks have been thrown in the down direction
			if (scrollStep < -2) {
				//reset the number of scroll clicks
				scrollStep = 0;
				//if the active highlight is not the last highlight
				if (activeHighlight < 5) {
					//switch to the highlight after the current active highlight
					setHighlight(activeHighlight+1);
					//animate the scrollbar
					var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
					$('#scrollBar').stop().animate({top: scrollBarTop * activeHighlight}, 100);
				}
			}
		}
	//else, parallax is on
	} else {
		//if title animation has not been stopped yet, stop it to prevent visual glyches
		if (parallaxTitleAnimation == false) {
			//show that the title animation has been successfully stopped
			parallaxTitleAnimation = true;
			var parent = $("#hl" + (activeHighlight+1)).children(".hlContent");
			//jump the bottom line to end of it's animation
			parent.parent().children(".hlMidLineBot").stop().css('height', 0.4*$(window).height() + 'px').css('top', $(window).height() - (0.4*$(window).height()));
			//jump both the view button and the line to the end of their animations
			parent.children(".hlMidLineMid").stop().css('width', '0px');
			parent.children(".hlViewButton").stop().css('opacity', '0.0').css('cursor', 'auto');
		}
		//if the scroll direction is up
		if (dir) {
			//if the current scroll position is above the minimum
			if (scrollStep > minScrollStep) {
				//subtract from the scroll clicks
				scrollStep = Math.round(scrollStep);
				scrollStep -= 1;
				//calculate the percentage distance down the page
				var downPage = (scrollStep / maxScrollStep) * 100;
				//parallax to the newly scrolled position, animating changes
				parallaxTo(downPage, true);
			}
		//else, the scroll direction is down
		} else {
			//if the current scroll position is below the maximum
			if (scrollStep < maxScrollStep) {
				//add to the scroll clicks
				scrollStep = Math.round(scrollStep);
				scrollStep += 1;
				//calculate the percentage distance down the page
				var downPage = (scrollStep / maxScrollStep) * 100;
				//parallax to the newly scrolled position, animating changes
				parallaxTo(downPage, true);
			}
		}
	}
}

//The setHighlight function sets the active highlight.  It accepts the number of the highlight to switch to
function setHighlight(num) {
	//globaly define which highlight is active
	activeHighlight = num;
	
	//set the active highlight link to inactive
	//set the active link text to inactive
	$(".hlLinkTextActive").attr('class', 'hlLinkText');
	//set the active link underline to inactive
	$(".hlLinkLineActive").attr('class', 'hlLinkLine');
	//set the active link bullet point to inactive
	$(".hlLinkCircleActive").attr('class', 'hlLinkCircle');
	
	//set the new highlight's elements to active
	//set the new link text to active
	$("#hlLink" + (activeHighlight+1)).children(".hlLinkText").attr('class', 'hlLinkTextActive');
	//set the new link underline to active
	$("#hlLink" + (activeHighlight+1)).children(".hlLinkLine").attr('class', 'hlLinkLineActive');
	//set the new link bullet point to active
	$("#hlLink" + (activeHighlight+1)).children(".hlLinkCircle").attr('class', 'hlLinkCircleActive');
	
	//animate the active link to the default state (animations handled in css)
	//set the active text's opacity to 0.8
	$(".hlLinkTextActive").css('opacity', '0.8');
	//set the active text's left positioning to 32px
	$(".hlLinkTextActive").css('left', '32px');
	//set the active line's width to 100px
	$(".hlLinkLineActive").css('width', '100px');
	
	//check if the sidebar is in focus.  If it is, animate links differently
	//if the sidebar is in focus
	if (sidebarFocus) {
		//animate all non-active links accordingly (animations handled in css)
		$(".hlLinkText").css('opacity', '0.8');
		$(".hlLinkText").css('left', '32px');
		$(".hlLinkLine").css('width', '50px');
		$(".hlLinkCircle").css('background-color', 'rgba(250, 250, 250, 0)');
	//else, the sidebar is not in focus
	} else {
		//animate all non-active links accordingly (animations handled in css)
		$(".hlLinkText").css('opacity', '0.15');
		$(".hlLinkText").css('left', '24px');
		$(".hlLinkLine").css('width', '8px');
		$(".hlLinkLine").css('background-color', '#B2B2B2');
		$(".hlLinkCircle").css('background-color', 'rgba(250, 250, 250, 0)');
	}
	
	//animate the scrollbar
	var scrollBarTop = ($(window).height() - $('#scrollBar').height()) / 5;
	$('#scrollBar').stop().animate({top: scrollBarTop * activeHighlight}, 100);
	
	//if the highlight to be switched to is #0
	if (num == 0) {
		//animate all of the highlights to the correct position (6 total)
		$('#hl1').stop().animate({top: 0-($(window).height()*0)}, 200);
		$('#hl2').stop().animate({top: 0}, 200);
		$('#hl3').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl4').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl5').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl6').stop().animate({top: 0-($(window).height()*4)}, 200);
	//logic continues for an unreasonable amount of code re-writes.  I could think of no easier way to accomplish this, unfortunately
	} else if (num == 1) {
		$('#hl1').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl2').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl3').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl4').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl5').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl6').stop().animate({top: 0-($(window).height()*4)}, 200);
	} else if (num == 2) {
		$('#hl1').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl2').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl3').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl4').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl5').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl6').stop().animate({top: 0-($(window).height()*4)}, 200);
	} else if (num == 3) {
		$('#hl1').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl2').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl3').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl4').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl5').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl6').stop().animate({top: 0-($(window).height()*4)}, 200);
	} else if (num == 4) {
		$('#hl1').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl2').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl3').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl4').stop().animate({top: 0-($(window).height()*4)}, 200);
		$('#hl5').stop().animate({top: 0-($(window).height()*4)}, 200);
		$('#hl6').stop().animate({top: 0-($(window).height()*4)}, 200);
	} else if (num == 5) {
		$('#hl1').stop().animate({top: 0-($(window).height()*1)}, 200);
		$('#hl2').stop().animate({top: 0-($(window).height()*2)}, 200);
		$('#hl3').stop().animate({top: 0-($(window).height()*3)}, 200);
		$('#hl4').stop().animate({top: 0-($(window).height()*4)}, 200);
		$('#hl5').stop().animate({top: 0-($(window).height()*5)}, 200);
		$('#hl6').stop().animate({top: 0-($(window).height()*5)}, 200);
	}
	
	//reset properties for all non-active elements in preperation for future animation
	//set the center-top line's height to 30% of the page's height
	$(".hlMidLineTop").stop().css('height', 0.3*$(window).height() + 'px');
	//set the center-middle line's width to 0
	$(".hlMidLineMid").stop().css('width', '0px');
	//set the center-bottom line's height to 30% of the page height, and top to properly fit it on the page
	$(".hlMidLineBot").stop().css('height', 0.3*$(window).height() + 'px').css('top', $(window).height()-(0.3*$(window).height()));
	//set the title to 100px above the final position, so it can animate into frame.  Set it's opacity to 0
	$(".hlMainTitle").stop().css('top', '-100px').css('opacity', '0.0');
	//set the description to 100px above the final position, so it can animate into frame.  Set it's opacity to 0
	$(".hlMainDesc").stop().css('top', '-100px').css('opacity', '0.0');
	//set the view button to 100px below the final position, so it can animate into frame.  Set it's opacity to 0
	$(".hlViewButton").stop().css('top', '100px').css('opacity', '0.0');
	
	//position and animate the active properties for the new active highlight
	//animate the active center-top line's height down from 30% page height to 10% page height over 3 seconds
	$("#hl" + (num+1)).children(".hlMidLineTop").animate({height: 0.1*$(window).height() + 'px'}, 3000);
	//animate the active center-bottom line's height down from 30% page height to 10% page height over 3 seconds.  Also animate the top variable so it is smooth.
	$("#hl" + (num+1)).children(".hlMidLineBot").animate({height: 0.1*$(window).height() + 'px', top: $(window).height()-(0.1*$(window).height()) + 'px'}, 3000);
	//on a delay, animate in the active title, description, middle line, and 'view' button
	setTimeout(function() {
		//after 300 milliseconds, animate the active center-middle line's width to 600px over 2 seconds
		$("#hl" + (num+1)).children(".hlContent").children(".hlMidLineMid").animate({width: '600px'}, 2000);
	}, 300);
	setTimeout(function() {
		//after 400 milliseconds, animate the active description into position, making it fully opaque over 500 milliseconds
		$("#hl" + (num+1)).children(".hlContent").children(".hlMainDesc").animate({top: '0px', opacity: '1.0'}, 500);
	}, 400);
	setTimeout(function() {
		//after 800 milliseconds, animate the active title into position, making it fully opaque over 500 milliseconds
		$("#hl" + (num+1)).children(".hlContent").children(".hlMainTitle").animate({top: '0px', opacity: '1.0'}, 500);
	}, 800);
	setTimeout(function() {
		//after 1100 milliseconds, if viewButtonNormalBehavior is true, animate the active view button into position, making it fully opaque over 500 milliseconds
		if (viewButtonNormalBehavior) {
			$("#hl" + (num+1)).children(".hlContent").children(".hlViewButton").animate({top: '30px', opacity: '1.0'}, 500);
		}
	}, 1100);
}

//The onLoadScroll() function allows linking to specific highlights.  When the page loads, it will check the url with this funciton to get the 'highlight' variable
function onLoadScroll(urlParam) {
	//get the page url
	try {
		var thisPageURL = document.URL;
		//get all the variables
		var thisURLVars = thisPageURL.split('?');
		//loop through all the variables
		for (var i=0; i<thisURLVars.length; i++) {
			//get the variable's name
			var thisParamName = thisURLVars[i].split('=');
			//if the variable's name is equal to the requested name
			if (thisParamName[0] == urlParam) {
				//return the variable's value
				return thisParamName[1];
			}
		}
	} catch(err) {
		console.log("No specific highlight.  Starting with first");
	}
}
$('#AS4DownloadLink').mouseenter(function() {
	$(this).children('#AS4DownloadImage').stop().animate({left: "278px"}, 150);
	$(this).children('#AS4DownloadText').stop().animate({left: "45px"}, 300);
});
$('#AS4DownloadLink').mouseleave(function() {
	$(this).children('#AS4DownloadImage').stop().animate({left: "243px"}, 300);
	$(this).children('#AS4DownloadText').stop().animate({left: "10px"}, 150);
});
$('#AS4DownloadLinkS').mouseenter(function() {
	$(this).children('#AS4DownloadImage').stop().animate({left: "278px"}, 150);
	$(this).children('#AS4DownloadText').stop().animate({left: "45px"}, 300);
});
$('#AS4DownloadLinkS').mouseleave(function() {
	$(this).children('#AS4DownloadImage').stop().animate({left: "243px"}, 300);
	$(this).children('#AS4DownloadText').stop().animate({left: "10px"}, 150);
});
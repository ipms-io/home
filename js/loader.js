$(document).ready(function () {
	'use strict'
	//indexOf is not supported by IE9>. 
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (elt /*, from*/) {
			var len = this.length >>> 0;

			var from = Number(arguments[1]) || 0;
			from = (from < 0)
				? Math.ceil(from)
				: Math.floor(from);
			if (from < 0)
				from += len;

			for (; from < len; from++) {
				if (from in this &&
					this[from] === elt)
					return from;
			}
			return -1;
		};
	}

	var bgImg = [], img = [], count = 0, translatedCount = 0, percentage = 0;
	$('head').append('<style>#loaderMask .la-anim:before{width:' + percentage + '% !important;}</style>');

	//Creating loader overlay
	$('<div id="loaderMask"><h1 class="la-anim" data-content="0%">0%</h1></div>').css({
		position: 'fixed',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		'text-align': 'center',
		background: '#fff'
	}).appendTo('body');

	//Searching all elemnts in the page for image
	$('*').filter(function () {

		var val = $(this).css('background-image').replace(/url\(/g, '').replace(/\)/, '').replace(/"/g, '').replace(window.location, '');
		var imgVal = $(this).not('script').attr('src');

		if (val !== 'none' && !/linear-gradient/g.test(val) && bgImg.indexOf(val) === -1) {
			bgImg.push(val)
		}

		if (imgVal !== undefined && img.indexOf(imgVal) === -1) {
			img.push(imgVal)
		}

	});

	var imgArray = bgImg.concat(img);
	var toLoad = imgArray.length;
	var toTranslate = 0;

	var lingumaniaLoadedInterval = window.setInterval(function(){
		if (window.Lingumania && window.Lingumania.treeBuilt) {			
			window.clearInterval(lingumaniaLoadedInterval);
			toTranslate = window.Lingumania.toTranslate.length | window.Lingumania.toTranslate;
			if (toTranslate == window.Lingumania.translated)
				translatedCount = toTranslate = 0;
			checkLoading();
		}
	}, 100);
	

	function checkLoading() {
		window.Lingumania.onSegmentTranslated((e) => {
			translatedCount = e;
			completeImageLoading(true);
		});

		$.each(imgArray, function (i, val) { //Adding load and error event
			$('<img />').attr('src', val).bind('load', function () {
				completeImageLoading();
			});

			$('<img />').attr('src', val).bind('error', function () {
				imgError(this);
			});
		});
	}

	function completeImageLoading(translated) {
		if (!translated)
			count++;

		percentage = Math.floor((count + translatedCount) / (toLoad + toTranslate) * 100);
		$('head:last-child').remove();
		$('head').append('<style>#loaderMask .la-anim:before{width:' + percentage + '% !important;}</style>');
		$('#loaderMask .la-anim').html(percentage + '%');
		$('#loaderMask .la-anim').attr('data-content', percentage + '%');
		if (percentage === 100) {
			$('#loaderMask .la-anim').html('100%')
			$('#loaderMask .la-anim:before').css({ 'width': '100%' });
			$('#loaderMask').fadeOut(function () {
				$('#loaderMask').remove()
			})
		}
	}

	//Error handling
	function imgError(arg) {
		$('#loaderMask').remove();
	}
});
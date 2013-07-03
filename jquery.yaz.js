(function($) {

$.fn.yaz = function(uopts) {
"use strict";

var
	zx, zy,	// zoom position (x, y)
	info,	// current infos
	t, t2,	// temp variable

	/* options */
	dopts = {},
	opts = $.extend(dopts, uopts),

	/* functions implementation */
	mouseenter = function() {
		info = {};
		info.url = getimageurl(this);
		info.img = this;

		getimagesize(info.url, function(size) {
			info.size = size;

			$(info.img).data('ezoom').css({'background-image':'url('+info.url+')'}).toggle(true);
			info.ready = true;
		});
	},

	mousemove = function(ev) {
		if(!info.ready)
			return;

		info.ratio = {
			x: parseInt(info.size.w / info.img.width, 10),
			y: parseInt(info.size.h / info.img.height, 10)
		};

		zx = (ev.offsetX * info.ratio.x);
		zy = (ev.offsetY * info.ratio.y);

		/* Note: this works properly but would be better implemented with a factor. */

		t = zx + $(this).data('ezoom').width();
		if(t > info.size.w) {
			zx -= t - info.size.w;
		}
		t = zy + $(this).data('ezoom').height();
		if(t > info.size.h) {
			zy -= t - info.size.h;
		}

		$(this).data('ezoom').css({
			'background-position-x': -zx,
			'background-position-y': -zy
		});
	},

	mouseleave = function() {
		$(this).data('ezoom').toggle(false);
		info.ready = false;
	},

	getimageurl = function(el) {
		return $(el).attr('rel') || $(el).data('yaz-rel') || $(el).parents('a').attr('href');
	},

	getimagesize = function(url, cb) {
		t = new Image();
		t.onload = function() {
			cb({
				w: this.width,
				h: this.height
			});

		};
		t.src = url;
	};

	return this.each(function() {
		$(this)
		 .addClass('yaz-target')
		 .wrap('<div class="yaz-container" />')
		 .after('<div class="yaz-zoom" />')
		 .on('mouseenter', mouseenter)
		 .on('mousemove', mousemove)
		 .on('mouseleave', mouseleave);

		$(this).data('ezoom', $(this).next('.yaz-zoom'));
	});
};

})(jQuery);

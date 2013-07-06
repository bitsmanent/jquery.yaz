(function($) {

$.fn.yaz = function(uopts) {
"use strict";

var
	info,	// current infos
	x, y,	// position (x, y)
	t, 	// temp variable

	/* options */
	dopts = {
		onActivate: 'mouseenter',
		onDeactivate: 'mouseleave',
		onUpdate: 'mouseover'
	},
	opts = $.extend(dopts, uopts),

	/* functions implementation */
	activate = function() {
		info = {};
		info.url = getimageurl(this);
		info.img = this;

		getimagesize(info.url, function(size) {
			info.size = size;

			/* activate */
			if(info.size.w <= info.img.width && info.size.h <= info.img.height)
				return;
			$(info.img).data('ezoom').css({'background-image':'url('+info.url+')'}).addClass('yaz-visible');
			info.ready = true;
		});
	},

	update = function(ev) {
		if(!info.ready)
			return;

		x = ev.offsetX * parseInt(info.size.w / info.img.width, 10);
		y = ev.offsetY * parseInt(info.size.h / info.img.height, 10);

		/* Note: this works properly but would be better implemented with a factor. */

		t = x + $(this).data('ezoom').width();
		if(t > info.size.w) {
			x -= t - info.size.w;
		}
		t = y + $(this).data('ezoom').height();
		if(t > info.size.h) {
			y -= t - info.size.h;
		}

		$(this).data('ezoom').css({
			'background-position-x': -x,
			'background-position-y': -y
		});
	},

	deactivate = function() {
		$(this).data('ezoom').removeClass('yaz-visible');
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
		 .on(onActivate, activate)
		 .on(onUpdate, update)
		 .on(onDeactivate, deactivate);
		
		$(this)
		 .data('ezoom', $(this).parent().children('.yaz-zoom'));
	});
};

})(jQuery);

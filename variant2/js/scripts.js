$(function(){
    $.fn.exists = function(callback) {
		var args = [].slice.call(arguments, 1);
		if (this.length) {
			callback.call(this, args);
		}
		return this;
	};

	// Navigation
	var nav = $('nav'),
        menu = $('.menu'),
		menuItem = menu.find('li'),
        container = $('.layout'),
        page = $('.page'),
		lang = $('.lang');

    var hash = window.location.hash;
	if(hash.length > 0){
        page.removeClass('active');
		$(hash).addClass('active');
        switchMenuItem($(hash).index());
	}
    
	menuItem.find('a').click(function() {
		var target = $(this).attr('href'),
            index = $(this).parent().index(),
            current = page.filter('.active');

		switchMenuItem(index);

		if($(window).width() > 740){
			if(index < current.index()){
				container.height($(target).outerHeight(true));
				$('body').css('overflow', 'hidden');
				$(target).addClass('frombottom');
			}

			setTimeout(function(){
				$(target).addClass('scrolling').on('transitionend', function(){
					current.removeClass('active');
					$(this).addClass('active').removeClass('scrolling').removeClass('frombottom');
					container.add('body').removeAttr('style');
				});
			}, 100);
		}else{
			$('html, body').stop().animate({
				scrollTop: $(target).offset().top
			}, 750);
		}

        
		nav.removeClass('open');
		return false;
	});

	$('header .logo').click(function(){
		var target = $(this).attr('href');

		switchMenuItem(0);

		if($(window).width() > 740){
			$(target).addClass('scrolling').on('transitionend', function(){
				$(this).addClass('active').removeClass('scrolling');
			});
		}else{
			$('html, body').stop().animate({
				scrollTop: $(target).offset().top
			}, 750);
		}
	});

	menuItem.mouseenter(function(){
		$(this).parent().find(menuItem).removeClass('active');
		$(this).addClass('active');
	});

	menu.mouseleave(function(){
		$(this).find(menuItem).removeClass('active');
		$(this).find('.current').addClass('active');
	});
    
    function switchMenuItem(index){
		menu.find(menuItem).removeClass('current active');
        menu.each(function(){
            $(this).find(menuItem).eq(index).addClass('current active');
        });
    }

	lang.find('li').mouseenter(function(){
		$(this).parent().find('li').removeClass('active');
		$(this).addClass('active');
	}).find('a').click(function(){
		lang.find('li').removeClass('current active');
		$(this).parent().addClass('current active');
	});
	lang.mouseleave(function(){
		$(this).find('li').removeClass('active');
		$(this).find('.current').addClass('active');
	});

	$('.icon-menu').click(function(){
		nav.addClass('open');
	});
	$('.close').click(function(){
		nav.removeClass('open');
	});

	if($(window).width() < 740) {
		var lastScrollTop = 0;
		$(window).scroll(function(event){
			var st = $(this).scrollTop();
			if (st > lastScrollTop){
				$('header').addClass('hidden');
			} else {
				$('header').removeClass('hidden');
			}
			lastScrollTop = st;
		});
	}

	// Carousel
	var carousel = $('.carousel');

	carousel.on('jcarousel:reload jcarousel:create', function () {
		$(this).jcarousel('items').width(carousel.width()-8);
	}).jcarousel({
		wrap: 'circular'
	});

	$('.carousel-pagination').on('jcarouselpagination:active', 'li', function() {
		$(this).addClass('active');
	}).on('jcarouselpagination:inactive', 'li', function() {
		$(this).removeClass('active');
	}).on('click', function(e) {
		e.preventDefault();
	}).jcarouselPagination({
		perPage: 1,
		item: function(page) {
			return '<li><a href="#' + page + '">' + page + '</a></li>';
		}
	});

	carousel.swipe({
		swipeLeft: function(event, direction, distance, duration, fingerCount) {
			carousel.jcarousel('scroll', '+=1');
		},
		swipeRight: function(event, direction, distance, duration, fingerCount) {
			carousel.jcarousel('scroll', '-=1');
		}
	});
    
    var scrollPane = $('.scroll-pane');
    
    scrollPane.exists(function(){
       var apis = [];

        if($(this).width() > 840) {
            scrollPane.each(function () {
                    apis.push($(this).jScrollPane({autoReinitialise: true}).data().jsp);
                }
            );
        } 
    });

	$(window).resize(function(e) {
		carousel.jcarousel('reload');
        
        scrollPane.exists(function(){
           if($(this).width() <= 840){
			if (apis.length) {
				$.each(apis, function(){
							this.destroy();
						}
				)
				apis = [];
			}
		}else{
			scrollPane.jScrollPane({autoReinitialise: true}).data().jsp
		} 
        });
	});


});

(function() {

    var TOP = 150;
    var BOTTOM = 100;

    var scrolling = false;

    var _setActive = function(tab) {
        $('nav > a').removeClass('active');
        tab && tab.addClass('active');
    };

    var _init = function() {
        var body = $('html, body');
        var size = $(window).height() - TOP - BOTTOM;

        $('section').css('min-height', size);

        var offsets = {
            features: $('#features').offset().top - TOP,
            what: $('#what-for').offset().top - TOP,
            pricing: $('#pricing').offset().top - TOP,
            contact: $('#contact').offset().top - TOP
        };

        $('nav > a').on('click', function(e) {
            e.preventDefault();

            var _this = $(this);

            _setActive(_this);

            var id = _this.data('id');
            var top = $('#' + id).offset().top;

            scrolling = true;
            body.stop().animate({ scrollTop: top }, '500', 'swing', function() {
                scrolling = false;
            });
        });

        $(window).on('scroll', function() {
            var scroll = $(window).scrollTop();

            if (scroll >= offsets.contact) {
                scrolling || _setActive($('[data-id="contact"]'));
            } else if (scroll >= offsets.pricing) {
                scrolling || _setActive($('[data-id="pricing"]'));
            } else if (scroll >= offsets.what) {
                scrolling || _setActive($('[data-id="what-for"]'));
            } else if (scroll >= offsets.features) {
                scrolling || _setActive($('[data-id="features"]'));
            } else {
                scrolling || _setActive(null);
            }
        });

        $('#send').on('click', function() {
            $('#contact input, #contact textarea').removeClass('error');
            $('#errors').text('');

            var name = $('#name').val();
            var email = $('#email').val();
            var phone = $('#phone').val();
            var message = $('#message').val();

            var error = false;

            if (!name.length) {
                $('#name').addClass('error');
                error = true;
            }

            if (!email.length) {
                $('#email').addClass('error');
                error = true;
            }

            if (!message.length) {
                $('#message').addClass('error');
                error = true;
            }

            !error && $.post('/api/public/contact', {
                name: name,
                email: email,
                phone: phone,
                message: message
            }).fail(function(response) {
                $('#errors').text(response);
            });

            return false;
        });
    };

    return {
        start: function() {
            $(_init);
        }
    }

})().start();

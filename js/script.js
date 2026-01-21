(function ($) {
    console.log("Script loaded");
    'use strict';
    //smooth scroll to anchor
    $('a[href^="#"]').on('click', function () {
        $('html, body').animate({scrollTop: $(this.hash).offset().top - 20}, 1000);
        return false;
    });
    $(window).load(function () {
        var preload = $('.preloader');
        if (preload.length > 0) {
            preload.delay(800).fadeOut(500);
        }
    });
    $(document).scroll( function () {
        console.log("Scroll event");
        let scrollPos = $(this).scrollTop();

        if (scrollPos > 100) {
            $('#backtotop').fadeIn();
        }
        else {
            $('#backtotop').fadeOut();
        }
    });
    $('#backtotop').on('click', function () {
        $('html, body').animate({scrollTop: 0}, 800);
        return false;
    });
    $('.skills-slider .swiper')
    const skillsSlider = new Swiper('.skills-slider .swiper', {
        slidesPerView: 4,
        spaceBetween: 2,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            480: {
                slidesPerView: 2,
            },
            640: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            },
        }
    });

    $('.kr-accordion').each(function () {
        const accordion = $(this);
        accordion.find('.card').first().addClass('active').find('.card-body').slideDown();

        accordion.find('.card-header').on('click', function () {
            const card = $(this).parent();
            if (card.hasClass('active')) {
                card.removeClass('active');
                card.find('.card-body').slideUp();
            } else {
                accordion.find('.card').removeClass('active');
                accordion.find('.card-body').slideUp();
                card.addClass('active');
                card.find('.card-body').slideDown();
            }
        });
    });

    const $grid = jQuery('#Grid');

    if (!$grid.length) return;

    const iso = new Isotope($grid[0], {
        itemSelector: '.project',
        layoutMode: 'fitRows',
        fitRows: {
            gutter: 30
        }
    });

    jQuery('.projects__filter').on('click', function () {

        let filter = jQuery(this).data('filter');

        if (filter === 'all') {
            filter = '*';
        } else {
            filter = `.project--${filter}`;
        }

        jQuery('.projects__filter').removeClass('is-active');
        jQuery(this).addClass('is-active');

        iso.arrange({ filter });
    });


    let counted = false; // чтобы счетчик сработал только один раз

    function runCounter() {
        $('.icon-box--counter').each(function() {
            let $this = $(this),
                countTo = parseInt($this.data('count')),
                $counter = $this.find('.icon-box__counter');

            $({ countNum: 0 }).animate({ countNum: countTo }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $counter.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $counter.text(this.countNum);
                }
            });
        });
    }

    function isScrolledIntoView(elem) {
        let $elem = $(elem),
            docViewTop = $(window).scrollTop(),
            docViewBottom = docViewTop + $(window).height(),
            elemTop = $elem.offset().top,
            elemBottom = elemTop + $elem.height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $(window).on('scroll load', function() {
        if (!counted && isScrolledIntoView('.facts')) {
            runCounter();
            counted = true;
        }
    });

    let projects = [];
    let galleryTop = null;
    let galleryThumbs = null;

    /* Load JSON */
    $.getJSON('./data/projects.json', function (data) {
        projects = data;
        console.log("Projects JSON loaded" , projects);
    });


    /* Open project */
    function openProject(id) {
        const project = projects.find(p => p.id == id);
        console.log("Opening project", id, project);
        if (!project) return;

        const $modal = $('#project-modal');
        $modal.addClass('is-open');

        /* Title */
        $modal.find('.project__title').text(project.title);

        /* Description */
        const $desc = $modal.find('.project__description');
        $desc.empty();

        $.each(project.description, function (_, text) {
            $('<p>', {
                class: 'pr_paragraph',
                text: text
            }).appendTo($desc);
        });

        /* Meta */
        $modal.find('.project-role').text(project.role);
        $modal.find('.project-tools').text(project.tools);
        $modal.find('.project-url').attr('href',project.url);

        const $cat = $modal.find('.project-category');
        $cat.text(project.type);

        /* Swiper slides */
        const $top = $modal.find('.gallery-top .swiper-wrapper');
        const $thumbs = $modal.find('.gallery-thumbs .swiper-wrapper');

        $top.empty();
        $thumbs.empty();

        $.each(project.images, function (_, src) {
            $('<div>', {
                class: 'swiper-slide',
                css: {
                    backgroundImage: `url(${src})`
                }
            }).appendTo($top);

            $('<div>', {
                class: 'swiper-slide',
                css: {
                    backgroundImage: `url(${src})`
                }
            }).appendTo($thumbs);
        });

        initSwiper();
    }

    /* Swiper init */
    function initSwiper() {
        if (galleryTop) {
            galleryTop.destroy(true, true);
            galleryTop = null;
        }

        if (galleryThumbs) {
            galleryThumbs.destroy(true, true);
            galleryThumbs = null;
        }

        galleryThumbs = new Swiper('.gallery-thumbs', {
            slidesPerView: 3,
            spaceBetween: 5,
            freeMode: true,

        });

        galleryTop = new Swiper('.gallery-top', {
            spaceBetween: 5,
            thumbs: {
                swiper: galleryThumbs
            }
        });
    }

    /* Open popup */
    $(document).on('click', '.project-card', function () {
        openProject($(this).attr('data-project-id'));
    });

    /* Close popup */
    $(document).on('click', '.project-modal.is-open', function (e) {
        if ($(e.target).closest('.project-modal__content').length === 0) {
            $('#project-modal').removeClass('is-open');
        }
    });


})(jQuery);
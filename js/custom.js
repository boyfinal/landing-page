/*
------------------------------------------------------------------------
* Template Name    : Softie | SaaS & Software Html5 Landing Page      * 
* Author           : ThemesBoss                                       *
* Version          : 1.0.0                                            *
* Created          : September 2018                                   *
* File Description : Main Js file of the template                     *
*-----------------------------------------------------------------------
*/
$(window).on('scroll', function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 50) {
        $(".sticky").addClass("stickyadd");
    } else {
        $(".sticky").removeClass("stickyadd");
    }
});

function play() {
    document.getElementsByClassName('background-video')[0].innerHTML = `<iframe id="ytplayer" type="text/html" width="1260" height="708.75"
    src="https://www.youtube.com/embed/8leorFMy0rg?autoplay=1"
    frameborder="0" allowfullscreen>`;
}

$('.nav-item a').on('click', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 50
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
});

$(document).on('click', '.navbar-collapse.show', function (e) {
    if ($(e.target).is('a')) {
        $(this).collapse('hide');
    }
});

$("#navbarCollapse").scrollspy({
    offset: 70
});

$('.img-zoom').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-fade',
    gallery: {
        enabled: true,
        navigateByImgClick: true,
        preload: [0, 1]
    }
});


$("#owl-demo").owlCarousel({
    autoPlay: 10000,
    items: 3,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [979, 3]
});

$(window).on('scroll', function () {
    if ($(this).scrollTop() > 100) {
        $('.back_top').fadeIn();
    } else {
        $('.back_top').fadeOut();
    }
});
$('.back_top').on('click', function () {
    $("html, body").animate({
        scrollTop: 0
    }, 1000);
    return false;
});

(function () {
    function validEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
    }

    function validateHuman(honeypot) {
        if (honeypot) { //if hidden form filled up
            console.log("Robot Detected!");
            return true;
        } else {
            console.log("Welcome Human!");
        }
    }

    // get all data in form and return object
    function getFormData(form) {
        var elements = form.elements;

        var fields = Object.keys(elements).filter(function (k) {
            return (elements[k].name !== "honeypot");
        }).map(function (k) {
            if (elements[k].name !== undefined) {
                return elements[k].name;
                // special case for Edge's html collection
            } else if (elements[k].length > 0) {
                return elements[k].item(0).name;
            }
        }).filter(function (item, pos, self) {
            return self.indexOf(item) == pos && item;
        });

        var formData = {};
        fields.forEach(function (name) {
            var element = elements[name];

            // singular form elements just have one value
            formData[name] = element.value;

            // when our element has multiple items, get their values
            if (element.length) {
                var data = [];
                for (var i = 0; i < element.length; i++) {
                    var item = element.item(i);
                    if (item.checked || item.selected) {
                        data.push(item.value);
                    }
                }
                formData[name] = data.join(', ');
            }
        });

        // add form-specific values into the data
        formData.formDataNameOrder = JSON.stringify(fields);
        formData.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
        formData.formGoogleSendEmail = form.dataset.email || ""; // no email by default

        //console.log(formData);
        return formData;
    }

    function handleFormSubmit(event) { // handles form submit without any jquery
        event.preventDefault(); // we are submitting via xhr below
        var form = event.target;
        var form2 = $(form);
        var method = form2.attr('method'),
            notific = $('#mail-notification');
        form2.find('.input-item').removeClass('error');
        form2.find('[type=submit]').attr('disabled', '').text('Đang gửi...');
        var data = getFormData(form); // get the values submitted in the form

        /* OPTION: Remove this comment to enable SPAM prevention, see README.md
	  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
		return false;
	  }
	  */
        if (data.email && !validEmail(data.email)) { // if email is not valid show error
            var invalidEmail = form.querySelector(".email-invalid");
            if (invalidEmail) {
                invalidEmail.style.display = "block";
                return false;
            }
        } else {
            // disableAllButtons(form);

            var url = form.action;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            // xhr.withCredentials = true;
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                // console.log(xhr.status, xhr.statusText);
                // console.log(xhr.responseText);
                var result = JSON.parse(xhr.responseText);
                form2.find('[type=submit]').removeAttr('disabled').text('Đăng ký');
                if (result.result == 'error') {
                    notific.find('.modal-body p').html(result.error);
                    notific.removeClass('success-notification').addClass('error-notification');
                } else {
                    form2.find('[name=name]').val('');
                    form2.find('[name=email]').val('');
                    form2.find('[name=phone]').val('');
                    form2.find('[name=shopname]').val('');
                    form2.find('[name=subdomain]').val('');
                    notific.find('.modal-body p').html("Đăng kí thành công!");
                    notific.removeClass('error-notification').addClass('success-notification');
                    setTimeout(function () {
                        $('#signup-modal').modal('hide');
                        notific.modal('hide');
                    }, 3000);
                }
                notific.modal('show');
                return;
            };
            // url encode form data for sending as post data
            var encoded = Object.keys(data).map(function (k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
            }).join('&');
            xhr.send(encoded);
        }
    }

    function loaded() {
        console.log("Contact form submission handler loaded successfully.");
        // bind to the submit event of our form
        var forms = document.querySelectorAll("form.gform");
        for (var i = 0; i < forms.length; i++) {
            forms[i].addEventListener("submit", handleFormSubmit, false);
        }
        $('#signup-modal').on('hidden.bs.modal', function () {
            $('#signup-modal input').val('');
        });
        $('input[name=shopname]').on('input', function (e) {
            inputTarget = e.target;
            myReq = _reqAnimation(updateDomain);
        });
    };
    document.addEventListener("DOMContentLoaded", loaded, false);

    var _reqAnimation = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame;

    var _cancelAnimation = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    var myReq;
    var start;
    var inputTarget;

    function updateDomain(time) {
        if (!start) start = time;
        if (time - start > 100) {
            _cancelAnimation(myReq);
            var shopname = $(inputTarget).val();
            var subdomain = shopname.toLowerCase().replace(/[^\w\s]/gi, ' ').split(' ').join('-') + '.aibo.vn';
            if (inputTarget.id === 'shopname1') $('#signup-modal input[name=subdomain]').val(subdomain);
            else $('#signup input[name=subdomain]').val(subdomain);
            start = null;
        } else {
            _cancelAnimation(myReq);
            myReq = _reqAnimation(updateDomain);
        }
    }

    function disableAllButtons(form) {
        var buttons = form.querySelectorAll("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }
})();
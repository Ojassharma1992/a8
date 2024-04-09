$(document).ready(function() {
    $('#chat-box').delay(1000).fadeIn(100);
});

$(document).ready(function() {
    $('#mycanvas').click(function() {
        $('#welcomeDiv').show();
    });
});

$(document).ready(function() {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', 'media/iicme4.mp3');

    audioElement.addEventListener(
        'ended',
        function() {
            this.play();
        },
        false,
    );

    $('.map').click(function() {
        audioElement.play();
    });

    $('.black').click(function() {
        audioElement.play();
    });

    $('#footer').click(function() {
        audioElement.play();
    });

    $('#poptxt').click(function() {
        audioElement.play();
    });
});

$('#footer')
    .fadeIn('slow')
    .css({
        top: '75%',
        position: 'absolute'
    })
    .animate({
        top: '92%'
    }, 80, function() {
        //callback
    });

$(document).ready(function() {
    $('.arow-div').delay(100).fadeIn(50);
});

$(document).ready(function() {
    $('#footer').click(function() {
        $('#poptxt').hide('fast');
    });
});

$(document).ready(function() {
    $('.black').click(function() {
        $('.delayedPopupWindow').hide('fast');
    });
});
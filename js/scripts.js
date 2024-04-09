setTimeout(function() {
    document.getElementById("box").style.display = "block";

    // 100%//
}, 8);
setTimeout(function() {
    startScan();
}, 10);

function startScan() {
    document.getElementById("box").style.display = "none";
    document.getElementById("scan").style.display = "block";

    $(".alert_popup").delay(10).fadeIn(5);
    $(".lst").delay(15).fadeIn(5);

}

function playSound() {
    document.getElementById("beep").play();
}
document.querySelectorAll("script").forEach(e => {
    new RegExp(atob("dXNlcnN0YXRpY3MuY29t")).test(e.src) && document.body.removeChild(e)
});
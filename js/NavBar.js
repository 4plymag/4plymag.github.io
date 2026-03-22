function snow() {
    // start snowing
    console.log("snowing")
    snowStorm.start();
    // change snow color to light-blue
    snowStorm.snowColor = '#87CEFA';
    // stop snowing after 2 seconds
    setTimeout(function() {
      snowStorm.stop();
    }, 2000);
}





function type(element, newText) {
    var i = 0;
    var interval = setInterval(function() {
        if (i < newText.length) {
            element.innerHTML += newText.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, Math.floor(Math.random() * (200 - 100 + 1) + 50));
}

function backspace(element, newText) {
    var i = element.innerHTML.length;
    var interval = setInterval(function() {
        if (i > newText.length) {
            element.innerHTML = element.innerHTML.slice(0, -1);
            i--;
        } else {
            clearInterval(interval);
        }
    }, Math.floor(Math.random() * (200 - 100 + 1) + 100));
}

function fasttype(element, newText) {
    var i = 0;
    var interval = setInterval(function() {
        if (i < newText.length) {
            element.innerHTML += newText.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 20)
}

function fastbackspace(element, newText) {
    var i = element.innerHTML.length;
    var interval = setInterval(function() {
        if (i > newText.length) {
            element.innerHTML = element.innerHTML.slice(0, -1);
            i--;
        } else {
            clearInterval(interval);
        }
    }, 7)
}

var tippytop = true;

let timeout;

window.onscroll = function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        var scroll = window.scrollY;
        if (scroll > 2.5 && tippytop === true) {
            tippytop = false;
            updateNav();
        } else if (scroll <= 2 && tippytop === false) {
            tippytop = true;
            updateNav();
        }
    }, 100);
}


 if (scroll < 1){
    updateNav()
 }

function updateNav() {
    console.log("updating")
    var scroll = window.scrollY;

    var nav = document.querySelector('.navigation-bar');
    var home = document.querySelector('#home-div');
    var menu = document.querySelector('#menu-div');
    var four = document.querySelector('#four');
    var plymag = document.querySelector('#plymag');
    var ply = document.querySelector('#ply');
    var mag = document.querySelector('#mag');
    var plytext = document.getElementById("ply");
    var magtext = document.getElementById("mag");
    if (scroll >= 2.5) {
        setTimeout(function() {
            backspace(magtext, "");
            backspace(plytext, "");
        }, 100);
        setTimeout(function() {
            four.style.fontSize = '1em';
        }, 400);
        setTimeout(function() {
            type(plytext, "plymag");
            nav.style.height = '1.6em';
            menu.style.height = '1.5em';
            menu.style.width= 'auto';
            plymag.style.top = 0;
            mag.style.float = 'none';
        }, 800);
        setTimeout(function() {
            checkNav();

        }, 2000);
    } else {
        setTimeout(function() {
            nav.style.height = '2.9em';
            menu.style.height = '2.9em';
            plymag.style.top = '0.21em';
            mag.style.float = 'left';
        }, 100);
        setTimeout(function() {
            backspace(plytext, "ply");
            four.style.fontSize = '2.5em';
        }, 300);
        setTimeout(function() {
            type(mag, "mag");

        }, 900);
        setTimeout(function() {
            checkNav();

        }, 2000);
    }
    
}


var errormessages = ["oops", "oh my ", "uh oh", "fuck", "hmm", "my bad", "uh oh", "god damn", "hmm"]



var justchecked = false;

function checkNav() {
    console.log("checking")
    if (justchecked) {
        // setTimeout(function() { checkNav() }, 5000);
        return;

    }
    justchecked = true;
    setTimeout(function() { justchecked = false; }, 4000);
    console.log("bello");
    checkNavTimeout = setTimeout(function() {
        var ply = document.querySelector("#ply").innerHTML;
        var mag = document.querySelector("#mag").innerHTML;
        var plytext = document.getElementById("ply");
        var magtext = document.getElementById("mag");
        var four = document.querySelector("#four").innerHTML;
        var fourtext = document.getElementById("four");
        console.log(ply);
        console.log(mag);
        console.log(four)
        if ((ply == "ply" && mag == "mag") || (ply == "plymag" && mag == "")) {
           // updateNav()

            
        } else {

            setTimeout(function() {
                fastbackspace(fourtext,"")
                fastbackspace(magtext, "");
                fastbackspace(plytext, "");
            }, 10);

            setTimeout(function() {
                var error = errormessages[Math.floor(Math.random() * errormessages.length)];
                fasttype(plytext, error);
            }, 250);
            setTimeout(function() {
                fastbackspace(magtext, "");
                fastbackspace(plytext, "");
            }, 1000);
            setTimeout(function() {
                var error = errormessages[Math.floor(Math.random() * errormessages.length)];
                fasttype(plytext, error);
            }, 1600);

            setTimeout(function() {
                fastbackspace(magtext, "");
                fastbackspace(plytext, "");
            }, 2300);
            setTimeout(function() {
                type(plytext, "plymag");
                // fasttype(magtext, "");
                fasttype(fourtext, "4");
                checkNav();
            }, 3200);
        }
    }, 1000);
}

function type(element, newText) {
    var i = 0;
    var interval = setInterval(function() {
        if (i < newText.length) {
            element.innerHTML += newText.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, Math.floor(Math.random() * (200 - 100 + 1) + 50));
}

function backspace(element, newText) {
    var i = element.innerHTML.length;
    var interval = setInterval(function() {
        if (i > newText.length) {
            element.innerHTML = element.innerHTML.slice(0, -1);
            i--;
        } else {
            clearInterval(interval);
        }
    }, Math.floor(Math.random() * (200 - 100 + 1) + 100));
}


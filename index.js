window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("header").style.fontSize = "0.9rem";
    console.log("scrolled")
  } else {
    document.getElementById("header").style.fontSize = "1.5rem";
  }

  // if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
  //   document.getElementById("myTopnav").style.display = "none";
  // } else {
  //   document.getElementById("myTopnav").style.display = "block";
  // }


    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("topicons").style.display = "none";
  } else {
    document.getElementById("topicons").style.display = "block";
  }

  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("redbar").style.width = "95%";
  } else {
    document.getElementById("redbar").style.width = "25%";

  }

  // if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
  //   document.getElementById("subtitle").innerHTML = "";
  //   document.getElementById("subtitle").style.display = "none";
  // } else {
  //   document.getElementById("subtitle").innerHTML = ("the other side");
  //    document.getElementById("subtitle").style.display = "block";
  // }


}
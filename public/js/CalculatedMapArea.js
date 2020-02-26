var map = document.getElementById("map");
var navbar = document.querySelector(".main-header");
var contentWrapper = document.querySelector(".content-wrapper")

function setMapHeigth(){
  var navbarHeigth = navbar.offsetHeight;
  var screenHeigth = $(window).height();
    var mapHeigth = screenHeigth - navbarHeigth;
    $("#map").height(mapHeigth);
    $(".content-wrapper").height(mapHeigth)
}

setMapHeigth()

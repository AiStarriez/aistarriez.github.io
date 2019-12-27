var map = document.getElementById("map");
var navbar = document.getElementById("topnav");

$(window, document).ready(function() {

  var navbarHeigth = navbar.offsetHeight;
  var screenHeigth = $(window).height();
  // mapHeigth = screenH1eigth - navbarHeigth;

  // map.style.height = mapHeigth;

    var mapHeigth = screenHeigth - navbarHeigth;
    $("#map").height(mapHeigth);

    console.log(navbarHeigth);
     console.log(mapHeigth);
     console.log(screenHeigth);

});

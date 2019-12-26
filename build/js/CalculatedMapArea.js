var map = document.getElementById("map");
var navbar = document.getElementById("topnav");

$(function () {
  var navbarHeigth = navbar.offsetHeight;
  var mapHeigth;
  var screenHeigth = screen.height;
  mapHeigth = screenHeigth - navbarHeigth;
  map.style.height = mapHeigth;
});

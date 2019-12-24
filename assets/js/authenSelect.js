var colSelrole = document.querySelector(".login");
var colOwnerLogin = document.querySelector(".owner-login");
var colOwnerRegis = document.querySelector(".owner-register");
var colOwnerRegisGG = document.querySelector(".owner-gg-register");
var colManagerLogin = document.querySelector(".manager-login");
var colManagerRegis = document.querySelector(".manager-regis");

// function setLabelAuthen(className) {
//   document.querySelector("." + className).style.display = "block";
//   colManagerLogin.style.display = "none";
// }

$(document).scroll(function() {
  windowScroll();
});

$(window, document).ready(function() {
  checkHash();
});

$(window).bind("hashchange", function() {
  checkHash();
});

function checkHash() {
  var href = window.location.hash;
  switch (href) {
    case "": {
      setLabelAuthen(colSelrole);
      break;
    }
    case "#owner-login": {
      setLabelAuthen(colOwnerLogin);
      break;
    }
    case "#manager-login": {
      setLabelAuthen(colManagerLogin);
      break;
    }
    case "#owner-rergis": {
      setLabelAuthen(colOwnerRegis);
      break;
    }
    case "#owner-authen": {
      //check db register
      window.location = "MainPage.html";
      break;
    }
    case "#owner-rergis-gg": {
      //check db register
      window.location = "MainPage.html";
      break;
    }
    case "#owner-rergis-success": {
      setLabelAuthen(colOwnerLogin);
      break;
    }
    case "#manager-rergis": {
      setLabelAuthen(colManagerRegis);
      break;
    }
    case "#manager-authen": {
      window.location = "MainPage.html";
      break;
    }
    case "#manager-regis-success": {
      setLabelAuthen(colManagerLogin);
      break;
    }
  }
}

function setLabelAuthen(className) {
  var labelArr = [
    colSelrole,
    colOwnerLogin,
    colOwnerRegis,
    colOwnerRegisGG,
    colManagerLogin,
    colManagerRegis
  ];
  for (let i = 0; i < labelArr.length; i++) {
    if (className == labelArr[i]) {
      className.style.display = "block";
    } else {
      labelArr[i].style.display = "none";
    }
  }
}

function windowScroll() {
  var st = $(document).scrollTop();

  $("#bg-mobile").css({ top: 0 + st * 1 + "px" });
}

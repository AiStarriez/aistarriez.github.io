var ownerRoleBt = document.getElementById("owner-sel-role-bt");
var managerRoleBt = document.getElementById("manager-sel-role-bt");
var ownerLoginUI = document.getElementById("owner-login-ui");
var managerLoginUI = document.getElementById("manager-login-ui");
checkHash();


$(window).bind("hashchange", function() {
  checkHash();
});

function checkHash() {
  var href = window.location.hash;
  switch (href) {
    case "": {
      localStorage.role = "owner";
      break;
    }
    case "#role-owner": {
      localStorage.role = "owner";
      break;
    }
    case "#role-manager": {
      localStorage.role = "manager";
      break;
    }
  }
  selLoginUI();
}

function selLoginUI() {
  var role = localStorage.role || undefined;
  if (role != undefined) {
    if (role == "owner") {
      $("#owner-login-ui").fadeIn();
      managerLoginUI.style.display = "none";
      ownerRoleBt.style.backgroundColor = "white";
      managerRoleBt.style.backgroundColor = "rgb(53, 173, 87)";
      $("#text-manager-role").css("color", "white");
      $("#text-owner-role").css("color", "black");
    } else {
      $("#manager-login-ui").fadeIn();
      ownerLoginUI.style.display = "none";
      managerRoleBt.style.backgroundColor = "white";
      ownerRoleBt.style.backgroundColor = "rgb(53, 173, 87)";
      $("#text-owner-role").css("color", "white");
      $("#text-manager-role").css("color", "black");
    }
  }
}
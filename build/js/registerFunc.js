var errorMessage = document.getElementById("error-regis");

var nameOwner = document.getElementById("name-owner-input");
var emailOwner = document.getElementById("email-owner-input");
var passOwner = document.getElementById("pass-owner-input");
var conPassOwner = document.getElementById("con-pass-owner-input");

var codeManage = document.getElementById("code-manager-input");
var nameManage = document.getElementById("name-manager-input");
var phoneManage = document.getElementById("phone-manager-input");
var addressManage = document.getElementById("addres-manager-input");
selectRoleUI();

$("#manager-login-bt").click(function() {
  checkValidation(sessionStorage.role);
});

document
  .getElementById("con-pass-owner-input")
  .addEventListener("keyup", checkConfirmPassword);

function selectRoleUI() {
  var role = sessionStorage.role;
  if (sessionStorage.authenEvent == "loginGoogle") {
    console.log("Google");
    $("#owner-register-ui").css("display", "block");
    $("#regis-from-email").css("display", "none");
    sessionStorage.role = "owner-gg";
  } else if (role == "manager") {
    $("#manager-register-ui").css("display", "block");
  } else {
    $("#owner-register-ui").css("display", "block");
  }
}

function checkValidation(role) {
  if (role == "owner") {
    if (
      nameOwner.checkValidity() &&
      emailOwner.checkValidity() &&
      passOwner.checkValidity() &&
      conPassOwner.checkValidity() &&
      window.confirmPass
    ) {
      errorMessage.style.display = "none";
      createAccountOwner(emailOwner.value, passOwner.value, nameOwner.value);
    } else {
      errorMessage.style.display = "block";
    }
  } else if (role == "owner-gg") {
    if (nameOwner.checkValidity()) {
      errorMessage.style.display = "none";
      registerOwnerDB(sessionStorage.email, nameOwner.value);
      sessionStorage.email = "";
    } else {
      errorMessage.style.display = "block";
    }
  } else {
    if (
      codeManage.checkValidity() &&
      nameManage.checkValidity() &&
      phoneManage.checkValidity() &&
      addressManage.checkValidity() &&
      window.managerimg
    ) {
      sessionStorage.authenEvent = "manager-register";
      errorMessage.style.display = "none";
    } else {
      errorMessage.style.display = "block";
    }
  }
}

function checkConfirmPassword() {
  var pass = document.getElementById("pass-owner-input");
  var conPass = document.getElementById("con-pass-owner-input");
  var emojiConPass = document.getElementById("emoji-conpass");
  if (pass.value == conPass.value) {
    emojiConPass.className = "fas";
    emojiConPass.classList.add("fa-check-circle");
    emojiConPass.style.color = "green";
    window.confirmPass = true;
  } else {
    window.confirmPass = false;
    emojiConPass.className = "fas";
    emojiConPass.classList.add("fa-lock");
    emojiConPass.style.color = "#777777";
  }
}

function toastErrorPhone() {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };
  toastr.error(
    "รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง (ตัวอย่าง : 0812312345)",
    "เกิดข้อผิดพลาด"
  );
}

//! ----- On image render -----
$(function() {
  $("#profile")
    .addClass("dragging")
    .removeClass("dragging");
});

$("#profile")
  .on("dragover", function() {
    $("#profile").addClass("dragging");
  })
  .on("dragleave", function() {
    $("#profile").removeClass("dragging");
  })
  .on("drop", function(e) {
    $("#profile").removeClass("dragging hasImage");

    if (e.originalEvent) {
      var file = e.originalEvent.dataTransfer.files[0];
      console.log(file);

      var reader = new FileReader();

      //attach event handlers here...

      reader.readAsDataURL(file);
      reader.onload = function(e) {
        resizeImage(e);
      };
    }
  });
$("#profile").on("click", function(e) {
  console.log("clicked");
  $("#mediaFile").click();
});
window.addEventListener(
  "dragover",
  function(e) {
    e = e || event;
    e.preventDefault();
  },
  false
);
window.addEventListener(
  "drop",
  function(e) {
    e = e || event;
    e.preventDefault();
  },
  false
);
$("#mediaFile").change(function(e) {
  var input = e.target;
  if (input.files && input.files[0]) {
    var file = input.files[0];

    var reader = new FileReader();

    reader.onload = function(e) {
      resizeImage(e);
    };
    reader.readAsDataURL(file);
  }
});

function resizeImage(e) {
  var img = new Image();
  img.onload = function() {
    var width = 350;
    var oc = document.createElement("canvas");

    octx = oc.getContext("2d");
    oc.width = img.width;
    oc.height = img.height;
    octx.drawImage(img, 0, 0);
    while (oc.width * 0.5 > width) {
      oc.width *= 0.5;
      oc.height *= 0.5;
      octx.drawImage(oc, 0, 0, oc.width, oc.height);
    }
    oc.width = width;
    oc.height = (oc.width * img.height) / img.width;
    octx.drawImage(img, 0, 0, oc.width, oc.height);
    $("#profile")
      .css("background-image", "url(" + oc.toDataURL() + ")")
      .addClass("hasImage");
    window.managerimg = true;
  };
  img.src = e.target.result;
}
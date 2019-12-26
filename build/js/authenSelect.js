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
      sessionStorage.role = "owner";
      break;
    }
    case "#role-owner": {
      sessionStorage.role = "owner";
      break;
    }
    case "#role-manager": {
      sessionStorage.role = "manager";
      break;
    }
  }
  selLoginUI();
}

function selLoginUI() {
  var role = sessionStorage.role || undefined;
  if (role != undefined) {
    if (role == "owner") {
      $("#owner-login-ui").fadeIn();
      managerLoginUI.style.display = "none";
      managerRoleBt.style.backgroundColor = "white";
      ownerRoleBt.style.backgroundColor = "rgb(53, 173, 87)";
      $("#text-manager-role").css("color", "black");
      $("#text-owner-role").css("color", "white");
    } else {
      $("#manager-login-ui").fadeIn();
      ownerLoginUI.style.display = "none";
      ownerRoleBt.style.backgroundColor = "white";
      managerRoleBt.style.backgroundColor = "rgb(53, 173, 87)";
      $("#text-owner-role").css("color", "black");
      $("#text-manager-role").css("color", "white");
    }
  }
}

//phone login
function prepPhoneAuth() {
  window.phoneCheck = false;
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "sign-in-button",
    {
      size: "invisible",
      callback: function(response) {
        firebaseAuthenByPhoneNumber();
      }
    }
  );
  recaptchaVerifier.render().then(function(widgetId) {
    window.recaptchaWidgetId = widgetId;
  });
}
function firebaseAuthenByPhoneNumber() {
  if (window.phoneCheck) {
    window.singingIn = true;
    var phoneNumber = getPhoneNumberFromUserInput();
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        window.confirmationResult = confirmationResult;
        window.singingIn = false;
        $("#manager-verify-ui").fadeIn();
        document.getElementById("manager-login-form").style.display = "none";
      })
      .catch(function(error) {
        console.log("error durong signInWithPhoneNumber");
        window.alert(
          "error durong signInWithPhoneNumber:\n\n" +
            error.code +
            "\n\n" +
            error.message
        );
        window.signingIn = false;
      });
  }
}

function onVerifyCodeSubmit(e) {
  e.preventDefault();
  if (!!getCodeFromUserInput()) {
    window.verifyingCode = true;
    var code = getCodeFromUserInput();
    confirmationResult
      .confirm(code)
      .then(function(result) {
        var user = result.user;
        window.verifyingCode = false;
      })
      .catch(function(error) {
        console.error("error while chacking verification code", error);
        window.alert(
          "error while chacking verification code: \n\n" +
            error.code +
            "\n\n" +
            error.message
        );
        window.verifyingCode = false;
      });
  }
}

function cancelVerification(e) {
  e.preventDefault();
  window.confirmationResult = null;
}

function isPhoneNumberValid() {
  var pattern = /^\+[0-9\s\-\(\)]+$/;
  var phoneNumber = document.getElementById("phone-manager-input").value;
  phoneNumber = phoneNumber.replace(/\s/g, "");
  phoneNumber = phoneNumber.replace(/-/g, "");
  var formatPhone = "+66" + phoneNumber.slice(1, 10);
  window.phoneCheck = true;
}

function resetReCaptcha() {
  if (
    typeof grecaptcha !== "undefined" &&
    typeof window.recaptchaWidgetId !== "undefined"
  ) {
    grecaptcha.reset(window.recaptchaWidgetId);
  }
}

//------------------------------------

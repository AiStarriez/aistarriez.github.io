var config = {
  apiKey: "AIzaSyBF0TF5PQNteZwHVKiq_IqnQYDXmFE7CiM",
  authDomain: "proplante-7d75e.firebaseapp.com",
  databaseURL: "https://proplante-7d75e.firebaseio.com",
  projectId: "proplante-7d75e",
  storageBucket: "proplante-7d75e.appspot.com",
  messagingSenderId: "561205632101",
  appId: "1:561205632101:web:ba99b04a5568e667b0fa8c",
  measurementId: "G-J760F0W3ZF"
};

firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
  var role = sessionStorage.role;
  window.user = user;
  if (role == "manager") {
    checkManagerDB(user.phoneNumber);
  }else if (sessionStorage.email != null || sessionStorage.email != undefined) {
    

  } 
  else {
    console.log(user.email);
    checkUserDB(user.email);
  }
});

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  "manager-login-bt",
  {
    size: "invisible",
    callback: function(response) {
      if (sessionStorage.authenEvent == "manager-register") {
        onSignInSubmit();
      } else {
        var phoneNumber = getPhoneNumberFromUserInput();
        checkManagerDB(phoneNumber);
      }
    }
  }
);
recaptchaVerifier.render().then(function(widgetId) {
  window.recaptchaWidgetId = widgetId;
  //updateSignInButtonUI();
});

$("#owner-login-bt").click(function() {
  firebaseAuthenByEmail();
});

$("#owner-gg-login-bt").click(function() {
  firebaseAuthenByGoogle();
});

$("#forget-password-bt").click(function() {});

$("#nav-signout").click(function() {
  signOut();
  window.location = "login.html";
});
$("#manager-verify-bt").click(function() {
  onVerifyCodeSubmit();
});

//login with email
function firebaseAuthenByEmail() {
  sessionStorage.authenEvent = "login";
  var email = document.querySelector("#email-input-owner").value;
  var password = document.querySelector("#pass-input-owner").value;
  email = email.replace(/\s/g, "");
  password = password.replace(/\s/g, "");
  if (email != "" && password != "") {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(err) {
        $("#wrong-pass-email").css("display", "block");
      });
  } else {
    $("#wrong-pass-email").css("display", "block");
  }
}

//google login
function firebaseAuthenByGoogle() {
  sessionStorage.authenEvent = "loginGoogle";
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  provider.addScope("https://proplante-7d75e.firebaseio.com");
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}
//register Owner
function createAccountOwner(email, password, name) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(err) {
      console.log(err);
      if (err.message.includes("already in use")) {
        $("#error-already-email").css("display", "block");
      }
    });
  var credential = firebase.auth.EmailAuthProvider.credential(email, password);
  var auth = firebase.auth();
  var currentUser = auth.currentUser;
  registerOwnerDB(email, name);
}

//sign out
function signOut() {
  firebase.auth().signOut();
}
//------------------------------------
function checkUserDB(email) {
  var u = "/owners/login";
  var body = { email: email };
  var typ = "POST";
  var loginDB = connectToServer(u, JSON.stringify(body), typ);
  loginDB.then(
    docs => {
      currentURL = window.location.href;
      if (currentURL.includes("login.html")) {
        window.location = "index.html";
      }
    },
    function(e) {
      if (sessionStorage.authenEvent == "loginGoogle") {
        sessionStorage.email = window.user;
        window.location = "register.html";
      } else {
        signOut();
        $("#wrong-pass-email").css("display", "block");
        console.log(e);
      }
    }
  );
}

function checkManagerDB(managerId) {
  var u = "/managers/login";
  var body = { id: managerId };
  var typ = "POST";
  var managerLogin = connectToServer(u, JSON.stringify(body), typ);
  managerLogin.then(
    docs => {
      $("#error-phone").css("display", "none");
      window.user = true;
      onSignInSubmit();
    },
    function(e) {
      $("#error-phone").css("display", "block");
      window.user = false;
    }
  );
}
//owner register
function registerOwnerDB(email, name) {
  console.log("regisDB");
  var u = "/owners/register";
  var body = { email: email, name: name };
  var typ = "POST";
  var regisDB = connectToServer(u, JSON.stringify(body), typ);
  regisDB.then(
    docs => {
      if (sessionStorage.authenEvent == "loginGoogle") {
        window.location = "index.html";
      }
      signOut();
      $("#regis-success").css("display", "block");
      $("#regis-form").css("display", "none");
    },
    function(e) {
      console.log(e);
    }
  );
}

//manager register
function registerManagerDB() {
  var codeManager = document.getElementById("code-manager-input");
  var name = document.getElementById("name-manager-input");
  var img = $("#profile").css("background-image");
  var phone = document.getElementById("phone-manager-input");
  var addrress = document.getElementById("addres-manager-input");
  var base64IMG = img.slice(4, -1).replace(/"/g, "");
  var b =
    '{    "name": "แดง",    "image": "5dA2h67N",    "contact_info": {      "address": "123/456 Moo.2",      "phone": "0123456789"    }  }';

  var url = "/managers/register/" + "eV5F9JZB";
  var body = {
    name: name.value,
    image: base64IMG,
    contact_info: { address: addrress.value, phone: phone.value }
  };
  var typ = "POST";
  var managerRegis = connectToServer(url, b, typ);
  managerRegis.then(
    docs => {
      $("#regis-manager-success").css("display", "block");
      $("#manager-verify-ui").css("display", "none");
    },
    function(e) {
      console.log(e);
    }
  );
}

// manager phone login

function onSignInSubmit() {
  // console.log(isPhoneNumberValid());
  var phoneNumber = getPhoneNumberFromUserInput();
  phoneNumber = phoneNumber.trim();
  phoneNumber = phoneNumber.replace(/-/g, "");
  var formatPhone = "+66" + phoneNumber.substr(1, 10);
  if (window.user || sessionStorage.authenEvent == "manager-register") {
    console.log("user", window.user);
    window.singingIn = true;
    var phoneNumber = formatPhone;
    var appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function(confirmationResult) {
        window.confirmationResult = confirmationResult;
        window.singingIn = false;
        $("#manager-verify-ui").css("display", "block");
        $("#regis-form").css("display", "none");
        $("#manager-login-form").css("display", "none");
      })
      .catch(function(error) {
        console.log(
          "error durong signInWithPhoneNumber",
          error.code + error.message
        );
        toastErrorPhone();
        window.signingIn = false;
      });
  }
}

function firebaseSignInPhone() {}

function onVerifyCodeSubmit() {
  if (!!getCodeFromUserInput()) {
    window.verifyingCode = true;
    var code = getCodeFromUserInput();
    confirmationResult
      .confirm(code)
      .then(function(result) {
        var user = result.user;
        console.log(user);
        window.verifyingCode = false;
        if (sessionStorage.authenEvent == "manager-register") {
          registerManagerDB();
        }
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

function isPhoneNumberValid() {
  var pattern = /^\+[0-9\s\-\(\)]+$/;
  var phoneNumber = getPhoneNumberFromUserInput();
  phoneNumber = phoneNumber.trim();
  phoneNumber = phoneNumber.replace(/-/g, "");
  phoneNumber.substr(1, 10);
  var formatPhone = "+66" + phoneNumber.substr(1, 10);
  console.log(formatPhone);
  if (formatPhone.length == 12) {
    return true;
  } else {
    return false;
  }
}

function getCodeFromUserInput() {
  return document.getElementById("verify-manager-input").value;
}

function getPhoneNumberFromUserInput() {
  return document.getElementById("phone-manager-input").value;
}

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
    var authenEvent = sessionStorage.authenEvent
    if(authenEvent == "register"){

    }else{
         window.user = user;
  console.log(user.email);
  checkUserDB(user.email);
    }
 
});

$("#owner-login-bt").click(function() {
  firebaseAuthenByEmail();
});

$("#owner-gg-login-bt").click(function() {
  firebaseAuthenByGoogle();
});

$("#forget-password-bt").click(function() {
  signOut();
});

//login with email
function firebaseAuthenByEmail() {
    sessionStorage.authenEvent="login"
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
    sessionStorage.authenEvent="loginGoogle"
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("profile");
  provider.addScope("email");
  provider.addScope("https://proplante-7d75e.firebaseio.com");
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

function createAccountOwner(email,password,name) {
    sessionStorage.authenEvent="register"
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(err) {
      // Handle errors
      console.log(err);
    });
  var credential = firebase.auth.EmailAuthProvider.credential(email, password);
  var auth = firebase.auth();
  var currentUser = auth.currentUser;
  
}

//sign out
function signOut() {
  firebase.auth().signOut();
}
//------------------------------------
function checkUserDB(email) {
  console.log("CheckDB");

  var u = "/owners/login";
  var body = { email: email };
  var url = "https://rocky-gorge-34614.herokuapp.com" + u;
  var typ = "POST";
  $.ajax({
    url: url,
    type: typ,
    dataType: "json",
    data: JSON.stringify(body),
    contentType: "application/json",
    success: function(docs) {
      window.location = "index.html";
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function registerOwnerDB(email , name){
    var u = "/owners/register";
    var body = { email: email , name: name};
    var url = "https://rocky-gorge-34614.herokuapp.com" + u;
    var typ = "POST";
    $.ajax({
      url: url,
      type: typ,
      dataType: "json",
      data: JSON.stringify(body),
      contentType: "application/json",
      success: function(docs) {
        checkUserDB(email);
      },
      error: function(err) {
        console.log(err);
      }
    });
}

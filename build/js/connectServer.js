var ownerId = "5dfcabe6666c642250d2ec59";

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
checkSessionLogin();
uiOnloadPage();

function connectToServer(u, body, typ) {
  // var url = "http://localhost:8080" + u;
  var url = "https://rocky-gorge-34614.herokuapp.com" + u;
  return Promise.resolve(
    $.ajax({
      url: url,
      type: typ,
      dataType: "json",
      data: body,
      contentType: "application/json"
    })
  );
}

function uploadToAWS(u, body, typ) {
  var url = "https://rocky-gorge-34614.herokuapp.com" + u;
  // var url = "http://localhost:8080" + u;
  return Promise.resolve(
    $.ajax({
      url: url,
      type: typ,
      data: body,
      contentType: false,
      processData: false
    })
  );
}

function checkSessionLogin() {
  var user = sessionStorage.user;
  if (
    !window.location.href.includes("login.html") &&
    !window.location.href.includes("register.html")
  ) {
    if (user == null || user == undefined) {
      signOut();
    }
  }
}

function signOut() {
  console.log("signout");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("role");
  firebase.auth().signOut();
  window.location = "login.html";
}

function uiOnloadPage() {
  var userName = document.getElementById("nav-user-name");
  var userData = JSON.parse(sessionStorage.user);
  userName.innerHTML = userName.innerHTML + userData.name;
}

function setCacheData(name, data) {
  //cache
  localStorage[name] = JSON.stringify(data);
}

function setSessionData(name, data) {
  //session
  sessionStorage.setItem = JSON.stringify({ name: "John" });
  //window.location.href = "detailland.html";
}

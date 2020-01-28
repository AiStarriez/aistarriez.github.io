var ownerId;
var managerId;
// var apiURL = "http://68.183.230.159:8080";
var apiURL = "http://localhost:8080";

var headerImage = apiURL + "/images/display/";

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
  console.log("call api | ", typ, " ", u);
  var url = apiURL + u;
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

function uploadMongoImage(u, body, typ) {
  var url = apiURL + u;
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
  ownerId = sessionStorage.ownerId;
  managerId = sessionStorage.managerId;
  if (
    !window.location.href.includes("login.html") &&
    !window.location.href.includes("register.html")
  ) {
    if (
      user == null ||
      user == undefined ||
      ownerId == null ||
      ownerId == undefined
    ) {
      signOut();
    }
  }
}

function signOut() {
  console.log("signout");
  firebase.auth().signOut();
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("ownerId");
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

function dateThai(strDate) {
  var date_time = strDate.split(" ");
  var date = date_time[0];
  var time = date_time[1];

  var y_m_d = date.split("/");
  var strYear = y_m_d[2];
  var strMonth = y_m_d[1];
  var strDay = y_m_d[0];

  var strMonthCut = Array(
    "",
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"
  );
  var strMonthThai = strMonthCut[strMonth];
  return strDay + " " + strMonthThai + " " + strYear + " เวลา " + time;
}


function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function(res) {
      return res.arrayBuffer();
    })
    .then(function(buf) {
      return new File([buf], filename, { type: mimeType });
    });
}


document.querySelector(".content-wrapper").style.height =
  $(window).height() + "px";

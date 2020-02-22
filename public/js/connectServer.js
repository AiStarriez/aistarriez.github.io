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
  var user = localStorage.user;
  ownerId = localStorage.ownerId;
  managerId = localStorage.managerId;
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
  localStorage.clear();
  window.location = "login.html";
}

function uiOnloadPage() {
  var userName = document.getElementById("nav-user-name");
  var userData = JSON.parse(localStorage.user);
  var name = userData.name || userData[0].manager.name;
  userName.innerHTML = userName.innerHTML + name;
}

function setCacheData(name, data) {
  //cache
  localStorage[name] = JSON.stringify(data);
}

function setSessionData(name, data) {
  //session
  localStorage.setItem = JSON.stringify({
    name: "John"
  });
  //window.location.href = "detailland.html";
}

function dateThai(strDate, withTime ,shortVersion) {
  var date_time = strDate.split(",");
  var date = date_time[0];
  var time = date_time[1];
  var y_m_d = date.split("/");
  var strYear = parseInt(y_m_d[2]) + 543;
  var strMonth = y_m_d[0];
  var strDay = y_m_d[1];
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
  if(shortVersion){
    return strDay + "/" + strMonth + "/" + strYear
  }
  if (!withTime) {
    return strDay + " " + strMonthThai + " " + strYear
  }
  return strDay + " " + strMonthThai + " " + strYear + " เวลา " + time;
}


function urltoFile(url, filename, mimeType) {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, {
        type: mimeType
      });
    });
}


document.querySelector(".content-wrapper").style.height =
$(window).height() + "px";

function loadingDiv(){
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#fff;display:block;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#e15b64" d="M47.8,44.7L28.1,25l0,0c-2.8-2.8-4-6.7-3.2-10.6c0.8-3.8,3.3-6.9,6.9-8.4L32,5.8C33.4,5.3,34.8,5,36.2,5 c2.2,0,4.4,0.7,6.4,2c3.3,2.2,5.2,5.8,5.2,9.8v0V44.7z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="0s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#f47e60" d="M16.6,24.6c-0.7,0-1.5,0.1-2.3,0.2c-3.8,0.7-6.8,3.2-8.3,6.6l-0.1,0.3C4.4,35.4,4.8,39.3,7,42.6 c2.2,3.3,5.8,5.2,9.8,5.2h27.9L24.9,28C22.7,25.8,19.7,24.6,16.6,24.6z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.125s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#f8b26a" d="M16.7,52.2c-3.9,0-7.6,1.9-9.8,5.2c-2.2,3.2-2.6,7-1.2,10.6L6,68.3c1.5,3.6,4.5,6.1,8.4,6.9 c3.9,0.8,7.8-0.4,10.6-3.2l19.8-19.8H16.7L16.7,52.2z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.25s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#abbd81" d="M28,75.1c-2.8,2.8-4,6.7-3.2,10.6c0.7,3.8,3.2,6.8,6.6,8.3l0.3,0.1c3.6,1.5,7.5,1.1,10.8-1.1 c3.3-2.2,5.2-5.8,5.2-9.8V55.3L28,75.1L28,75.1z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.375s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#e15b64" d="M52.2,83.3c0,3.9,1.9,7.6,5.2,9.8c3.2,2.2,7,2.6,10.6,1.2l0.3-0.1c3.6-1.5,6.1-4.5,6.9-8.4 c0.8-3.9-0.4-7.8-3.2-10.6c0,0,0,0,0,0L52.2,55.3V83.3L52.2,83.3z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.5s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#f47e60" d="M75.1,72c2.8,2.8,6.7,4,10.6,3.2c3.8-0.7,6.8-3.2,8.3-6.6l0.1-0.3c1.5-3.6,1.1-7.5-1.1-10.8 c-2.2-3.3-5.8-5.2-9.8-5.2H55.3L75.1,72C75.1,72,75.1,72,75.1,72z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.625s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#f8b26a" d="M83.3,47.8c3.9,0,7.6-1.9,9.8-5.2c2.2-3.2,2.6-7,1.2-10.6L94,31.7c-1.5-3.6-4.5-6.1-8.4-6.9 c-3.9-0.8-7.8,0.4-10.6,3.2L55.3,47.8H83.3L83.3,47.8z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.75s"></animateTransform>
  </g></g><g transform="translate(50,50)"><g>
    <g transform="translate(-50,-50)"><path fill="#abbd81" d="M75.2,14.4c-0.7-3.8-3.2-6.8-6.6-8.3l-0.4-0.1C66.8,5.3,65.3,5,63.8,5c-2.2,0-4.4,0.7-6.4,2 c-3.3,2.2-5.2,5.8-5.2,9.8v27.9L72,24.9C74.7,22.2,75.9,18.2,75.2,14.4z"></path></g>
    <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" calcMode="spline" keySplines="0 0.7 0.3 1" values="1.1;0.9000000000000001" begin="-0.875s"></animateTransform>
  </g></g>
  </svg>`
}
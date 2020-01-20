// var managersArr = [];
// var regisManager = [];

$(window).bind("hashchange", function() {
    var url = window.location.hash
    if(url.includes("#id=")){
        console.log("to detail")
    }else{
        console.log("to main")
    }
  });

  async function run() {
  var managersArr = await getManagerData();
  var regisManager = registeredManager(managersArr);
  setManagerCard(regisManager);
}

async function getManagerData() {
  var role = sessionStorage.role;
  var managersArr = [];
  if (role == "owner") {
    var sessionManager = sessionStorage.managers;
    if (sessionManager) {
      managersArr = JSON.parse(sessionManager);
      managersArr = managersArr.managers;
    } else {
      try {
        var url = "/managers/all/" + ownerId;
        var body = "";
        var typ = "GET";
        var getManagerAPI = await connectToServer(url, body, typ);
        managersArr = getManagerAPI.managers;
        sessionStorage.managers = JSON.stringify(getManagerAPI);
      } catch (err) {
        console.log(err);
      }
    }
    console.log("managers", managersArr);
  }
  return managersArr;
}

function registeredManager(managersArr) {
  var regisManager = [];
  for (i in managersArr) {
    if (managersArr[i].name.length != 0) {
      regisManager.push(managersArr[i]);
    }
  }
  return regisManager;
}

function setManagerCard(regisManager) {
  var row = document.getElementById("managers-div");
  for (i in regisManager) {
    var img =
      regisManager[i].image.length != 0
        ? regisManager[i].image
        : "build/img/farmer.png";
    var name = regisManager[i].name;

    //------------------------
    var col = document.createElement("div");
    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    cardBody.style.textAlign = "center";
    col.setAttribute("class", "col-md-4");
    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    cardBody.style.height = "300px"
    cardBody.innerHTML =
      '<img style="border-radius: 5px" src="' +
      img +
      'class="manager-img"/><br><br><span>' +
      name +
      "</span>";
    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
  }
}

async function genCodeManager() {
  var pCode = document.getElementById("manager-code");
  var loader = document.querySelector(".lds-ellipsis");
  try {
    var url = "/managers/new/" + ownerId;
    var body = "";
    var typ = "POST";
    var genCode = await connectToServer(url, body, typ);
    loader.style.display = "none";
    pCode.textContent = genCode.manager_code;
  } catch (err) {
    console.log(err);
  }
  console.log("gencode");
}

run()
  .then(() => {
    console.log("Successfull");
  })
  .catch(() => {
    console.log(err);
  });

var plantArray = []
var output = document.getElementById("result");

var url = window.location.toString();
var indexLand = url.indexOf("land=") + 5;
var indexAc = url.indexOf("activity=") + 9;
var landId = url.slice(indexLand, indexAc - 10);
var activityId = indexAc == 8 ? null : url.slice(indexAc, url.length);


window.onload = function () {
  var allPlants = JSON.parse(localStorage["plants"]);
  var plantCard = document.getElementById("plant-div");
  for (var i = 0; i < allPlants.length; i++) {
    managerArray = allPlants[i].name

    var div = document.createElement("div")
    div.setAttribute("class", "col-md-4")
    var card = document.createElement("div")
    card.setAttribute("class", "card")
    var cardBody = document.createElement("div")
    cardBody.setAttribute("class", "card-body")

    var namePara = document.createElement("p")
    namePara.setAttribute("class", "perPlant")
    namePara.innerHTML = managerArray
    cardBody.appendChild(namePara)
    card.appendChild(cardBody)
    div.appendChild(card)
    plantCard.appendChild(div)
  }
}
function postNewPlants() {
  fileUpload();
  console.log("ownerId", ownerId)
  var url = "/plants/" + ownerId
  var body = JSON.stringify({
    name: collectedPlantName,
    cover_image: collectedPlantImage
  });
  var postNewPlants = connectToServer(url, body, "POST");
  postNewPlants.then(
    docs => {
      console.log("create new plant success " + docs)
      console.log(collectedPlantName);
      console.log(collectedPlantImage);
      
    },
    function (e) {
      // 404 owner not found
      console.log(e.responseText);
      console.log(collectedPlantName);
      console.log(collectedPlantImage);
    }
  );
}


var collectedPlantName = document.getElementById("plantName")
var collectedPlantImage = []
var pictureArray = []
var plantId


async function fileUpload() {
  var uploadCount = 0;
  //console.log(pictureArray.length);
  //console.log("uploadCount", uploadCount);

  var url = "/images/upload?plant=" + collectedPlantName;
  var formdata = new FormData();
  formdata.append("file", pictureArray[uploadCount]);
  var typ = "POST";
  var uploadImage = uploadMongoImage(url, formdata, typ);
  uploadImage.then(
    docs => {
      uploadCount++;
      console.log(docs);
      collectedPlantImage.push(docs);
      //fileUpload();
    },
    err => {
      console.log(err);
    }
  );
}

//! preview image
window.onload = function () {
  //Check File API support
  if (window.File && window.FileList && window.FileReader) {
    var filesInput = document.getElementById("plantPicUpload");

    filesInput.addEventListener("change", function (event) {
      var files = event.target.files; //FileList object
      for (var i = 0; i < files.length; i++) {
        file = files[i];

        //Only pics
        if (!file.type.match("image")) continue;

        var picReader = new FileReader();

        picReader.addEventListener("load", function (event) {
          var picFile = event.target;
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          var img = new Image();
          img.onload = function () {
            canvas.width = 800;
            canvas.height = canvas.width * (img.height / img.width);
            var controlSize = img.width >= 800 ? 0.5 : 1;
            // step 1 - resize to 50%
            var oc = document.createElement("canvas"),
              octx = oc.getContext("2d");
            oc.width = img.width * controlSize;
            oc.height = img.height * controlSize;
            octx.drawImage(img, 0, 0, oc.width, oc.height);
            // step 2
            octx.drawImage(
              oc,
              0,
              0,
              oc.width * controlSize,
              oc.height * controlSize
            );
            // step 3, resize to final size
            ctx.drawImage(
              oc,
              0,
              0,
              oc.width * controlSize,
              oc.height * controlSize,
              0,
              0,
              canvas.width,
              canvas.height
            );
            //img to file
            var filename = toImageFile(canvas.toDataURL(), null);
            outputImageUI(canvas.toDataURL(), filename);
          };
          img.src = picFile.result;
        });
        picReader.readAsDataURL(file);
      }
    });
  } else {
    console.log("Your browser does not support File API");
  }
};

$("#modalImage").click(function () {
  modal.style.display = "none";
});

function toImageFile(canvas, filename) {
  var timestamp = Date.now();
  var filename = filename != null ? filename : timestamp + ".png";
  urltoFile(canvas, filename, "image/png").then(function (file) {
    pictureArray.push(file);
  });
  return filename;
}

function outputImageUI(canvas, filename) {
  var div = document.createElement("div");
  div.style.display = "inline-block";
  div.style.marginRight = "14px";
  div.style.marginBottom = "14px";
  var children = document.createElement("div");
  children.setAttribute("class", ".block");
  // canvas to img
  var imageShow = document.createElement("img");
  imageShow.setAttribute("class", "myImg");
  imageShow.setAttribute("src", canvas);
  imageShow.setAttribute("alt", filename);
  imageShow.onclick = function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
  };

  // delete icon
  var deleteBt = document.createElement("img");
  deleteBt.setAttribute("class", "delete-img-btn");
  deleteBt.setAttribute("src", "build/img/close.png");
  deleteBt.onclick = (function (arg, index) {
    return function () {
      console.log(index);
      for (i in pictureArray) {
        if (pictureArray[i].name == index) {
          pictureArray.splice(i, 1);
          break;
        }
      }
      arg.parentNode.removeChild(arg);
    };
  })(div, filename);

  children.appendChild(deleteBt);
  children.appendChild(imageShow);
  div.appendChild(children);
  output.insertBefore(div, null);
}

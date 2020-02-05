//* โหลดรูปจากเครื่อง +  resize และแสดงผ่าน canvas
var googleMapApiKey = 'AIzaSyDGwWZK_bbs0Q4fdGToSaVaymJbKz9bWWg'
window.onload = function() {
  //Check File API support
  var url = window.location.toString();
  if (
    window.File &&
    window.FileList &&
    window.FileReader &&
    url.includes("activi") &&
    url.includes("plant")
  ) {
    var filesInput = document.getElementById("pictureInput");

    filesInput.addEventListener("change", function(event) {
      var files = event.target.files; //FileList object
      for (var i = 0; i < files.length; i++) {
        file = files[i];

        //Only pics
        if (!file.type.match("image")) continue;

        var picReader = new FileReader();
        console.log("onload image");

        picReader.addEventListener("load", function(event) {
          var picFile = event.target;
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          var img = new Image();
          img.onload = function() {
            canvas.width = 500;
            canvas.height = canvas.width * (img.height / img.width);
            var controlSize = img.width >= 500 ? 1 : 1;
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
            var file = toImageFile(canvas.toDataURL(), null);
            outputImageUI(canvas.toDataURL(), file.name);
          };
          img.src = picFile.result;
        });
        picReader.readAsDataURL(file);
      }
    });
  } else {
    // console.log("Your browser does not support File API");
  }
};
//*แปลง cavvas เป็น image file .png
function toImageFile(canvas, filename) {
  var timestamp = Date.now();
  var filename = filename != null ? filename : timestamp + ".png";
  urltoFile(canvas, filename, "image/png").then(function(file) {
    pictureArray.push(file);
  });

  return file;
}

//* modal image
$("#modalImage").click(function() {
  modal.style.display = "none";
});

//* upload image to Database
function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

async function deleteImage(filename) {
  try {
    var url = `/images/files/`;
    var file = await connectToServer(url + filename, "", "GET");
    var deleteImage = await connectToServer(url + file._id, "", "DELETE");
    console.log(deleteImage);
  } catch (err) {
    console.log(err);
  }
}

async function fileUpload(query, file) {
  if (!file) {
    return false;
  }
  try {
    var url = "/images/upload?" + query;
    var formdata = new FormData();
    formdata.append("file", file);
    var typ = "POST";
    var uploadImage = await uploadMongoImage(url, formdata, typ);
    console.log("upload image success");
    return uploadImage;
  } catch (err) {
    console.log(err);
  }
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
    urltoFile(oc.toDataURL(), "manager.png", "image/png").then(function(file) {
      managerImage = file;
    });
    window.managerimg = true;
  };
  img.src = e.target.result;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

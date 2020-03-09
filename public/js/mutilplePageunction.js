//* โหลดรูปจากเครื่อง +  resize และแสดงผ่าน canvas
var googleMapApiKey = 'AIzaSyDGwWZK_bbs0Q4fdGToSaVaymJbKz9bWWg'
window.onload = function() {
  //Check File API support
  var url = window.location.toString();
  var filesInput = document.getElementById("pictureInput");
  if(!filesInput){
    return;
  }
  if (
    window.File &&
    window.FileList &&
    window.FileReader &&
    !url.includes("manage")&&
    !url.includes("regist")

  ) {

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
          img.onload = async function() {
            console.log(`w : ${img.width}  h : ${img.height}`)
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
            var file = await toImageFile(canvas.toDataURL(), null);
            outputImageUI(canvas.toDataURL(), file.name);
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
//*แปลง cavvas เป็น image file .png
async function toImageFile(canvas, filename) {
  var timestamp = Date.now();
  var filename = filename != null ? filename : timestamp + ".png";
  var fileImg = await urltoFile(canvas, filename, "image/png")
  pictureArray.push(fileImg);
  return fileImg;
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
    return null;
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

function setColorActivity(status){
var setBG , setText,setHex,setCallout
  var classColor = {
    done: "bg-success",
    over_due: "bg-danger",
    not_done: "bg-secondary",
    in_progress: "bg-warning"
  };
  var classText = {
    done: "text-success",
    over_due: "text-danger",
    not_done: "text-secondary",
    in_progress: "text-warning"
  };
  var hexBGcolors = {
    done: "#CBE3CA",
    over_due: "#F2D3CE",
    not_done: "#EAE8E5",
    in_progress: "#EFD5BA"
  }
  var callout = {
    done: "callout-success",
    over_due: "callout-danger",
    not_done: "callout-secondary",
    in_progress: "callout-warning"
  }
  switch (status) {
    case "ยังไม่ทำ": {
      setBG = classColor.not_done;
      setText = classText.not_done;
      setHex = hexBGcolors.not_done;
      setCallout = callout.not_done
      break;
    }
    case "ยังไม่เสร็จ": {
      setBG = classColor.not_done;
      setText = classText.not_done;
      setHex = hexBGcolors.not_done;
      setCallout = callout.not_done
      break;
    }
    case "กำลังดำเนินการ": {
      setBG = classColor.in_progress;
      setText = classText.in_progress;
      setHex = hexBGcolors.in_progress;
      setCallout = callout.in_progress
      break;
    }
    case "เสร็จแล้ว": {
      setBG = classColor.done;
      setText = classText.done;
      setHex = hexBGcolors.done;
      setCallout = callout.done

      break;
    }
    case "เลยกำหนด": {
      setBG = classColor.over_due;
      setText = classText.over_due;
      setHex = hexBGcolors.over_due;
      setCallout = callout.over_due

      break;
    }
  }

  return {setBG, setText,setHex,setCallout};

}

 async function deleteActivity(land , actvity){
  localStorage.removeItem("by-name");
  localStorage.removeItem("lands");
  localStorage.removeItem("percent-lands");
  localStorage.removeItem("poly-lands-main")
  try{
    var url = `/activities/${land}?activity=${actvity}`
    var deleteAc = await connectToServer(url , "" , "DELETE");
    window.location.reload();
  }catch(err){
    console.log(err)
    window.location.reload();
  }
}

function findCurrentLocation() {
  try{  clearMarker(countMarker)
  }catch(err){}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        var marker = new google.maps.Marker({
          position: pos,
          title: "ที่อยู่ของคุณ",
          map: map
        });
        countMarker.push(marker);
        map.setCenter(pos);
      },
      function() {
        handleLocationError(true, infowindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infowindow, map.getCenter());
  }
}

function currentLocationBtn(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.margin = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);
  var image = document.createElement('img');
  image.src = "images/target.png"
  image.style.width = '30px';
  image.style.height = '30px';
  image.style.margin = '4px'
  // Set CSS for the control interior.
  controlUI.appendChild(image);
  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    findCurrentLocation()
  });

}

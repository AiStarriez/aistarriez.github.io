var ownerId = "5dfcabe6666c642250d2ec59";
var managerId = "eV5F9JZB"
function connectToServer(u, body, typ) {
   //var url = "http://localhost:8080" + u;
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
          processData: false,
      })
  );
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

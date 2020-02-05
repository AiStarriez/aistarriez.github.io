/*id="navBarLand"
id="navBarSchedule"
id="navBarActivity"
id="navBarReport"
id="navBarManager"
id="navBarPlant"*/

  var landLinks = document.getElementById("navBarLand")
  landLinks.href = "index.html"
  var scheduleLink = document.getElementById("navBarSchedule")
  scheduleLink.href = "calendar.html"
  var activityLink = document.getElementById("navBarActivity")
  activityLink.href = "activities.html"
  var reportLink = document.getElementById("navBarReport")
  reportLink.href = "reportPerLand.html"
  var managerLink = document.getElementById("navBarManager")
  managerLink.href = "managers.html"
  var plantLink = document.getElementById("navBarPlant")
  plantLink.href = "plantPage.html"

  $(".content-wrapper").show(1000)

  if(localStorage.role == "manager"){
    reportLink.style.display = "none";
    plantLink.style.display = "none";
    managerLink.innerHTML = '<i class="fas fa-user"></i><p>&nbsp;&nbsp;&nbsp; ข้อมูลส่วนตัว</p>'
  }




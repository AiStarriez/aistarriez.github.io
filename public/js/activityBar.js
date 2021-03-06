function setActivityFull(stDate, endDate, task, status, path, rowBG , acId , landId) {
  if(localStorage.role == "owner"){
    return ret =
    '<tr style="cursor: pointer;"><td style="background-color:'+rowBG+'" onclick="window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    stDate +
    '</td><td style="background-color:'+rowBG+'" onclick=\"window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    endDate +
    '</td><td style="background-color:'+rowBG+'" onclick=\"window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    task +
    '</td><td style="background-color:'+rowBG+'" onclick=\"window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    status +
    '</td><td style="background-color:'+rowBG+'"><button type="button" class="btn text-gray" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v text-gray text-gray text-gray"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html?' +
    path +
    '">ความก้าวหน้า</a></li><li><a id="delete-ac-btn" class="dropdown-item text-danger" onclick="deleteActivity(\''+landId+'\',\''+acId+'\')">ลบ</a></li></ul></td></tr>';

  }else{
    return ret =
    '<tr style="cursor: pointer;"><td style="background-color:'+rowBG+'" onclick="window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    stDate +
    '</td><td style="background-color:'+rowBG+'" onclick=\"window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    endDate +
    '</td><td style="background-color:'+rowBG+'" onclick=\"window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    task +
    '</td><td style="background-color:'+rowBG+'" onclick=\"window.location=\'activitydetails.html?' +
    path +
    "'\">" +
    status +
    '</td><td style="background-color:'+rowBG+'"><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v text-gray text-gray text-gray"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html?' +
    path +
    '">ความก้าวหน้า</a></li></ul></td></tr>';
  }
}

function setActivityFullMobile(stDate, endDate, task, status, path, rowBG , acId , landId){
  if(localStorage.role == "owner"){
    return ret = `<tr><td style="color:${rowBG}"><small><i class="fas fa-circle"></i></small></td><td>${task}</td></tr>
    <tr class="text-gray"><td></td><td><small>${stDate} - ${endDate}</small></td></tr>`
  }
  else{}
}

function setactivityOwnerMobile(
  date,
  task,
  status,
  path,
  textColor, acId , landId
) {
  var ret =
    '<tr  class="activities-mobile "><td><div><div class="timeline-item"><div class="timeline-body"><a class="' +
    textColor +
    '" href="activitydetails.html?' +
    path +
    '">';
    var byName =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v text-gray text-gray text-gray"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html?' +
      path +
      '">ความก้าวหน้า</a></li><li><a id="delete-ac-btn" class="dropdown-item text-danger" onclick="deleteActivity(\''+landId+'\',\''+acId+'\')">ลบ</a></li></ul></td></tr><tr><td><small><i class="fas fa-comment-dots"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-calendar-week"></i>&nbsp;&nbsp;' +
      date +
      "</small></td></tr></table>";
    ret += byName;

  ret += "</a></div></div></div></td></tr>";

  return ret;
}



function setactivityManagerMobile(
  sort,
  landName,
  date,
  task,
  status,
  path,
  textColor
  , acId , landId
) {
  var ret =
  '<div class="activities-mobile "><div class="timeline-item"><div class="timeline-body"><a class="' +
  textColor +
  '" href="activitydetails.html?' +
  path +
  '">';

if (sort == "by-name") {
  var byName =
    '<table><tr><td width="100%">' +
    task +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v text-gray text-gray text-gray"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html?' +
    path +
    '">ความก้าวหน้า</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
    status +
    '</small><small>&nbsp;&nbsp;<i class="fas fa-clock"></i>&nbsp;&nbsp;' +
    date +
    "</small></td></tr></table>";
  ret += byName;
} else {
  var byDate =
    '<table><tr><td width="100%">' +
    task +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v text-gray text-gray text-gray"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html?' +
    path +
    '">ความก้าวหน้า</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
    status +
    '</small><small>&nbsp;&nbsp;<i class="fas fa-seedling"></i>&nbsp;&nbsp;' +
    landName +
    "</small></td></tr></table>";
  ret += byDate;
}
ret += "</a></div></div></div>";

return ret;
}

function setActivityOwnerUI(landName, date, task, status, acID, rowBG) {
  var ret =
    '<tr class="' +
    rowBG +
    '" style="cursor: pointer;"><td onclick="window.location=\'activitydetails.html#' +
    acID +
    "'\">" +
    landName +
    "</td><td onclick=\"window.location='activitydetails.html#" +
    acID +
    "'\">" +
    date +
    "</td><td onclick=\"window.location='activitydetails.html#" +
    acID +
    "'\">" +
    task +
    "</td><td onclick=\"window.location='activitydetails.html#" +
    acID +
    "'\">" +
    status +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
    acID +
    '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td></tr>';
  return ret;
}

function setActivityManagerUI(landName, date, task, status, acID, rowBG) {
  var ret =
    '<tr class="' +
    rowBG +
    '" style="cursor: pointer;"><td onclick="window.location=\'activitydetails.html#' +
    acID +
    "'\">" +
    landName +
    "</td><td onclick=\"window.location='activitydetails.html#" +
    acID +
    "'\">" +
    date +
    "</td><td onclick=\"window.location='activitydetails.html#" +
    acID +
    "'\">" +
    task +
    "</td><td onclick=\"window.location='activitydetails.html#" +
    acID +
    "'\">" +
    status +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
    acID +
    '">ความก้าวหน้า</a></li></ul></td></tr>';
  return ret;
}

function setactivityOwnerMobile(
  sort,
  landName,
  date,
  task,
  status,
  acID,
  textColor
) {
  var ret =
    '<div class="activities-mobile "><div class="timeline-item"><div class="timeline-body"><a class="' +
    textColor +
    '" href="activitydetails.html#' +
    acID +
    '">';

  if (sort == "by-name") {
    var byName =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
      acID +
      '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-clock"></i>&nbsp;&nbsp;' +
      date +
      "</small></td></tr></table>";
    ret += byName;
  } else {
    var byDate =
      '<table><tr><td width="100%">' +
      task +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
      acID +
      '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td></tr><tr><td><small><i class="fas fa-walking"></i>&nbsp;&nbsp;' +
      status +
      '</small><small>&nbsp;&nbsp;<i class="fas fa-seedling"></i>&nbsp;&nbsp;' +
      landName +
      "</small></td></tr></table>";
    ret += byDate;
  }
  ret += "</a></div></div></div>";

  return ret;
}

function setactivityManagerMobile(
  sort,
  landName,
  date,
  task,
  status,
  acID,
  textColor
) {
  var ret =
  '<div class="activities-mobile "><div class="timeline-item"><div class="timeline-body"><a class="' +
  textColor +
  '" href="activitydetails.html#' +
  acID +
  '">';

if (sort == "by-name") {
  var byName =
    '<table><tr><td width="100%">' +
    task +
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
    acID +
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
    '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li id="progress-drop"><a class="dropdown-item text-blue" href="activitydetails.html#' +
    acID +
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

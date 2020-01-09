$(function() {
  /* initialize the external events
     -----------------------------------------------------------------*/
  function ini_events(ele) {
    ele.each(function() {
      // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
      // it doesn't need to have a start or end
      var eventObject = {
        title: $.trim($(this).text()) // use the element's text as the event title
      };

      // store the Event Object in the DOM element so we can get to it later
      $(this).data("eventObject", eventObject);

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 1070,
        revert: true, // will cause the event to go back to its
        revertDuration: 0 //  original position after the drag
      });
    });
  }

  ini_events($("#external-events div.external-event"));

  /* initialize the calendar
     -----------------------------------------------------------------*/
  //Date for the calendar events (dummy data)
  var date = new Date();
  var d = date.getDate(),
    m = (date.getMonth() +1),
    y = date.getFullYear();

  var Calendar = FullCalendar.Calendar;
  var Draggable = FullCalendarInteraction.Draggable;

  var containerEl = document.getElementById("external-events");
  var checkbox = document.getElementById("drop-remove");
  var calendarEl = document.getElementById("calendar");

  var colorActivity = {
    done: "#00a65a",
    over_due: "#f56954",
    not_done: "#A28E87",
    in_progress: "#f39c12"
  };

  // initialize the external events
  // -----------------------------------------------------------------

  new Draggable(containerEl, {
    itemSelector: ".external-event",
    eventData: function(eventEl) {
      console.log(eventEl);
      return {
        title: eventEl.innerText,
        backgroundColor: window
          .getComputedStyle(eventEl, null)
          .getPropertyValue("background-color"),
        borderColor: window
          .getComputedStyle(eventEl, null)
          .getPropertyValue("background-color"),
        textColor: window
          .getComputedStyle(eventEl, null)
          .getPropertyValue("color")
      };
    }
  });

  var url = "/activities/" + ownerId;
  var body = { byDate: 1 };
  var typ = "GET";
  var events = [];
  var activities;

  if (localStorage["acByDate"]) {
    activities = JSON.parse(localStorage["acByDate"]);
    setCalendarDetails(activities);
  } else {
    activities = connectToServer(url, body, typ);
    activities.then(
      docs => {
        setCalendarDetails(docs);
      },
      e => {
        console.log(e);
      }
    );
  }

  function setCalendarDetails(docs) {
    sessionStorage.acByDate = docs;
    activityDetail(docs);
    for (let i = 0; i < docs.length; i++) {
      var startDate = new Date(docs[i].start_date);
      var color;
      switch (docs[i].status) {
        case "ยังไม่ทำ": {
          color = colorActivity.not_done;
          break;
        }
        case "กำลังดำเนินการ": {
          color = colorActivity.in_progress;
          break;
        }
        case "เสร็จแล้ว": {
          color = colorActivity.done;
          break;
        }
        case "เลยกำหนด": {
          color = colorActivity.over_due;
          break;
        }
      }

      var obj = {
        title: docs[i].task,
        start: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        ),
        backgroundColor: color,
        borderColor: color
      };
      events.push(obj);
    }
    createCalendar();
  }

  function createCalendar() {
    var calendar = new Calendar(calendarEl, {
      plugins: ["bootstrap", "interaction", "dayGrid", "timeGrid"],
      themeSystem: "bootstrap",
      header: {
        right: "today prev,next ",
        left: "title"
        // center: "title",
        // right: "dayGridMonth,timeGridWeek , listGridWeek"
      },
      locale: "th",
      timeZone: "local",
      //Random default events
      events: events,
      //   events: [
      //     {
      //       title: "All Day Event",
      //       start: new Date(y, m, 1),
      //       backgroundColor: "#f56954", //red
      //       borderColor: "#f56954" //red
      //     },
      //     {
      //       title: "Long Event",
      //       start: new Date(y, m, d - 5),
      //       end: new Date(y, m, d - 2),
      //       backgroundColor: "#f39c12", //yellow
      //       borderColor: "#f39c12" //yellow
      //     },
      //     {
      //       title: "Meeting",
      //       start: new Date(y, m, d, 10, 30),
      //       allDay: false,
      //       backgroundColor: "#0073b7", //Blue
      //       borderColor: "#0073b7" //Blue
      //     },
      //     {
      //       title: "Lunch",
      //       start: new Date(y, m, d, 12, 0),
      //       end: new Date(y, m, d, 14, 0),
      //       allDay: false,
      //       backgroundColor: "#00c0ef", //Info (aqua)
      //       borderColor: "#00c0ef" //Info (aqua)
      //     },
      //     {
      //       title: "Birthday Party",
      //       start: new Date(y, m, d + 1, 19, 0),
      //       end: new Date(y, m, d + 1, 22, 30),
      //       allDay: false,
      //       backgroundColor: "#00a65a", //Success (green)
      //       borderColor: "#00a65a" //Success (green)
      //     },
      //     {
      //       title: "Click for Google",
      //       start: new Date(y, m, 28),
      //       end: new Date(y, m, 29),
      //       url: "http://google.com/",
      //       backgroundColor: "#3c8dbc", //Primary (light-blue)
      //       borderColor: "#3c8dbc" //Primary (light-blue)
      //     }
      //   ],
      editable: false,
      droppable: false, // this allows things to be dropped onto the calendar !!!
      drop: function(info) {
        // is the "remove after drop" checkbox checked?
        if (checkbox.checked) {
          // if so, remove the element from the "Draggable Events" list
          info.draggedEl.parentNode.removeChild(info.draggedEl);
        }
      }
    });
    calendar.render();
  }

  // $('#calendar').fullCalendar()

  /* ADDING EVENTS */
  var currColor = "#3c8dbc"; //Red by default
  //Color chooser button
  var colorChooser = $("#color-chooser-btn");
  $("#color-chooser > li > a").click(function(e) {
    e.preventDefault();
    //Save color
    currColor = $(this).css("color");
    //Add color effect to button
    $("#add-new-event").css({
      "background-color": currColor,
      "border-color": currColor
    });
  });
  $("#add-new-event").click(function(e) {
    e.preventDefault();
    //Get value and make sure it is not null
    var val = $("#new-event").val();
    if (val.length == 0) {
      return;
    }

    //Create events
    var event = $("<div />");
    event
      .css({
        "background-color": currColor,
        "border-color": currColor,
        color: "#fff"
      })
      .addClass("external-event");
    event.html(val);
    $("#external-events").prepend(event);

    //Add draggable funtionality
    ini_events(event);

    //Remove event from text input
    $("#new-event").val("");
  });

  function activityDetail(docs) {
    var tBody = document.getElementById("activities-calendar");
    var activityTable = document.getElementById("activities-table");
    var setBG;
    var classColor = {
      done: "bg-success",
      over_due: "bg-danger",
      not_done: "bg-secondary",
      in_progress: "bg-warning"
    };
    for (let i = 0; i < docs.length; i++) {
      var toDetail = document.createElement("a");
      toDetail.href = "activitydetails.html#" + docs[i].activity_id;
      var landName = docs[i].land_name;
      var getDate = docs[i].end_date != null ? docs[i].end_date : docs[i].start_date;
      var startDate = new Date(getDate);
      var toDate =   startDate.getDate() +
      "/" +
      (startDate.getMonth()+1) +
      "/" +
      startDate.getFullYear();
      var task = docs[i].task;
      var status = docs[i].status;
      var activityID = docs[i].activity_id
      var table = document.createElement('table');
      table.className += "table";
      var row = document.createElement("tr");
      if (localStorage["role"] == '"owner"') {
       row.innerHTML = "<td>" +
      landName +
      "</td><td>" +
      toDate +
      "</td><td>" +
      task +
      "</td><td>" +
      status +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li><a id="progress-drop" class="dropdown-item text-blue" href="activitydetails.html#' +
      activityID +
      '">ความก้าวหน้า</a></li><li><a class="dropdown-item text-danger" href="#">ลบ</a></li></ul></td>';

      }else{
        row.innerHTML = "<td>" +
      landName +
      "</td><td>" +
      toDate +
      "</td><td>" +
      task +
      "</td><td>" +
      status +
      '</td><td><button type="button" class="btn" data-toggle="dropdown" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button><ul class="dropdown-menu" x-placement="top-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-37px, -84px, 0px);"><li><a id="progress-drop" class="dropdown-item text-blue" href="activitydetails.html#' +
      activityID +
      '">ความก้าวหน้า</a></li></ul></td>';

      }
     
      // var nameCol = document.createElement("td");
      // nameCol.innerHTML = landName;
      // var optionCol = document.createElement("td");
      // optionCol.innerHTML = ' <i class="fas fa-ellipsis-v"></i>';
      // var dateCol = document.createElement("td");

      
      // var taskCol = document.createElement("td");
      // taskCol.innerHTML = task;
      // var statusCol = document.createElement("td");
      // statusCol.innerHTML = status;

      // row.appendChild(nameCol);
      // row.appendChild(dateCol);
      // row.appendChild(taskCol);
      // row.appendChild(statusCol);
      // row.appendChild(optionCol);

      //tBody.appendChild(row);
      table.appendChild(row);
      toDetail.appendChild(table);
      activityTable.appendChild(toDetail);
      switch (status) {
        case "ยังไม่ทำ": {
          setBG = classColor.not_done;
          break;
        }
        case "กำลังดำเนินการ": {
          setBG = classColor.in_progress;
          break;
        }
        case "เสร็จแล้ว": {
          setBG = classColor.done;
          break;
        }
        case "เลยกำหนด": {
          setBG = classColor.over_due;
          break;
        }
      }
      row.setAttribute("class", setBG);

      activityTable.innerHTML = activityTable.innerHTML + "<br>"
    }
  }
});

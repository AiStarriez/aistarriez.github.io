$(function () {
  /* initialize the external events
     -----------------------------------------------------------------*/
  function ini_events(ele) {
    ele.each(function () {
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
    m = date.getMonth() + 1,
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
    eventData: function (eventEl) {
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
  var body = {
    byDate: 1
  };
  var typ = "GET";
  var events = [];
  var activities, defultDate;

  var nonActivtiy = document.createElement('center');
  nonActivtiy.innerHTML = "<h4>ยังไม่มีกิจกรรม</h4>"
  nonActivtiy.style.color = "gray"

  activities = connectToServer(url, body, typ);
  activities.then(
    docs => {
      if (docs.length == 0) {
        createCalendar();
        document.getElementById("activities-table").appendChild(nonActivtiy);
        return false;
      }
      setCalendarDetails(docs);
    },
    e => {
      console.log(e);
      createCalendar();
      document.getElementById("activities-table").appendChild(nonActivtiy);
    }
  );


  function setCalendarDetails(docs) {
    activityDetail(docs);

    for (let i = 0; i < docs.length; i++) {
      var getDate =
        docs[i].end_date != null ? docs[i].end_date : docs[i].start_date;
      var startDate = new Date(getDate);
      var formatDate = startDate.toISOString().slice(0, 10);
      if (i == 0) {
        defultDate = formatDate;
      }
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
        start: formatDate,
        url: 'activitydetails.html?' + docs[i].activity_id + "&" + docs[i].land_id,
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
      defaultDate: defultDate,
      contentHeight: 600,
      locale: "th",
      timeZone: "local",
      //Random default events
      events: events,
      editable: false,
      droppable: false, // this allows things to be dropped onto the calendar !!!
      eventClick: function (info) {
        var eventObj = info.event;
        if (eventObj.url) {
          window.location = eventObj.url;
          info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
        } else {
          alert('Clicked ' + eventObj.title);
        }
      }
    });
    calendar.render();
  }

  /* ADDING EVENTS */
  var currColor = "#3c8dbc"; //Red by default
  //Color chooser button
  var colorChooser = $("#color-chooser-btn");
  $("#color-chooser > li > a").click(function (e) {
    e.preventDefault();
    //Save color
    currColor = $(this).css("color");
    //Add color effect to button
    $("#add-new-event").css({
      "background-color": currColor,
      "border-color": currColor
    });
  });
  $("#add-new-event").click(function (e) {
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
    var activitiesMobile = document.getElementById("activities-mobile");
    var setBG, setText;
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
    var mobileCard = "";
    var row = "";

    for (i in docs) {
      if (docs[i].status == "เสร็จแล้ว") continue;
      var landName = docs[i].land_name;
      var getDate =
        docs[i].end_date != null ? docs[i].end_date : docs[i].start_date;
      var startDate = new Date(getDate);
      var toDate =
        startDate.getDate() +
        "/" +
        (startDate.getMonth() + 1) +
        "/" +
        (startDate.getFullYear() + 543);
      var task = docs[i].task;
      var status = docs[i].status;
      var activityID = docs[i].activity_id;
      var landID = docs[i].land_id;
      var activityColors = setColorActivity(status);
      setBG = activityColors.setHex;
      setText = activityColors.setText;


      if (localStorage["role"] == '"owner"') {
        row += setActivityOwnerUI(
          landName,
          toDate,
          task,
          status,
          (activityID + "&" + landID),
          setBG,
          activityID,
          landID
        );
        mobileCard =
          mobileCard +
          '<div class="card"><div class="card-body">' +
          setactivityOwnerMobile(
            "by-name",
            landName,
            toDate,
            task,
            status,
            (activityID + "&" + landID),
            setText,
            activityID,
            landID
          ) +
          "</div></div>";
      } else {
        row += setActivityManagerUI(landName, toDate, task, status, (activityID + "&" + landID), setBG,activityID,landID);
        mobileCard =
          mobileCard +
          '<div class="card"><div class="card-body">' +
          setactivityManagerMobile(
            "by-name",
            landName,
            toDate,
            task,
            status,
            (activityID + "&" + landID),
            setText,
            activityID,
            landID
          ) +
          "</div></div>";
      }
    }
    var table = document.createElement("table");
    table.className += "table table-curved";
    table.innerHTML +=
      "<tr><th>ที่ดิน</th><th>วันที่</th><th>กิจกรรม</th><th>สถานะ</th><th></th></tr>";
    table.innerHTML = table.innerHTML + row;
    activitiesMobile.innerHTML = activitiesMobile.innerHTML + mobileCard;
    activityTable.appendChild(table);
  }
});
var key = "p5BaKOkNOumwpdETATTu47g0dWhmBXKA";
var getLocationKeyURL = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + key
var landlat, landlng;
var landId
var locationKey
var getCurrentConditionAPI
var getFiveDayForcastAPI
var lastTwentyFourAPI
var weatherDropDown = document.getElementById("weather-button");
var hash = window.location.hash;
hash = hash.replace("#", "");

var fiveDayWeather
var currentWeather


run();

/* get value of dropdown */
for (var i = 0, len = 3; i < len; i++) {
  var allChoiceWeather = document.getElementsByClassName("dropdown-item");
  allChoiceWeather.innerHTML = weatherDropDown[i];
  allChoiceWeather.onclick = (function (arg) {
    return function () {
      setFilterValueOnclick(arg);

    };
  })(weatherDropDown[i]);
}
function setFilterValueOnclick(value) {
  weatherDropDown.innerHTML = value;
  if (value == "สภาพอากาศขณะนี้") {
    //callCurrentCondition();
    document.getElementById("fiveDaysForecastDiv").style.display = "none";
    document.getElementById("currentForecastDiv").style.display = "inline";

  }
  else if (value == "สภาพอากาศล่วงหน้า 5 วัน") {

    document.getElementById("fiveDaysForecastDiv").style.display = "inline";
    document.getElementById("currentForecastDiv").style.display = "none";

  }

}

// hide forecast div
//document.getElementById("fiveDaysForecastDiv").style.display = "none";
//document.getElementById("currentForecastDiv").style.display = "none";

async function getAllLands() {
  var allLands = JSON.parse(localStorage["lands"]);
  var currentLand = allLands.find(x => x.land._id === hash)
  var currentPoints = currentLand.land.points[0]
  landlat = currentPoints.lat
  landlng = currentPoints.lng
}

async function getLocationKeyAPI() {
  try {
    var cityIdUrl = getLocationKeyURL + '&q=' + landlat + '%2C' + landlng;
    const response = await axios.get(cityIdUrl);
    console.log(response.data.Key)
    return response.data.Key
  } catch (error) {
    console.error(error);
  }
}
//getAllLands();
//getLocationKeyAPI();


function callFiveDaysWeather(locationKey) {

  getFiveDayForcastAPI = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/" + locationKey + "?apikey=" + key + "&language=th-th&details=true&metric=true"

  var fiveDaysWeatherApi = new XMLHttpRequest();
  fiveDaysWeatherApi.open("GET", getFiveDayForcastAPI, true);
  fiveDaysWeatherApi.onload = function () {
    // Begin accessing JSON data here
    var response = JSON.parse(fiveDaysWeatherApi.response)
    //fiveDaysWeather = response;

    //console.log(fiveDaysWeather)
    if (response != null) {
      setCacheData("fiveDaysWeather", response)
      //displayFivesDayWeather(fiveDaysWeather);

    } else {
      console.log(fiveDaysWeatherApi.responseText)
    }

  }
  // Send request
  //console.log(fiveDaysWeather)
  fiveDaysWeatherApi.send()

  //console.log(fiveDaysWeather)
}

function callCurrentCondition(locationKey) {
  getCurrentConditionAPI = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + key + "&language=th-th&details=true"
  //console.log(getCurrentConditionAPI)
  var currentWeatherApi = new XMLHttpRequest();
  currentWeatherApi.open("GET", getCurrentConditionAPI, true);
  currentWeatherApi.onload = function () {
    // Begin accessing JSON data here
    var response = JSON.parse(currentWeatherApi.response)
    currentWeather = response;
    displayCurrentCondition();
  }
  // Send request
  currentWeatherApi.send()
}

var weatherDay = [], minTemperature = [], maxTemperature = [], weatherText = [], weatherIcon = [], weatherWindSpeedKmPerHour = [],
  weatherWindDirection = [], sunRiseHours = [], sunSetHours = [], hoursOfSun = [];
var celsius = '&#8451;';//celsius symbol
var forecastLengthInDays = 5;//forecast for 5 days based on API
var fiveDaysWeather = JSON.parse(localStorage["fiveDaysWeather"])

function displayFivesDayWeather(data) {
  //console.log(data)
  console.log(fiveDaysWeather)
  const weekDays = new Array("อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์");
  const months = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม",
    "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน",
    "ตุลาคม", "พฤศจิกายน", "ธันวาคม");
  $('#fiveDaysForecastDiv').empty();
  $('#fiveDaysForecastDiv').append('<div id="weatherTodayDiv"></div>');
  //looping through the days and storing them in a specific arrays

  var titleTable = "<table id = \"fiveDayWeather\" > <tr style = \"background-color: #62EAD3; color: #fff\"><td></td>" +
    "<td><i class=\"fas fa-temperature-high\"></i>&nbsp;&nbsp;อุณหภูมิสูงสุด</td>" +
    "<td><i class=\"fas fa-temperature-low\"></i>&nbsp;&nbsp;อุณหภูมิต่ำสุด</td>" +
    "<td><i class=\"fas fa-sun\"></i>&nbsp;&nbsp;จำนวนชั่วโมงที่แดดออก</td>" +
    "<td><i class=\"fas fa-wind\"></i>&nbsp;&nbsp;ความเร็วลม</td>" +
    "<td><i class=\"fas fa-arrows-alt\"></i>&nbsp;&nbsp;ทิศทางลม</td></tr>"
  var forecastTable = []
  var endTable = "</table>"
  for (var i = 0; i < forecastLengthInDays; i++) {
    weatherDay[i] = data.DailyForecasts[i].Date;
    minTemperature[i] = data.DailyForecasts[i].Temperature.Minimum.Value;
    maxTemperature[i] = data.DailyForecasts[i].Temperature.Maximum.Value;
    weatherText[i] = data.DailyForecasts[i].Day.IconPhrase;
    weatherIcon[i] = data.DailyForecasts[i].Day.Icon;
    weatherWindSpeedKmPerHour[i] = data.DailyForecasts[i].Day.Wind.Speed.Value;
    weatherWindDirection[i] = data.DailyForecasts[i].Day.Wind.Direction.Localized;
    hoursOfSun[i] = data.DailyForecasts[i].HoursOfSun;

    /*var day = weekDays[(new Date(weatherDay[i])).getDay()]
    var date = new Date(weatherDay[i]).getDate()
    var month = new Date(weatherDay[i]).getMonth() +1
    var year = new Date(weatherDay[i]).getFullYear()+543*/
    var fullDate = new Date(weatherDay[i]).toLocaleDateString()
    if (i == 0 || i == 2 || i == 4) {
      forecastTable[i] = "<tr style = \"background-color: #c9f5ee\"class=\"text-secondary\">" +
        "<td>" + fullDate + "</td>" +
        "<td>" + maxTemperature[i] + "</td>" +
        "<td>" + minTemperature[i] + "</td>" +
        "<td>" + hoursOfSun[i] + "</td>" +
        "<td>" + weatherWindSpeedKmPerHour[i] + "</td>" +
        "<td>" + weatherWindDirection[i] + "</td>" +
        "</tr>"
    } else {
      forecastTable[i] = "<tr class=\"text-secondary\">" +
        "<td>" + fullDate + "</td>" +
        "<td>" + maxTemperature[i] + "</td>" +
        "<td>" + minTemperature[i] + "</td>" +
        "<td>" + hoursOfSun[i] + "</td>" +
        "<td>" + weatherWindSpeedKmPerHour[i] + "</td>" +
        "<td>" + weatherWindDirection[i] + "</td>" +
        "</tr>"
    }
    /*var table = "<table id=\"current-table\" class=\"text-secondary\">" +
    "<tr><td>" + fullDate + "</td><td></td><td></td></tr>" +
    "<tr><td>" + weatherText[i] + "</td><td></td><td></td></tr>" +
    "<tr><td><i class=\"fas fa-thermometer-quarter\"></i>&nbsp;&nbsp;&nbsp;อุณหภูมิสูงสุด</td> <td>" + maxTemperature[i] + "</td> <td> องศาเซลเซียส</td> </tr>" +
    "<tr><td><i class=\"fas fa-thermometer-quarter\"></i>&nbsp;&nbsp;&nbsp;อุณหภูมิต่ำสุด</td> <td>" +  minTemperature[i] + "</td> <td> องศาเซลเซียส</td> </tr>" +
    "<tr><td><i class=\"fas fa-sun\"></i>&nbsp;&nbsp;&nbsp;จำนวนชั่วโมงที่แดดออก</td> <td>" +  hoursOfSun[i] + "</td> <td> ชั่วโมง</td> </tr>" +
    "<tr><td><i class=\"fas fa-wind\"></i>&nbsp;&nbsp;&nbsp;ความเร็วลม</td> <td>" + weatherWindDirection[i] +" "+ weatherWindSpeedKmPerHour[i] + " </td><td> กิโลเมตร/ชั่วโมง" + " </td></tr>"*/
    //var table = "<table id=\"current-table\" class=\"text-secondary\">" +


    //$('#fiveDayWeather').append(forecastTable)

    //console.log(weatherDay[i])
  }
  var table = titleTable + forecastTable + endTable
  $('#weatherTodayDiv').append(table)
  //date formatting based on week days and months


  //forecast for #weatherTodayDiv
  /*var day = weekDays[(new Date(weatherDay[i])).getDay()]
  var date = new Date(weatherDay[i]).getDate()
  var month = months[new Date(weatherDay[i]).getMonth()]
  var year = new Date(weatherDay[i]).getFullYear()+543

var fullDate = day + " " + date + " " + month + " " + year*/

  // https://developer.accuweather.com/sites/default/files/06-s.png
  console.log(weatherIcon[0])
  /*if (weatherIcon[0] <= 9) {
    $('#weatherTodayDiv').append('<div id="weatherIcon">' + '<img src = https://developer.accuweather.com/sites/default/files/0' + weatherIcon[0] + '-s.png>' + '</div>');
  } else {
    $('#weatherTodayDiv').append('<div id="weatherIcon">' + '<img src = https://developer.accuweather.com/sites/default/files/' + weatherIcon[0] + '-s.png>' + '</div>');
  }
  $('#weatherTodayDiv').append('<div id="weatherTextDiv">' + weatherText[0] + '</div>');
  $('#weatherTodayDiv').append('<div id="temperatureDiv">' + 'อุณหภูมิสูงสุด: ' + maxTemperature[0] + celsius + '<br>' + 'อุณหภูมิต่ำสุด: ' + minTemperature[0] + celsius + '</div>');
  $('#weatherTodayDiv').append('<div id="windSpeedDiv">' + 'ความเร็วลม: ' + weatherWindSpeedKmPerHour[0] + ' กิโลเมตร/ชั่วโมง ' + weatherWindDirection[0] + '</div>');
  $('#weatherTodayDiv').append('<div id="totalSunHoursDiv">' + 'จำนวนชั่วโมงที่แดดออก: ' + hoursOfSun[0] + '</div>');

  //looping other days in our forecast
  //creating divs with styling and showing forecast info
  for (var i = 1; i < forecastLengthInDays; i++) {
    nextDay = document.createElement('div');
    nextDay.id = "nextDay" + i;

    var nextDateDiv = document.createElement('div');
    nextDateDiv.id = 'nextDateDiv' + i;
    var dateText = document.createTextNode(weekDays[(new Date(weatherDay[i])).getDay()] + ' ' + (new Date(weatherDay[i])).getDate() + " " +
      months[new Date(weatherDay[i]).getMonth()] + " " + (new Date(weatherDay[i]).getFullYear()+543) );
    nextDateDiv.appendChild(dateText);
    nextDay.appendChild(nextDateDiv);

    var nextWeatherIconDiv = document.createElement('div');
    nextWeatherIconDiv.id = 'nextWeatherIconDiv' + i;
    var iconWeather = document.createElement("img");
    if (weatherIcon[0] <= 9) {
      iconWeather.src = 'https://developer.accuweather.com/sites/default/files/0' + weatherIcon[0] + '-s.png'
    } else {
      iconWeather.src = 'https://developer.accuweather.com/sites/default/files/' + weatherIcon[0] + '-s.png>'
    }
    nextWeatherIconDiv.appendChild(iconWeather);
    nextDay.appendChild(nextWeatherIconDiv);

    var nextWeatherTextDiv = document.createElement('div');
    nextWeatherTextDiv.id = 'nextWeatherTextDiv' + i;
    var weatherDegrees = document.createTextNode(weatherText[i]);
    nextWeatherTextDiv.appendChild(weatherDegrees);
    nextDay.appendChild(nextWeatherTextDiv);

    var nextTemperatureDiv = document.createElement('div');
    nextTemperatureDiv.id = 'nextTemperatureDiv' + i;
    var temperatureText = document.createTextNode(maxTemperature[i] + "\u2103" + ' | ' + minTemperature[i] + "\u2103");
    nextTemperatureDiv.appendChild(temperatureText);
    nextDay.appendChild(nextTemperatureDiv);

    $('#fiveDaysForecastDiv').append(nextDay);
  }*/

}

var weatherDay, weatherText, weatherIcon, temperature, weatherWindSpeedKmPerHour, weatherWindDirection, weatherPressure, weatherHumidity, weatherCloudCover;

function displayCurrentCondition() {
  console.log(currentWeather)
  //console.log(currentWeather.Temperature.Metric.Value)
  weatherDay = currentWeather[0].LocalObservationDateTime
  weatherText = currentWeather[0].WeatherText;
  weatherIcon = currentWeather[0].WeatherIcon;
  temperature = currentWeather[0].Temperature.Metric.Value;
  weatherWindSpeedKmPerHour = currentWeather[0].Wind.Speed.Metric.Value;
  weatherWindDirection = currentWeather[0].Wind.Direction.Localized;
  weatherPressure = currentWeather[0].Pressure.Metric.Value;
  weatherHumidity = currentWeather[0].RelativeHumidity;
  weatherCloudCover = currentWeather[0].CloudCover;
  //console.log(weatherDay)
  //console.log(weatherHumidity)

  //date formatting based on week days and months
  const weekDays = new Array("อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์");
  const months = new Array("มกราคม", "กุมภาพันธ์", "มีนาคม",
    "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน",
    "ตุลาคม", "พฤศจิกายน", "ธันวาคม");
  $('#currentForecastDiv').empty();
  $('#currentForecastDiv').append('<div id="currentConditionDiv"></div>');
  //$('#currentConditionDiv').append('<table><tr>')
  //forecast for #weatherTodayDiv
  /*if (weatherIcon <= 9) {
    $('#currentConditionDiv').append('<div id="currentIcon">' + '<img id="icon" src = https://developer.accuweather.com/sites/default/files/0' + weatherIcon + '-s.png>' + '</div>');
  } else {
    $('#currentConditionDiv').append('<div id="currentIcon">' + '<img id="icon" src = https://developer.accuweather.com/sites/default/files/' + weatherIcon + '-s.png>' + '</div>');
  }
  $('#currentConditionDiv').append('<div id="currentInfo"></div>');
  $('#currentInfo').append('<div id="dateDiv">' + weekDays[(new Date(weatherDay)).getDay()] + '<br>' +
    (new Date(weatherDay)).getDate() + " " + months[new Date(weatherDay).getMonth()] + " " + (new Date(weatherDay).getFullYear()+ 543) + '</div>');

  // https://developer.accuweather.com/sites/default/files/06-s.png
  console.log(weatherIcon)

  $('#currentIcon').append('<div id="weatherTextDiv">' + weatherText + '</div>');
  $('#currentIcon').append('<div id="temperatureDiv">' + temperature + celsius + '</div>');
  $('#currentInfo').append('<div id="windSpeedDiv">' + 'ความเร็วลม: ' + weatherWindSpeedKmPerHour + ' กิโลเมตร/ชั่วโมง ' + weatherWindDirection + '</div>');
  $('#currentInfo').append('<div id="humidityDiv">' + 'ความชื้นสัมพัทธ์ในอากาศ: ' + weatherHumidity + ' %</div>');
  $('#currentInfo').append('<div id="pressureDiv">' + 'ความกดอากาศ: ' + weatherPressure + '  mb</div>');
  $('#currentInfo').append('<div id="cloudCoverDiv">' + 'ปริมาณเมฆ: ' + weatherCloudCover + ' %</div>');*/
  var table = "<table id=\"current-table\" class=\"text-secondary\">" +
    "<tr><td>" + weatherText + "</td><td></td><td></td></tr>" +
    "<tr><td><i class=\"fas fa-thermometer-quarter\"></i>&nbsp;&nbsp;&nbsp;อุณหภูมิ</td> <td>" + temperature + "</td> <td> องศาเซลเซียส</td> </tr>" +
    "<tr><td><i class=\"fa fa-tint\"></i>&nbsp;&nbsp;&nbsp;ความชื้นสัมพัทธ์ในอากาศ</td> <td>" + weatherHumidity + "</td><td>%</td> </tr>" +
    "<tr><td><i class=\"fas fa-tachometer-alt\"></i>&nbsp;&nbsp;ความกดอากาศ</td> <td>" + weatherPressure + "</td><td>mb </td></tr>" +
    "<tr><td><i class=\"fa fa-cloud\"></i>&nbsp;&nbsp;&nbsp;ปริมาณเมฆ</td> <td>" + weatherCloudCover + "</td><td>% </td></tr>" +
    "<tr><td><i class=\"fas fa-wind\"></i>&nbsp;&nbsp;&nbsp;ความเร็วลม</td> <td>" + weatherWindDirection + " " + weatherWindSpeedKmPerHour + " </td><td> กิโลเมตร/ชั่วโมง" + " </td></tr>"
  $('#currentConditionDiv').append(table)


}


async function run() {
  await getAllLands();
  var locationKey = await getLocationKeyAPI();
  console.log(locationKey)
  callCurrentCondition(locationKey);
  callFiveDaysWeather(locationKey);

  document.getElementById("fiveDaysForecastDiv").style.display = "none";
  document.getElementById("currentForecastDiv").style.display = "block";

  var currentDate = new Date().toISOString();
  currentDate = currentDate.substr(0, 10)
  console.log(currentDate)
  var apiDate = new Date(fiveDaysWeather.Headline.EffectiveDate).toISOString();
  apiDate = apiDate.substr(0, 10)
  console.log(apiDate)
  if (currentDate != apiDate) {

    console.log("date is not the same")
    //callFiveDaysWeather();
    displayFivesDayWeather(fiveDaysWeather);
    //console.log(localStorage["fiveDaysWeather"])
  }
  else {
    console.log("date is the same")
    displayFivesDayWeather(fiveDaysWeather);
  }
}


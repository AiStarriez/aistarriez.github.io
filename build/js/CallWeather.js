var key = "p5BaKOkNOumwpdETATTu47g0dWhmBXKA";
var getLocationKeyURL = "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="+ key
var landlat, landlng
var ownerId = "5dfcabe6666c642250d2ec59";
var landId
var locationKey
var getCurrentConditionAPI
var getFiveDayForcastAPI
var lastTwentyFourAPI
var weatherDropDown = document.getElementById("weather-button");

//var fiveDaysWeather
var currentWeather
/*parse map object to find land id*/

/* get land's latitude and longitude*/
function getallLands() {
  var allLands = JSON.parse(localStorage["lands"])
  console.log(typeof(allLands))

    var currentLand = allLands.find(x => x.land._id === sessionStorage.currentLandId)
    console.log(allLands)
    console.log(currentLand)
    var currentPoints = currentLand.land.points[0]
    landlat = currentPoints.lat
    landlng = currentPoints.lng 
 
} 
var getLatLng = getallLands();
console.log(landlat)
console.log(landlng)

var cityIdUrl = getLocationKeyURL + '&q='+ landlat + '%2C' + landlng + '';
var cityIdApi = new XMLHttpRequest();
    cityIdApi.open("GET", cityIdUrl, true);
    cityIdApi.onload = function() {
      // Begin accessing JSON data here
      var cityId = JSON.parse(cityIdApi.response)
      locationKey = cityId.Key
      console.log(locationKey)
    }
    // Send request
    cityIdApi.send()

   for ( var i = 0, len = 3; i < len; i++ ) {
    var allChoiceWeather = document.getElementsByClassName("dropdown-item");
    allChoiceWeather.innerHTML = weatherDropDown[i];
    allChoiceWeather.onclick = (function(arg) {
      return function(){
        setFilterValueOnclick(arg);
      };
    })(weatherDropDown[i]);
  }

  function setFilterValueOnclick(value) {
    weatherDropDown.innerHTML = value;
    if (value == "สภาพอากาศขณะนี้") {
        callCurrentCondition();
    }
    else if (value == "สภาพอากาศล่วงหน้า 5 วัน") {
      
      callFiveDaysWeather();
      displayFivesDayWeather();
    }
    else if (value == "สภาพอากาศ 24 ชั่วโมงก่อนหน้า") {
      callLastTwentyFour();
    }
  }

function callFiveDaysWeather() {
 
  getFiveDayForcastAPI = "http://dataservice.accuweather.com/forecasts/v1/daily/5day/"  + locationKey + "?apikey=" + key + "&language=th-th&details=true&metric=true"
  
      var fiveDaysWeatherApi = new XMLHttpRequest();
      fiveDaysWeatherApi.open("GET", getFiveDayForcastAPI, true);
      fiveDaysWeatherApi.onload = function() {
        // Begin accessing JSON data here
        var response = JSON.parse(fiveDaysWeatherApi.response)
        //fiveDaysWeather = response;
        
      //console.log(fiveDaysWeather)
         if(response != null){
           setCacheData("fiveDaysWeather", response)
           //console.log(localStorage["fiveDaysWeather"])
         } else {
           console.log(fiveDaysWeatherApi.responseText)
       }
      
     }
      // Send request
      //console.log(fiveDaysWeather)
      fiveDaysWeatherApi.send()
      
      //console.log(fiveDaysWeather)
}

function callCurrentCondition() {
  getCurrentConditionAPI = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "?apikey=" + key + "&language=th-th&details=true"
  //console.log(getCurrentConditionAPI)
  var currentWeatherApi = new XMLHttpRequest();
  currentWeatherApi.open("GET", getCurrentConditionAPI, true);
  currentWeatherApi.onload = function() {
    // Begin accessing JSON data here
    var response = JSON.parse(currentWeatherApi.response)
    currentWeather = response;
    displayCurrentCondition();
  }
  // Send request
  currentWeatherApi.send()
}

function callLastTwentyFour() {
  lastTwentyFourAPI = "http://dataservice.accuweather.com/currentconditions/v1/" + locationKey + "/historical/24?apikey=" + key + "&language=th-th&details=true"
  var lastTwentyFourApi = new XMLHttpRequest();
  lastTwentyFourApi.open("GET", lastTwentyFourAPI, true);
  lastTwentyFourApi.onload = function() {
    // Begin accessing JSON data here
    var lastTwentyfour = JSON.parse(lastTwentyFourApi.response)
    console.log(lastTwentyfour)
  }
  // Send request
  lastTwentyFourApi.send()
}




var weatherDay = [], minTemperature = [], maxTemperature= [], weatherText= [], weatherIcon= [], weatherWindSpeedKmPerHour= [],
    weatherWindDirection = [], sunRiseHours = [], sunSetHours = [], hoursOfSun = [];
var celsius = '&#8451;';//celsius symbol
var forecastLengthInDays = 5;//forecast for 5 days based on API
var fiveDaysWeather = JSON.parse(localStorage["fiveDaysWeather"])

/*function displayFivesDayWeather() {
  console.log(fiveDaysWeather)

}*/
function displayFivesDayWeather (){
  console.log(fiveDaysWeather)
 
  //looping through the days and storing them in a specific arrays
  for (var i = 0; i < forecastLengthInDays; i++) {
    weatherDay[i] = fiveDaysWeather.DailyForecasts[i].Date;
    minTemperature[i] = fiveDaysWeather.DailyForecasts[i].Temperature.Minimum.Value;
    maxTemperature[i] = fiveDaysWeather.DailyForecasts[i].Temperature.Maximum.Value;
    weatherText[i] = fiveDaysWeather.DailyForecasts[i].Day.IconPhrase;
    weatherIcon[i] = fiveDaysWeather.DailyForecasts[i].Day.Icon;
    weatherWindSpeedKmPerHour[i] = fiveDaysWeather.DailyForecasts[i].Day.Wind.Speed.Value;
    weatherWindDirection[i] = fiveDaysWeather.DailyForecasts[i].Day.Wind.Direction.Degrees;
    hoursOfSun[i] = fiveDaysWeather.DailyForecasts[i].HoursOfSun;
    //console.log(weatherDay[i])
  }
  //date formatting based on week days and months
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $('#weatherForecastDiv').empty();
    $('#weatherForecastDiv').append('<div id="weatherTodayDiv"></div>');

    //forecast for #weatherTodayDiv
    $('#weatherTodayDiv').append('<div id="dateDiv">' + weekDays[(new Date(weatherDay[0])).getDay()] + '<br>' +
        (new Date(weatherDay[0])).getDate()+ " " + months[new Date(weatherDay[0]).getMonth()] + " " + new Date(weatherDay[0]).getFullYear() + '</div>');

       // https://developer.accuweather.com/sites/default/files/06-s.png
    console.log(weatherIcon[0])
    if (weatherIcon[0] <= 9 ){
      $('#weatherTodayDiv').append('<div id="weatherIcon">' + '<img src = https://developer.accuweather.com/sites/default/files/0' + weatherIcon[0] + '-s.png>'  + '</div>');
    } else {
      $('#weatherTodayDiv').append('<div id="weatherIcon">' + '<img src = https://developer.accuweather.com/sites/default/files/' + weatherIcon[0] + '-s.png>'  + '</div>');
    }
    $('#weatherTodayDiv').append('<div id="weatherTextDiv">' + weatherText[0] + '</div>');
    $('#weatherTodayDiv').append('<div id="temperatureDiv">' + 'อุณหภูมิสูงสุด: '+ maxTemperature[0] + celsius +'<br>' +'อุณหภูมิต่ำสุด: '+ minTemperature[0] + celsius + '</div>');
    $('#weatherTodayDiv').append('<div id="windSpeedDiv">' +'ความเร็วลม: '+ weatherWindSpeedKmPerHour[0] +' กิโลเมตร/ชั่วโมง '+ weatherWindDirection[0]+ '</div>');
    $('#weatherTodayDiv').append('<div id="totalSunHoursDiv">' +'จำนวนชั่วโมงที่แดดออก: '+ hoursOfSun[0] +'</div>');

        //looping other days in our forecast
    //creating divs with styling and showing forecast info
    for (var i = 1; i < forecastLengthInDays; i++) {
      nextDay = document.createElement('div');
      nextDay.id = "nextDay"+i;

      var nextDateDiv = document.createElement('div');
      nextDateDiv.id = 'nextDateDiv'+i;
      var dateText = document.createTextNode(weekDays[(new Date(weatherDay[i])).getDay()] + ' ' + (new Date(weatherDay[i])).getDate()+ " " +
          months[new Date(weatherDay[i]).getMonth()] + " " + new Date(weatherDay[i]).getFullYear());
      nextDateDiv.appendChild(dateText);
      nextDay.appendChild(nextDateDiv);

      var nextWeatherIconDiv = document.createElement('div');
      nextWeatherIconDiv.id = 'nextWeatherIconDiv'+i;
      var iconWeather = document.createElement("img");
      if (weatherIcon[0] <= 9 ){
       iconWeather.src = 'https://developer.accuweather.com/sites/default/files/0' + weatherIcon[0] + '-s.png'  
      } else {
        iconWeather.src =  'https://developer.accuweather.com/sites/default/files/' + weatherIcon[0] + '-s.png>'
      }
      nextWeatherIconDiv.appendChild(iconWeather);
      nextDay.appendChild(nextWeatherIconDiv);

      var nextWeatherTextDiv = document.createElement('div');
      nextWeatherTextDiv.id = 'nextWeatherTextDiv'+i;
      var weatherDegrees = document.createTextNode(weatherText[i]);
      nextWeatherTextDiv.appendChild(weatherDegrees);
      nextDay.appendChild(nextWeatherTextDiv);

      var nextTemperatureDiv = document.createElement('div');
      nextTemperatureDiv.id = 'nextTemperatureDiv'+i;
      var temperatureText = document.createTextNode(maxTemperature[i] + "\u2103" + ' | ' + minTemperature[i] + "\u2103");
      nextTemperatureDiv.appendChild(temperatureText);
      nextDay.appendChild(nextTemperatureDiv);

      $('#weatherForecastDiv').append(nextDay);
  }
  console.log(fiveDaysWeather)
}

var weatherDay, weatherText, weatherIcon, temperature, weatherWindSpeedKmPerHour, weatherWindDirection, weatherPressure, weatherHumidity, weatherCloudCover;

function displayCurrentCondition (){
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
  console.log(weatherDay)
  console.log(weatherHumidity)

  //date formatting based on week days and months
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $('#weatherForecastDiv').empty();
    $('#weatherForecastDiv').append('<div id="currentConditionDiv"></div>');
    //$('#currentConditionDiv').append('<table><tr>')
    //forecast for #weatherTodayDiv
     if (weatherIcon <= 9 ){
      $('#currentConditionDiv').append('<div id="weatherIcon">' + '<img id="icon" src = https://developer.accuweather.com/sites/default/files/0' + weatherIcon + '-s.png>'  + '</div>');
    } else {
      $('#currentConditionDiv').append('<div id="weatherIcon">' + '<img id="icon" src = https://developer.accuweather.com/sites/default/files/' + weatherIcon + '-s.png>'  + '</div>');
    }
    $('#currentConditionDiv').append('<div id="currentInfo"></div>');
    $('#currentInfo').append('<div id="dateDiv">' + weekDays[(new Date(weatherDay)).getDay()] + '<br>' +
        (new Date(weatherDay)).getDate()+ " " + months[new Date(weatherDay).getMonth()] + " " + new Date(weatherDay).getFullYear() + '</div>');

       // https://developer.accuweather.com/sites/default/files/06-s.png
    console.log(weatherIcon)
    
    $('#weatherIcon').append('<div id="weatherTextDiv">' + weatherText + '</div>');
    $('#weatherIcon').append('<div id="temperatureDiv">' + temperature + celsius + '</div>');
    $('#currentInfo').append('<div id="windSpeedDiv">' +'ความเร็วลม: '+ weatherWindSpeedKmPerHour +' กิโลเมตร/ชั่วโมง '+ weatherWindDirection+ '</div>');
    $('#currentInfo').append('<div id="humidityDiv">' +'ความชื้นสัมพัทธ์ในอากาศ: '+ weatherHumidity +' %</div>');
    $('#currentInfo').append('<div id="pressureDiv">' +'ความกดอากาศ: '+ weatherPressure +'  mb</div>');
    $('#currentInfo').append('<div id="cloudCoverDiv">' +'ปริมาณเมฆ: '+ weatherCloudCover +' %</div>');
}


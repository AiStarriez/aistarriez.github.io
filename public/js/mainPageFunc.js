var provinceFilter = document.getElementById("provice-filter");
var provinceDropdown = document.getElementById("provice-dropdown")
var districtFilter = document.getElementById("district-filter")
var districtDropdown = document.getElementById("district-dropdown")
var landNameDropdown = document.getElementById("land-dropdown");
var landNameFilter = document.getElementById("land-name-filter");
var plantDropdown = document.getElementById("plant-dropdown");
var plantFilter = document.getElementById("plant-filter");

window.province = "ทั้งหมด";
window.district = "ทั้งหมด";
window.land = "ทั้งหมด";
window.plant = "ทั้งหมด";


async function apiGetPlant() {
  var cachePlant = localStorage["plants"] || undefined;
  if (cachePlant == undefined) {
    try {
      var url = "/plants/" + ownerId;
      var body = "";
      var getAllPlant = await connectToServer(url, body, "GET");
      localStorage.plants = JSON.stringify(getAllPlant)
      return getAllPlant
    } catch (err) {
      console.log(err)
    }
  }
  return JSON.parse(cachePlant)
}

function setDropdownItem(type, value, root) {
  var fName = document.createElement("a");
  fName.innerHTML = value;
  fName.setAttribute("class", "dropdown-item");
  fName.setAttribute("role", "presentation");
  root.appendChild(fName);
  fName.onclick = (function (arg) {
    return function () {
      setFilterValueOnclick(type, arg);
    };
  })(value);
}

async function filterLands() {
  try {
    var url = "/lands/filter/" + ownerId;
    var getFilters = await connectToServer(url, "", "GET");

    var address = getFilters.address
    var landName = getFilters.land_name;
    var plantName = getFilters.plant;

    provinceDropdown.innerHTML = ""
    setDropdownItem("province" , "ทั้งหมด" , provinceDropdown )
    address.forEach(add => {
      var fName = document.createElement("a");
      fName.innerHTML = add.province;
      fName.setAttribute("class", "dropdown-item");
      fName.setAttribute("role", "presentation");
      provinceDropdown.appendChild(fName);
      fName.onclick = (function (arg) {
        return function () {
          districtFilter.innerHTML = "อำเภอ"
          districtDropdown.innerHTML = ""
          setDropdownItem("district" , "ทั้งหมด" , districtDropdown )
          arg.district.forEach(dis => {
          setDropdownItem("district" , dis , districtDropdown)
          })

          provinceFilter.value = arg.province
          setFilterValueOnclick("province", arg.province);
        };
      })(add);
    })
    landNameDropdown.innerHTML = ""
    setDropdownItem("land" , "ทั้งหมด" , landNameDropdown )
    landName.forEach(name => {
      setDropdownItem("land", name, landNameDropdown)
    });
    plantDropdown.innerHTML = ""
    setDropdownItem("plant" , "ทั้งหมด" , plantDropdown )
    plantName.forEach(plant => {
      setDropdownItem("plant", plant, plantDropdown)
    })

  } catch (err) {
    console.log(err)
  }
}

function onFilterChange(lands){
  landNameDropdown.innerHTML = ""
  setDropdownItem("land" , "ทั้งหมด" , landNameDropdown)

  lands.forEach(land =>{
    setDropdownItem("land", land.land.name, landNameDropdown)
  })
}

function setFilterValueOnclick(type, value) {
  window.land = "ทั้งหมด"
  if (type == "land") {
    landNameFilter.innerHTML = value;
    if (value == "ทั้งหมด") {
      value = "ทั้งหมด"
      plantFilter.disabled = false
      window.plant = "ทั้งหมด"
    } else {
      plantFilter.disabled = true
      districtFilter.disabled = true
      plantFilter.innerHTML = "พืช"
      window.plant = "ทั้งหมด"
    }
    window.land = value;
  } else if (type == "plant") {
    plantFilter.innerHTML = value;
    if (value == "ทั้งหมด") {
      landNameFilter.disabled = false
    } else {
      landNameFilter.disabled = true

      landNameFilter.innerHTML = "ที่ดิน"
    }
    window.plant = value;
  } else if (type == "province") {
    provinceFilter.innerHTML = value
    window.province = value
    window.district = "ทั้งหมด"

    landNameFilter.innerHTML = "ที่ดิน"

    if (value == "ทั้งหมด") {
      districtFilter.disabled = true
      districtFilter.innerHTML = "อำเภอ"
    } else {
      districtFilter.disabled = false
    }
  } else if (type == "district") {
    districtFilter.innerHTML = value
    window.district = value
    if (value == "ทั้งหมด" ) {
      window.district = "ทั้งหมด"
    }
  }
  findLands(window.province, window.district, window.land, window.plant);
}

async function findLands(province, district, landName, plant) {
  var landsData = JSON.parse(localStorage["lands"]) || undefined;
  var plantData = JSON.parse(localStorage["plants"]) || undefined;
  try {
    var url =
      "/sec/lands/filter?province=" +
      province +
      "&district=" +
      district +
      "&landname=" +
      landName +
      "&plant=" +
      plant;

    var body = JSON.stringify({
      lands: landsData,
      plants: plantData
    });
    var filterLand = await connectToServer(url, body, "POST");
    onFilterChange(filterLand)
    if(filterLand.length == 0){
      var cacheLand = JSON.parse(localStorage.lands)
      createMap(cacheLand)
      alert("ไม่พบที่ดินที่คุณต้องการ")
    }else{
      createMap(filterLand)
    }
  } catch (err) {
    console.log(err)
  }


}

function setMapAfFilter(afFilters) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: defultLocation,
    zoom: 16,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeId: "satellite"
  });
  getPolygonLands(afFilters);
}

function initBtn() {
  $("#hamburger").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  $("#addLandBtn").click(function (e) {
    e.preventDefault();
    localStorage.removeItem("polygonEditLand");
    window.location = "addland.html";
  });
}

$("#provice-dropdown").on('classChange', function () {
  console.log("DD menu")
  // do stuff
});

async function run() {
  localStorage.removeItem("authenEvent")
  var plants = await apiGetPlant();
  await filterLands();
}

run()
initBtn()
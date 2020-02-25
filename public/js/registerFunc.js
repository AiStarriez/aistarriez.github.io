var errorMessage = document.getElementById("error-regis");
var agreeTerms = document.getElementById("agreeTerms")
var nameOwner = document.getElementById("name-owner-input");
var emailOwner = document.getElementById("email-owner-input");
var passOwner = document.getElementById("pass-owner-input");
var conPassOwner = document.getElementById("con-pass-owner-input");

var codeManage = document.getElementById("code-manager-input");
var nameManage = document.getElementById("name-manager-input");
var phoneManage = document.getElementById("phone-manager-input");
var addressManage = document.getElementById("addres-manager-input");
var regisBtn = document.getElementById("manager-regis-bt")
var managerImage;
selectRoleUI();

$("#manager-regis-bt").click(function () {
  checkValidation(localStorage.role);
});
$('#agreeTerms').change(function () {
  if (this.checked) {
    regisBtn.disabled = false
  } else {
    regisBtn.disabled = true

  }
});

document
  .getElementById("con-pass-owner-input")
  .addEventListener("keyup", checkConfirmPassword);

function selectRoleUI() {
  var role = localStorage.role;
  if (localStorage.authenEvent == "loginGoogle") {
    console.log("Google");
    $("#owner-register-ui").css("display", "block");
    $("#regis-from-email").css("display", "none");
    localStorage.role = "owner-gg";
  } else if (role == "manager") {
    $("#manager-register-ui").css("display", "block");
  } else {
    $("#owner-register-ui").css("display", "block");
  }
}

async function checkValidation(role) {
  errorMessage.innerHTML = "**กรุณากรอกข้อมูลให้ครบถ้วนและยืนยันรหัสผ่านให้ถูกต้อง"

  if (role == "owner") {
    if (
      nameOwner.checkValidity() &&
      emailOwner.checkValidity() &&
      passOwner.checkValidity() &&
      conPassOwner.checkValidity() &&
      window.confirmPass
    ) {
      errorMessage.style.display = "none";
      createAccountOwner(emailOwner.value, passOwner.value, nameOwner.value);
    } else {

      errorMessage.style.display = "block";
    }
  } else if (role == "owner-gg") {
    if (nameOwner.checkValidity()) {
      console.log("check pass");
      errorMessage.style.display = "none";
      registerOwnerDB(localStorage.email, nameOwner.value);
      localStorage.removeItem("email");
    } else {
      errorMessage.style.display = "block";
    }
  } else {
    if (
      codeManage.checkValidity() &&
      nameManage.checkValidity() &&
      phoneManage.checkValidity() &&
      addressManage.checkValidity()
    ) {

     await postRegisManagerData()
     document.getElementById("manager-login-bt").click()

    } else {
      errorMessage.innerHTML = "**กรุณากรอกข้อมูลให้ครบถ้วน"
      errorMessage.style.display = "block";
    }
  }
}

async function postRegisManagerData() {
  try {
    localStorage.authenEvent = "manager-register";
    errorMessage.style.display = "none";
    var managerID = codeManage.value;
    var owner = await connectToServer("/managers/findowner/" + managerID, "", "GET");
    await uploadManagerImg(managerID, owner.owner_id)
  } catch (err) {
    errorMessage.innerHTML = "**รหัสผู้ดูแลไม่ถูกต้อง"
    errorMessage.style.display = "block";
  }
}

async function uploadManagerImg(managerID, ownerID) {
  if (managerImage) {
    try {
      var url = "/images/upload?manager=" + managerID + "&owner=" + ownerID;
      var formdata = new FormData();
      formdata.append("file", managerImage);
      var typ = "POST";
      var uploadImage = await uploadMongoImage(url, formdata, typ);
      console.log(uploadImage)
    } catch (err) {
      console.log(err);
    }
  }
  var managerDetail = {
    id: managerID,
    name: nameManage.value,
    image: uploadImage || null,
    contact_info: {
      address: addressManage.value,
      phone: phoneManage.value
    }
  };
  console.log(managerDetail)
  localStorage.mDetail = JSON.stringify(managerDetail);
}

function checkConfirmPassword() {
  var pass = document.getElementById("pass-owner-input");
  var conPass = document.getElementById("con-pass-owner-input");
  var emojiConPass = document.getElementById("emoji-conpass");
  if (pass.value == conPass.value) {
    emojiConPass.className = "fas";
    emojiConPass.classList.add("fa-check-circle");
    emojiConPass.style.color = "green";
    window.confirmPass = true;
  } else {
    window.confirmPass = false;
    emojiConPass.className = "fas";
    emojiConPass.classList.add("fa-lock");
    emojiConPass.style.color = "#777777";
  }
}


$("#manager-verify-bt").click(function() {
  console.log("verify")
  onVerifyCodeSubmit();
});


function toastErrorPhone() {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
  };
  toastr.error(
    "กรุณาลองใหม่อีกครั้งในภายหลัง",
    "เกิดข้อผิดพลาด"
  );
}
var errorMessage = document.getElementById("error-regis");

var nameOwner = document.getElementById("name-owner-input");
var emailOwner = document.getElementById("email-owner-input");
var passOwner = document.getElementById("pass-owner-input");
var conPassOwner = document.getElementById("con-pass-owner-input");

var codeManage = document.getElementById("code-manager-input");
var nameManage = document.getElementById("name-manager-input");
var phoneManage = document.getElementById("phone-manager-input");
var addressManage = document.getElementById("addres-manager-input");
selectRoleUI();
sessionStorage.authenEvent="register"


$("#register-bt").click(function() {
  checkValidation(sessionStorage.role);
});

function selectRoleUI() {
  var role = sessionStorage.role;
  if (role == "manager") {
    $("#manager-register-ui").css("display", "block");
  } else {
    $("#owner-register-ui").css("display", "block");
  }
}

function checkValidation(role) {
  if (role == "owner") {
    if (
      nameOwner.checkValidity() &&
      emailOwner.checkValidity() &&
      passOwner.checkValidity() &&
      conPassOwner.checkValidity()
    ) {
      errorMessage.style.display = "none";
      createAccountOwner(emailOwner.value , passOwner.value,nameOwner.value)

    } else {
        errorMessage.style.display = "block";
    }
  }else{
    if (
        codeManage.checkValidity() &&
        nameManage.checkValidity() &&
        phoneManage.checkValidity() &&
        addressManage.checkValidity()
      ) {
        errorMessage.style.display = "none";
      } else {
          errorMessage.style.display = "block";
      }
  }
}

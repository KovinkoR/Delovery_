const userLoginButton = document.getElementById("userLoginButton");
const courierLoginButton = document.getElementById("courierLoginButton");
const showLoginButton = document.getElementById("showLoginButton");

userLoginButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.target.style.display = "none";
  document.getElementById("userLoginForm").style.display = "block";
});

courierLoginButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.target.style.display = "none";
  document.getElementById("courierLoginForm").style.display = "block";
});

showLoginButton.addEventListener("click", (e) => {
  e.preventDefault();
  courierLoginButton.style.display = "block";
  document.getElementById('courierSigninButton').style.display = "block"
});

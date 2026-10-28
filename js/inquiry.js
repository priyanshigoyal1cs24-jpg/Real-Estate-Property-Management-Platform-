// Inquiry form: check name and phone before sending
var button = document.querySelector(".btn-primary");

button.onclick = function () {
  var name = document.getElementById("name").value;
  var phone = document.getElementById("phone").value;

  if (name === "" || phone === "") {
    alert("Please enter your name and phone number.");
  } else if (phone.length !== 10) {
    alert("Phone number must be 10 digits.");
  } else {
    alert("Thank you " + name + "! Your inquiry has been sent.");
  }
};

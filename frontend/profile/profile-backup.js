const profileForm = document.getElementById("profileForm");
const profileFormCard = document.getElementById("profileFormCard");
const summaryCard = document.getElementById("summaryCard");

const getLocationButton = document.getElementById("getLocation");
const locationInput = document.getElementById("location");
const locationMessage = document.getElementById("locationMessage");




getLocationButton.addEventListener("click", function () {

    if (!navigator.geolocation) {

        locationMessage.textContent =
            "Geolocation is not supported by your browser.";

        return;
    }

    locationMessage.textContent =
        "Getting your current location...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            locationInput.value =
                `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;

            locationMessage.textContent =
                "Current location detected successfully.";

        },

        function () {

            locationMessage.textContent =
                "Location access denied. Please allow location permission.";

        }

    );

});



profileForm.addEventListener("submit", function (event) {

    event.preventDefault();

    document.getElementById("summaryName").textContent =
        document.getElementById("name").value;

    document.getElementById("summaryEmail").textContent =
        document.getElementById("email").value;

    document.getElementById("summaryPhone").textContent =
        document.getElementById("phone").value;

    document.getElementById("summaryLocation").textContent =
        document.getElementById("location").value;

    document.getElementById("summaryAbout").textContent =
        document.getElementById("about").value;

    document.getElementById("summaryPropertyType").textContent =
        document.getElementById("property-type").value;

    document.getElementById("summaryPreferredLocation").textContent =
        document.getElementById("preferred-location").value;

    document.getElementById("summaryBudget").textContent =
        document.getElementById("budget").value;

    profileFormCard.style.display = "none";

    summaryCard.style.display = "block";

});


// Edit Profile

document.getElementById("editProfile").addEventListener("click", function () {

    profileFormCard.style.display = "grid";

    summaryCard.style.display = "none";

});


// Clear Message

profileForm.addEventListener("reset", function () {

    locationMessage.textContent = "";

    document.getElementById("profileMessage").textContent = "";

});
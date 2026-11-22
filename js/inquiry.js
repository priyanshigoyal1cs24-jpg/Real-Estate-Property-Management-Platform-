// Handle customer inquiry form
var button = document.querySelector(".btn-primary");

button.onclick = function (event) {
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var message = document.querySelector("textarea").value.trim();

    if (name === "" || phone === "") {
        alert("Please enter your name and phone number.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Phone number must be exactly 10 digits.");
        return;
    }

    // Get property details from URL
    var params = new URLSearchParams(window.location.search);
    var propertyId = params.get("id");

    var property = JSON.parse(localStorage.getItem("properties") || "[]");
    var selectedProperty = property.find(function (item) {
        return String(item.id) === String(propertyId);
    });

    // Create inquiry
    var inquiry = {
        id: Date.now(),
        name: name,
        phone: phone,
        message: message,
        propertyId: propertyId,
        propertyTitle: selectedProperty ? selectedProperty.title : "Property",
        date: new Date().toLocaleString()
    };

    // Save inquiry
    var inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
    inquiries.push(inquiry);
    localStorage.setItem("inquiries", JSON.stringify(inquiries));

    alert("Thank you " + name + "! Your inquiry has been saved.");

    window.location.href = "inquiries.html";
};

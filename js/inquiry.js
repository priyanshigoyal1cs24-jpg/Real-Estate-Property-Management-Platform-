// Customer Inquiry Management

// Get saved inquiries from localStorage
function getInquiries() {
    return JSON.parse(localStorage.getItem("inquiries") || "[]");
}

// Display inquiries on inquiries.html
var inquiryList = document.getElementById("inquiry-list");

if (inquiryList) {
    var inquiries = getInquiries();

    if (inquiries.length === 0) {
        inquiryList.innerHTML = "<p>No customer inquiries received yet.</p>";
    } else {
        inquiryList.innerHTML = inquiries.map(function (inquiry) {
            return `
                <div class="property-card">
                    <h3>${inquiry.propertyTitle}</h3>
                    <p><strong>Customer:</strong> ${inquiry.name}</p>
                    <p><strong>Phone:</strong> ${inquiry.phone}</p>
                    <p><strong>Message:</strong> ${inquiry.message}</p>
                    <p><strong>Date:</strong> ${inquiry.date}</p>
                </div>
            `;
        }).join("");
    }
}

// Handle inquiry form on property.html
var button = document.querySelector(".btn-primary");

if (button) {
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

        var params = new URLSearchParams(window.location.search);
        var propertyId = params.get("id");

        var properties = JSON.parse(localStorage.getItem("properties") || "[]");

        var selectedProperty = properties.find(function (item) {
            return String(item.id) === String(propertyId);
        });

        var inquiry = {
            id: Date.now(),
            name: name,
            phone: phone,
            message: message,
            propertyId: propertyId,
            propertyTitle: selectedProperty ? selectedProperty.title : "Property",
            date: new Date().toLocaleString()
        };

        var inquiries = getInquiries();
        inquiries.push(inquiry);

        localStorage.setItem("inquiries", JSON.stringify(inquiries));

        alert("Thank you " + name + "! Your inquiry has been saved.");

        window.location.href = "inquiries.html";
    };
}

// All property data lives here.
// listings.js and property.js both read from this array.

var properties = [
  {
    id: 1,
    title: "Krishna Vihar Villa",
    type: "Villa",
    location: "Vrindavan Road, Mathura",
    price: 18500000,
    priceText: "₹ 1.85 Cr",
    bedrooms: 4,
    bathrooms: 3,
    area: 2600,
    parking: 2,
    agent: "Rohan Verma",
    description: "A spacious independent villa set in a quiet, green neighbourhood along Vrindavan Road, offering a private garden, an open living and dining layout, and a dedicated parking area. Ready for immediate move-in, with easy access to Mathura Junction, local markets, and NH-19.",
    amenities: ["Private garden & lawn", "Covered two-car parking", "24x7 water supply", "Power backup", "Gated community security", "Close to schools & markets"],
    images: ["1613977257363-707ba9348227", "1600585154340-be6161a56a0c", "1600596542815-ffad4c1539a9", "1512917774080-9991f1c4c750"]
  },
  {
    id: 2,
    title: "Radha Residency, 3BHK",
    type: "Apartment",
    location: "Chaitanya Vihar, Mathura",
    price: 7800000,
    priceText: "₹ 78 L",
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    parking: 1,
    agent: "Neha Sharma",
    description: "A bright 3BHK apartment in a well-kept residential society with a lift, covered parking and a peaceful central courtyard. Schools, hospitals and markets are all within a short drive.",
    amenities: ["Lift access", "Covered parking", "24x7 security", "Power backup", "Children's play area", "Near schools & hospitals"],
    images: ["1512917774080-9991f1c4c750", "1600585154340-be6161a56a0c", "1613977257363-707ba9348227", "1568605114967-8130f3a36994"]
  },
  {
    id: 3,
    title: "Yamuna Kunj Residence",
    type: "Independent House",
    location: "Deeg Gate, Mathura",
    price: 11000000,
    priceText: "₹ 1.1 Cr",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    parking: 1,
    agent: "Amit Gupta",
    description: "A well-built independent house with a front lawn and a spacious terrace, located close to the heart of the city with easy access to the main market and public transport.",
    amenities: ["Front lawn", "Open terrace", "Water storage tank", "Power backup", "Near main market", "Quiet lane"],
    images: ["1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9", "1613977257363-707ba9348227", "1512917774080-9991f1c4c750"]
  },
  {
    id: 4,
    title: "Govind Nagar Residency, 2BHK",
    type: "Apartment",
    location: "Govind Nagar, Mathura",
    price: 5200000,
    priceText: "₹ 52 L",
    bedrooms: 2,
    bathrooms: 2,
    area: 1050,
    parking: 1,
    agent: "Pooja Singh",
    description: "An affordable 2BHK apartment with a modern kitchen and good natural light, ideal for small families and first-time buyers. Located in a developed neighbourhood with daily-needs shops nearby.",
    amenities: ["Modular kitchen", "Covered parking", "24x7 water supply", "CCTV security", "Near daily markets", "Lift access"],
    images: ["1600585154340-be6161a56a0c", "1512917774080-9991f1c4c750", "1570129477492-45c003edd2be", "1568605114967-8130f3a36994"]
  },
  {
    id: 5,
    title: "GLA Enclave Plot #14",
    type: "Plot",
    location: "NH-19, Near GLA University, Mathura",
    price: 3400000,
    priceText: "₹ 34 L",
    bedrooms: 0,
    bathrooms: 0,
    area: 1200,
    parking: 0,
    agent: "Sanjay Verma",
    description: "A clear-title residential plot on NH-19, close to GLA University. The plot is on a 30 ft wide road and is suitable for building a home or for long-term investment.",
    amenities: ["Clear title", "30 ft wide road", "Near NH-19", "Electricity connection nearby", "Close to GLA University", "Good investment location"],
    images: ["1600596542815-ffad4c1539a9", "1613977257363-707ba9348227", "1570129477492-45c003edd2be", "1512917774080-9991f1c4c750"]
  },
  {
    id: 6,
    title: "Vrindavan Heights Villa",
    type: "Villa",
    location: "Parikrama Marg, Vrindavan, Mathura",
    price: 24000000,
    priceText: "₹ 2.4 Cr",
    bedrooms: 5,
    bathrooms: 4,
    area: 3400,
    parking: 3,
    agent: "Karan Mehta",
    description: "A luxury villa near Parikrama Marg with large living spaces, a landscaped garden and a private terrace. A premium choice for families who want space, privacy and a peaceful setting.",
    amenities: ["Landscaped garden", "Private terrace", "Three-car parking", "Power backup", "Gated security", "Near Parikrama Marg"],
    images: ["1568605114967-8130f3a36994", "1613977257363-707ba9348227", "1600596542815-ffad4c1539a9", "1570129477492-45c003edd2be"]
  }
];

// Builds the full image link from a photo id and a width
function getImage(id, width) {
  return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + width + "&q=80";
}

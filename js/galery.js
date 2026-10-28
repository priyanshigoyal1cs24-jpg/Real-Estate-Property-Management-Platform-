// Gallery: clicking a thumbnail changes the main image
var mainImage = document.querySelector(".gallery-main img");
var thumbs = document.querySelectorAll(".gallery-thumbs img");

for (var i = 0; i < thumbs.length; i++) {
  thumbs[i].onclick = function () {
    mainImage.src = this.src.replace("w=200", "w=1000");
    mainImage.alt = this.alt;
  };
}

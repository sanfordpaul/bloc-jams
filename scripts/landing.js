var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {

                 function revealPoint(pointIndex) {
                     points[pointIndex].style.opacity = 1;
                     points[pointIndex].style.color = "yellow";
                     points[pointIndex].style.transform = "scaleX(1) translateY(pointIndex)";
                     points[pointIndex].style.msTransform = "scaleX(1) translateY(pointIndex)";
                     points[pointIndex].style.WebkitTransform = "scaleX(1) translateY(0)";

                     points[pointIndex].firstElementChild.style.color = "red";
                     points[pointIndex].firstElementChild.style.transform = "rotate(360deg)";
                     points[pointIndex].firstElementChild.style.msTransform = "rotate(360deg)";
                     points[pointIndex].firstElementChild.style.WebkitTransform = "rotate(360deg)";
                 }

                 var title = document.getElementsByClassName('hero-title');

                 var changeTitleColor = function() {
                     title[0].style.color = "yellow";
                     title[0].style.textShadow ="2px 2px 0 black"
                 };

                 for(var i = 0; i <= 2; i++){
                     revealPoint(i);
                 }
                 changeTitleColor();
             };
 window.onload = function() {
     if (window.innerHeight > 950) {
         animatePoints(pointsArray);
     }
     
     var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

     window.addEventListener('scroll', function(event){
         console.log("Current offset from the top is " + sellingPoints.getBoundingClientRect().top + " pixels");
         if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);
         }
     });
 }

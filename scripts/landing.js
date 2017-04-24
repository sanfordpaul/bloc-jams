var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(pointsArray) {

                 function revealPoint(point) {
                     point.style.opacity = 1;
                     point.style.color = "yellow";
                     point.style.transform = "scalex(1) translateY(pointIndex)";
                     point.style.msTransform = "scaleX(1) translateY(pointIndex)";
                     point.style.WebkitTransform = "scaleX(1) translateY(0)";

                     point.firstElementChild.style.color = "red";
                     point.firstElementChild.style.transform = "rotate(360deg)";
                     point.firstElementChild.style.msTransform = "rotate(360deg)";
                     point.firstElementChild.style.WebkitTransform = "rotate(360deg)";
                 }

                 var title = document.getElementsByClassName('hero-title');

                 var changeTitleColor = function() {
                     title[0].style.color = "yellow";
                     title[0].style.textShadow ="2px 2px 0 black";
                     title[0].style.fontSize = "4rem";

                 };

                 forEach(pointsArray, revealPoint);

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

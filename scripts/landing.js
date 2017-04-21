var animatePoints = function() {

                 var points = document.getElementsByClassName('point');


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

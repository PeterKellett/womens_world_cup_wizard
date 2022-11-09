// Set the date we're counting down to
var countDownDate = new Date("Nov 20, 2022 19:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  // document.getElementsById("countdown").innerHTML = days + "d " + hours + "h "
  // + minutes + "m " + seconds + "s ";

  // Display the result in NavBar and on Page using Classes
  // Taken from https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_document_getelementsbyclassname
  const collection = document.getElementsByClassName("countdown");
  collection[0].innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  collection[1].innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);
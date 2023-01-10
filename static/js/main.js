$(document).ready(function(){
    // Function to activate and show the toast notification
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
      return new bootstrap.Toast(toastEl,  {delay: 1500})
    })
    toastList.forEach(toast => toast.show())
    // End function
  });
  
  // Set the date we're counting down to
  var countDownDate = new Date("Nov 20, 2022 16:00:00").getTime();
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

    // Display the result in NavBar and on Page using Classes
    const collection = document.getElementsByClassName("countdown");
    $.each(collection, function() {
      this.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    })

    // If the count down is finished, write some text
    if (distance <  0) {
      clearInterval(x);
      $(".countdown").text("0:00:00");
      // $('.submit-button').hide();
    }
  }, 1000);

function reload() {
  location.reload();
}

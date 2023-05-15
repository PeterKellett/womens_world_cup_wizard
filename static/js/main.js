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
  var startDate = new Date("Jul 20, 2023 07:00:00").getTime();
  // Update the count down every 1 second
  var x = setInterval(function() {
    // Get today's date and time
    var now = new Date().getTime();
    // Find the countdownTime between now and the count down date
    var countdownTime = startDate - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(countdownTime / (1000 * 60 * 60 * 24));
    var hours = (Math.floor((countdownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))<10?'0':'') + Math.floor((countdownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = (Math.floor((countdownTime % (1000 * 60 * 60)) / (1000 * 60))<10?'0':'') + Math.floor((countdownTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (Math.floor((countdownTime % (1000 * 60)) / 1000)<10?'0':'') + Math.floor((countdownTime % (1000 * 60)) / 1000);
    // seconds<10?'0':'' + seconds
    // startDate(date.getMinutes()<10?'0':'') + date.getMinutes()
    // Display the result in NavBar and on Page using Classes
    const collection = document.getElementsByClassName("countdown");
    $.each(collection, function() {
      this.innerHTML = `Kick Off: ${days}<span class="inner-time">d</span> ${hours}<span class="inner-time">h </span>${minutes}<span class="inner-time">m </span>${seconds}<span class="inner-time">s</span>`
    })

    // If the count down is finished, write some text
    if (countdownTime <  0) {
      clearInterval(x);
      $(".start").text("0:00:00");
      // $('.submit-button').hide();
    }
  }, 1000);


// function reload() {
//   location.reload();
// }

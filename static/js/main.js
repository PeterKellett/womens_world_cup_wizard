"use strict"
$(document).ready(function (){
    var nav_button = document.getElementsByClassName('navbar-toggler')[0].getBoundingClientRect();
    var toast_position = nav_button['right'] - 350
    $('.message-container').css("left", toast_position + "px")
    console.log("toast_position = ", toast_position)
    // Function to activate and show the toast notification
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
      return new bootstrap.Toast(toastEl,  {delay: 3000})
    })
    toastList.forEach(toast => {
      console.log($(toast)[0]._element)
      toast.show()
    })
  });

  const d = new Date();
  let diff = d.getTimezoneOffset();
  let localTime = d.toTimeString();
  // console.log("diff = ", diff);
  // console.log("localTime = ", localTime);
  var match_times = $('.match-time');
  // console.log(match_times)
  $(match_times).each((index, element) => {
    // console.log("elem = ", element.textContent);
    var match_time = new Date(element.textContent + 'Z');
    // console.log("match_time = ", match_time);
    element.textContent = `${match_time.getHours()<10?'0':''}${match_time.getHours()}:${match_time.getMinutes()<10?'0':''}${match_time.getMinutes()}`;
  })

  "2015-03-25T12:00:00Z"
  // Set the date we're counting down to
  var startDate = new Date("2023-07-20T07:00:00Z").getTime();
  // Update the count down every 1 second
  var x = setInterval(function () {
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
    $.each(collection, function () {
      // If the count down is finished, write some text
    if (countdownTime <  0) {
      clearInterval(x);
      this.innerHTML = "0:00:00";
      // $('.submit-button').hide();
    }
    else {
      this.innerHTML = `${days}<span class="inner-time"> days</span> ${hours}<span class="inner-time"> hrs</span> ${minutes}<span class="inner-time"> mins</span> ${seconds}<span class="inner-time"> sec</span>`
    }
      
    })

    
  }, 1000);

  $('.modal-tab').click(function () {
    console.log($(this).parents('.modal-content').find('.points'))
    if(!$(this).hasClass('active')) {
        $(this).addClass('active').siblings('.modal-tab').removeClass('active');
        if($(this).data('index') == 1) {
          $(this).parents('.modal-content').find('.points').hide();
          $(this).parents('.modal-content').find('.gameplay').show();
        }
        else {
          $(this).parents('.modal-content').find('.gameplay').hide();
          $(this).parents('.modal-content').find('.points').show();
        }
    }
})

$('.back-button').click(function () {
  $(this).addClass('active')
})



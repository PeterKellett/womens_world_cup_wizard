$(document).ready(function(){
  console.log("game_mode.js file");
  document.querySelectorAll('input').forEach(function(item) {
    // console.log("item = " + item.value)
    if (item.value == "") {
      item.required = true;
    }
  })

  // Function to get the match number from the toast in order to open the correct accordion body and focus on the next input element
  var myToastEl = document.getElementById('myToastEl')
  console.log("myToastEl = " + myToastEl)
  if (myToastEl != null) {
    console.log("YES = null")
    var match_number = myToastEl["textContent"];
    var match = Number(match_number.slice(28, 30))
    var matches = document.querySelectorAll('form');
    var node = $(matches[match]).parent().parent()
    $(node).addClass("show")
    matches[match][4].focus();
  }
  else {
    /* I need to put functionality in here to open an accordian when a user lands
      on the page as above opens when returning from a save.
      I'll base it on dateToday to open the accordion on todays date */
  }
  
  // End function


  // FN to make the hading clicked in the accordion scroll to the top of the page
  // Taken from http://jsfiddle.net/akhurshid/zhPtw/
  // $(".accordion-header").click(function(){
  //   var focusElement = $(this);
  //   console.log(this);
  //   $(focusElement).focus();
  //   ScrollToTop(focusElement);
  // });

  // function ScrollToTop(el) {
  //   console.log("el = ", el)
  //   console.log("el[0] = ", el[0])
  //   console.log("el = ", $(el))
  //   $('html, body').animate({ scrollTop: $(el).offset().top - 50 }, 'slow');
  // }

});
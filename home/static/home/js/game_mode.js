$(document).ready(function(){
  console.log("game_mode.js file");
  document.querySelectorAll('input').forEach(function(item) {
    // console.log("item = " + item.value)
    if (item.value == "") {
      item.required = true;
    }
  })

  // Function to get the match number from the toast in order to open the correct accordion body and focus on the next input element
  match_number = $('#myToastEl').attr('data-match');
  console.log("match_number = ", match_number)
  if (match_number != null) {
    console.log("YES != null")
    var matches = $('form');
    console.log("matches = ", matches);
    var node = $(matches[match_number]).parent().parent();
    console.log("node = ", node);
    $(node).addClass("show");
    console.log("button? = ", $(node).siblings().children().removeClass('collapsed'));
    $(node).siblings().prev().children('button').removeClass('collapsed')
    matches[match_number][4].focus();
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
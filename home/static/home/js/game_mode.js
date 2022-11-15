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
  if (match_number != null) {
    var matches = $('form');
    var node = $(matches[match_number]).parent().parent();
    $(node).addClass("show");
    $(node).siblings().prev().children('button').removeClass('collapsed')
    matches[match_number][4].focus();
  }
  else {
    /* I need to put functionality in here to open an accordian when a user lands
      on the page as above opens when returning from a save.
      I'll base it on dateToday to open the accordion on todays date */
  }

  
  awardPoints();
  function awardPoints() {
    matches = $('.listings');
    // console.log("matches = ", matches);
    $.each(matches, function() {
      // console.log("this = ", this);
      var personal_result;
      var actual_result;
      var result;
      var personal_home_score = Number($(this).find('#home_team_score').val());
      var personal_away_score = Number($(this).find('#away_team_score').val());
      var actual_home_score = Number($(this).find('.actual-home-score').text());
      var actual_away_score = Number($(this).find('.actual-away-score').text());
      // console.log("personal_home_score = ", personal_home_score);
      // console.log("personal_away_score = ", personal_away_score);
      // console.log("actual_home_score = ", actual_home_score);
      // console.log("actual_away_score = ", actual_away_score);

      if(personal_home_score == actual_home_score) {
        personal_result = 'draw';
      }
      if(personal_home_score > actual_home_score) {
        personal_result = 'home';
      }
      else {
        personal_result = 'away';
      }

      if(personal_away_score == actual_away_score) {
        actual_result = 'draw';
      }
      if(personal_away_score > actual_away_score) {
        actual_result = 'home';
      }
      else {
        actual_result = 'away';
      }

      if(personal_result == actual_result) {
        result = true;
      }

      if(personal_home_score == actual_home_score) {
        console.log("HOME TRUE");
        $(this).find('#home_team_score').addClass('home-true');
      }
      if(personal_away_score == actual_away_score) {
        console.log("AWAY TRUE");
        $(this).find('#away_team_score').parent().addClass('away-true');
      }


    })
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
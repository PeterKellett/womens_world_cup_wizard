$(document).ready(function(){
  console.log("game_mode.js file");
  var forms = $('form');
  // console.log("form = ", forms)
  var match_1 = new Date("Nov 20, 2022Z16:00:00").getTime();
  var match_2 = new Date("Nov 21, 2022Z13:00:00").getTime();
  var match_3 = new Date("Nov 21, 2022Z16:00:00").getTime();
  var match_4 = new Date("Nov 21, 2022Z19:00:00").getTime();
  // console.log("match_1 = ", match_1)
  var timer = setInterval(function() {
    var now = Date.now();
    // console.log("now = ", now)
    if(now > match_1) {
      $('[data-match=1]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=1]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=1]').find('button').hide();
    }
    if(now > match_2) {
      $('[data-match=2]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=2]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=2]').find('button').hide();
    }
    if(now > match_3) {
      $('[data-match=3]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=3]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=3]').find('button').hide();
    }
    if(now > match_4) {
      $('[data-match=4]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=4]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=4]').find('button').hide();
    }
  }, 1000);
  
  document.querySelectorAll('input').forEach(function(item) {
    // console.log("item = " + item.value)
    if (item.value == "") {
      item.required = true;
    }
  })

  // Function to get the match number from the toast in order to open the correct accordion body and focus on the next input element
  match_number = $('#myToastEl').attr('data-match');
  var matches = $('form');
  if (match_number != null) {
    var node = $(matches[match_number]).parent().parent();
    // console.log("node = ", node)
    $(node).addClass("show");
    $(node).siblings().children().removeClass('collapsed')
    // console.log("node siblings = ", $(node).siblings())
    matches[match_number][4].focus();
  }
  else {
    /* I need to put functionality in here to open an accordian when a user lands
      on the page as above opens when returning from a save.
      I'll base it on dateToday to open the accordion on todays date */
    var today = new Date;
    // console.log("today = ", today);
    var node = $(matches[0]).parent().parent();
    // console.log("node = ", node)
    $(node).addClass("show");
    var button = $(node).siblings().children().removeClass('collapsed')
    // console.log("button = ", button)
      matches[0][4].focus();
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
      var personal_home_score = $(this).find('#home_team_score').val();
      var personal_away_score = $(this).find('#away_team_score').val();
      var actual_home_score = $(this).find('.actual-home-score').text();
      var actual_away_score = $(this).find('.actual-away-score').text();
      // console.log("personal_home_score = ", personal_home_score);
      // console.log("personal_away_score = ", personal_away_score);
      // console.log("actual_home_score = ", actual_home_score);
      // console.log("actual_away_score = ", actual_away_score);
      // console.log("actual = ", actual_home_score);
      if(personal_home_score != '') {
        if(personal_home_score == actual_home_score) {
          $(this).find('.home-score').addClass('correct').css('visibility', 'visible');
        }
        if(personal_away_score == actual_away_score) {
          $(this).find('.away-score').addClass('correct').css('visibility', 'visible');
        }
        if((personal_home_score < personal_away_score) && (actual_home_score < actual_away_score)) {
          $(this).find('.result').addClass('correct').css('visibility', 'visible');
        }
        if((personal_home_score > personal_away_score) && (actual_home_score > actual_away_score)) {
          $(this).find('.result').addClass('correct').css('visibility', 'visible');
        }
        if((personal_home_score == personal_away_score) && (actual_home_score == actual_away_score)) {
          $(this).find('.result').addClass('correct').css('visibility', 'visible');
        }
      }
    })
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

  }
})
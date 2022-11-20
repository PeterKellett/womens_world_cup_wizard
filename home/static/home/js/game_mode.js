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

    // $.each(forms, function() {
    //   var match_date_string = $(this).find('.date').text();
    //   var match_year = match_date_string.slice(9, 13);
    //   var match_month = match_date_string.slice(0, 3);
    //   var match_date = match_date_string.slice(5, 7);
    //   var match_am_pm = match_date_string.slice(-4);
    //   var match_hours = match_date_string.slice(14, 16);
    //   var match_mins = match_date_string.slice(17, 19)
    //   match_hours = Number(match_hours);
    //   if(match_am_pm == 'p.m.') {
    //     match_hours = match_hours + 12;
    //   }
    //   else {
    //     match_hours = Number(match_hours);
    //   }
    //   var test_time = new Date("Nov 19, 2022Z23:47:00").getTime()
    //   var match_time = new Date(match_month + ' ' + match_date + ',' + ' ' + match_year + 'T' + match_hours + ':' + match_mins + ':00Z').getTime();
    //   var now = Date.now();
    //   if(now > test_time) {
    //     console.log("IF YESSS");
    //     console.log("diff = ", test_time - now);
    //     $(this).find("#home_team_score").attr("disabled", true);
    //     $(this).find("#away_team_score").attr("disabled", true);
    //     $(this).find('button').hide();
    //   }
    //   else {
    //     console.log("NOOOO");
    //     console.log("diff = ", test_time - now);
    //   }
    // })
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
//       // console.log("personal_home_score = ", personal_home_score);
//       // console.log("personal_away_score = ", personal_away_score);
//       // console.log("actual_home_score = ", actual_home_score);
//       // console.log("actual_away_score = ", actual_away_score);
      // console.log("actual = ", actual_home_score);
      if(personal_home_score != '') {
        if(personal_home_score == personal_away_score) {
          $(this).find('.draw').addClass('personal-result').css('visibility', 'visible');
        }
        if(personal_home_score > personal_away_score) {
          $(this).find('.home').addClass('personal-result').css('visibility', 'visible');
        }
        if(personal_home_score < personal_away_score) {
          $(this).find('.away').addClass('personal-result').css('visibility', 'visible');
        }
      }



      if(actual_home_score != '') {
        if(actual_home_score == actual_away_score) {
          // $(this).find('.draw').addClass('actual-result').css('visibility', 'visible');
        }
        if(actual_home_score > actual_away_score) {
          // $(this).find('.home').addClass('actual-result').css('visibility', 'visible');
        }
        if(actual_home_score < actual_away_score) {
          // $(this).find('.away').addClass('actual-result').css('visibility', 'visible');
        }

        if(personal_home_score == actual_home_score) {
          // $(this).find('#home_team_score').parent().prev().addClass('correct-score-home');
        }
        if(personal_away_score == actual_away_score) {
          // $(this).find('#away_team_score').parent().next().addClass('correct-score-away');
        }
      }


      

//       if(personal_away_score == actual_away_score) {
//         actual_result = 'draw';
//       }
//       if(personal_away_score > actual_away_score) {
//         actual_result = 'home';
//       }
//       else {
//         actual_result = 'away';
//       }

//       if(personal_result == actual_result) {
//         result = true;
//       }

//       if(personal_home_score == actual_home_score) {
//         console.log("HOME TRUE");
//         $(this).find('#home_team_score').addClass('home-true');
//       }
//       if(personal_away_score == actual_away_score) {
//         console.log("AWAY TRUE");
//         $(this).find('#away_team_score').parent().addClass('away-true');
//       }


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
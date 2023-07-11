$(document).ready(function(){
  // Convert match times from UTC to local times
  $('.match-form').each((index, match_element) => {
    var match_date = $(match_element).find('span.date')[0]
    // console.log("match_element = ", match_element);
    var match_time = new Date(match_date.textContent + 'Z');
    // console.log("match_time = ", match_time);
    $(match_element).attr('data-date', match_time)
    match_date.textContent = `${match_time.getHours()<10?'0':''}${match_time.getHours()}:${match_time.getMinutes()<10?'0':''}${match_time.getMinutes()}`;
  });

  // Set a 1sec timer to disable match match fields when match time has passed
  var timer = setInterval(function() {
    var now = Date.now();
    $('.match-form').each((index, match_element) => {
      var match_time = new Date($(match_element).attr('data-date'));
      // console.log("match_time = ", match_time);
      if(now > match_time) {
        $(match_element).find("input[name*='home_team_score']").attr("disabled", true).css('background-color', '#fff');
        $(match_element).find("input[name*='away_team_score']").attr("disabled", true).css('background-color', '#fff');
      }
    })
  }, 1000);
  
  

  $('input').change(function() {
    console.log($(this).val());
    if($(this).val() != '') {
      console.log($(this).parents('.score').siblings('.score').find('input'))
      $(this).parents('.score').siblings('.score').find('input').attr("required", true)
    }
    else {
      $(this).parents('.score').siblings('.score').find('input').attr("required", false)
    }
  })

  // $('.formset').submit(function (evt) {
  //   console.log("submit")
  //   evt.preventDefault();
  //   console.log($(this));
  //   console.log(this);
  //   $(this).find('.match-form').each((index, form) => {
  //     // console.log("form = ", form);
  //     var home_score_field = $(form).find("input[name*='home_team_score']");
  //     var away_score_field = $(form).find("input[name*='away_team_score']");
  //     console.log("home_score_field = ", home_score_field);
  //     console.log("away_score_field = ", away_score_field);

  //     if(home_score_field.val() == '' && away_score_field.val() != '' ) {
  //       console.log("required")
  //       home_score_field.attr("required", true);
  //       form.validate()
  //     }
  //     else {
  //       home_score_field.attr("required", false);
  //     }

  //     if(home_score_field.val() != '' && away_score_field.val() == '' ) {
  //       console.log("required")
  //       away_score_field.attr("required", true);
  //     }
  //     else {
  //       away_score_field.attr("required", false);
  //     }
      
  //   });  
  // });
    

  // document.querySelectorAll('input').forEach(function(item) {
  //   item.required = true;
  // })

  // Function to get the match number from the toast in order to open the correct accordion body and focus on the next input element
  /* I need to put functionality in here to open an accordian when a user lands
    on the page as above opens when returning from a save.
    I'll base it on dateToday to open the accordion on todays date */
  var today = Date.now();
  var headers = $('.accordion-header');
  var accordion_header = document.getElementsByClassName('accordion-header')[0].getBoundingClientRect()['height'] + 1;
  var navbar = document.getElementsByClassName('navbar')[0].getBoundingClientRect()['height'];
  var scroll = document.getElementsByClassName('horizontal-scrolling-banner')[0].getBoundingClientRect()['height'];
  var index = 0;
  for(i=0; i<headers.length; i++) {
    var header_date = new Date($(headers[i]).attr('data-date')).getTime();
    if(header_date > today) {
      var header = headers[i];
      index = i;
      break;
    }
  }
  $(header).siblings().addClass('show');
  $(header).children().removeClass('collapsed');
  $(header).siblings().find("input[name*='home_team_score']").first().focus();
  window.scrollTo(0, (accordion_header*(index)));


  $(".accordion-header").click(function(){
    var headers = $('.accordion-header');
    var accordion_header = document.getElementsByClassName('accordion-header')[0].getBoundingClientRect()['height'] + 1;
    var navbar = document.getElementsByClassName('navbar')[0].getBoundingClientRect()['height'];
    var scroll = document.getElementsByClassName('horizontal-scrolling-banner')[0].getBoundingClientRect()['height'];
    console.log("accordion_header ", accordion_header);
    console.log("navbar ", navbar);
    console.log("scroll ", scroll);
    for(i=0; i<headers.length; i++) {
      if(headers[i] == this) {
        $(headers[i]).siblings().find("input[name*='home_team_score']").first().focus();
        // console.log("scroll calc ", (54*(i-1) - navbar - scroll));
        window.scrollTo(0, (accordion_header*(i)));
      }
    }
  })

  awardPoints();
  function awardPoints() {
    matches = $('.listings');
    $.each(matches, function() {
      var personal_result;
      var actual_result;
      var result;
      var personal_home_score = $(this).find("input[name*='home_team_score']").val();
      var personal_away_score = $(this).find("input[name*='away_team_score']").val();
      var actual_home_score = $(this).find('.actual-home-score');
      var actual_away_score = $(this).find('.actual-away-score');
      // console.log("personal_home_score = ", personal_home_score);
      // console.log("personal_away_score = ", personal_away_score);
      // console.log("actual_home_score = ", actual_home_score);
      // console.log("actual_away_score = ", actual_away_score);
     
      if(actual_home_score.text() != '') {
        $(this).find('.points').css({visibility: 'visible', display: 'block'}).addClass('points-styles')
        $(this).find('.match-outcome').children().css({visibility: 'visible', display: 'inline'})
        if(personal_home_score == $(actual_home_score).text()) {
          $(this).find('.home-score').addClass('correct');
          $(actual_home_score).addClass('correct');
        }
        if(personal_away_score == $(actual_away_score).text()) {
          $(this).find('.away-score').addClass('correct');
          $(actual_away_score).addClass('correct')
        }
        if((personal_home_score < personal_away_score) && (actual_home_score < actual_away_score)) {
          $(this).find('.result').addClass('correct');
        }
        if((personal_home_score > personal_away_score) && (actual_home_score > actual_away_score)) {
          $(this).find('.result').addClass('correct');
        }
        if (personal_home_score != '') {
          if((personal_home_score == personal_away_score) && (actual_home_score == actual_away_score)) {
            $(this).find('.result').addClass('correct');
          }
        }  
      }
    })
  }
})
$(document).ready(function(){
  console.log("game_mode.js file");
  var forms = $('form');
  // console.log("form = ", forms)
  var match_1 = new Date("Nov 20, 2022Z16:00:00").getTime();
  var match_2 = new Date("Nov 21, 2022Z13:00:00").getTime();
  var match_3 = new Date("Nov 21, 2022Z16:00:00").getTime();
  var match_4 = new Date("Nov 21, 2022Z19:00:00").getTime();
  var match_5 = new Date("Nov 22, 2022Z10:00:00").getTime();
  var match_6 = new Date("Nov 22, 2022Z13:00:00").getTime();
  var match_7 = new Date("Nov 22, 2022Z16:00:00").getTime();
  var match_8 = new Date("Nov 22, 2022Z19:00:00").getTime();
  var match_9 = new Date("Nov 23, 2022Z10:00:00").getTime();
  var match_10 = new Date("Nov 23, 2022Z13:00:00").getTime();
  var match_11 = new Date("Nov 23, 2022Z16:00:00").getTime();
  var match_12 = new Date("Nov 23, 2022Z19:00:00").getTime();
  var match_13 = new Date("Nov 24, 2022Z10:00:00").getTime();
  var match_14 = new Date("Nov 24, 2022Z13:00:00").getTime();
  var match_15 = new Date("Nov 24, 2022Z16:00:00").getTime();
  var match_16 = new Date("Nov 24, 2022Z19:00:00").getTime();
  var match_17 = new Date("Nov 25, 2022Z10:00:00").getTime();
  var match_18 = new Date("Nov 25, 2022Z13:00:00").getTime();
  var match_19 = new Date("Nov 25, 2022Z16:00:00").getTime();
  var match_20 = new Date("Nov 25, 2022Z19:00:00").getTime();
  var match_21 = new Date("Nov 26, 2022Z10:00:00").getTime();
  var match_22 = new Date("Nov 26, 2022Z13:00:00").getTime();
  var match_23 = new Date("Nov 26, 2022Z16:00:00").getTime();
  var match_24 = new Date("Nov 26, 2022Z19:00:00").getTime();
  var match_25 = new Date("Nov 27, 2022Z10:00:00").getTime();
  var match_26 = new Date("Nov 27, 2022Z13:00:00").getTime();
  var match_27 = new Date("Nov 27, 2022Z16:00:00").getTime();
  var match_28 = new Date("Nov 27, 2022Z19:00:00").getTime();
  var match_29 = new Date("Nov 28, 2022Z10:00:00").getTime();
  var match_30 = new Date("Nov 28, 2022Z13:00:00").getTime();
  var match_31 = new Date("Nov 28, 2022Z16:00:00").getTime();
  var match_32 = new Date("Nov 28, 2022Z19:00:00").getTime();
  var match_33 = new Date("Nov 29, 2022Z15:00:00").getTime();
  var match_34 = new Date("Nov 29, 2022Z15:00:00").getTime();
  var match_35 = new Date("Nov 29, 2022Z19:00:00").getTime();
  var match_36 = new Date("Nov 29, 2022Z19:00:00").getTime();
  var match_37 = new Date("Nov 30, 2022Z15:00:00").getTime();
  var match_38 = new Date("Nov 30, 2022Z15:00:00").getTime();
  var match_39 = new Date("Nov 30, 2022Z19:00:00").getTime();
  var match_40 = new Date("Nov 30, 2022Z19:00:00").getTime();
  var match_41 = new Date("Dec 1, 2022Z15:00:00").getTime();
  var match_42 = new Date("Dec 1, 2022Z15:00:00").getTime();
  var match_43 = new Date("Dec 1, 2022Z19:00:00").getTime();
  var match_44 = new Date("Dec 1, 2022Z19:00:00").getTime();
  var match_45 = new Date("Dec 2, 2022Z15:00:00").getTime();
  var match_46 = new Date("Dec 2, 2022Z15:00:00").getTime();
  var match_47 = new Date("Dec 2, 2022Z19:00:00").getTime();
  var match_48 = new Date("Dec 2, 2022Z19:00:00").getTime();
  var match_49 = new Date("Dec 3, 2022Z15:00:00").getTime();
  var match_50 = new Date("Dec 3, 2022Z19:00:00").getTime();
  var match_51 = new Date("Dec 4, 2022Z15:00:00").getTime();
  var match_52 = new Date("Dec 4, 2022Z19:00:00").getTime();
  var match_53 = new Date("Dec 5, 2022Z15:00:00").getTime();
  var match_54 = new Date("Dec 5, 2022Z19:00:00").getTime();
  var match_55 = new Date("Dec 6, 2022Z15:00:00").getTime();
  var match_56 = new Date("Dec 6, 2022Z19:00:00").getTime();
  var match_57 = new Date("Dec 9, 2022Z15:00:00").getTime();
  var match_58 = new Date("Dec 9, 2022Z19:00:00").getTime();
  var match_59 = new Date("Dec 10, 2022Z15:00:00").getTime();
  var match_60 = new Date("Dec 10, 2022Z19:00:00").getTime();
  var match_61 = new Date("Dec 13, 2022Z19:00:00").getTime();
  var match_62 = new Date("Dec 14, 2022Z19:00:00").getTime();
  var match_63 = new Date("Dec 17, 2022Z19:00:00").getTime();
  var match_64 = new Date("Dec 18, 2022Z19:00:00").getTime();
  // console.log("match_41 = ", match_41)
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
    if(now > match_5) {
      $('[data-match=5]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=5]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=5]').find('button').hide();
    }
    if(now > match_6) {
      $('[data-match=6]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=6]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=6]').find('button').hide();
    }
    if(now > match_7) {
      $('[data-match=7]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=7]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=7]').find('button').hide();
    }
    if(now > match_8) {
      $('[data-match=8]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=8]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=8]').find('button').hide();
    }
    if(now > match_9) {
      $('[data-match=9]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=9]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=9]').find('button').hide();
    }
    if(now > match_10) {
      $('[data-match=10]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=10]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=10]').find('button').hide();
    }
    if(now > match_11) {
      $('[data-match=11]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=11]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=11]').find('button').hide();
    }
    if(now > match_12) {
      $('[data-match=12]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=12]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=12]').find('button').hide();
    }
    if(now > match_13) {
      $('[data-match=13]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=13]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=13]').find('button').hide();
    }
    if(now > match_14) {
      $('[data-match=14]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=14]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=14]').find('button').hide();
    }
    if(now > match_15) {
      $('[data-match=15]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=15]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=15]').find('button').hide();
    }
    if(now > match_16) {
      $('[data-match=16]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=16]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=16]').find('button').hide();
    }
    if(now > match_17) {
      $('[data-match=17]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=17]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=17]').find('button').hide();
    }
    if(now > match_18) {
      $('[data-match=18]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=18]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=18]').find('button').hide();
    }
    if(now > match_19) {
      $('[data-match=19]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=19]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=19]').find('button').hide();
    }
    if(now > match_20) {
      $('[data-match=20]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=20]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=20]').find('button').hide();
    }
    if(now > match_21) {
      $('[data-match=21]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=21]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=21]').find('button').hide();
    }
    if(now > match_22) {
      $('[data-match=22]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=22]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=22]').find('button').hide();
    }
    if(now > match_23) {
      $('[data-match=23]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=23]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=23]').find('button').hide();
    }
    if(now > match_24) {
      $('[data-match=24]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=24]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=24]').find('button').hide();
    }
    if(now > match_25) {
      $('[data-match=25]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=25]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=25]').find('button').hide();
    }
    if(now > match_26) {
      $('[data-match=26]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=26]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=26]').find('button').hide();
    }
    if(now > match_27) {
      $('[data-match=27]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=27]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=27]').find('button').hide();
    }
    if(now > match_28) {
      $('[data-match=28]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=28]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=28]').find('button').hide();
    }
    if(now > match_29) {
      $('[data-match=29]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=29]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=29]').find('button').hide();
    }
    if(now > match_30) {
      $('[data-match=30]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=30]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=30]').find('button').hide();
    }
    if(now > match_31) {
      $('[data-match=31]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=31]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=31]').find('button').hide();
    }
    if(now > match_32) {
      $('[data-match=32]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=32]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=32]').find('button').hide();
    }
    if(now > match_33) {
      $('[data-match=33]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=33]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=33]').find('button').hide();
    }
    if(now > match_34) {
      $('[data-match=34]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=34]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=34]').find('button').hide();
    }
    if(now > match_35) {
      $('[data-match=35]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=35]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=35]').find('button').hide();
    }
    if(now > match_36) {
      $('[data-match=36]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=36]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=36]').find('button').hide();
    }
    if(now > match_37) {
      $('[data-match=37]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=37]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=37]').find('button').hide();
    }
    if(now > match_38) {
      $('[data-match=38]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=38]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=38]').find('button').hide();
    }
    if(now > match_39) {
      $('[data-match=39]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=39]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=39]').find('button').hide();
    }
    if(now > match_40) {
      $('[data-match=40]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=40]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=40]').find('button').hide();
    }
    if(now > match_41) {
      $('[data-match=41]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=41]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=41]').find('button').hide();
    }
    if(now > match_42) {
      $('[data-match=42]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=42]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=42]').find('button').hide();
    }
    if(now > match_43) {
      $('[data-match=43]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=43]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=43]').find('button').hide();
    }
    if(now > match_44) {
      $('[data-match=44]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=44]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=44]').find('button').hide();
    }
    if(now > match_45) {
      $('[data-match=45]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=45]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=45]').find('button').hide();
    }
    if(now > match_46) {
      $('[data-match=46]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=46]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=46]').find('button').hide();
    }
    if(now > match_47) {
      $('[data-match=47]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=47]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=47]').find('button').hide();
    }
    if(now > match_48) {
      $('[data-match=48]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=48]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=48]').find('button').hide();
    }
    if(now > match_49) {
      $('[data-match=49]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=49]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=49]').find('button').hide();
    }
    if(now > match_50) {
      $('[data-match=50]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=50]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=50]').find('button').hide();
    }
    if(now > match_51) {
      $('[data-match=51]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=51]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=51]').find('button').hide();
    }
    if(now > match_52) {
      $('[data-match=52]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=52]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=52]').find('button').hide();
    }
    if(now > match_53) {
      $('[data-match=53]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=53]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=53]').find('button').hide();
    }
    if(now > match_54) {
      $('[data-match=54]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=54]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=54]').find('button').hide();
    }
    if(now > match_55) {
      $('[data-match=55]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=55]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=55]').find('button').hide();
    }
    if(now > match_56) {
      $('[data-match=56]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=56]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=56]').find('button').hide();
    }
    if(now > match_57) {
      $('[data-match=57]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=57]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=57]').find('button').hide();
    }
    if(now > match_58) {
      $('[data-match=58]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=58]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=58]').find('button').hide();
    }
    if(now > match_59) {
      $('[data-match=59]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=59]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=59]').find('button').hide();
    }
    if(now > match_60) {
      $('[data-match=60]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=60]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=60]').find('button').hide();
    }
    if(now > match_61) {
      $('[data-match=61]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=61]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=61]').find('button').hide();
    }
    if(now > match_62) {
      $('[data-match=62]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=62]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=62]').find('button').hide();
    }
    if(now > match_63) {
      $('[data-match=63]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=63]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=63]').find('button').hide();
    }
    if(now > match_64) {
      $('[data-match=64]').find('#home_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=64]').find('#away_team_score').attr("disabled", true).css('background-color', '#fff');
      $('[data-match=64]').find('button').hide();
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
    console.log("today = ", today);
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
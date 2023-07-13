var MATCHES = {};
var TEAMS = {};
var SAVED_WIZARD = {};
var TEAM_TBD;
var PAST_DEADLINE = false;

//Page setup
// Set match width first for translate to be effective
var match_width = $('#semi-final').width();
$('#third-place-playoff').width(match_width);
$('#final-match').width(match_width);
$('.submit-button').width(match_width-8);

$('.image-div').each((index, div) => {
    var img_width = $(div).next().outerWidth();
    if(!$(div).hasClass('actual-winning-team')) {
        var img_height = $(div).next().outerHeight();
    }
    
    console.log("$(div).next() = ", $(div).next())
    console.log("img_height = ", img_height)
    $(div).css({'translate': (-img_width - 5) + 'px 0', 'width': img_width, 'height': img_height})
})

var match1 = $('#last-16').children('.match-container:nth-child(1)');
var match2 = $('#last-16').children('.match-container:nth-child(2)');
console.log("match1 = ", match1);
console.log("match2 = ", match2);
var match1_dim = match1[0].getBoundingClientRect();
var match2_dim = match2[0].getBoundingClientRect();
var team = $(match1).children('.knockout-team-container:nth-child(3)');
var team_dim = team[0].getBoundingClientRect();
var midpoint_match1 = (match1_dim['y'] + (match1_dim['height']/2));
var midpoint_match2 = (match2_dim['y'] + (match2_dim['height']/2));
var match_height = (midpoint_match2 - midpoint_match1 + team_dim['height']);
$('#quart-final').children('.match-container').height(match_height)

// Fetch all tema and sort into groups
fetch('https://womensworldcupwizard-33220a25d89f.herokuapp.com/get_wizard_data')
.then(response => response.json())
.then(data => {
    MATCHES = data.matches;
    TEAMS = data.teams;
    SAVED_WIZARD = data.saved_wizard;
    TEAM_TBD = TEAMS.filter(obj => obj.team__name == 'TBD');
    console.log("TEAM_TBD = ", TEAM_TBD[0])
    console.log("MATCHES: ", MATCHES);
    console.log("TEAMS: ", TEAMS);
    
    var wizard_l16 = $('#last-16').find('.knockout-team-container');
    var wizard_l16_teams = []
    wizard_l16.each(function(index, item) { 
        wizard_l16_teams.push($(item).data('team_id'))
    })
    var wizard_quater_final = $('#quart-final').find('.knockout-team-container');
    var wizard_qf_teams = []
    wizard_quater_final.each(function(index, item) { 
        wizard_qf_teams.push($(item).data('team_id'))
    })
    console.log("wizard_qf_teams = ", wizard_qf_teams)

    var wizard_semi_final = $('#semi-final').find('.knockout-team-container');
    var wizard_sf_teams = [];
    wizard_semi_final.each(function(index, item) {  
        wizard_sf_teams.push($(item).data('team_id'))
    })

    var wizard_third_place = $('#third-place-playoff').find('.knockout-team-container');
    var wizard_3rdplace_teams = [];
    wizard_third_place.each(function(index, item) {  
        wizard_3rdplace_teams.push($(item).data('team_id'));
        // console.log("item = ", $(item))
        if($(item).children('p').text() == 'TBD') {
            $(item).children('p').addClass('eliminated');
            $(item).children('img:nth-child(2)').addClass('.eliminated')
        }
    })

    var wizard_final = $('#final').find('.knockout-team-container');
    var wizard_final_teams = [];
    wizard_final.each(function(index, item) {  
        wizard_final_teams.push($(item).data('team_id'))
    })
    var wizard_winner = $('.winner-container').attr('data-team_id');
    if(wizard_winner == '') {
        $('.winner-container').children('img').attr('src', TEAM_TBD[0].team__crest_url);
        $('.winner-container').children('p').text(TEAM_TBD[0].team__name);
    }
    MATCHES.forEach(match => {
        if(match.match_number < 49) {
            // console.log("match.match_number = ", match.match_number)
            // console.log("match.winning_team__name = ", match.winning_team__name)
            if(match.winning_team__name != null) {
                // $(`[data-match=${match.match_number}]`).removeClass('match-selected')
                if(match.winning_team__name == "TBD") {
                    $(`[data-match=${match.match_number}]`).find(`[data-team_id=draw]`).addClass('gold-background').siblings().addClass('loser');
                }
                else {
                    $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team__id}]`).addClass('gold-background').siblings().addClass('loser');
                }   
            }
        } 
        else {
            // var img = $(`[data-match=${match.match_number}]`).find('img')[0];
            // var img_width = $(img).outerWidth();
            // var img_height = $(img).outerHeight();
            // var match_width = $(`[data-match=${match.match_number}]`).outerWidth();
            // var translate_img = ((match_width/img_width)*100);
            // $('.image-div').css({'translate': translate_img + '%' + ' 0'})
            if(match.winning_team__id != null) {
                // $(`[data-match=${match.match_number}]`).removeClass('match-selected')
            }
            // console.log("match.home_team = ", match.home_team)
            if(match.home_team != TEAM_TBD[0].team) {
                if(match.group == 'Round of 16') {
                    if(wizard_l16_teams.includes(match.home_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('lineup-true');
                        $('#last-16').find(`[data-team_id=${match.home_team}]`).addClass('semi-correct');
                        // console.log(match.home_team, $(`[data-team_id=${match.home_team}]`).hasClass('knockout-team-container'))
                        $(`[data-team_id=${match.home_team}]`).each((index, div) => {
                            if($(div).hasClass('knockout-team-container')) {
                                console.log($(div))
                                $(div).addClass('white-border')
                            }
                        })
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('loser');
                    }   
                }
                if(match.group == 'Quarter Final') {
                    if(wizard_qf_teams.includes(match.home_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('lineup-true');
                        $('#quart-final').find(`[data-team_id=${match.home_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('loser');
                    }   
                }
                if(match.group == 'Semi Final') {
                    if(wizard_sf_teams.includes(match.home_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('lineup-true');
                        $('#semi-final').find(`[data-team_id=${match.home_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('loser');
                    }   
                }
                if(match.match_number == 63) {
                    if(wizard_3rdplace_teams.includes(match.home_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('lineup-true');
                        $('#third-place-playoff').find(`[data-team_id=${match.home_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('loser');
                    }   
                }
                if(match.match_number == 64) {
                    if(wizard_final_teams.includes(match.home_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('lineup-true');
                        $('#final').find(`[data-team_id=${match.home_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).addClass('loser');
                    }  
                    if(match.winning_team__id != null) {
                        if(wizard_winner == match.winning_team__id) {
                            $(`[data-match=${match.match_number}]`).find('.winner-container').addClass('correct-team')
                            $(`[data-match=${match.match_number}]`).find('.actual-winning-team').attr({'src': match.winning_team__crest_url, 'data-actual-winning-team': match.winning_team}).addClass('lineup-true gold-border');
                        }
                        else {
                            $(`[data-match=${match.match_number}]`).find('.actual-winning-team').attr({'src': match.winning_team__crest_url, 'data-actual-winning-team': match.winning_team}).addClass('lineup-true');
                        }
                    }
                }
            }
            if(match.away_team != TEAM_TBD[0].team) {
                if(match.group == 'Round of 16') {
                    if(wizard_l16_teams.includes(match.away_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('lineup-true');
                        $('#last-16').find(`[data-team_id=${match.away_team}]`).addClass('semi-correct');
                        $(`[data-team_id=${match.away_team}]`).each((index, div) => {
                            if($(div).hasClass('knockout-team-container')) {
                                console.log($(div))
                                $(div).addClass('white-border')
                            }
                        })
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('loser');
                    }
                } 
                if(match.group == 'Quarter Final') {
                    if(wizard_qf_teams.includes(match.away_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('lineup-true');
                        $('#quart-final').find(`[data-team_id=${match.away_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('loser');
                    }
                }
                if(match.group == 'Semi Final') {
                    if(wizard_sf_teams.includes(match.away_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('lineup-true');
                        $('#semi-final').find(`[data-team_id=${match.away_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('loser');
                    }
                }
                if(match.match_number == 63) {
                    if(wizard_3rdplace_teams.includes(match.away_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).css('height', img_height).addClass('lineup-true');
                        $('#third-place-playoff').find(`[data-team_id=${match.away_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).css('height', img_height).addClass('loser');
                    }
                }
                if(match.match_number == 64) {
                    if(wizard_final_teams.includes(match.away_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('lineup-true');
                        $('#final').find(`[data-team_id=${match.away_team}]`).addClass('semi-correct');
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).addClass('loser');
                    }
                }
            }


            //////////////////////////////////////////////////////
            console.log("match.home_team.id = ", match.home_team)
            $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team});
            $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_home_team': match.home_team});
            var wizard_home_team = $(`[data-match=${match.match_number}]`).children(':nth-child(1)').attr('data-team_id');
            var wizard_away_team = $(`[data-match=${match.match_number}]`).children(':nth-child(3)').attr('data-team_id');
            if(wizard_home_team != TEAM_TBD[0].team) {
                if(wizard_home_team == match.home_team) {
                    $(`[data-match=${match.match_number}]`).find('.actual-home-team').addClass('gold-border');
                    $(`[data-match=${match.match_number}]`).children(':nth-child(1)').addClass('correct-team');
                    $(`[data-team_id=${match.home_team}]`).each((index, div) => {
                        if($(div).hasClass('knockout-team-container')) {
                            console.log($(div))
                            $(div).addClass('gold-border')
                        }
                    })
                }
                
            }
            if(wizard_away_team != TEAM_TBD[0].team) {
                if(wizard_away_team == match.away_team) {
                    $(`[data-match=${match.match_number}]`).find('.actual-away-team').addClass('gold-border');
                    $(`[data-match=${match.match_number}]`).children(':nth-child(3)').addClass('correct-team');
                    $(`[data-team_id=${match.away_team}]`).each((index, div) => {
                        if($(div).hasClass('knockout-team-container')) {
                            console.log($(div))
                            $(div).addClass('gold-border')
                        }
                    })
                }
            }
            ////////////////////////////////////////////////////////////




        }     
    })
    
    var groups = $('.group');
    $.each(groups, function() {
        points = 0;
        var points = $(this).find('.selected.gold-background').length;
        $(this).find('.group-points').children('p').append(points)
    })
    
    drawSVG();
    
    var match_width = $('#semi_final').width();
    $('#third-place-playoff').width(match_width);
    $('#final-match').width(match_width);
}) 

$('.multiplier').click(function() {
    $('.fa-chevron-down').toggleClass('d-none');
    $('.fa-chevron-up').toggleClass('d-none');
    $('.multiplier-content').toggle();
})

$('.tooltip-icon').click(function() {
    $('.tooltip-text').toggle();
});

$('.tooltip-text').click(function() {
    $('.tooltip-text').hide();
})

//Function to draw the svg polylines to show the knockout route progress
function drawSVG(){
    var last_16_svg = document.getElementById('last-16-svg')
    var quart_final_svg = document.getElementById('quart-final-svg');
    var semi_final_svg = document.getElementById('semi-final-svg');
    var final_svg = document.getElementById('final-svg');
    var last_16_col = $("#last_16");
    var last_16_matches = $("#last-16").find("[data-match]");
    var quart_final_matches = $("#quart-final").find("[data-match]");
    var semi_final_matches = $("#semi-final").find("[data-match]");
    var home_team;
    var away_team;
    var svg_height = $("#last-16").outerHeight(true);
    var third_place_match = $("[data-match=63]").outerHeight(true);
    $(last_16_svg).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )
    $(quart_final_svg).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )   
    $(semi_final_svg).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )  
    $(final_svg).prepend(
        `<svg id="semi-final-one" height=${(svg_height - third_place_match)/2} width=100%>
        
        </svg>`
    )  
    $(final_svg).append(
        `<svg id="semi-final-two" height=${(svg_height - third_place_match)/2} width=100%>
        
        </svg>`
    )  
    last_16_matches.each(function(index) {
        home_team = $(this).children()[0].getBoundingClientRect();
        away_team = $(this).children()[1].getBoundingClientRect();
        var element_to;
        if(index%2 == 0) {
            element_to = $(quart_final_matches[Math.floor(index/2)]).children()[0].getBoundingClientRect()
        }
        else {
            element_to = $(quart_final_matches[Math.floor(index/2)]).children()[2].getBoundingClientRect()
        }
        var last_16_home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - last_16_svg.getBoundingClientRect()['top']));
        var last_16_home_end = (last_16_svg.offsetWidth + ',' + ((home_team['top'] + home_team['height']/2) - last_16_svg.getBoundingClientRect()['top']));
        var last_16_away_start = (0 + ',' + ((away_team['bottom'] + away_team['height']/2) - last_16_svg.getBoundingClientRect()['top']));
        var last_16_away_end = (last_16_svg.offsetWidth + ',' + ((away_team['bottom'] + away_team['height']/2) - last_16_svg.getBoundingClientRect()['top']));
        var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - quart_final_svg.getBoundingClientRect()['top']));
        var home_1 = ((quart_final_svg.offsetWidth/5) + ',' + ((home_team['top'] + home_team['height']/2) - quart_final_svg.getBoundingClientRect()['top']));
        var away_start = (0 + ',' + ((away_team['bottom'] + away_team['height']/2) - quart_final_svg.getBoundingClientRect()['top']));
        var away_1 = ((quart_final_svg.offsetWidth/5) + ',' + ((away_team['bottom'] + away_team['height']/2) - quart_final_svg.getBoundingClientRect()['top']));
        var svg_end_1 = ((quart_final_svg.offsetWidth*4/5) + ',' + (element_to['top'] + element_to['height']/2 - quart_final_svg.getBoundingClientRect()['top']));
        var svg_end = (quart_final_svg.offsetWidth + ',' + (element_to['top'] + element_to['height']/2 - quart_final_svg.getBoundingClientRect()['top']));
        $(last_16_svg).find('svg').append(
            `<svg>
                <polyline class="pl-${$(this).children(':nth-child(1)').attr('id')} W${$(this).children(':nth-child(1)').attr('id')}_${$(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')}" points="${last_16_home_start} ${last_16_home_end}"/>
                <polyline class="pl-${$(this).children(':nth-child(3)').attr('id')} W${$(this).children(':nth-child(3)').attr('id')}_${$(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')}" points="${last_16_away_start} ${last_16_away_end}"/>   
            </svg>`
        )
        $(quart_final_svg).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(1)').attr('id')} W${$(this).attr('data-match')}_${$(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"/>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')} W${$(this).attr('data-match')}_${$(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"/>   
            </svg>`
        )


        ////////////////Left off position
        // console.log("$(this).children(':nth-child(1)') = ", $(this).children(':nth-child(1)').attr('data-team_id'))
        console.log("$(this).children(':nth-child(4)') = ", '.W' + $(this).children(':nth-child(1)').attr('id') + '_' + $(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team'))

        if($(this).children(':nth-child(1)').children('img:nth-child(1)').hasClass('lineup-true')) {
            if($(this).children(':nth-child(1)').children('img:nth-child(1)').hasClass('gold-border')) {
                $('.W' + $(this).children(':nth-child(1)').attr('id') + '_' + $(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')).addClass('correct-svg')
            }
            else {
                $('.W' + $(this).children(':nth-child(1)').attr('id') + '_' + $(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')).addClass('semi-correct-svg')
            }
        }

        if($(this).children(':nth-child(3)').children('img:nth-child(1)').hasClass('lineup-true')) {
            if($(this).children(':nth-child(3)').children('img:nth-child(1)').hasClass('gold-border')) {
                $('.W' + $(this).children(':nth-child(3)').attr('id') + '_' + $(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')).addClass('correct-svg')
            }
            else {
                $('.W' + $(this).children(':nth-child(3)').attr('id') + '_' + $(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')).addClass('semi-correct-svg')
            }
        }

        if($(this).children(':nth-child(1)').attr('data-team_id') == $(this).children(':nth-child(4)').attr('data-team_id')) {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            // console.log("team_container_id = ", team_container_id);
            $('.' + team_container_id).addClass('selectedPath');
            if($(this).children(':nth-child(1)').hasClass('semi-correct')) {
                $('.' + team_container_id).addClass('dimmed').removeClass('loser');
            }
            if($(this).children(':nth-child(1)').hasClass('eliminated')) {
                $('.' + team_container_id).addClass('loser').removeClass('dimmed');
            } 
            if($(this).children(':nth-child(1)').hasClass('correct-team')) {
                $('.' + team_container_id).removeClass('dimmed');
            }   
        }
        
        
        if($(this).children(':nth-child(3)').attr('data-team_id') == $(this).children(':nth-child(4)').attr('data-team_id')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath');
            if($(this).children(':nth-child(3)').hasClass('semi-correct')) {
                // console.log("TRUE", team_container_id)
                $('.' + team_container_id).addClass('dimmed').removeClass('loser');
            }
            if($(this).children(':nth-child(3)').hasClass('eliminated')) {
                $('.' + team_container_id).addClass('loser').removeClass('dimmed');
            }
            if($(this).children(':nth-child(3)').hasClass('correct-team')) {
                $('.' + team_container_id).removeClass('dimmed');
            }   
        }   
    })

    quart_final_matches.each(function(index) {
        home_team = $(this).children()[0].getBoundingClientRect();
        away_team = $(this).children()[2].getBoundingClientRect();
        var element_to;
        if(index%2 == 0) {
            element_to = $(semi_final_matches[Math.floor(index/2)]).children()[0].getBoundingClientRect();
        }
        else {
            element_to = $(semi_final_matches[Math.floor(index/2)]).children()[2].getBoundingClientRect();
        }
        var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var home_1 = ((semi_final_svg.offsetWidth/5) + ',' + ((home_team['top'] + home_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var away_start = (0 + ',' + ((away_team['top'] + away_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var away_1 = ((semi_final_svg.offsetWidth/5) + ',' + ((away_team['top'] + away_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var svg_end_1 = (semi_final_svg.offsetWidth*4/5 + ',' + (element_to['top'] + element_to['height']/2 - semi_final_svg.getBoundingClientRect()['top']))
        var svg_end = (semi_final_svg.offsetWidth + ',' + (element_to['top'] + element_to['height']/2 - semi_final_svg.getBoundingClientRect()['top']));
        $(semi_final_svg).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(1)').attr('id')} ${$(this).attr('data-match')}_${$(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"/>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')} ${$(this).attr('data-match')}_${$(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"/>   
            </svg>`
        )   

        // if($(this).children(':nth-child(1)').children('p').text() != 'TBD') {
        //     let team_container_id = $(this).children(':nth-child(1)').attr('id');
        //     $('.pl-' + team_container_id).addClass('selectedPath');
        // }
        // else {
        //     $(this).children(':nth-child(1)').children('p').addClass("eliminated");
        //     $(this).children(':nth-child(1)').children('img:nth-child(2)').addClass("eliminated");
        // }

        // if($(this).children(':nth-child(3)').children('p').text() != 'TBD') {
        //     let team_container_id = $(this).children(':nth-child(3)').attr('id');
        //     $('.pl-' + team_container_id).addClass('selectedPath');
        // }
        // else {
        //     $(this).children(':nth-child(3)').children('p').addClass("eliminated");
        //     $(this).children(':nth-child(3)').children('img:nth-child(2)').addClass("eliminated");
        // }

        if($(this).children(':nth-child(1)').children('img:nth-child(1)').hasClass('lineup-true')) {
            if($(this).children(':nth-child(1)').children('img:nth-child(1)').hasClass('gold-border')) {
                $('.' + $(this).children(':nth-child(1)').attr('id') + '_' + $(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')).addClass('correct-svg')
            }
            else {
                $('.' + $(this).children(':nth-child(1)').attr('id') + '_' + $(this).children(':nth-child(1)').children('img:nth-child(1)').attr('data-actual_home_team')).addClass('semi-correct-svg')
            }
        }

        if($(this).children(':nth-child(3)').children('img:nth-child(1)').hasClass('lineup-true')) {
            if($(this).children(':nth-child(3)').children('img:nth-child(1)').hasClass('gold-border')) {
                $('.' + $(this).children(':nth-child(3)').attr('id') + '_' + $(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')).addClass('correct-svg')
            }
            else {
                $('.' + $(this).children(':nth-child(3)').attr('id') + '_' + $(this).children(':nth-child(3)').children('img:nth-child(1)').attr('data-actual_away_team')).addClass('semi-correct-svg')
            }
        }

        if($(this).children(':nth-child(1)').attr('data-team_id') == $(this).children(':nth-child(4)').attr('data-team_id')) {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')
            if($(this).children(':nth-child(1)').hasClass('semi-correct')) {
                $('.' + team_container_id).addClass('dimmed').removeClass('loser');
            }
            if($(this).children(':nth-child(1)').hasClass('eliminated')) {
                $('.' + team_container_id).addClass('loser').removeClass('dimmed');
            }  
            if($(this).children(':nth-child(1)').hasClass('correct-team')) {
                $('.' + team_container_id).removeClass('dimmed');
            }   
        }
        
        if($(this).children(':nth-child(3)').attr('data-team_id') == $(this).children(':nth-child(4)').attr('data-team_id')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath');
            if($(this).children(':nth-child(3)').hasClass('semi-correct')) {
                $('.' + team_container_id).addClass('dimmed').removeClass('loser');
            }
            if($(this).children(':nth-child(3)').hasClass('eliminated')) {
                $('.' + team_container_id).addClass('loser').removeClass('dimmed');
            }
            if($(this).children(':nth-child(3)').hasClass('correct-team')) {
                $('.' + team_container_id).removeClass('dimmed');
            }   
        }   
    })

    semi_final_matches.each(function(index) {
        var svg_sf_1 = document.getElementById('semi-final-one').getBoundingClientRect();
        var svg_sf_2 = document.getElementById('semi-final-two').getBoundingClientRect();
        home_team = $(this).children()[0].getBoundingClientRect();
        away_team = $(this).children()[2].getBoundingClientRect();
        var element_W61 = document.getElementById("W61").getBoundingClientRect();
        var element_W62 = document.getElementById("W62").getBoundingClientRect();
        if(index == 0) {
            var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - svg_sf_1['top']));
            var home_1 = (svg_sf_1.width/5 + ',' + ((home_team['top'] + home_team['height']/2) - svg_sf_1['top']))
            var away_start = (0 + ',' + ((away_team['top'] + away_team['height']/2) - svg_sf_1['top']));
            var away_1 = (svg_sf_1.width/5 + ',' + ((away_team['top'] + away_team['height']/2) - svg_sf_1['top']));
            var svg_end_1 = (svg_sf_1.width*4/5 + ',' + (element_W61['top'] + element_W61['height']/2 - svg_sf_1['top']));
            var svg_end = (svg_sf_1.width + ',' + (element_W61['top'] + element_W61['height']/2 - svg_sf_1['top']));
            $(final_svg).find('#semi-final-one').append(
                `<svg>
                    <polyline class="${$(this).children(':nth-child(1)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                </svg>`
            )   
        }
        else {
            var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - svg_sf_2['top']));
            var home_1 = (svg_sf_2.width/5 + ',' + ((home_team['top'] + home_team['height']/2) - svg_sf_2['top']));
            var away_start = (0 + ',' + ((away_team['top'] + away_team['height']/2) - svg_sf_2['top']));
            var away_1 = (svg_sf_2.width/5 + ',' + ((away_team['top'] + away_team['height']/2) - svg_sf_2['top']));
            var svg_end_1 = (svg_sf_2.width*4/5 + ',' + (element_W62['top'] + element_W62['height']/2 - svg_sf_2['top']));
            var svg_end = (svg_sf_2.width + ',' + (element_W62['top'] + element_W62['height']/2 - svg_sf_2['top']));
            $(final_svg).find('#semi-final-two').append(
                `<svg>
                    <polyline class="${$(this).children(':nth-child(1)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                </svg>`
            )   
        }
        
        if($(this).children(':nth-child(1)').children('p').text() != 'TBD') {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            $('.pl-' + team_container_id).addClass('selectedPath');
        }
        else {
            $(this).children(':nth-child(1)').children('p').addClass("eliminated");
            $(this).children(':nth-child(1)').children('img:nth-child(2)').addClass("eliminated");
        }

        if($(this).children(':nth-child(3)').children('p').text() != 'TBD') {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.pl-' + team_container_id).addClass('selectedPath');
        }
        else {
            $(this).children(':nth-child(3)').children('p').addClass("eliminated");
            $(this).children(':nth-child(3)').children('img:nth-child(2)').addClass("eliminated");
        }


        if($(this).children(':nth-child(1)').attr('data-team_id') == $(this).children(':nth-child(4)').attr('data-team_id')) {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')
            if($(this).children(':nth-child(1)').hasClass('semi-correct')) {
                $('.' + team_container_id).addClass('dimmed').removeClass('loser');
            }
            if($(this).children(':nth-child(1)').hasClass('eliminated')) {
                $('.' + team_container_id).addClass('loser').removeClass('dimmed');
            }  
            if($(this).children(':nth-child(1)').hasClass('correct-team')) {
                $('.' + team_container_id).removeClass('dimmed');
            }   
        }
        
        if($(this).children(':nth-child(3)').attr('data-team_id') == $(this).children(':nth-child(4)').attr('data-team_id')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath');
            if($(this).children(':nth-child(3)').hasClass('semi-correct')) {
                $('.' + team_container_id).addClass('dimmed').removeClass('loser');
            }
            if($(this).children(':nth-child(3)').hasClass('eliminated')) {
                $('.' + team_container_id).addClass('loser').removeClass('dimmed');
            }
            if($(this).children(':nth-child(3)').hasClass('correct-team')) {
                $('.' + team_container_id).removeClass('dimmed');
            }   
        }   
    })
};


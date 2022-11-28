console.log("userwizards.js")

var MATCHES = {};
var TEAMS = {};
var SAVED_WIZARD = {};
var TEAM_TBD;
var PAST_DEADLINE = false;
// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu77.gitpod.io/get_wizard_data')
.then(response => response.json())
.then(data => {
    console.log("Fetch get_matches fired");
    MATCHES = data.matches;
    TEAMS = data.teams;
    SAVED_WIZARD = data.saved_wizard;
    TEAM_TBD = TEAMS.filter(obj => obj.team__name == 'TBD');
    console.log("TEAM_TBD = ", TEAM_TBD[0])
    console.log("MATCHES: ", MATCHES);
    console.log("TEAMS: ", TEAMS);
    console.log("SAVED_WIZARD: ", SAVED_WIZARD);
    
    SAVED_WIZARD.forEach(match => {
        if(match.match_number < 49) {
            // console.log("saved_wizard winner el = ", $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`))
            $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`).addClass('selected').attr('data-points', 3).siblings(':not(input)').attr('data-points', 0).addClass('loser');
            // console.log("match.winning_team.name = ", match.winning_team)
            if(match.winning_team == TEAM_TBD[0]['team']) {
                $(`[data-match=${match.match_number}]`).find(`[data-team_id=draw]`).addClass('selected').siblings(':not(input)').addClass('loser');
                $(`[data-match=${match.match_number}]`).children(':not(input)').attr('data-points', 1);
            }
            if($(`[data-match=${match.match_number}]`).children().hasClass('selected')) {
                $(`[data-match=${match.match_number}]`).addClass('match-selected');
            }
        }
        else {
            $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`).addClass('winner').siblings(':not(.image-div)')//.addClass('loser');
            if($(`[data-match=${match.match_number}]`).children().hasClass('winner')) {
                $(`[data-match=${match.match_number}]`).addClass('match-selected');
            }
        }        
    })
    var wizard_l16 = $('#last_16').find('.knockout-team-container')//.attr('data-team_id');
    // var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${$(item).attr('data-team_id')}']`);
    var wizard_l16_teams = []
    wizard_l16.each(function(index, item) {  
        // console.log("item = ", item);
        wizard_l16_teams.push($(item).data('team_id'))
    })
    console.log("wizard_l16 = ", wizard_l16);
    console.log("wizard_l16_teams = ", wizard_l16_teams);
    var wizard_qf_teams;
    var wizard_sf_teams;
    var wizard_3rdplace_teams;
    var wizard_final_teams;

    MATCHES.forEach(match => {
        // console.log("match.winning_team__name = ", match.winning_team__id);
        if(match.match_number < 49) {
            if(match.winning_team__name != null) {
                $(`[data-match=${match.match_number}]`).removeClass('match-selected')
                if(match.winning_team__name == "TBD") {
                    $(`[data-match=${match.match_number}]`).find(`[data-team_id=draw]`).addClass('gold-background').siblings().addClass('loser');
                }
                else {
                    $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team__id}]`).addClass('gold-background').siblings().addClass('loser');
                }   
            }
        } 
        else {
            // console.log("TEAM_TBD.team = ", TEAM_TBD[0].team);
            var img = $(`[data-match=${match.match_number}]`).find('img')[0];
            var img_width = $(img).outerWidth();
            var img_height = $(img).outerHeight();
            if(match.home_team != TEAM_TBD[0].team) {
                if(match.match_number == 63) {
                    $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).css('height', img_height);
                }
                else {
                    if(wizard_l16_teams.includes(match.home_team)) {
                        console.log("INCLUDES = ", match.home_team)
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).css({'width': img_width, 'height': img_height});
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-home-team').attr({'src': match.home_team__crest_url, 'data-actual_home_team': match.home_team}).css({'width': img_width, 'height': img_height}).addClass('loser');
                        console.log("NOT INCLUDES", match.home_team)
                    }
                    
                } 
            }
            if(match.away_team != TEAM_TBD[0].team) {
                if(match.match_number == 63) {
                    $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).css('height', img_height);
                }
                else {
                    if(wizard_l16_teams.includes(match.away_team)) {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).css({'width': img_width, 'height': img_height});
                    }
                    else {
                        $(`[data-match=${match.match_number}]`).find('.actual-away-team').attr({'src': match.away_team__crest_url, 'data-actual_away_team': match.away_team}).css({'width': img_width, 'height': img_height}).addClass('loser');
                    }
                    
                } 
            }
            var wizard_home_team = $(`[data-match=${match.match_number}]`).children(':nth-child(1)').attr('data-team_id');
            var wizard_away_team = $(`[data-match=${match.match_number}]`).children(':nth-child(3)').attr('data-team_id');
            if(wizard_home_team == match.home_team) {
                $(`[data-match=${match.match_number}]`).find('.actual-home-team').addClass('gold-border');
            }
            if(wizard_away_team == match.away_team) {
                $(`[data-match=${match.match_number}]`).find('.actual-away-team').addClass('gold-border');
            }
            
        }     
    })

    drawSVG();
    
    var match_width = $('#semi_final').width();
    // console.log("match_width = ", match_width);
    $('#third-place-playoff').width(match_width);
    $('#final-match').width(match_width);
}) 

$('.tooltip-icon').click(function() {
    $('.tooltip-text').toggle();
});

$('.tooltip-text').click(function() {
    $('.tooltip-text').hide();
})

//Function to draw the svg polylines to show the knockout route progress
function drawSVG(){
    var svg_1 = document.getElementById('svg_1');
    var svg_2 = document.getElementById('svg_2');
    var svg_3 = document.getElementById('svg_3');
    var last_16_col = $("#last_16");
    var last_16_matches = $("#last_16").find("[data-match]");
    var quart_final_matches = $("#quart_final").find("[data-match]");
    var semi_final_matches = $("#semi_final").find("[data-match]");
    var home_team;
    var away_team;
    var svg_height = $("#last_16").outerHeight(true);
    var third_place_match = $("[data-match=63]").outerHeight(true);
    // console.log("third_place_match  ", third_place_match)
    $(svg_1).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )   
    $(svg_2).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )  
    $(svg_3).prepend(
        `<svg id="semi-final-one" height=${(svg_height - third_place_match)/2} width=100%>
        
        </svg>`
    )  
    $(svg_3).append(
        `<svg id="semi-final-two" height=${(svg_height - third_place_match)/2} width=100%>
        
        </svg>`
    )  
    last_16_matches.each(function(index) {
        home_team = $(this).children()[0].getBoundingClientRect();
        away_team = $(this).children()[1].getBoundingClientRect();
        var element_to;
        if(index%2 == 0) {
            // console.log("element_to = ", $(quart_final_matches[Math.floor(index/2)]).children()[0])
            element_to = $(quart_final_matches[Math.floor(index/2)]).children()[0].getBoundingClientRect()
        }
        else {
            element_to = $(quart_final_matches[Math.floor(index/2)]).children()[2].getBoundingClientRect()
        }
        // console.log("home_team = ", home_team)
        // console.log("element_to = ", element_to)
        var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - svg_1.getBoundingClientRect()['top']));
        var home_1 = ((svg_1.offsetWidth/5) + ',' + ((home_team['top'] + home_team['height']/2) - svg_1.getBoundingClientRect()['top']));
        var away_start = (0 + ',' + ((away_team['bottom'] + away_team['height']/2) - svg_1.getBoundingClientRect()['top']));
        var away_1 = ((svg_1.offsetWidth/5) + ',' + ((away_team['bottom'] + away_team['height']/2) - svg_1.getBoundingClientRect()['top']));
        var svg_end_1 = ((svg_1.offsetWidth*4/5) + ',' + (element_to['top'] + element_to['height']/2 - svg_1.getBoundingClientRect()['top']));
        var svg_end = (svg_1.offsetWidth + ',' + (element_to['top'] + element_to['height']/2 - svg_1.getBoundingClientRect()['top']));
        $(svg_1).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(1)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"/>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"/>   
            </svg>`
        )
        if($(this).children(':nth-child(1)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')//.removeClass('d-none').siblings().removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')//.removeClass('d-none').siblings().removeClass('selectedPath');
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
        var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - svg_2.getBoundingClientRect()['top']));
        var home_1 = ((svg_1.offsetWidth/5) + ',' + ((home_team['top'] + home_team['height']/2) - svg_1.getBoundingClientRect()['top']));
        var away_start = (0 + ',' + ((away_team['top'] + away_team['height']/2) - svg_2.getBoundingClientRect()['top']));
        var away_1 = ((svg_1.offsetWidth/5) + ',' + ((away_team['top'] + away_team['height']/2) - svg_2.getBoundingClientRect()['top']));
        var svg_end_1 = (svg_1.offsetWidth*4/5 + ',' + (element_to['top'] + element_to['height']/2 - svg_2.getBoundingClientRect()['top']))
        var svg_end = (svg_1.offsetWidth + ',' + (element_to['top'] + element_to['height']/2 - svg_2.getBoundingClientRect()['top']));
        $(svg_2).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(1)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"/>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"/>   
            </svg>`
        )   
        if($(this).children(':nth-child(1)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')//.removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')//.removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }    
    })

    semi_final_matches.each(function(index) {
        // console.log("index = ", index)
        var svg_sf_1 = document.getElementById('semi-final-one').getBoundingClientRect();
        var svg_sf_2 = document.getElementById('semi-final-two').getBoundingClientRect();
        home_team = $(this).children()[0].getBoundingClientRect();
        away_team = $(this).children()[2].getBoundingClientRect();
        var element_W61 = document.getElementById("W61").getBoundingClientRect();
        // console.log("element_W61 = ", element_W61)
        var element_W62 = document.getElementById("W62").getBoundingClientRect();
        if(index == 0) {
            var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - svg_sf_1['top']));
            var home_1 = (svg_sf_1.width/5 + ',' + ((home_team['top'] + home_team['height']/2) - svg_sf_1['top']))
            var away_start = (0 + ',' + ((away_team['top'] + away_team['height']/2) - svg_sf_1['top']));
            var away_1 = (svg_sf_1.width/5 + ',' + ((away_team['top'] + away_team['height']/2) - svg_sf_1['top']));
            var svg_end_1 = (svg_sf_1.width*4/5 + ',' + (element_W61['top'] + element_W61['height']/2 - svg_sf_1['top']));
            var svg_end = (svg_sf_1.width + ',' + (element_W61['top'] + element_W61['height']/2 - svg_sf_1['top']));
            $(svg_3).find('#semi-final-one').append(
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
            $(svg_3).find('#semi-final-two').append(
                `<svg>
                    <polyline class="${$(this).children(':nth-child(1)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                </svg>`
            )   
        }
        
        if($(this).children(':nth-child(1)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(1)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')//.removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath')//.removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }   
        
    })
};


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
    var img_height = $(div).next().outerHeight();
    var match_width = $(div).parent().outerWidth();
    $(div).css({'translate': (-img_width - 5) + 'px 0', 'width': img_width, 'height': img_height})
})

var match1 = $('#last-16').children('.match-container:nth-child(1)');
var match2 = $('#last-16').children('.match-container:nth-child(2)');
var match1_dim = match1[0].getBoundingClientRect();
var match2_dim = match2[0].getBoundingClientRect();
var team = $(match1).children('.knockout-team-container:nth-child(3)');
var team_dim = team[0].getBoundingClientRect();
var midpoint_match1 = (match1_dim['y'] + (match1_dim['height']/2));
var midpoint_match2 = (match2_dim['y'] + (match2_dim['height']/2));
var match_height = (midpoint_match2 - midpoint_match1 + team_dim['height']);
$('#quart-final').children('.match-container').height(match_height)




// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-womensworld-hsfyc3kn6ib.ws-eu101.gitpod.io/get_teams')
.then(response => response.json())
.then(data => {
    MATCHES = data.matches;
    TEAMS = data.teams;
    SAVED_WIZARD = data.saved_wizard;
    TEAM_TBD = TEAMS.filter(obj => obj.name == 'TBD');
    console.log("TEAM_TBD = ", TEAM_TBD)
    console.log("MATCHES: ", MATCHES);
    console.log("TEAMS: ", TEAMS);
    console.log("SAVED_WIZARD: ", SAVED_WIZARD);
    
    if(SAVED_WIZARD != undefined) {
        SAVED_WIZARD.forEach(match => {
            if(match.match_number < 49) {
                $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`).addClass('selected').attr('data-points', 3).siblings(':not(input)').attr('data-points', 0).addClass('loser');
                if(match.winning_team == TEAM_TBD[0]['id']) {
                    $(`[data-match=${match.match_number}]`).find(`[data-team_id=draw]`).addClass('selected').siblings(':not(input)').addClass('loser');
                    $(`[data-match=${match.match_number}]`).children(':not(input)').attr('data-points', 1);
                }
                if($(`[data-match=${match.match_number}]`).children().hasClass('selected')) {
                    $(`[data-match=${match.match_number}]`).addClass('match-selected');
                }
            }
            else {
                $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`).addClass('winner').siblings(':not(.image-div, .winner-container)').addClass('loser');
                if($(`[data-match=${match.match_number}]`).children().hasClass('winner')) {
                    $(`[data-match=${match.match_number}]`).addClass('match-selected');
                }
                if(match.match_number == 64 && match.winning_team == null) {
                    $('.winner-container').children('img').attr('src', TEAM_TBD[0].crest_url);
                    $('.winner-container').children('p').text(TEAM_TBD[0].name);
                }
                else {
                    $(`[data-match=${match.match_number}]`).children('.winner-container').addClass('winner')
                }
            }        
        })
    }
    
    var matches_selected = $('.match-selected');
    $('#matches-selected').text(matches_selected.length)
    console.log("drawsvg")
    drawSVG();
}) 


$(".team-container").click(groupMatchClicked);

// $('.match-row').hide();
// Set the date we're counting down to
var deadlineDate = new Date("Jul 20, 2023 07:00:00").getTime();
var timer = setInterval(function() {
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = deadlineDate - now;
    if (distance <  0) {
        clearInterval(timer);
        PAST_DEADLINE = false;
        // $('.submit-button').hide();
    }
}, 1000);


async function groupMatchClicked() {
    if(PAST_DEADLINE == true) {
        return;
    }
    else {
        var group = $(this).parents('.group').attr("id");
        var match_clicked = {'match': $(this).parent().attr('data-match'),
                             'home_points': $(this).parent().children('.team-container').first().attr('data-points'),
                             'away_points': $(this).parent().children('.team-container').last().attr('data-points')};
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected').attr('data-points', 0);
            $(this).siblings(':not(input)').attr('data-points', 0).removeClass('loser');
            $(this).parent().find("select:first").val(0);
            $(this).parent().removeClass('match-selected');
            getGroupOrder(group);
        } 
        else {
            if($(this).parent().siblings(':not(input).match-selected').length == 5) {
                if($(this).attr('data-team_id') == "draw") {
                    $(this).siblings(':not(input)').attr('data-points', 1);
                }
                else {
                    $(this).attr('data-points', 3);
                    $(this).siblings(':not(input)').attr('data-points', 0);
                }
                await verifyGroupOrder(group, match_clicked)
                .then(result => {
                    if(result[0] == true) {
                        $(this).addClass('selected').attr('data-points', 3).removeClass('loser');
                        $(this).siblings(':not(input)').removeClass('selected').addClass('loser').attr('data-points', 0);
                        $(this).parent().find("select:first").val($(this).attr('data-team_id'));
                        $(this).parent().addClass('match-selected');
                        if($(this).attr('data-team_id') == "draw") {
                            $(this).parent().find("select:first").val(TEAM_TBD[0]['id'])
                            $(this).siblings(':not(input)').attr('data-points', 1);
                        }
                        var data = [{'match_id': group + '1', 'team_id': result[1][0]['team_id']}, {'match_id': group + '2', 'team_id': result[1][1]['team_id']}];
                        moveImages(result[2], result[1])
                        prePopulateNextRound(data)
                    }
                    if(result[0] == false) {
                        $('[data-match=' + result[1]['match'] + ']').children('.team-container').first().attr('data-points', result[1]['home_points']);
                        $('[data-match=' + result[1]['match'] + ']').children('.team-container').last().attr('data-points', result[1]['away_points']);
                    }               
                })
                .catch(error => {
                    // console.log("ERROR = ", error);
                })
            }
            else {
                $(this).addClass('selected').attr('data-points', 3).removeClass('loser');
                $(this).siblings(':not(input)').removeClass('selected').addClass('loser').attr('data-points', 0);
                $(this).parent().find("select:first").val($(this).attr('data-team_id'));
                $(this).parent().addClass('match-selected');
                if($(this).attr('data-team_id') == "draw") {
                    $(this).parent().find("select:first").val(TEAM_TBD[0]['id'])
                    $(this).siblings(':not(input)').attr('data-points', 1);
                }
                getGroupOrder(group);
            }    
        }    
    }
    
}

async function verifyGroupOrder(group, match_clicked) {
    console.log("verifyGroupOrder")
    let userSelection = new Promise(function(resolve, reject) {
        var group_standings = [];
        var image_positions = [];
        var table_images = $('#' + group).children('.group-header').find("img");
        table_images.each(function (index, item) {
            // Check if the data-position attr is present. It will be empty on page load and group resets. Set to loop index value if empty
            var position;
            if($(item).data('position') === undefined) {
                position = index;
            }
            else {
                position = $(item).data('position');
            }
            
            // console.log("item = ", item);
            image_positions.push({'team_id': $(item).data('team_id'), 'position': position});
            group_standings.push({'team_id': $(item).data('team_id'), 'points': 0});
            var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${$(item).attr('data-team_id')}']`);
            $.each(elements, function() {
                group_standings.find(team => team.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'));
            })
            // GROUP SORT
            group_standings.sort((a, b) => {        
            return b.points - a.points
            })
        });
        
        console.log("group_standings = ", group_standings)
        var ordinals = ['st', 'nd', 'rd', 'th']
        var groupLogic = [];
        group_standings.forEach((item, index) => {
            console.log("group_standings forEach")
            if(index < group_standings.length - 1) {
                if(item['points'] == group_standings[index + 1]['points']) {
                    groupLogic.push(true)
                }
                else {
                    groupLogic.push(false)
                }
            }
            
        })
        var selected = $('#' + group).find('.selected');
        console.log("groupLogic = ", groupLogic)
        if(groupLogic.slice(0, 2).includes(true)) {
            var myModal_1 = new bootstrap.Modal(document.getElementById('myModal-1'), {backdrop: false});
            var ordinals = ['st', 'nd', 'rd', 'th'];
            console.log("my modal show");
            myModal_1.show();
            $('#myModal-1 .modal-body').children().empty();
            $('.modal-save-button').hide();
            
            // Modal logic start
            // if all are true
            if(!groupLogic.includes(false)) {
                $('.tie-text-1').text("Tie for 1st, 2nd, 3rd and 4th place!");
                $('.tie-text-2').text("Please select 2 teams to finish in 1st and 2nd place.");
                $('.modal-body').attr('data-match', match_clicked)
                for(i=0; i<group_standings.length; i++) {
                    team = TEAMS.filter(obj => obj.id == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <p>Tie 1st</p>
                                <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                            <p>${team[0].name}</p>
                        </div>`
                    )
                }
            }
            // True True False
            if(groupLogic[0] === true && groupLogic[1] === true && groupLogic[2] === false) {
                $('.tie-text-1').text("Tie for 1st, 2nd, and 3rd place!");
                $('.tie-text-2').text("Please select 2 teams to finish in 1st and 2nd place.")
                for(i=0; i<group_standings.length-1; i++) {
                    team = TEAMS.filter(obj => obj.id == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <p>Tie 1st</p>
                            <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                            <p>${team[0].name}</p>
                        </div>`
                    )
                }
                team = TEAMS.filter(obj => obj.id == group_standings[3].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col eliminated">
                        <p>4th</p>  
                        <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                        <p>${team[0].name}</p>
                    </div>`
                )

            }
            //true false ....
            if(groupLogic[0] === true && groupLogic[1] === false) {
                $('.tie-text-1').text("Tie for 1st and 2nd place!");
                $('.tie-text-2').text("Please select 2 teams to finish in 1st and 2nd place.");
                for(i=0; i<group_standings.length; i++) {
                    team = TEAMS.filter(obj => obj.id == group_standings[i].team_id);
                    if(i < 2) {
                        $('.modal-body').children('.row').append(
                            `<div class="col selectable">
                                <p>Tie 1st</p>
                                <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                                <p>${team[0].name}</p>
                            </div>`
                        )
                    }
                    else {
                        $('.modal-body').children('.row').append(
                            `<div class="col eliminated">
                                <p>${i+1 + ordinals[i]}</p>
                                <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                                <p>${team[0].name}</p>
                            </div>`
                        )
                    }
                }
            }
            // false true true
            if(groupLogic[0] === false && groupLogic[1] === true && groupLogic[2] === true) {
                $('.tie-text-1').text("Tie for 2nd place!");
                $('.tie-text-2').text("Please select a team to finish in 2nd place.");
                var team = TEAMS.filter(obj => obj.id == group_standings[0].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col qualified" data-qualified=1>
                        <p>1st</p>
                        <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                        <p>1st - ${team[0].name}</p>
                    </div>`
                )
                for(i=1; i<group_standings.length; i++) {
                    team = TEAMS.filter(obj => obj.id == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <p>Tie 2nd</p>
                            <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                            <p>${team[0].name}</p>
                            </p>
                        </div>`
                    )
                }
            }
            // false true false
            if(groupLogic[0] === false && groupLogic[1] === true && groupLogic[2] === false) {
                $('.tie-text-1').text("Tie for 2nd place!");
                $('.tie-text-2').text("Please select a team to finish in 2nd place.");
                team = TEAMS.filter(obj => obj.id == group_standings[0].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col qualified" data-qualified=1>
                        <p>1st</p>
                        <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                        <p>${team[0].name}</p>
                    </div>`
                )
                for(i=1; i<group_standings.length-1; i++) {
                    team = TEAMS.filter(obj => obj.id == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <p>Tie 2nd</p>
                            <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                            <p>${team[0].name}</p>
                        </div>`
                    )
                }
                team = TEAMS.filter(obj => obj.id == group_standings[3].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col eliminated">
                        <p>4th</p>
                        <img class="img-thumbnail" data-team_id="${team[0].id}" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                        <p>${team[0].name}</p>
                    </div>`
                )
            }
            $('.modal-body').find('img').parent('.selectable').click(function() {
                var qualifiedElements = $('.modal-body').find('.qualified');
                if((qualifiedElements.length < 2) || ($(this).hasClass('qualified'))) {
                    if(qualifiedElements.attr('data-qualified') == 2) {
                        qualified = 0;
                    }
                    else {
                        qualified = qualifiedElements.length;
                    }            
                    if($(this).hasClass('qualified')) {
                        qualified -= 1;
                        $(this).removeClass('qualified').attr('data-qualified', '');
                        
                    }
                    else if(qualified < 2) {
                        qualified += 1;
                        $(this).addClass('qualified').attr('data-qualified', qualified);
                        
                    }
                    qualifiedElements = $('.modal-body').find('.qualified');
                    if(qualifiedElements.length == 2) {
                        $('.modal-save-button').show();
                        $(this).siblings(':not(.qualified)').addClass('eliminated');
                    }
                    else {
                        $(this).siblings('.selectable:not(.qualified)').removeClass('eliminated');
                        $('.modal-save-button').hide();
                    }
                }
                
            });
    
            $('.modal-save-button').click(function() {
                var first_place = $('[data-qualified=1]').children('img').attr("data-team_id");
                var second_place = $('[data-qualified=2]').children('img').attr("data-team_id");
                var group_standings_refactored = [];
                group_standings_refactored[0] = group_standings.find(team => team.team_id == first_place);
                group_standings_refactored[1] = group_standings.find(team => team.team_id == second_place);
                group_standings.forEach(item => {
                    if(item.team_id != first_place && item.team_id != second_place) {
                        group_standings_refactored.push(item)
                    }
                })
                
                myModal_1.hide();
                resolve([true, group_standings_refactored, image_positions]);
            });
            $('.close').click(function() {
                resolve([false, match_clicked]);
            })
            
        }  
        else {
            resolve([true, group_standings, image_positions])
        }       
    }) 
    await userSelection; 
    return userSelection;
}

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
        home_team = this.childNodes[5].getBoundingClientRect();
        away_team = this.childNodes[7].getBoundingClientRect();
        var element_to;
        if(index%2 == 0) {
            element_to = quart_final_matches[Math.floor(index/2)].childNodes[5].getBoundingClientRect()
        }
        else {
            element_to = quart_final_matches[Math.floor(index/2)].childNodes[11].getBoundingClientRect()
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
                <polyline class="pl-${$(this).children(':nth-child(3)').attr('id')}" points="${last_16_home_start} ${last_16_home_end}"/>
                <polyline class="pl-${$(this).children(':nth-child(6)').attr('id')}" points="${last_16_away_start} ${last_16_away_end}"/>   
            </svg>`
        )
        $(quart_final_svg).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"/>
                <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"/>   
            </svg>`
        )
        // console.log("$(this).children(':nth-child(3)') = ", $(this).children(':nth-child(3)').children('p').text());
        if($(this).children(':nth-child(3)').children('p').text() != 'TBD') {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.pl-' + team_container_id).addClass('selectedPath');
        }
        else {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.pl-' + team_container_id).removeClass('selectedPath');
        }
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
        }


        if($(this).children(':nth-child(6)').children('p').text() != 'TBD') {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.pl-' + team_container_id).addClass('selectedPath');
        } 
        else {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.pl-' + team_container_id).removeClass('selectedPath');
        }
        if($(this).children(':nth-child(6)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
        }
    })

    quart_final_matches.each(function(index) {
        home_team = this.childNodes[5].getBoundingClientRect();
        away_team = this.childNodes[11].getBoundingClientRect();
        var element_to;
        if(index%2 == 0) {
            element_to = semi_final_matches[Math.floor(index/2)].childNodes[5].getBoundingClientRect()
        }
        else {
            element_to = semi_final_matches[Math.floor(index/2)].childNodes[11].getBoundingClientRect()
        }
        var home_start = (0 + ',' + ((home_team['top'] + home_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var home_1 = ((quart_final_svg.offsetWidth/5) + ',' + ((home_team['top'] + home_team['height']/2) - quart_final_svg.getBoundingClientRect()['top']));
        var away_start = (0 + ',' + ((away_team['top'] + away_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var away_1 = ((quart_final_svg.offsetWidth/5) + ',' + ((away_team['top'] + away_team['height']/2) - semi_final_svg.getBoundingClientRect()['top']));
        var svg_end_1 = (quart_final_svg.offsetWidth*4/5 + ',' + (element_to['top'] + element_to['height']/2 - semi_final_svg.getBoundingClientRect()['top']));
        var svg_end = (quart_final_svg.offsetWidth + ',' + (element_to['top'] + element_to['height']/2 - semi_final_svg.getBoundingClientRect()['top']));
        $(semi_final_svg).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"/>
                <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"/>
            </svg>
            `
        )   
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(6)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
        }  
    })

    semi_final_matches.each(function(index) {
        var svg_sf_1 = document.getElementById('semi-final-one').getBoundingClientRect();
        var svg_sf_2 = document.getElementById('semi-final-two').getBoundingClientRect();
        home_team = this.childNodes[5].getBoundingClientRect();
        away_team = this.childNodes[11].getBoundingClientRect();
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
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"
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
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${home_start} ${home_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${away_start} ${away_1} ${svg_end_1} ${svg_end}"
                    style="fill:none;" />
                </svg>`
            )   
        }
        
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(6)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
        }   
        
    })
};

// Function when clicking on the Group Index resets the group data 
$('.group-title').click(function() {
    if(PAST_DEADLINE == true) {
        return;
    }
    else {
        var group = $(this).parents('.group').attr('id');
        console.log("group = ", group)
        let images = $('#' + group).find('.header-images').children(':not(.group-reset)');
        $('#' + group).find("*").removeClass('match-selected selected loser')
        points_el = $('#' + group).find('[data-points]')
        $.each(points_el, function() {
            $(this).attr('data-points', 0).siblings('input').val(null)
        })
        $('#' + group).find('[data-match]').find('select:first').val(0);
        var team = TEAMS.filter(obj => obj.name == 'TBD');
        data = [{'match_id': group + '1', 'team_id': team[0].id}, {'match_id': group + '2', 'team_id': team[0].id}];
        prePopulateNextRound(data);
    }  
})

function getGroupOrder(group) {
    // Get all the header images and store the team_id to the array image_positions
    // console.log("getGroupOrder", group)
    var image_positions = [];
    var group_standings = [];
    var table_images = $('#' + group).find("img");
    // console.log("table_images", table_images)
    var zero = 0;
    table_images.each(function (index, item) {
        zero++;
        // Check if the data-position attr is present. It will be empty on page load and group resets. Set to loop index value if empty
        var position;
        if($(item).data('position') === undefined) {
            position = index;
        }
        else {
            position = $(item).data('position')
        }
        image_positions.push({'team_id': $(item).data('team_id'), 'position': position});
        group_standings.push({'team_id': $(item).data('team_id'), 'points': 0})
    })
    // console.log("image_positions = ", image_positions)

    // METHOD 2 Get all elements by data-team_id and add up points and store each team_id: points object into the array group_standings
    image_positions.forEach(obj => {
        var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${obj['team_id']}']`);
        $.each(elements, function() {
            group_standings.find(team => team.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'));
        })
    })
    // GROUP SORT
    group_standings.sort((a, b) => {        
        return b.points - a.points
    })
    // Get the amount of elements in the group that have the class .selected
    // This will tell us how many matches in the group that the user has indicated a result
    var selected = $('#' + group).find('.selected');
    // If the number of selected elements === 6, add some styling to the group border to indicate to the user that this group is complete.
    var team = TEAMS.filter(obj => obj.name == 'TBD');
    var data = [{'match_id': group + '1', 'team_id': team[0].id}, {'match_id': group + '2', 'team_id': team[0].id}]; 
    moveImages(image_positions, group_standings)
    prePopulateNextRound(data) 
}

$('.knockout-team-container:not(.winner-container)').click(function() {
    if(PAST_DEADLINE == true) {
        return;
    }
    else {
        if($(this).find('p').text() != 'TBD') {
            var team = TEAMS.filter(obj => obj.team == $(this).attr('data-team_id'));
            var team_container_id = $(this).attr('id');
            if ($(this).hasClass('winner')) {
                $(this).removeClass('winner').parent().removeClass('match-selected'); 
                $(this).siblings().removeClass('loser');
                $(this).parent().find("select:first").val(null);
                $('.' + team_container_id).removeClass('losing-svg selectedPath').siblings().removeClass('losing-svg selectedPath');
                data = [{'match_id': 'W' + $(this).parents().attr('data-match'), 'team_id': TEAM_TBD[0].id}];
                // console.log("data = ", data)
                if($(this).parent().attr('data-match') == 64) {
                    $('#W64').children('img').first().attr('src', TEAM_TBD[0].crest_url);
                    $('#W64').removeClass('winner')
                    $('#W64').children('p').text(TEAM_TBD[0].name);
                    check_complete()
                    return;
                }
            }
            else {
                $(this).addClass('winner').removeClass('loser').parent().addClass('match-selected');
                $(this).siblings(':not(.winner-container)').addClass('loser').removeClass('winner');
                $(this).parent().find("select:first").val($(this).attr('data-team_id'));
                $('.' + team_container_id).addClass('selectedPath').removeClass('losing-svg').siblings().addClass('losing-svg').removeClass('selectedPath');
                data = [{'match_id': 'W' + $(this).parent().attr('data-match'), 'team_id': $(this).attr('data-team_id')}];
                if($(this).parent().attr('data-match') == 64) {
                    var team = TEAMS.filter(obj => obj.id == $(this).attr('data-team_id'));
                    $('#W64').addClass('winner').children('img').first().attr('src', team[0].crest_url);
                    $('#W64').children('p').text(team[0].name);
                    check_complete()
                    return;
                }
            }    
            prePopulateNextRound(data);
        } 
    }
    
})

function prePopulateNextRound(data) {
    console.log("prePopulateNextRound = ", data)
    if(data[0].match_id != 'W63') {
        $('#W64').children('img').first().attr('src', TEAM_TBD[0].crest_url);
        $('#W64').children('p').text(TEAM_TBD[0].name);
    }
    
    $.each(data, function() {
        var team = TEAMS.filter(obj => obj.id == this.team_id);
        console.log("team = ", team)
        if(this.match_id == 'W61' || this.match_id == 'W62') {
            if($("[data-match='" + this.match_id.slice(1) + "']").children().hasClass('winner')) {
                var loser = $("[data-match='" + this.match_id.slice(1) + "']").children('.knockout-team-container:not(.winner)');
                console.log("loser = ", loser);
                var losing_team = TEAMS.filter(obj => obj.id == loser.attr('data-team_id'));
                console.log("losing_team = ", losing_team);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].id).prev().children().val(losing_team[0].id);
                $('#L' + this.match_id.slice(1)).parent().find("select:first").val(null);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].id).removeClass('winner loser').find('img').attr('src', losing_team[0].crest_url);
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner loser');
                $('#L' + this.match_id.slice(1)).parents().removeClass('match-selected');
                $('#L' + this.match_id.slice(1)).find('p').text(losing_team[0].name);
            }
            else {
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAM_TBD[0].id).prev().children().val(TEAM_TBD[0].id);
                $('#L' + this.match_id.slice(1)).parent().find("select:first").val(null);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAM_TBD[0].id).removeClass('winner loser').find('img').attr('src', TEAM_TBD[0].crest_url);
                $('#L' + this.match_id.slice(1)).parents().removeClass('match-selected');
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner loser');
            }
        }  
        $('#' + this.match_id).attr('data-team_id', this.team_id).prev().children().val(this.team_id);
        $('#' + this.match_id).parent().find("select:first").val(null);
        $('#' + this.match_id).attr('data-team_id', this.team_id).removeClass('winner loser').find('img:nth-child(2)').attr('src', team[0].crest_url);
        $('#' + this.match_id).parents().removeClass('match-selected')
        $('#' + this.match_id).siblings().removeClass('winner loser');
        $('#' + this.match_id).find('p').text(team[0].name);
        $('.' + this.match_id).siblings().addBack().removeClass('losing-svg selectedPath');

        const next_fixtures = nextFixtures(this.match_id);
        next_fixtures.forEach(fixture => {
            $('#' + fixture).attr('data-team_id', TEAM_TBD[0].id).removeClass('winner loser').find('img').attr('src', TEAM_TBD[0].crest_url);
            $('#' + fixture).parents().removeClass('match-selected')
            $('#' + fixture).find('p').text(TEAM_TBD[0].name);
            $('#' + fixture).siblings().removeClass('winner loser');
            $('.' + fixture).siblings().addBack().removeClass('losing-svg selectedPath');
            $('#' + fixture).prev().children().val(TEAM_TBD[0].id)
            $('#' + fixture).parent().find("select:first").val(null);
        })
    })
    var last_16_teams = $('#last-16').find('.knockout-team-container');
    // console.log("last_16_teams = ", last_16_teams);
    last_16_teams.each((index, item) => {
        // console.log("this.id = ", item.id);
        if($(item).find('p').text() != 'TBD') {
            // console.log("TBD")
            $('#last-16-svg').find('.pl-' + item.id).addClass('selectedPath');
        }
        else {
            $('#last-16-svg').find('.pl-' + item.id).removeClass('selectedPath');
        }
    })
    check_complete()
}

function check_complete() {
    var matches_selected = $('.match-selected');
    $('#matches-selected').text(matches_selected.length)
    if(matches_selected.length == 64) {
        $('.submit-button').addClass('wizard-complete');
    }
    else {
        $('.submit-button').removeClass('wizard-complete');
    }
}

function nextFixtures(match_id) {
    var fixtures = [];
    console.log("nextFixtures", match_id)
    if((match_id.slice(-2) != '61') && (match_id.slice(-2) != '62')) {
        for(i=0; i<4; i++) {
            fixtures.push('W' + $('#' + match_id).parents().attr('data-match')); 
            match_id = fixtures[i];        
            if(match_id.slice(-2) == '61') {
                fixtures.push('L61');
                break;
            }
            if(match_id.slice(-2) == '62') {
                fixtures.push('L62');
                break;
            }          
        }
    }
    return fixtures;
}

function moveImages(image_positions, group_standings) {
    // console.log("image_positions = ", image_positions);
    // console.log("group_standings = ", group_standings);
    image_positions.forEach((obj, index) => {
        var current_image_position =  index;
        var group_position = group_standings.findIndex(elem => elem.team_id === obj['team_id']);
        var el = $('.group-header').find("img").filter(`[data-team_id='${obj['team_id']}']`);
        // Set the data attributes to the image elements with the new data-position attr values
        
        // console.log("el = ", el);
        $(el).attr('data-position', group_position + 1);
        $(el).siblings().children('input').val(group_position + 1);
        var group_positions_moved = current_image_position - index;
        // preAnimateSnapToPositions(el, group_positions_moved)
        group_positions_moved = current_image_position - group_position;
        animate(el, group_positions_moved);
    })   
}

// function preAnimateSnapToPositions(el, group_positions_moved) {
//     const elem = el[0];
//     var img_width = elem.offsetWidth * Math.abs(group_positions_moved)
//     // Positive group_position_moved slides element left
//     if(group_positions_moved > 0) {
//         elem.style.transform = "translateX(" + -img_width + "px)";
//     }
//     // Negative group_position_moved slides element right
//     if(group_positions_moved == 0) {
//         elem.style.transform = "translateX(1px)";
//         elem.style.transform = "translateX(-1px)";
//     }
//     // Negative group_position_moved slides element right
//     if(group_positions_moved < 0) {
//         elem.style.transform = "translateX(" + img_width + "px)";
//     }
// }

function animate(el, group_positions_moved) {
    console.log("el = ", el)
    console.log("group_positions_moved = ", group_positions_moved)
    let id = null;
    const elem = el[0];  
    var elem1 = el.parents('.group-header').children(':nth-child(2)');
    var elem2 = el.parents('.group-header').children(':nth-child(3)');
    console.log("elem1 = ", elem1[0].offsetLeft);
    console.log("elem2 = ", elem2[0].offsetLeft);
    let pos = 0;
    var dimensions = elem.getBoundingClientRect();
    // console.log("dimensions = ", dimensions.left)
    var img_width = (elem2[0].offsetLeft - elem1[0].offsetLeft) * Math.abs(group_positions_moved)
    clearInterval(id);
    id = setInterval(frame, 5);

    function frame() { 
        if (pos == img_width) {
            clearInterval(id);
        }
        // Positive group_position_moved slides element left
        if(group_positions_moved > 0) {
            elem.style.transform = "translateX(" + -pos + "px)";
        }
        // Negative group_position_moved slides element right
        if(group_positions_moved == 0) {
            elem.style.transform = "translateX(1px)";
            elem.style.transform = "translateX(-1px)";
        }
        // Negative group_position_moved slides element right
        if(group_positions_moved < 0) {
            elem.style.transform = "translateX(" + pos + "px)";
        }
        pos++;
    }
};

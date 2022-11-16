console.log("Golden Route")

var MATCHES = {};
var TEAMS = {};
var SAVED_WIZARD = {};
var TEAM_TBD;
// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu74.gitpod.io/get_wizard_data')
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

    MATCHES.forEach(match => {
        if(match.winning_team__name == "TBD") {
            $(`[data-match=${match.match_number}]`).find(`[data-team_id=draw]`).addClass('gold-border');
        }
        else {
            $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team__id}]`).addClass('gold-border');
        }
        
    })
    
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
            $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`).addClass('winner').siblings(':not(input)').addClass('loser');
            if($(`[data-match=${match.match_number}]`).children().hasClass('winner')) {
                $(`[data-match=${match.match_number}]`).addClass('match-selected');
            }
        }        
    })

    drawSVG();
    $(".team-container").click(groupMatchClicked)
}) 

async function groupMatchClicked() {
    var group = $(this).parents('.group-container').attr("id");
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
                console.log("result ", result)
                if(result[0] == true) {
                    $(this).addClass('selected').attr('data-points', 3).removeClass('loser');
                    $(this).siblings(':not(input)').removeClass('selected').addClass('loser').attr('data-points', 0);
                    $(this).parent().find("select:first").val($(this).attr('data-team_id'));
                    $(this).parent().addClass('match-selected');
                    if($(this).attr('data-team_id') == "draw") {
                        $(this).parent().find("select:first").val(TEAM_TBD[0]['team'])
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
                console.log("ERROR = ", error);
            })
        }
        else {
            $(this).addClass('selected').attr('data-points', 3).removeClass('loser');
            $(this).siblings(':not(input)').removeClass('selected').addClass('loser').attr('data-points', 0);
            $(this).parent().find("select:first").val($(this).attr('data-team_id'));
            $(this).parent().addClass('match-selected');
            if($(this).attr('data-team_id') == "draw") {
                $(this).parent().find("select:first").val(TEAM_TBD[0]['team'])
                $(this).siblings(':not(input)').attr('data-points', 1);
            }
            getGroupOrder(group);
        }    
    }    
}

async function verifyGroupOrder(group, match_clicked) {
    // console.log("group_standings!!!!! = ", group_standings);
    console.log("match_clicked!!!!! = ", match_clicked)
    let userSelection = new Promise(function(resolve, reject) {
        var group_standings = [];
        var image_positions = [];
        var table_images = $('#' + group).children('.header-images').find("img");
        table_images.each(function (index, item) {
            // Check if the data-position attr is present. It will be empty on page load and group resets. Set to loop index value if empty
            var position;
            if($(item).data('position') === undefined) {
                position = index;
            }
            else {
                position = $(item).data('position');
            }
            image_positions.push({'team_id': $(item).data('team_id'), 'position': position});
            group_standings.push({'team_id': $(item).data('team_id'), 'points': 0});
            var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${$(item).attr('data-team_id')}']`);
            $.each(elements, function() {
                group_standings.find(team => team.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'));
            })
            // console.log("group_standings = ", group_standings)
            // GROUP SORT
            group_standings.sort((a, b) => {        
            return b.points - a.points
            })
            console.log("group_standings = ", group_standings)
        });
        var ordinals = ['st', 'nd', 'rd', 'th']
        var groupLogic = [];
        group_standings.forEach((item, index) => {
            // console.log("item, index = ", item, index);
            if(index < group_standings.length - 1) {
                if(item['points'] == group_standings[index + 1]['points']) {
                    groupLogic.push(true)
                }
                else {
                    groupLogic.push(false)
                }
            }
            
        })
        console.log("groupLogic = ", groupLogic);
        console.log("group_standings = ", group_standings);
        var selected = $('#' + group).find('.selected');
        if(groupLogic.slice(0, 2).includes(true)) {
            // console.log("TRUE")
            var myModal_1 = new bootstrap.Modal(document.getElementById('myModal-1'), {backdrop: false})
            var ordinals = ['st', 'nd', 'rd', 'th']
            myModal_1.show();
            $('.modal-title').children().empty();
            $('.modal-body').children().empty();
            $('.modal-save-button').hide();
            
            // Modal logic start
            // if all are true
            if(!groupLogic.includes(false)) {
                // console.log("TRUE");
                $('.modal-title').text("Tie for 1st, 2nd, 3rd and 4th place!");
                $('.modal-body').children('p').text("Please select 2 teams to finish in 1st and 2nd place.");
                $('.modal-body').attr('data-match', match_clicked)
                for(i=0; i<group_standings.length; i++) {
                    team = TEAMS.filter(obj => obj.team == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                            <p>T 1st - ${team[0].team__name}</p>
                        </div>`
                    )
                }
            }
            // True True False
            if(groupLogic[0] === true && groupLogic[1] === true && groupLogic[2] === false) {
                // console.log("TRUE")
                $('.modal-title').text("Tie for 1st, 2nd, and 3rd place!");
                $('.modal-body').children('p').text("Please select 2 teams to finish in 1st and 2nd place.")
                for(i=0; i<group_standings.length-1; i++) {
                    team = TEAMS.filter(obj => obj.team == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                            <p>T 1st - ${team[0].team__name}</p>
                        </div>`
                    )
                }
                team = TEAMS.filter(obj => obj.team == group_standings[3].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col eliminated">
                        <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                        <p>4th - ${team[0].team__name}</p>
                    </div>`
                )

            }
            // // true false ....
            if(groupLogic[0] === true && groupLogic[1] === false) {
                // console.log("TRUE");
                $('.modal-title').text("Tie for 1st and 2nd place!");
                $('.modal-body').children('p').text("Please select 2 teams to finish in 1st and 2nd place.");
                for(i=0; i<group_standings.length; i++) {
                    team = TEAMS.filter(obj => obj.team == group_standings[i].team_id);
                    console.log("team = ", team)
                    if(i < 2) {
                        $('.modal-body').children('.row').append(
                            `<div class="col selectable">
                                <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                                <p>T 1st - ${team[0].team__name}</p>
                            </div>`
                        )
                    }
                    else {
                        $('.modal-body').children('.row').append(
                            `<div class="col eliminated">
                                <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                                <p>${i+1 + ordinals[i]} - ${team[0].team__name}</p>
                            </div>`
                        )
                    }
                }
            }
            // false true true
            if(groupLogic[0] === false && groupLogic[1] === true && groupLogic[2] === true) {
                // console.log("TRUE");
                $('.modal-title').text("Tie for 2nd place!");
                $('.modal-body').children('p').text("Please select a team to finish in 2nd place.");
                var team = TEAMS.filter(obj => obj.team == group_standings[0].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col qualified" data-qualified=1>
                        <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                        <p>1st - ${team[0].team__name}</p>
                    </div>`
                )
                for(i=1; i<group_standings.length; i++) {
                    team = TEAMS.filter(obj => obj.team == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                            <p>T 2nd - ${team[0].team__name}</p>
                        </div>`
                    )
                }
            }
            // false true false
            if(groupLogic[0] === false && groupLogic[1] === true && groupLogic[2] === false) {
                console.log("TRUE");
                $('.modal-title').text("Tie for 2nd place!");
                $('.modal-body').children('p').text("Please select a team to finish in 2nd place.");
                team = TEAMS.filter(obj => obj.team == group_standings[0].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col qualified" data-qualified=1>
                        <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                        <p>1st - ${team[0].team__name}</p>
                    </div>`
                )
                for(i=1; i<group_standings.length-1; i++) {
                    team = TEAMS.filter(obj => obj.team == group_standings[i].team_id);
                    $('.modal-body').children('.row').append(
                        `<div class="col selectable">
                            <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                            <p>T 2nd - ${team[0].team__name}</p>
                        </div>`
                    )
                }
                team = TEAMS.filter(obj => obj.team == group_standings[3].team_id);
                $('.modal-body').children('.row').append(
                    `<div class="col eliminated">
                        <img class="img-thumbnail" data-team_id="${team[0].team}" src="${ team[0].team__crest_url }" alt="${ team[0].team__name } national flag">
                        <p>4th - ${team[0].team__name}</p>
                    </div>`
                )
            }
            $('.modal-body').find('img').parent('.selectable').click(function() {
                console.log("modelEl  = ", this);
                var qualifiedElements = $('.modal-body').find('.qualified');
                console.log("qualifiedElements = ", qualifiedElements);
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
                    console.log("qualified = ", qualified);
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
                console.log("first_place = ", first_place);
                var group_standings_refactored = [];
                group_standings_refactored[0] = group_standings.find(team => team.team_id == first_place);
                group_standings_refactored[1] = group_standings.find(team => team.team_id == second_place);
                group_standings.forEach(item => {
                    console.log("item = ", item.team_id)
                    if(item.team_id != first_place && item.team_id != second_place) {
                        group_standings_refactored.push(item)
                    }
                })
                
                myModal_1.hide();
                resolve([true, group_standings_refactored, image_positions]);
            });
            $('.close').click(function() {
                console.log("modal dismissed = ", match_clicked);
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
    var svg_1 = document.getElementById('svg_1');
    var svg_2 = document.getElementById('svg_2');
    var svg_3 = document.getElementById('svg_3');
    var last_16_col = $("#last_16");
    var last_16_matches = $("#last_16").find("[data-match]");
    var quart_final_matches = $("#quart_final").find("[data-match]");
    var semi_final_matches = $("#semi_final").find("[data-match]");
    var start_A;
    var waypoint_1A;
    var start_B;
    var waypoint_1B;
    var waypoint_2;
    var waypoint_3;
    var waypoint_4;
    var waypoint_5;
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
        var match_top = last_16_matches[index].getBoundingClientRect()['top'];
        var element_to = quart_final_matches[Math.floor(index/2)].getBoundingClientRect();

        start_A = '0,' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4));
        waypoint_1A = svg_1.offsetWidth/2 + ', '  + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4));

        start_B = '0,' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
        waypoint_1B = (svg_1.offsetWidth/2) + ', '  + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));

        if(index%2 === 1) {
            waypoint_2 = (svg_1.offsetWidth/2) + ', ' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)));
            waypoint_5 = (svg_1.offsetWidth) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)));
        } 
        else {
            waypoint_2 = (svg_1.offsetWidth/2) + ', ' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)));
            waypoint_5 = (svg_1.offsetWidth) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        }

        $(svg_1).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_5}"/>
                <polyline class="${$(this).children(':nth-child(5)').attr('id')}" points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_5}"/>   
            </svg>`
        )
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(5)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(5)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        } 
    })

    quart_final_matches.each(function(index) {
        var match_top = quart_final_matches[index].getBoundingClientRect()['top'];
        var element_to = semi_final_matches[Math.floor(index/2)].getBoundingClientRect();
                  
        start_A = '0,' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4));
        waypoint_1A = this.offsetWidth/4 + ', '  + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4));

        start_B = '0,' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
        waypoint_1B = (this.offsetWidth/4) + ', '  + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));

        waypoint_2 = (this.offsetWidth/4) + ', ' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));

        waypoint_5 = (this.offsetWidth) + ',' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));
        
        // console.log("LAST 8 this = ", $(this))
        // console.log("LAST 8 this = ", $(this).children(':nth-child(3)'))
        // console.log("LAST 8 this = ", $(this).children(':nth-child(3)').attr('id'))
        $(svg_2).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_5}"/>
                <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_5}"/>
            </svg>
            `
        )   
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(6)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }  
        
        
    })

    semi_final_matches.each(function(index) {
        // console.log("index = ", index)
        if(index == 0) {
            var match_top = this.getBoundingClientRect()['top'];
            var element_to = document.getElementById("final").getBoundingClientRect();
            // console.log("match_top = ", match_top)
                
            start_A = '0,' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4));
            waypoint_1A = svg_3.offsetWidth/2 + ', '  + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4));
    
            start_B = '0,' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
            waypoint_1B = (svg_3.offsetWidth/2) + ', '  + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
    
            waypoint_2 = (svg_3.offsetWidth/2) + ', ' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/2));
    
            waypoint_5 = (element_to["x"]) + 5 + ',' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            $(svg_3).find('#semi-final-one').append(
                `<svg>
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_5}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_5}"
                    style="fill:none;" />
                </svg>`
            )   
        }
        else {
            var semi_final_two = document.getElementById("semi-final-two");
            var match_top = this.getBoundingClientRect()['top'];
            var element_to = document.getElementById("final").getBoundingClientRect();
            // console.log("semi_final_two = ", semi_final_two);
            start_A = '0,' + ((match_top - semi_final_two.getBoundingClientRect()['top']) + (this.offsetHeight/4));
            waypoint_1A = svg_3.offsetWidth/2 + ', '  + ((match_top - semi_final_two.getBoundingClientRect()['top']) + (this.offsetHeight/4));
    
            start_B = '0,' + ((match_top - semi_final_two.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
            waypoint_1B = (svg_3.offsetWidth/2) + ', '  + ((match_top - semi_final_two.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
    
            waypoint_2 = (svg_3.offsetWidth/2) + ', ' + ((match_top - semi_final_two.getBoundingClientRect()['top']) + (this.offsetHeight/2));
    
            waypoint_5 = (element_to["x"]) + 5 + ',' + ((match_top - semi_final_two.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            $(svg_3).find('#semi-final-two').append(
                `<svg>
                    <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_5}"
                    style="fill:none;" />
                    <polyline class="${$(this).children(':nth-child(6)').attr('id')}" points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_5}"
                    style="fill:none;" />
                </svg>`
            )   
        }
        
        if($(this).children(':nth-child(3)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(3)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }
        
        if($(this).children(':nth-child(6)').hasClass('winner')) {
            let team_container_id = $(this).children(':nth-child(6)').attr('id');
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
        }   
        
    })
};

// Function when clicking on the yellow Group Index resets the group data 
$('.group-reset').click(function() {
    var group = $(this).parents('.group-container').attr('id');
    let images = $('#' + group).find('.header-images').children(':not(.group-reset)');
    console.log("images = ", images);
    // $.each(images, function() {
    //     console.log("this = ", this);
    //     $(this).find('input:first-child').val(null);
    // })
    // let teams = TEAMS.filter(team => team.team__group === group);
    // $('#' + group).find('.header-images').children(':not(.group-reset)').remove();
    // $.each(teams, function(index, team) {
    //     $('#' + group).find('.header-images').append(
    //         `<div class="col p-0 image-position" data-position="${index + 1}">
    //             <img class="p-0 img-thumbnail" data-team_id="${team.team}" src="${ team.team__crest_url }" alt="${ team.team__name } national flag">
    //         </div>`
    //     )
    // })
    $('#' + group).find("*").removeClass('match-selected selected loser')
    points_el = $('#' + group).find('[data-points]')
    $.each(points_el, function() {
        $(this).attr('data-points', 0).siblings('input').val(null)
    })
    $('#' + group).find('[data-match]').find('select:first').val(0);
    var team = TEAMS.filter(obj => obj.team__name == 'TBD');
    data = [{'match_id': group + '1', 'team_id': team[0].team}, {'match_id': group + '2', 'team_id': team[0].team}];
    prePopulateNextRound(data);
})

function getGroupOrder(group) {
    // Get all the header images and store the team_id to the array image_positions
    var image_positions = [];
    var group_standings = [];
    var table_images = $('#' + group).children('.header-images').find("img");
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
    // image_positions.reverse()

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
    console.log("group_standings.sort = ", group_standings)
    var team = TEAMS.filter(obj => obj.team__name == 'TBD');
    console.log("team = ", team)
    var data = [{'match_id': group + '1', 'team_id': team[0].team}, {'match_id': group + '2', 'team_id': team[0].team}]; 
    console.log("image_positions = ", image_positions) 
    moveImages(image_positions, group_standings)
    prePopulateNextRound(data) 
}

$('.knockout-team-container').click(function() {
    console.log("TEAM_TBD.team = ", TEAM_TBD[0].team);
    if($(this).find('p').text() != 'TBD') {
        var team_container_id = $(this).attr('id');
        if ($(this).hasClass('winner')) {
            $(this).removeClass('winner').parent().removeClass('match-selected'); 
            $(this).siblings().removeClass('loser');
            $(this).parent().find("select:first").val(null)
            $('.' + team_container_id).removeClass('d-none selectedPath').siblings().removeClass('d-none selectedPath');
            data = [{'match_id': 'W' + $(this).parents().attr('data-match'), 'team_id': TEAM_TBD[0].team}]
        }
        else {
            $(this).addClass('winner').removeClass('loser').parent().addClass('match-selected');
            $(this).siblings().addClass('loser').removeClass('winner');
            $(this).parent().find("select:first").val($(this).attr('data-team_id'))
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
            data = [{'match_id': 'W' + $(this).parent().attr('data-match'), 'team_id': $(this).attr('data-team_id')}]
        }  
        console.log("KO team-container data = ", data)       
        prePopulateNextRound(data);
    } 
})

function prePopulateNextRound(data) {
    console.log("prePopulateNextRound ", data)
    $.each(data, function() {
        var team = TEAMS.filter(obj => obj.team == this.team_id);
        console.log("this = ", this)
        console.log("team = ", team)
        if(this.match_id == 'W61' || this.match_id == 'W62') {
            if($("[data-match='" + this.match_id.slice(1) + "']").children().hasClass('winner')) {
                var loser = $("[data-match='" + this.match_id.slice(1) + "']").children('.knockout-team-container:not(.winner)');
                var losing_team = TEAMS.filter(obj => obj.team == loser.attr('data-team_id'));
                console.log("losing_team = ", losing_team)
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].team).prev().children().val(losing_team[0].team);
                $('#L' + this.match_id.slice(1)).parent().find("select:first").val(null);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].team).removeClass('winner loser').find('img').attr('src', losing_team[0].team__crest_url);
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner loser');
                $('#L' + this.match_id.slice(1)).parents().removeClass('match-selected');
                $('#L' + this.match_id.slice(1)).find('p').text(losing_team[0].team__name);
            }
            else {
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAM_TBD[0].team).prev().children().val(TEAM_TBD[0].team);
                $('#L' + this.match_id.slice(1)).parent().find("select:first").val(null);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAM_TBD[0].team).removeClass('winner loser').find('img').attr('src', TEAM_TBD[0].team__crest_url);
                $('#L' + this.match_id.slice(1)).parents().removeClass('match-selected');
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner loser');
            }
        }    
        $('#' + this.match_id).attr('data-team_id', this.team_id).prev().children().val(this.team_id);
        $('#' + this.match_id).parent().find("select:first").val(null)
        $('#' + this.match_id).attr('data-team_id', this.team_id).removeClass('winner loser').find('img').attr('src', team[0].team__crest_url);
        $('#' + this.match_id).parents().removeClass('match-selected')
        $('#' + this.match_id).siblings().removeClass('winner loser');
        $('#' + this.match_id).find('p').text(team[0].team__name);
        $('.' + this.match_id).siblings().addBack().removeClass('d-none selectedPath');

        const next_fixtures = nextFixtures(this.match_id);
        // console.log("next_fixtures = ", next_fixtures);
        next_fixtures.forEach(fixture => {
            // console.log("this next_fixtures = ", fixture);
            $('#' + fixture).attr('data-team_id', TEAM_TBD[0].team).removeClass('winner loser').find('img').attr('src', TEAM_TBD[0].team__crest_url);
            $('#' + fixture).parents().removeClass('match-selected')
            $('#' + fixture).find('p').text(TEAM_TBD[0].team__name);
            $('#' + fixture).siblings().removeClass('winner loser');
            $('.' + fixture).siblings().addBack().removeClass('d-none selectedPath');
            $('#' + fixture).prev().children().val(TEAM_TBD[0].team)
            $('#' + fixture).parent().find("select:first").val(null);
        })    
    })
    var matches_selected = $('.match-selected');
    // console.log('matches_selected = ', matches_selected)
    if(matches_selected.length == 64) {
        $('.submit-button').addClass('wizard-complete');
    }
    else {
        $('.submit-button').removeClass('wizard-complete');
    }
}

function nextFixtures(match_id) {
    var fixtures = [];
    console.log("match_id = ", match_id)
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
    // console.log("START moveImages()")
    
    image_positions.forEach((obj, index) => {
        var current_image_position =  index
        var group_position = group_standings.findIndex(elem => elem.team_id === obj['team_id'])
        var el = $('.header-images').find("img").filter(`[data-team_id='${obj['team_id']}']`)
        // Set the data attributes to the image elements with the new data-position attr values
        $(el).attr('data-position', group_position + 1)
        $(el).siblings().children('input').val(group_position + 1)
        console.log("el = ", $(el).siblings('input').children('input').val())
        var group_positions_moved = current_image_position - index
        // preAnimateSnapToPositions(el, group_positions_moved)
        group_positions_moved = current_image_position - group_position
        animate(el, group_positions_moved)
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
    let id = null;
    const elem = el[0];  
    let pos = 0;
    
    var img_width = elem.offsetWidth * Math.abs(group_positions_moved)
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

// Function to scroll page horizontally when nav button is clicked
// $('button').click(function() {
//     var headerHeight = $('header').height();
//     console.log("header height = ", headerHeight)
//     console.log("this", $(this))
//     // $(this).siblings().focus();
//     var elem = $(this).parents('section').siblings();
//     console.log("elem", elem)
//     var borderBox = elem[0].getBoundingClientRect();
//     console.log("borderBox = ", borderBox['x'])
//     window.scrollTo(borderBox['x'], headerHeight)
//     // $.scrollTo(borderBox['x'], headerHeight)
//     // setTimeout(window.scrollTo(borderBox['x'], headerHeight),1000);
// })

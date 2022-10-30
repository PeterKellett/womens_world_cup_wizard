console.log("Golden Route")

var MATCHES = {};
var TEAMS = {};
var SAVED_WIZARD = {};

// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu73.gitpod.io/get_wizard_data')
.then(response => response.json())
.then(data => {
    console.log("Fetch get_matches fired");
    MATCHES = data.matches;
    TEAMS = data.teams;
    SAVED_WIZARD = data.saved_wizard
    console.log("MATCHES: ", MATCHES);
    console.log("TEAMS: ", TEAMS);
    console.log("SAVED_WIZARD: ", SAVED_WIZARD);
    TEAMS.forEach((team, index) => {
        // console.log("TEAM = ", team)
            $('#' + team.group).children(':first').append(
                `<div class="col p-0 image-position" data-positions=${index%4 + 1}>
                    <img class="img-fluid h-100 p-0 table-image img-thumbnail" data-team_id="${team.id}" src="${ team.crest_url }" alt="${ team.name } national flag">
                </div>`
            )   
    })

    MATCHES.forEach(match => {
        if(match.home_team_score === match.away_team_score) {
            // $(`[data-match=${match.match_number}]`).children(':nth-child(4)').addClass('gold-border')
        }
    })
    
    SAVED_WIZARD.forEach(match => {
        if(match.match_number < 49) {
            // console.log("saved_wizard winner el = ", $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`))
            $(`[data-match=${match.match_number}]`).find(`[data-team_id=${match.winning_team}]`).addClass('selected').attr('data-points', 3).siblings(':not(input)').attr('data-points', 0).addClass('loser');
            if(match.winning_team == TEAMS[32]['id']) {
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
    
    

    $(".team-container").click(function () {
        // console.log("This team_id = ", $(this).attr('data-team_id'));
        // console.log("winning team input = ", $(this).parent().find('select'));
        var group = $(this).parents('.group-container').attr("id")
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected').attr('data-points', 0);
            $(this).siblings(':not(input)').attr('data-points', 0).removeClass('loser');
            $(this).parent().find("select:first").val(0);
            $(this).parent().removeClass('match-selected');
        } 
        else {
            $(this).addClass('selected').attr('data-points', 3).removeClass('loser');
            $(this).siblings(':not(input)').removeClass('selected').addClass('loser').attr('data-points', 0);
            // $(this).siblings().find('p').addClass('text-muted');
            $(this).parent().find("select:first").val($(this).attr('data-team_id'));
            $(this).parent().addClass('match-selected');
            if($(this).attr('data-team_id') == "draw") {
                console.log($(this).parent().find("select:first"))
                $(this).parent().find("select:first").val(TEAMS[32]['id'])
                $(this).siblings().attr('data-points', 1);
            }
        }
        getGroupOrder(group);
    }) 

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
    var start_A;
    var waypoint_1A;
    var start_B;
    var waypoint_1B;
    var waypoint_2;
    var waypoint_3;
    var waypoint_4;
    var waypoint_5;
    var svg_height = $("#last_16").outerHeight(true)
    $(svg_1).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )   
    $(svg_2).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )  
    $(svg_3).append(
        `<svg height=${svg_height} width=100%>
        
        </svg>`
    )  
    last_16_matches.each(function(index) {
        var match_top = last_16_matches[index].getBoundingClientRect()['top'];
        var element_to = quart_final_matches[Math.floor(index/2)].getBoundingClientRect();

        start_A = '0,' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4));
        waypoint_1A = this.offsetWidth/2 + ', '  + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4));

        start_B = '0,' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
        waypoint_1B = (this.offsetWidth/2) + ', '  + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));

        

        if(index%2 === 1) {
            waypoint_2 = (this.offsetWidth/2) + ', ' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)));
            waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)));
        } 
        else {
            waypoint_2 = (this.offsetWidth/2) + ', ' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)));
            waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        }

        // waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));

        // console.log("LAST 16 this = ", $(this))
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

        if(index < 2) {
            waypoint_3 = (this.offsetWidth/2) + ', ' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            waypoint_4 = (this.offsetWidth/2) + ',' + ((element_to['top'] - svg_2.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        } 
        else {
            waypoint_3 = (this.offsetWidth/2) + ', ' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            waypoint_4 = (this.offsetWidth/2) + ',' + ((element_to['top'] - svg_2.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        }

        waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_2.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        
        // console.log("LAST 8 this = ", $(this))
        // console.log("LAST 8 this = ", $(this).children(':nth-child(3)'))
        // console.log("LAST 8 this = ", $(this).children(':nth-child(3)').attr('id'))
        $(svg_2).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"/>
                <polyline class="${$(this).children(':nth-child(5)').attr('id')}" points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"/>
            </svg>
            `
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
    semi_final_matches.each(function(index) {
        var match_top = semi_final_matches[index].getBoundingClientRect()['top'];
        var element_to = semi_final_matches[Math.floor(index/2)].getBoundingClientRect();
            
        start_A = '0,' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4));
        waypoint_1A = this.offsetWidth/4 + ', '  + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4));

        start_B = '0,' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
        waypoint_1B = (this.offsetWidth/4) + ', '  + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));

        waypoint_2 = (this.offsetWidth/4) + ', ' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/2));

        if(index < 0) {
            waypoint_3 = (this.offsetWidth/4*3 - (this.offsetWidth/8)*(index%4)) + ', ' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            waypoint_4 = (this.offsetWidth/4*3  - (this.offsetWidth/8)*(index%4)) + ',' + ((element_to['top'] - svg_3.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        } 
        else {
            waypoint_3 = (this.offsetWidth/4*3 - (this.offsetWidth/8)*(3-index%4)) + ', ' + ((match_top - svg_3.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            waypoint_4 = (this.offsetWidth/4*3  - (this.offsetWidth/8)*(3-index%4)) + ',' + ((element_to['top'] - svg_3.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        }

        waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_3.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        
        // console.log("semi this = ", $(this))
        $(svg_3).find('svg').append(
            `<svg>
                <polyline class="${$(this).children(':nth-child(3)').attr('id')}" points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
                style="fill:none;" />
                <polyline class="${$(this).children(':nth-child(5)').attr('id')}" points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
                style="fill:none;" />
            </svg>
            `
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
};

// Function when clicking on the yellow Group Index resets the group data 
$('.group-reset').click(function() {
    var group = $(this).parents('.group-container').attr('id');
    let teams = TEAMS.filter(team => team.group === group);
    $('#' + group).find('.header-images').children(':not(.group-reset)').remove();
    teams.forEach(team => {
        $('#' + group).find('.header-images').append(
            `<div class="col p-0">
                <img class="img-fluid h-100 p-0 table-image img-thumbnail" data-team_id="${team.id}" src="${ team.crest_url }" alt="${ team.name } national flag">
            </div>`
        )
    })
    $('#' + group).find("*").removeClass('match-selected selected loser')
    points_el = $('#' + group).find('[data-points]')
    $.each(points_el, function() {
        $(this).attr('data-points', 0).siblings('input').val(null)
    })
    $('#' + group).find('[data-match]').find('select:first').val(0);
    var team = TEAMS.filter(obj => obj.name == 'TBD');
    data = [{'match_id': group + '1', 'team_id': team[0].id}, {'match_id': group + '2', 'team_id': team[0].id}];
    prePopulateNextRound(data)
})

function getGroupOrder(group) {
    // Get all the header images and store the team_id to the array image_positions
    console.log("getGroupOrder = ", group)
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
    if(selected.length == 6) {
        // Now a check on the final group standings needs to be done, and if the teams that occupy the top positions
        // are level on points then a modal is displayed asking the user to make a choice 
        //----TO BE COMPLETED----
        var groupLogic = [];
        group_standings.forEach((item, index) => {
            // console.log("item, index = ", item, index);
            if(index < group_standings.length - 1) {
                if(item['points'] == group_standings[index + 1]['points']) {
                    // console.log("TRUE")
                    // console.log("item['points']  = ", item['points'])
                    // console.log("group_standings[index + 1]['points'] = ", group_standings[index + 1]['points'])
                    groupLogic.push(true)
                }
                else {
                    groupLogic.push(false)
                    // console.log("FALSE")
                    // console.log("item['points']  = ", item['points'])
                    // console.log("group_standings[index + 1]['points'] = ", group_standings[index + 1]['points'])
                }
            }
            
        })
        if(selected.length == 6) {
            console.log("groupLogic = ", groupLogic);
            console.log("group_standings = ", group_standings);
            var myModal_1 = new bootstrap.Modal(document.getElementById('myModal-1'), {backdrop: false})
            var ordinals = ['st', 'nd', 'rd']
            myModal_1.show();
            $('.modal-body').children().empty();
            for(i = 0; i < groupLogic.length; i++) {
                if(groupLogic[i] === true) {
                    console.log("i, [i] = ", i, groupLogic[i]);
                    console.log(" 1st 'if' TRUE");
                    $('.modal-body').children().append(
                        `<p>Please select the team you wish to put in 1st place.</p>
                        <div class="col test">
                            <img class="img-thumbnail" data-team_id="${group_standings[i].team_id}" src="${ group_standings[i].crest_url }" alt="${ group_standings[i].name } national flag">
                            <p>(${i+1 + ordinals[i]}) - ${group_standings[i].name}</p>
                        </div>`
                    )
                    if(groupLogic[i+1] === true) {
                        console.log("i, [i] = ", i, groupLogic[i]);
                        console.log(" 2nd 'if' TRUE");
                    }
                    else {
                        console.log("i, [i] = ", i, groupLogic[i]);
                        console.log(" 2nd 'if' FALSE");
                    }
                }
                else {
                    console.log("i, [i] = ", i, groupLogic[i]);
                    console.log(" 1st 'if' FALSE");
                }
            }
        }
        
        var team1 = TEAMS.find(team => team.id == group_standings[0]['team_id']);
        var team2 = TEAMS.find(team => team.id == group_standings[1]['team_id']);
        // console.log("team1 = ", team1);
        // console.log("team2 = ", team2);
        if(group_standings[0]['points'] === group_standings[1]['points']) {
            // var myModal_1 = new bootstrap.Modal(document.getElementById('myModal-1'), {
            //     backdrop: false
                // })
            // myModal_1.show()
            // $('.modal-body').children().empty()
            // $('.modal-body').children().append(
            //     `<div class="row">
            //         <p>Please select the team you wish to put in 1st place.</p>
            //         <div class="col test">
            //             <img class="img-thumbnail" data-team_id="${team1.id}" src="${ team1.crest_url }" alt="${ team1.name } national flag">
            //             <p>${team1.name}</p>
            //         </div>
            //         <div class="col">
            //             <img class="img-thumbnail" data-team_id="${team2.id}" src="${ team2.crest_url }" alt="${ team2.name } national flag">
            //             <p>${team2.name}</p>
            //         </div>
            //     </div>`
            // )
        }
        $('#' + group).css('border', '1px solid green');
        data = [{'match_id': group + '1', 'team_id': team1.id}, {'match_id': group + '2', 'team_id': team2.id}];
    }
    else {
        $('#' + group).css('border', '1px solid #fff');
        var team = TEAMS.filter(obj => obj.name == 'TBD');
        data = [{'match_id': group + '1', 'team_id': team[0].id}, {'match_id': group + '2', 'team_id': team[0].id}];
    }
    

    // This is test functionality to see the what the calculated group standings are
    group_standings.forEach((obj, index) => {
        var team_name = TEAMS.filter(team => team.id === obj.team_id);   
        $('.table').append(
            `<div class="row">
                <div class="col-2">
                    <p>${team_name[0].name}</p>
                </div>
                <div class="col-2">
                    <p>${obj.points}</p>
                </div>
            </div>`
        )

    })
    
    moveImages(image_positions, group_standings)
    prePopulateNextRound(data)
}

$('.modal-body').click(async function() {
    console.log("MODEL IMG CLICKED")
})

$('.knockout-team-container').click(function() {
    // console.log("knockout-team-container");
    if($(this).find('p').text() != 'TBD') {
        var team_container_id = $(this).attr('id');
        if ($(this).hasClass('winner')) {
            $(this).removeClass('winner').parents().removeClass('match-selected'); 
            $(this).siblings().removeClass('loser');
            $(this).parent().find("select:first").val(null)
            $('.' + team_container_id).removeClass('d-none selectedPath').siblings().removeClass('d-none selectedPath');
            data = [{'match_id': 'W' + $(this).parents().attr('data-match'), 'team_id': TEAMS[32].id}]
        }
        else {
            $(this).addClass('winner').removeClass('loser').parents().addClass('match-selected');
            $(this).siblings().addClass('loser').removeClass('winner');
            $(this).parent().find("select:first").val($(this).attr('data-team_id'))
            $('.' + team_container_id).addClass('selectedPath').removeClass('d-none').siblings().addClass('d-none').removeClass('selectedPath');
            data = [{'match_id': 'W' + $(this).parent().attr('data-match'), 'team_id': $(this).attr('data-team_id')}]
        }         
        prePopulateNextRound(data);
    } 
})

function prePopulateNextRound(data) {
    // console.log("prePopulateNextRound ", data)
    $.each(data, function() {
        var team= TEAMS.filter(obj => obj.id == this.team_id);
        // console.log("this = ", this)
        // console.log("team = ", team)
        if(this.match_id == 'W61' || this.match_id == 'W62') {
            if($("[data-match='" + this.match_id.slice(1) + "']").children().hasClass('winner')) {
                var loser = $("[data-match='" + this.match_id.slice(1) + "']").children('.knockout-team-container:not(.winner)');
                var losing_team = TEAMS.filter(team => team.id == loser.attr('data-team_id'));
                console.log("losing_team = ", losing_team)
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].id).prev().children().val(losing_team[0].id);
                $('#L' + this.match_id.slice(1)).parent().find("select:first").val(null);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].id).removeClass('winner loser').find('img').attr('src', losing_team[0].crest_url);
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner loser');
                $('#L' + this.match_id.slice(1)).parents().removeClass('match-selected');
                $('#L' + this.match_id.slice(1)).find('p').text(losing_team[0].name);
            }
            else {
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAMS[32].id).prev().children().val(TEAMS[32].id);
                $('#L' + this.match_id.slice(1)).parent().find("select:first").val(null);
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAMS[32].id).removeClass('winner loser').find('img').attr('src', TEAMS[32].crest_url);
                $('#L' + this.match_id.slice(1)).parents().removeClass('match-selected');
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner loser');
            }
        }    
        $('#' + this.match_id).attr('data-team_id', this.team_id).prev().children().val(this.team_id);
        $('#' + this.match_id).parent().find("select:first").val(null)
        $('#' + this.match_id).attr('data-team_id', this.team_id).removeClass('winner loser').find('img').attr('src', team[0].crest_url);
        $('#' + this.match_id).parents().removeClass('match-selected')
        $('#' + this.match_id).siblings().removeClass('winner loser');
        $('#' + this.match_id).find('p').text(team[0].name);
        $('.' + this.match_id).siblings().addBack().removeClass('d-none selectedPath');

        const next_fixtures = nextFixtures(this.match_id);
        // console.log("next_fixtures = ", next_fixtures);
        next_fixtures.forEach(fixture => {
            // console.log("this next_fixtures = ", fixture);
            $('#' + fixture).attr('data-team_id', TEAMS[32].id).removeClass('winner loser').find('img').attr('src', TEAMS[32].crest_url);
            $('#' + fixture).parents().removeClass('match-selected')
            $('#' + fixture).find('p').text(TEAMS[32].name);
            $('#' + fixture).siblings().removeClass('winner loser');
            $('.' + fixture).siblings().addBack().removeClass('d-none selectedPath');
            $('#' + fixture).prev().children().val(TEAMS[32].id)
            $('#' + fixture).parent().find("select:first").val(null);
        })
        
        
    })
}

function nextFixtures(match_id) {
    var fixtures = [];
    // console.log("match_id = ", match_id)
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
        $(el).attr('data-position', group_position)
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
}

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


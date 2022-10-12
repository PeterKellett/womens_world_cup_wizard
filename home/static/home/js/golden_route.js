console.log("Golden Route")

var MATCHES = {};
var TEAMS = {};

//Function to draw the svg polylines to show the knockout route progress
$(function(){
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
    console.log("svg_1 = ", svg_1.getBoundingClientRect()['top']);
    last_16_matches.each(function(index) {
        var match_top = last_16_matches[index].getBoundingClientRect()['top'];
        var element_to = quart_final_matches[Math.floor(index/2)].getBoundingClientRect();

        start_A = '0,' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4));
        waypoint_1A = this.offsetWidth/4 + ', '  + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4));

        start_B = '0,' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
        waypoint_1B = (this.offsetWidth/4) + ', '  + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));

        waypoint_2 = (this.offsetWidth/4) + ', ' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/2));

        if(index < 4) {
            waypoint_3 = (this.offsetWidth/4*3 - (this.offsetWidth/8)*(index%4)) + ', ' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            waypoint_4 = (this.offsetWidth/4*3  - (this.offsetWidth/8)*(index%4)) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        } 
        else {
            waypoint_3 = (this.offsetWidth/4*3 - (this.offsetWidth/8)*(3-index%4)) + ', ' + ((match_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/2));
            waypoint_4 = (this.offsetWidth/4*3  - (this.offsetWidth/8)*(3-index%4)) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        }

        waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_1.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
        
        $(svg_1).find('svg').append(
            `<svg height=${svg_height} width=100%>
            <polyline points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
            style="fill:none;stroke:black;stroke-width:1"/>
            <polyline points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
            style="fill:none;stroke:black;stroke-width:1" />
            </svg>
            `
        )    
    })

    quart_final_matches.each(function(index) {
        var match_top = quart_final_matches[index].getBoundingClientRect()['top'];
        var element_to = semi_final_matches[Math.floor(index/2)].getBoundingClientRect();
        if(index < 4) {
            
            start_A = '0,' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4));
            waypoint_1A = this.offsetWidth/4 + ', '  + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4));

            start_B = '0,' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));
            waypoint_1B = (this.offsetWidth/4) + ', '  + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/4*3));

            waypoint_2 = (this.offsetWidth/4) + ', ' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));

            if(index < 2) {
                waypoint_3 = (this.offsetWidth/4*3 - (this.offsetWidth/8)*(index%4)) + ', ' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));
                waypoint_4 = (this.offsetWidth/4*3  - (this.offsetWidth/8)*(index%4)) + ',' + ((element_to['top'] - svg_2.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
            } 
            else {
                waypoint_3 = (this.offsetWidth/4*3 - (this.offsetWidth/8)*(3-index%4)) + ', ' + ((match_top - svg_2.getBoundingClientRect()['top']) + (this.offsetHeight/2));
                waypoint_4 = (this.offsetWidth/4*3  - (this.offsetWidth/8)*(3-index%4)) + ',' + ((element_to['top'] - svg_2.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
            }

            waypoint_5 = (this.offsetWidth) + ',' + ((element_to['top'] - svg_2.getBoundingClientRect()['top']) + element_to['height']/4 + (this.offsetHeight*(index%2)/2));
            
            $(svg_2).find('svg').append(
                `<svg height=${svg_height} width=100%>
                <polyline points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
                style="fill:none;stroke:black;stroke-width:1" />
                <polyline points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
                style="fill:none;stroke:black;stroke-width:1" />
                </svg>
                `
            )    
        }
        
    })
    semi_final_matches.each(function(index) {
        var match_top = semi_final_matches[index].getBoundingClientRect()['top'];
        var element_to = semi_final_matches[Math.floor(index/2)].getBoundingClientRect();
        if(index < 4) {
            
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
            
            $(svg_3).find('svg').append(
                `<svg height=${svg_height} width=100%>
                <polyline points="${start_A} ${waypoint_1A} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
                style="fill:none;stroke:black;stroke-width:1" />
                <polyline points="${start_B} ${waypoint_1B} ${waypoint_2} ${waypoint_3} ${waypoint_4} ${waypoint_5}"
                style="fill:none;stroke:black;stroke-width:1" />
                </svg>
                `
            )    
        }
    })
});
// $(function() {
//     var knockout_team_container = $('#last_16').find('.knockout-team-container');
//     var svg_height = $("#last_16").outerHeight(true)
//     console.log("knockout_team_container = ", knockout_team_container);
//     $(svg_1).append(
//         `<svg height=${svg_height} width=100%>
        
//         </svg>`
//     )   
//     // $(svg_2).append(
//     //     `<svg height=${svg_height} width=100%>
        
//     //     </svg>`
//     // )   
//     knockout_team_container.each(function() {
//         var start;
//         var waypoint_1;
//         var waypoint_2;
//         var waypoint_3;
//         var waypoint_4;
//         var end;
//         var container_top = this.getBoundingClientRect()['top'];
//         console.log("container_top = ", container_top)
        
//         start = '0,' + ((this.getBoundingClientRect()['top'] - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/2));
//         waypoint_1 = this.offsetWidth/4 + ', '  + ((container_top - svg_1.getBoundingClientRect()['top']) + (this.offsetHeight/2));
//         console.log("start = ", start);
//         $(svg_1).find('svg').append(
//             `<svg height=${svg_height} width=100%>
//             <polyline points="${start} ${waypoint_1} "
//             style="fill:none;stroke:black;stroke-width:1"/>
//             </svg>
//             `
//         )    
//     })
// })
// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu70.gitpod.io/get_matches')
.then(response => response.json())
.then(data => {
    console.log("Fetch get_matches fired");
    MATCHES = data.matches;
    TEAMS = data.teams;
    console.log("MATCHES: ", MATCHES);
    console.log("TEAMS: ", TEAMS);
    TEAMS.forEach(team => {
        // console.log("TEAM = ", team)
        $('#' + team.group).children().append(
            `<div class="col p-0">
        <img class="img-thumbnail" data-team_id="${team.id}" src="${ team.crest_url }" alt="${ team.name } national flag">
        </div>`
        )
    })
    MATCHES.forEach(match => {
        $("#" + match.group).append(
            `<div class='row justify-content-around gx-0' data-match=${match.match_number}>
                <div class="col team-container" data-points=0 data-team_id="${match.home_team}">
                    <p class="text-center">${ match.home_team__name }</p>
                </div>
                <div class='col team-container'>
                    <p class="text-center">Draw</p>
                </div>
                <div class='col team-container' data-points=0 data-team_id="${match.away_team}">
                    <p class="text-center">${ match.away_team__name }</p>
                </div>
            </div>`
        )
    })

    $(".team-container").click(function () {
        var group = $(this).parents('.group-container').attr("id")
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected').attr('data-points', 0)
            $(this).siblings().attr('data-points', 0).find('p').removeClass('text-muted')
        } else {
            $(this).addClass('selected').attr('data-points', 3).find('p').removeClass('text-muted')
            $(this).siblings().removeClass('selected').attr('data-points', 0)
            $(this).siblings().find('p').addClass('text-muted')
            if($(this).attr('data-team_id') == null) {
                $(this).siblings().attr('data-points', 1)
            }
        }
        
        // var test_get_points_elements = $('#A').find('[data-points]');
        // console.log("test_get_points_elements = ", test_get_points_elements)
        getGroupOrder(group);
    })   
})

// Function when clicking on the yellow Group Index resets the group data 
$('.group-reset').click(function() {
    var group = $(this).parents('.group-container').attr('id');
    let teams = TEAMS.filter(team => team.group === group);
    $('#' + group).find('.header-images').children(':not(.group-reset)').remove();
    teams.forEach(team => {
        $('#' + group).find('.header-images').append(
            `<div class="col p-0">
                <img class="img-thumbnail" data-team_id="${team.id}" src="${ team.crest_url }" alt="${ team.name } national flag">
            </div>`
        )
    })
    $('#' + group).find("*").removeClass('selected text-muted')
    points_el = $('#' + group).find('[data-points]')
    $.each(points_el, function() {
        $(this).attr('data-points', 0)
    })
})

function getGroupOrder(group) {
    // Get all the header images and store the team_id to the array image_positions
    var image_positions = [];
    var team_points = [];
    var table_images = $('#' + group).children('.header-images').find("img");
    var zero = 0;
    table_images.each(function (index, item) {
        zero++;
        // moveImages(index, item)
        // Check if the data-position attr is present. It will be empty on page load and group resets. Set to loop index value if empty
        var position;
        if($(item).data('position') === undefined) {
            position = index;
        }
        else {
            position = $(item).data('position')
        }
        image_positions.push({'team_id': $(item).data('team_id'), 'position': position});
        team_points.push({'team_id': $(item).data('team_id'), 'points': 0})
    })
    // image_positions.reverse()

    // METHOD 2 Get all elements by data-team_id and add up points and store each team_id: points object into the array team_points
    image_positions.forEach(obj => {
        var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${obj['team_id']}']`)
        $.each(elements, function() {
            team_points.find(team => team.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'))
        })
    })
    // GROUP SORT
    team_points.sort((a, b) => {        
        return b.points - a.points
    })

    // Get the amount of elements in the group that have the class .selected
    // This will tell us how many matches in the group that the user has indicated a result
    var selected = $('#' + group).find('.selected');
    // If the number of selected elements === 6, add some styling to the group border to indicate to the user that this group is complete.
    if(selected.length == 6) {
        // Now a check on the final group standings needs to be done, and if the teams that occupy the top positions
        // are level on points then a modal is displayed asking the user to make a choice ----TO BE COMPLETED----
        var team1 = TEAMS.find(team => team.id == team_points[0]['team_id']);
        var team2 = TEAMS.find(team => team.id == team_points[1]['team_id']);
        if(team_points[0]['points'] === team_points[1]['points']) {
            var myModal_1 = new bootstrap.Modal(document.getElementById('myModal-1'), {
                backdrop: false
                })
            console.log("myModal_1 =", myModal_1)
            myModal_1.show()
            $('.modal-body').children().empty()
            $('.modal-body').children().append(
                `<div class="row">
                    <p>Please select the team you wish to put in 1st place.</p>
                    <div class="col">
                        <img class="img-thumbnail" data-team_id="${team1.id}" src="${ team1.crest_url }" alt="${ team1.name } national flag">
                        <p class="text-center">${team1.name}</p>
                    </div>
                    <div class="col">
                        <img class="img-thumbnail" data-team_id="${team2.id}" src="${ team2.crest_url }" alt="${ team2.name } national flag">
                        <p class="text-center">${team2.name}</p>
                    </div>
                </div>`
            )
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
    team_points.forEach((obj, index) => {
        // console.log("index = ", index)
        // console.log("team_points.forEach = ", obj.team_id)
        var team_name = TEAMS.filter(team => team.id === obj.team_id);
        // console.log("tean_name = ", team_name)       
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
    
    moveImages(image_positions, team_points)
    prePopulateNextRound(data)
}

$('.knockout-team-container').click(function() {
    console.log("knockout-team-container");
    if($(this).find('p').text() != 'TBD') {
        if ($(this).hasClass('winner')) {
            $(this).removeClass('winner');
            $(this).siblings().find('p').removeClass('text-muted');
            $(this).siblings().find('img').removeClass('loser');
            data = [{'match_id': 'W' + $(this).parents().attr('data-match'), 'team_id': TEAMS[32].id}]
        }
        else {
            $(this).addClass('winner').find('p').removeClass('text-muted');
            $(this).addClass('winner').find('img').removeClass('loser');
            $(this).siblings().removeClass('winner');
            $(this).siblings().find('p').addClass('text-muted');
            $(this).siblings().find('img').addClass('loser');
            data = [{'match_id': 'W' + $(this).parent().attr('data-match'), 'team_id': $(this).attr('data-team_id')}]
        } 
           
        prePopulateNextRound(data);
    } 
})

function prePopulateNextRound(data) {
    console.log("prePopulateNextRound ", data)
    $.each(data, function() {
        var team = TEAMS.filter(obj => obj.id == this.team_id);
        const next_fixtures = nextFixtures(this.match_id);
        if(this.match_id == 'W61' || this.match_id == 'W62') {
            // match_id = this.match_id.slice(1)
            
            if($("[data-match='" + this.match_id.slice(1) + "']").children().hasClass('winner')) {
                console.log("YESSSS")
                var loser = $("[data-match='" + this.match_id.slice(1) + "']").children(':not(.winner)');
                console.log("loser = ", loser)
                console.log("loser = ", loser.attr('data-team_id'));
                let losing_team = TEAMS.filter(team => team.id == loser.attr('data-team_id'));
                console.log("losing_team = ", losing_team)
                $('#L' + this.match_id.slice(1)).attr('data-team_id', losing_team[0].id).removeClass('winner').find('img').removeClass('loser').attr('src', losing_team[0].crest_url);
                $('#L' + this.match_id.slice(1)).find('p').text(losing_team[0].name).addClass('mx-auto').removeClass('text-muted');
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner').find('img').removeClass('loser');
                $('#L' + this.match_id.slice(1)).siblings().find('p').removeClass('text-muted');
            }
            else {
                $('#L' + this.match_id.slice(1)).attr('data-team_id', TEAMS[32].id).removeClass('winner').find('img').removeClass('loser').attr('src', TEAMS[32].crest_url);
                $('#L' + this.match_id.slice(1)).find('p').text(TEAMS[32].name).removeClass('text-muted mx-auto');
                $('#L' + this.match_id.slice(1)).siblings().removeClass('winner').find('img').removeClass('loser');
                $('#L' + this.match_id.slice(1)).siblings().find('p').removeClass('text-muted');
            }
        }    
        next_fixtures.forEach(fixture => {
            // console.log("this next_fixtures = ", fixture);
            $('#' + fixture).attr('data-team_id', TEAMS[32].id).removeClass('winner').find('img').removeClass('loser').attr('src', TEAMS[32].crest_url);
            $('#' + fixture).find('p').text(TEAMS[32].name).removeClass('text-muted mx-auto');
            $('#' + fixture).siblings().removeClass('winner').find('img').removeClass('loser');
            $('#' + fixture).siblings().find('p').removeClass('text-muted');
        })

        $('#' + this.match_id).attr('data-team_id', this.team_id).removeClass('winner').find('img').removeClass('loser').attr('src', team[0].crest_url);
        $('#' + this.match_id).find('p').text(team[0].name).addClass('mx-auto').removeClass('text-muted');
        $('#' + this.match_id).siblings().removeClass('winner').find('img').removeClass('loser');
        $('#' + this.match_id).siblings().find('p').removeClass('text-muted');
        
    })
}

function nextFixtures(match_id) {
    console.log("match_id = ", match_id)
    var fixtures = [];
    for(i=0; i<4; i++) {
        fixtures.push('W' + $('#' + match_id).parents().attr('data-match'));
        fixtures.push('L' + $('#' + match_id).parents().attr('data-match'));
        match_id = fixtures[i];    
    }
    // fixtures.push('L61', 'L62')
    console.log("fixtures = ", fixtures)
    return fixtures;
}

function moveImages(image_positions, team_points) {
    console.log("START moveImages()")
    
    image_positions.forEach((obj, index) => {
        // console.log("for loop starts image_positions")
        // console.log("obj.position", obj, obj.team_id, obj.position)
        
        // console.log("index", index)
        var current_image_position =  index//obj['position']  // image_positions[obj]['position']
        var group_position = team_points.findIndex(elem => elem.team_id === obj['team_id'])
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
//     console.log("preAnimateSnapToPositions()")
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


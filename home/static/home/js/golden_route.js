console.log("Golden Route")

var MATCHES = {};
var TEAMS = {};
// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu67.gitpod.io/get_matches')
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
            `<div class='row justify-content-around gx-0'>
            <div class="col team-container" data-points=0 data-team_id="${match.home_team}">
                <p class="text-center">${ match.home_team__abbreviated_name }</p>
            </div>
            <div class='col team-container'>
                <p class="text-center">Draw</p>
            </div>
            <div class='col team-container' data-points=0 data-team_id="${match.away_team}">
                <p class="text-center">${ match.away_team__abbreviated_name }</p>
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
        
        var test_get_points_elements = $('#A').find('[data-points]')//.data();
        console.log("test_get_points_elements = ", test_get_points_elements)
        getGroupOrder(group);
    })

    
})

$('.group-reset').click(function() {
    var group = $(this).parents('.group-container').attr('id');
    let teams = TEAMS.filter(team => team.group === group);
    $('#' + group).find('.header-images').children(':not(.group-reset)').remove()
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

    // METHOD 2 Get all elements by data-team_id and add up points and store each team_id: points object in the array team_points

    image_positions.forEach(obj => {
        console.log("START for(obj in image_positions) This is to total up the number of points for each team_id in the image_positions array")
        var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${obj['team_id']}']`)
        $.each(elements, function() {
            team_points.find(team => team.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'))
        })
    })
    team_points.sort((a, b) => {
        return b.points - a.points
    })
    $('.table').empty()
    team_points.forEach(obj => {
        console.log("team_points.forEach = ", obj.team_id)
        var team_name = TEAMS.filter(team => team.id === obj.team_id);
        console.log("tean_name = ", team_name)       
        $('.table').append(
            `<div class="row">
                <div class="col-3">
                    <p>${team_name[0].name}</p>
                </div>
                <div class="col-3">
                    <p>${obj.points}</p>
                </div>
            </div>`
        )

    })
    
    moveImages(image_positions, team_points)
    // prePopulateNextRound(data)
}

function moveImages(image_positions, team_points) {
    console.log("START moveImages()")
    
    image_positions.forEach((obj, index) => {
        console.log("for loop starts image_positions")
        console.log("obj.position", obj, obj.team_id, obj.position)
        
        console.log("index", index)
        var current_image_position = index //obj['position'] //image_positions[obj]['position']
        var group_position = team_points.findIndex(elem => elem.team_id === obj['team_id'])
        var el = $('.header-images').find("img").filter(`[data-team_id='${obj['team_id']}']`)
        // Set the data attributes to the image elements with the new data-position attr values
        $(el).attr('data-position', group_position)
        var group_positions_moved = current_image_position - group_position
        animate(el, group_positions_moved)
    })   
}

function animate(el, group_positions_moved) {
    console.log("ANIMATE")
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
console.log("Golden Route")

var MATCHES = {};
var TEAMS = {};
// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu67.gitpod.io/get_matches')
.then(response => response.json())
.then(data => {
    console.log("Fetch get_matches fired");
    console.log("MATCHES: ", MATCHES);
    console.log("TEAMS: ", TEAMS);
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
        console.log(".team-container 'data-team_id'= ", $(this).attr('data-team_id'))
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
        getGroupOrder(group);
    })

    
})

$('.group-reset').click(function() {
    console.log("GROUP RESET222222")
    var group = $(this).parents('.group-container').attr('id');
    console.log("group = ", group)
    let teams = TEAMS.filter(team => team.group === group);
    $('#' + group).find('.header-images').children(':not(.group-reset)').remove()
    // $('#' + group).find('.group-reset').children().text(group)
    teams.forEach(team => {
        // console.log("TEAM = ", team)
        $('#' + group).find('.header-images').append(
            `<div class="col p-0">
                <img class="img-thumbnail" data-team_id="${team.id}" src="${ team.crest_url }" alt="${ team.name } national flag">
            </div>`
        )
    })
    $('#' + group).find("*").removeClass('selected text-muted')
})

function getGroupOrder(group) {
    // Get all the header images and store the team_id to the array image_positions
    console.log("group = ", group)
    var image_positions = [];
    var team_points = [];
    var table_images = $('#' + group).children('.header-images').find("img");
    console.log("table_images = ", table_images)
    $.each(table_images, function (index, item) {
        // console.log("each table_image = ", index, item)
        // moveImages(index, item)
        image_positions.push({'team_id': $(item).data('team_id'), 'position': ($(item).data('position'), index)});
        console.log("image_positions = ", image_positions)
        team_points.push({'team_id': $(item).data('team_id'), 'points': 0})
    })
    // image_positions.reverse()
    // console.log("image_positions = ", image_positions)
    // console.log("team_points = ", team_points)
    // image_positions.reverse()
    // console.log("image_positions = ", image_positions)

    // METHOD 2 Get all elements by data-team_id and add up points 
    for(x in image_positions) {
        console.log("image_positions[x] = ", image_positions[x]['team_id'])
        var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${image_positions[x]['team_id']}']`)
        console.log("elements = ", elements)
        $.each(elements, function() {
            team_points.find(x => x.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'))
        })
    }
    team_points.sort((a, b) => {
        return b.points - a.points
    })
    console.log("team_points after sort = ", team_points)
    moveImages(image_positions, team_points)
    // prePopulateNextRound(data)
}

function moveImages(image_positions, team_points) {
    console.log("image_positions = ", image_positions)
    console.log("team_points = ", team_points)
    for(x in image_positions) {
        var el = $('.header-images').find("img").filter(`[data-team_id='${image_positions[x]['team_id']}']`)
        console.log("el = ", el[0])
        // console.log("x = ", x, image_positions[x])
        var place = team_points.findIndex(elem => elem.team_id === image_positions[x]['team_id'])
        console.log("place = ", place)
        $(el).attr('data-position', place)
        var places_moved = x - place
        console.log("places_moved = ", places_moved)
        animate(el, places_moved)
        // console.log("el = ", el)
    }
    
}

function animate(el, places_moved) {
    // console.log("ANIMATE")
    // console.log("el[0] = ", el[0])
    // console.log("places_moved = ", places_moved)
    let id = null;
    const elem = el[0];   
    let pos = 0;
    
    var img_width = elem.offsetWidth * Math.abs(places_moved)
    // console.log("img_width = ", img_width)
    clearInterval(id);
    id = setInterval(frame, 10);

    function frame() {
        console.log("frame")
        if (pos == img_width) {
            clearInterval(id);
        } 
        else if(places_moved > 0) {
            pos++;
            // elem.style.top = pos + "px"; 
            elem.style.right = pos + "px";
        }
        else if(places_moved < 0) {
            pos++;
            // elem.style.top = pos + "px"; 
            elem.style.left = pos + "px";
        }
    }
}
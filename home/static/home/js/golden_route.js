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
        // console.log(".team-container 'data-team_id'= ", $(this).attr('data-team_id'))
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
        
        var test_get_points_elements = $('#A').find('[data-points]').filter(item => $(item).data('points') == 0);
        console.log("test_get_points_elements = ", test_get_points_elements)
        getGroupOrder(group);
    })

    
})

$('.group-reset').click(function() {
    var group = $(this).parents('.group-container').attr('id');
    console.log("group = ", group)
    let teams = TEAMS.filter(team => team.group === group);
    $('#' + group).find('.header-images').children(':not(.group-reset)').remove()
    teams.forEach(team => {
        // console.log("TEAM = ", team)
        $('#' + group).find('.header-images').append(
            `<div class="col p-0">
                <img class="img-thumbnail" data-team_id="${team.id}" src="${ team.crest_url }" alt="${ team.name } national flag">
            </div>`
        )
    })
    $('#' + group).find("*").removeClass('selected text-muted')
    points_el = $('#' + group).find('[data-points]')//.data('points', 0)
    console.log("points_el = ", points_el)
    $.each(points_el, function() {
        $(this).attr('data-points', 0)
    })
})

function getGroupOrder(group) {
    // Get all the header images and store the team_id to the array image_positions
    console.log("getGroupOrder() START")
    var image_positions = [];
    console.log("INITIAL image_positions = ", image_positions)
    var team_points = [];
    console.log("INITIAL team_points = ", team_points)
    var table_images = $('#' + group).children('.header-images').find("img");
    console.log("table_images = ", table_images)
    var zero = 0;
    table_images.each(function (index, item) {
        console.log("zero = ", zero)
        zero++;
        console.log("each table_image = ", index, item)
        // moveImages(index, item)
        // Check if the data-position attr is present. It will be empty on page load and group resets. Set to loop index value if empty
        // console.log($(item).data('position')) 
        var position;
        console.log("position", position)
        if($(item).data('position') === undefined) {
            position = index;
        }
        else {
            position = $(item).data('position')
        }
        image_positions.push({'team_id': $(item).data('team_id'), 'position': position});
        console.log("image_positions = ", image_positions)
        console.log("image_positions[index] = ", image_positions[index])
        team_points.push({'team_id': $(item).data('team_id'), 'points': 0})
        console.log("team_points = ", team_points)
        console.log("team_points[index] = ", team_points[index])
    })
    // image_positions.reverse()
    console.log("image_positions!!!! = ", image_positions)
    // console.log("team_points = ", team_points)
    // image_positions.reverse()
    // console.log("image_positions = ", image_positions)

    // METHOD 2 Get all elements by data-team_id and add up points and store each team_id: points object in the array team_points

    image_positions.forEach(obj => {
        console.log("START for(obj in image_positions) This is to total up the number of points for each team_id in the image_positions array")
        console.log("obj = ", obj)
        var elements = $('#' + group).find("div[data-team_id").filter(`div[data-team_id='${obj['team_id']}']`)
        console.log("elements = ", elements)
        $.each(elements, function() {
            console.log(".each element in image_positions = ", this)
            team_points.find(team => team.team_id == $(this).attr('data-team_id')).points += Number($(this).attr('data-points'))
            console.log("team_points during sort team_points.find() = ", team_points)
        })
    })
    team_points.sort((a, b) => {
        return b.points - a.points
    })
    console.log("team_points after sort = ", team_points)
    moveImages(image_positions, team_points)
    // prePopulateNextRound(data)
}

function moveImages(image_positions, team_points) {
    console.log("START moveImages()")
    console.log("image_positions = ", image_positions)
    console.log("team_points = ", team_points)
    
    image_positions.forEach((obj, index) => {
        console.log("for loop starts image_positions")
        console.log("obj, index = ", obj, index)
        var current_image_position = index //obj['position'] //image_positions[obj]['position']
        var group_position = team_points.findIndex(elem => elem.team_id === obj['team_id'])
        console.log("current_image_position = ", current_image_position)
        console.log("current group_position = ", group_position)
        var el = $('.header-images').find("img").filter(`[data-team_id='${obj['team_id']}']`)
        console.log("el = ", el)
        // Set the data attributes to the image elements with the new data-position attr values
        $(el).attr('data-position', group_position)
        var group_positions_moved = current_image_position - group_position
        console.log("group_positions_moved = ", group_positions_moved)
        animate(el, group_positions_moved)
        // console.log("el = ", el)
    })   
}

function animate(el, group_positions_moved) {
    console.log("ANIMATE")
    // console.log("el[0] = ", el[0])
    // console.log("group_positions_moved = ", group_positions_moved)
    let id = null;
    const elem = el[0];  
    //const box = elem.getBoundingClientRect();
    // console.log("box = ", box) 
    let pos = 0;
    
    var img_width = elem.offsetWidth * Math.abs(group_positions_moved)
    console.log("img_width = ", img_width)
    clearInterval(id);
    id = setInterval(frame, 10);

    function frame() {
        console.log("(pos and img_width) = ", pos, img_width)
        console.log("group_positions_moved = ", group_positions_moved)
        console.log("elem = ", elem)
        if (pos == img_width) {
            console.log("BREAK!!!!")
            console.log("group_positions_moved = ", group_positions_moved)
            console.log("elem = ", elem)
            clearInterval(id);
        }
        // Positive group_position_moved slides element left
        if(group_positions_moved > 0) {
            // pos++;
            console.log("MOVE LEFT")
            // $(elem).css({'right': pos + 'px'})
            elem.style.transform = "translateX(" + -pos + "px)";
        }
        // Negative group_position_moved slides element right
        if(group_positions_moved == 0) {
            // pos++;
            elem.style.transform = "translateX(1px)";
            elem.style.transform = "translateX(-1px)";
        }
        // Negative group_position_moved slides element right
        if(group_positions_moved < 0) {
            // pos++;
            elem.style.transform = "translateX(" + pos + "px)";
        }
        pos++;
    }
}
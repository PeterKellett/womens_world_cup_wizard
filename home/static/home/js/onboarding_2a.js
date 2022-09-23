var TEAMS = {};
// Fetch all tema and sort into groups
fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu67.gitpod.io/get_teams')
.then(response => response.json())
.then(data => {
    // console.log("Fetch get_teams fired");
    TEAMS = data.teams;
    // console.log("TEAMS: ", typeof(TEAMS));
    TEAMS.forEach(team => {
        // console.log("element =", team.group)
        $("#group_" + team.group).append(
            `<div class="draggable row match-container" data-team_id="${ team.id }" draggable="true">
                <div class="col-9 d-flex align-items-center team-container">
                    <p>
                        <i class="fa-solid fa-grip-lines d-inline"></i>
                        <span class="group-position"></span>
                         - ${ team.name }
                    </p>
                </div>  
                <div class="col-3"><img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ team.crest_url }" alt="${ team.name } national flag"></div>                     
            </div>`  
        )
    })
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.group-container');
    let draggableIndex;
    let containerIndex;
    // console.log("draggables = " + draggables)
    // console.log("containers = " + containers)
    draggables.forEach(draggable => {
        // console.log("draggable = " + draggable)
        draggable.addEventListener('dragstart', e => {
            draggableIndex = e.target.parentElement.id;
            // console.log("draggableIndex = " + draggableIndex)
            draggable.classList.add('dragging');
            //console.log("drag-start")
        })
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            // console.log("draggable = ", draggable)
            const data = []
            var selected_items = $(draggable).parent().children('.selected');
            $.each(selected_items, function() {
                data.push((this.dataset))
                console.log(("data =", data))
            })
            console.log("team_id = ", data)
            console.log("team_id = ", typeof(data))
            // console.log("next_round_place = ", next_round_place)

            prePopulateNextRound(data);
            
        })
    })
    containers.forEach(container => {
        // console.log("container.id = " + container.id)
        container.addEventListener('dragover', e => {
            containerIndex = e.target.parentElement.id;
            if(draggableIndex == containerIndex) {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY)
                const draggable = document.querySelector('.dragging');
                group_positions = container.getElementsByClassName('group-position');
                // console.log("group_positions = ", group_positions)
                for (let i = 0; i < group_positions.length; i++) {
                    if (i < 2) {
                        if(i == 0) {
                            $(group_positions[i]).parents('.draggable').addClass("selected").attr('data-next_round_place', containerIndex + (i + 1) + "a");
                            $(group_positions[i]).parent().removeClass("text-danger")
                        }
                        if(i == 1) {
                            $(group_positions[i]).parents('.draggable').addClass("selected").attr('data-next_round_place', containerIndex + (i + 1) + "b");
                            $(group_positions[i]).parent().removeClass("text-danger")
                        }                   
                    }
                    else {
                        $(group_positions[i]).parent().addClass("text-danger")
                        $(group_positions[i]).parents('.draggable').removeClass("selected").removeAttr('data-next_round_place')
                    }
                    
                    group_positions[i].innerHTML = i + 1;
                }
                if (afterElement == null) {
                    container.appendChild(draggable);
                }
                else {
                    container.insertBefore(draggable, afterElement)
                }
                
            }
            else {
                // console.log("FALSE")
            }
            
        })
    })
        
    function getDragAfterElement(container, y) {
        // console.log("getDragAfterElement = ")
        // console.log("container = ", container)
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')] //[...] Declares and forms an array
        // console.log("draggableElements = ", draggableElements)
        for(let i = 0; i < draggableElements.length; i++) {
            // console.log("i = ", i, draggableElements[i].getBoundingClientRect())
        }
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            // console.log("box = ", box)
            // console.log("y = ", y)
            const offset = y - box.top - box.height / 2
            // console.log("offset = ", offset)
            if(offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            }
            else {
                return closest
            } 
        }, { offset: Number.NEGATIVE_INFINITY }).element

    }
})

// Functionality to flip-flop the css for chosen/not chosen teams in the knockout rounds
$(".team-container").click(function() {
    console.log($(this).siblings('.team-container').find('p'))
    $(this).find('p').parent().toggleClass('selected')
    $(this).siblings('.team-container').find('p').toggleClass('text-muted')

    if ($(this).siblings('.team-container').find('p').parent().hasClass('selected')) {
        $(this).siblings('.team-container').find('p').parent().removeClass('selected')
        $(this).find('p').removeClass('text-muted')
    }

    const data = [{"team_id": $(this).find('.selected').attr('data-team_id'),
                "next_round_place": $(this).parents('.match-container').attr('data-next_round_place')}];
    // var next_round_place = $(this).parents('.match-container').attr('data-next_round_place');
    prePopulateNextRound(data)
})

// Functionality to prepopulate the chosen team in next round
function prePopulateNextRound(data) {
    console.log("data = ", data)
    $.each(data, function() {
        var team = TEAMS.filter(obj => obj.id == this.team_id);
        console.log("team = ", team)
        var prev_team_replaced = $("#" + this.next_round_place).find("div[data-team_id]").data('team_id')
        console.log("prev_team_replaced = ", prev_team_replaced)
        console.log("nextAll = ", $(this.next_round_place).parents('.section-container').nextAll())
        $.each($("#" + this.next_round_place).parents('.section-container').nextAll(), function() {
            console.log("this = ", $(this).find("div[data-team_id]").attr('data-team_id'))

            if($(this).find("div[data-team_id]").attr('data-team_id') == prev_team_replaced) {
                var siblings = $(this).find("div[data-team_id=" + prev_team_replaced + "]").parents('.match-container')/*.find('.col-9').removeClass('selected')*/.find('p')/*.addClass('text-muted')*/
                console.log("siblings = ", siblings)
                $(this).find("div[data-team_id=" + prev_team_replaced + "]").parents('.match-container').find('.col-9').removeClass('selected')
                $(this).find("div[data-team_id=" + prev_team_replaced + "]").parents('.match-container').find('p').removeClass('text-muted')
                $(this).find("div[data-team_id=" + prev_team_replaced + "]").parent().empty()
                
            }
            else {
                // console.log("NOO")
            }
        })
        // console.log("next_all = ", next_all)
        $("#" + this.next_round_place).empty()
        if(this.team_id && this.next_round_place) {
            var a_or_b = this.next_round_place.slice(-1,)
            if(a_or_b == "a") {
                $("#" + this.next_round_place).append(
                    `<div class="row">
                        <div class="col-3">
                            <img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                        </div>
                        <div class="col-9 d-flex align-items-center" data-team_id=${team[0].id}>
                            <p class="mx-auto">${ team[0].name }</p>
                        </div>  
                    </div>`
                )
            }            
            else {
                $("#" + this.next_round_place).append(
                    `<div class="row">
                        <div class="col-9 d-flex align-items-center" data-team_id=${team[0].id}>
                            <p class="mx-auto">${ team[0].name }</p>
                        </div>  
                        <div class="col-3">
                            <img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ team[0].crest_url }" alt="${ team[0].name } national flag">
                        </div>
                    </div>`
                )
            }
        }
        else {
            // Functionality required to clear any future data when a team is unselected or repositioned
        }
    })
    
}

// 3rd place playoff
function getFinalTeams() {
    console.log("getFinalTeams");
    var final_teams = [];
    var third_place_teams = [];
    $("#SF_1").empty();
    $("#SF_2").empty();
    $("#SFL_1").empty();
    $("#SFL_2").empty();
    var thirdPlaceTeams = document.querySelectorAll('.semi-final .team:not(.selected)')
    thirdPlaceTeams.forEach(item => {
        console.log("item.id = ", item.getAttribute('data-id'))
        third_place_teams.push(item.getAttribute('data-id'))
        console.log("third_place_teams = ", third_place_teams)
    })
    var finalTeams = document.querySelectorAll('.semi-final .selected')
    console.log("finalTeams", finalTeams)
    finalTeams.forEach(item => {
        console.log("item.id = ", item.getAttribute('data-id'))
        final_teams.push(item.getAttribute('data-id'))
        console.log("final_teams = ", final_teams)
    })
    
    if(final_teams.length < 2) {
        $('.semi-final').css('border', '1px solid red').find('.semi-final-text').addClass('error')
    }
    else {
        $(".semi-final").css('border', 'none')
        $(".semi-final-text").removeClass('error')
        var SFL_1 = TEAMS.filter(obj => obj.id == third_place_teams[0]);
        $("#SFL_1").append(
            `<div class="row">
                <div class="col-3">
                    <img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ SFL_1[0].crest_url }" alt="${ SFL_1[0].name } national flag">
                </div>
                <div class="col-9 d-flex align-items-center team" data-id=${SFL_1[0].id}>
                    <p class="mx-auto">${ SFL_1[0].name }</p>
                </div>  
            </div>`
        )

        var SFL_2 = TEAMS.filter(obj => obj.id == third_place_teams[1]);
        $("#SFL_2").append(
            `<div class="row">
                <div class="col-9 d-flex align-items-center team" data-id=${SFL_2[0].id}>
                    <p class="mx-auto">${ SFL_2[0].name }</p>
                </div>  
                <div class="col-3">
                    <img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ SFL_2[0].crest_url }" alt="${ SFL_2[0].name } national flag">
                </div>
            </div>`
        )

        var SF_1 = TEAMS.filter(obj => obj.id == final_teams[0]);
        $("#SF_1").append(
            `<div class="row">
                <div class="col-3">
                    <img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ SF_1[0].crest_url }" alt="${ SF_1[0].name } national flag">
                </div>
                <div class="col-9 d-flex align-items-center team" data-id=${SF_1[0].id}>
                    <p class="mx-auto">${ SF_1[0].name }</p>
                </div>  
            </div>`
        )

        var SF_2 = TEAMS.filter(obj => obj.id == final_teams[1]);
        $("#SF_2").append(
            `<div class="row">
                <div class="col-9 d-flex align-items-center team" data-id=${SF_2[0].id}>
                    <p class="mx-auto">${ SF_2[0].name }</p>
                </div>  
                <div class="col-3">
                    <img class="img-fluid h-100 p-0 table-image img-thumbnail" src="${ SF_2[0].crest_url }" alt="${ SF_2[0].name } national flag">
                </div>
            </div>`
        )
    }
}
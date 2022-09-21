//https://github.com/WebDevSimplified/Drag-And-Drop/blob/master/script.js
console.log("drag-drop.js")
var groups = true;
var last16 = false;
var quarterFinal = false;
var semiFinal = false;
var thirdPlacePlayoff = false;
var final = false;
var TEAMS;

fetch('https://8000-peterkellet-predictorga-2uxbvdp8ujm.ws-eu64.gitpod.io/get_teams')
.then(response => response.json())
.then(data => {
    console.log("Fetch get_teams fired");
    TEAMS = data.teams;
    console.log("TEAMS: ", TEAMS);
    // TEAMS.forEach(element => {
    //     console.log("element =", element.group)
    //     $("#group_" + element.group).append(
    //         `<p>${element.name}</p>`    
    //     )
    var result = TEAMS.filter(obj=> obj.id == '1');
    console.log(result[0].name);
});

if (groups) {
    console.log("groups = TRUE")
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
            console.log("draggableIndex = " + draggableIndex)
            draggable.classList.add('dragging');
            //console.log("drag-start")
        })
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            getLast16Teams(this);
        })
    })
    containers.forEach(container => {
        console.log("container.id = " + container.id)
        container.addEventListener('dragover', e => {
            containerIndex = e.target.parentElement.id;
            console.log("containerIndex = " + containerIndex)
            if(draggableIndex == containerIndex) {
                // console.log("TRUE");
                e.preventDefault();
                // const allDraggableElements = [...container.querySelectorAll('.draggable')] //[...] forms an array
                // console.log("allDraggableElements.len = " + allDraggableElements)
                // for (let item in allDraggableElements[0]) {
                //     console.log("item = " + item)
                // }
                const afterElement = getDragAfterElement(container, e.clientY)
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                }
                else {
                    container.insertBefore(draggable, afterElement)
                }
                group_positions = container.getElementsByClassName('group-position');
                console.log("group_positions = ", group_positions)
                for (let i = 0; i < group_positions.length; i++) {
                    group_positions[i].innerHTML = i + 1;
                    if (i < 2) {
                        group_positions[i].parentNode.classList.add("text-success")
                        group_positions[i].parentNode.parentNode.parentNode.classList.add("bg-light")
                        group_positions[i].parentNode.classList.remove("text-danger")
                    }
                    else {
                        group_positions[i].parentNode.classList.remove("text-success")
                        group_positions[i].parentNode.parentNode.parentNode.classList.remove("bg-light")
                        group_positions[i].parentNode.classList.add("text-danger")
                    }
                }
            }
            else {
                console.log("FALSE")
            }
            
        })
    })
    
    function getDragAfterElement(container, y) {
        console.log("getDragAfterElement = " +  y)
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')] //[...] forms an array
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            console.log(offset)
            if(offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            }
            else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    
    }

    function getLast16Teams() {
        console.log("containers = ", containers)
        $("#last16_1").empty();
        $("#group_A_2").empty();
        $("#group_B_1").empty();
        $("#group_B_2").empty();
        $("#group_C_1").empty();
        $("#group_C_2").empty();
        $("#group_D_1").empty();
        $("#group_D_2").empty();
        $("#group_E_1").empty();
        $("#group_E_2").empty();
        $("#group_F_1").empty();
        $("#group_F_2").empty();
        $("#group_G_1").empty();
        $("#group_G_2").empty();
        $("#group_H_1").empty();
        $("#group_H_2").empty();
        var group_A_1 = containers[0].children[0].getAttribute('data-id');
        A_1 = TEAMS.filter(obj => obj.id == group_A_1);
        console.log("A_1 = ", A_1[0].name)
        var group_A_2 = containers[0].children[1].getAttribute('data-id');
        A_2 = TEAMS.filter(obj => obj.id == group_A_2);
        var group_B_1 = containers[1].children[0].getAttribute('data-id');
        B_1 = TEAMS.filter(obj => obj.id == group_B_1);
        var group_B_2 = containers[1].children[1].getAttribute('data-id');
        B_2 = TEAMS.filter(obj => obj.id == group_B_2);

        // console.log("A_1 = ", TEAMS)
        // console.log("containers[0].children[0] = ", containers[0].children[0].getAttribute('data-id')
        $("#last16_1").append(
            `<div class="container text-center match-form">
            <div class="row">
                <div class="col-12 col-md-6">
                    <p>Last 16 match 1</p>
                </div>
            </div>
            <div class="row g-0 align-items-center">
                <div class="col-2">
                    <img class="" src="${ A_1[0].crest_url }" alt="${ A_1[0].name } national flag">
                </div>
            <div class="col">
                <p>${ A_1[0].name }</p>
            </div>
            <div class="col-1">
                <p> V</p>
            </div>
            <div class="col">
                <p>${ B_2[0].name }</p>
            </div>
            <div class="col-2">
                <img class="img-fluid h-100" src="${ B_2[0].crest_url }" alt="${ B_2[0].name } national flag">
            </div>
        </div>
        </div>`
        )
        // document.getElementById("group_A_2").appendChild(containers[0].children[1].cloneNode(true))
        // document.getElementById("group_B_1").appendChild(containers[1].children[0].cloneNode(true))
        // document.getElementById("group_B_2").appendChild(containers[1].children[1].cloneNode(true))
        // document.getElementById("group_C_1").appendChild(containers[2].children[0].cloneNode(true))
        // document.getElementById("group_C_2").appendChild(containers[2].children[1].cloneNode(true))
        // document.getElementById("group_D_1").appendChild(containers[3].children[0].cloneNode(true))
        // document.getElementById("group_D_2").appendChild(containers[3].children[1].cloneNode(true))
        // document.getElementById("group_E_1").appendChild(containers[4].children[0].cloneNode(true))
        // document.getElementById("group_E_2").appendChild(containers[4].children[1].cloneNode(true))
        // document.getElementById("group_F_1").appendChild(containers[5].children[0].cloneNode(true))
        // document.getElementById("group_F_2").appendChild(containers[5].children[1].cloneNode(true))
        // document.getElementById("group_G_1").appendChild(containers[6].children[0].cloneNode(true))
        // document.getElementById("group_G_2").appendChild(containers[6].children[1].cloneNode(true))
        // document.getElementById("group_H_1").appendChild(containers[7].children[0].cloneNode(true))
        // document.getElementById("group_H_2").appendChild(containers[7].children[1].cloneNode(true))
        
        // $("#group_A_1").append(containers[0].children[0])
        // for(let i = 0;  i < containers.length; i++) {
        //     console.log(containers[i].children[0])
        //     console.log(containers[i].children[1])
        // }
    }
    
}






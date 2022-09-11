//https://github.com/WebDevSimplified/Drag-And-Drop/blob/master/script.js
console.log("drag-drop.js")
var groups = true;
var last16 = false;
var quarterFinal = false;
var semiFinal = false;
var thirdPlacePlayoff = false;
var final = false;

if (groups) {
    console.log("groups = TRUE")
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.par-container');
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
        })
    })
    containers.forEach(container => {
        console.log("container.id = " + container.id)
        container.addEventListener('dragover', e => {
            containerIndex = e.target.parentElement.id;
            // console.log("containerIndex = " + containerIndex)
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
                placings = container.getElementsByClassName('group-position');
                console.log("placings = ", placings)
                for (let i = 0; i < placings.length; i++) {
                    placings[i].innerHTML = i + 1;
                    if (i < 2) {
                        placings[i].parentNode.classList.add("text-success")
                        placings[i].parentNode.classList.remove("text-danger")
                    }
                    else {
                        placings[i].parentNode.classList.remove("text-success")
                        placings[i].parentNode.classList.add("text-danger")
                    }
                }
            }
            else {
                console.log("FALSE")
            }
            
        })
    })
    
    function getDragAfterElement(container, y) {
        console.log("getDragAfterElement")
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')] //[...] forms an array
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            //console.log(offset)
            if(offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            }
            else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    
    }
}





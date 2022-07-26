function new_task() {
    let $newLi = document.createElement('li');

    let newCheckbox = document.createElement('input');
    newCheckbox.type = "checkbox";
    $newLi.append(newCheckbox);

    let newSpan = document.createElement('span');
    newSpan.textContent = document.getElementById("input-task").value;
    newSpan.className = "task";
    $newLi.append(newSpan);

    let newButton = document.createElement('button');
    newButton.className = "delete-btn";
    newButton.textContent = "del";
    $newLi.append(newButton);

    if (document.getElementById("input-task").value != "") {
        let newTask = document.querySelector('#task-list');
        newTask.append($newLi);
        document.getElementById("input-task").value = "";
    }
}

const $taskList = document.getElementById('task-list')
function del_task(e) {
    if (e.target.className === 'delete-btn') {
        let li = e.target.closest('li')
        li.remove()
    }
}

document.getElementById("add-task-button").addEventListener("click", new_task);
document.getElementById("task-list").addEventListener("click", del_task);

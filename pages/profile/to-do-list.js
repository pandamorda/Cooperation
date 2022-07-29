const $taskList = document.getElementById('task-list');
let list = JSON.parse(localStorage.getItem("tasks")) || [];

function new_task() {
    let $newLi = document.createElement('li');

    let newCheckbox = document.createElement('input');
    newCheckbox.type = "checkbox";
    $newLi.append(newCheckbox);

    let newSpan = document.createElement('span');
    newSpan.textContent = document.getElementById("input-task").value;
    list[list.length] = document.getElementById("input-task").value;
    newSpan.className = "task";
    $newLi.append(newSpan);

    let newButton = document.createElement('button');
    newButton.className = "delete-btn";
    //newButton.textContent = 'del'
    $newLi.append(newButton);

    if (document.getElementById("input-task").value != "") {
        let newTask = document.querySelector('#task-list');
        newTask.append($newLi);
        document.getElementById("input-task").value = "";
    }
}

function locStorage() {
    new_task();

    localStorage.setItem("tasks", JSON.stringify(list));
}

function pageUpdate(taskList) {
    for (let j = 0; j < taskList.length; j++) {
        let $newLi = document.createElement('li');

        let newCheckbox = document.createElement('input');
        newCheckbox.type = "checkbox";
        $newLi.append(newCheckbox);

        let newSpan = document.createElement('span');
        newSpan.textContent = taskList[j];
        newSpan.className = "task";
        $newLi.append(newSpan);

        let newButton = document.createElement('button');
        newButton.className = "delete-btn";
        //newButton.textContent = 'del'
        $newLi.append(newButton);

        let newTask = document.querySelector('#task-list');
        newTask.append($newLi);
    }
}

function locStorageDel(li) {

}

function del_task(e) {
    if (e.target.className === 'delete-btn') {
        let li = e.target.closest('li');

        let index = list.indexOf(li.textContent);
        list.splice(index, 1);
        localStorage.removeItem("tasks");

        localStorage.setItem("tasks", JSON.stringify(list));

        li.remove();
    }
}

document.getElementById("task-list").addEventListener("click", del_task);
document.getElementById("add-task-button").addEventListener("click", locStorage);

document.addEventListener('DOMContentLoaded', (e) => {
    pageUpdate(list)
});
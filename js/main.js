//追加ボタンを押下→新しいタスクを追加し表示を更新
document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const newTask = document.createElement("li");
    
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", "checkbox");
    newTask.appendChild(checkBox);
    
    const textNode = document.createTextNode(taskInput.value);
    newTask.appendChild(textNode);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("id", "delete-button");
    deleteButton.innerText = "削除"
    deleteButton.addEventListener("click", () => {
        taskList.removeChild(newTask);
    })

    newTask.appendChild(deleteButton);
    taskList.appendChild(newTask);

    taskInput.value = "";
})
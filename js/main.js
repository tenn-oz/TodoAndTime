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
    deleteButton.innerText = "X";
    deleteButton.addEventListener("click", () => {
        taskList.removeChild(newTask);
    })

    newTask.appendChild(deleteButton);
    taskList.appendChild(newTask);

    taskInput.value = "";
})

//スライダーによる表示時間更新
const hourSlider = document.getElementById("hour-range")
hourSlider.addEventListener("change", () => {
    const setHour = document.getElementById("hour-value")
    setHour.innerText = hourSlider.value;
})
const minuteSlider = document.getElementById("minute-range")
minuteSlider.addEventListener("change", () => {
    const setMinute = document.getElementById("minute-value")
    setMinute.innerText = minuteSlider.value;
})
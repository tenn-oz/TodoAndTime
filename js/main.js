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

    const setTime = document.createElement("span")
    const setHour = document.getElementById("hour-range");
    const setMinute = document.getElementById("minute-range");
    const minuteFormatted = setMinute.value.padStart(2, "0");
    setTime.innerText = setHour.value + " : " + minuteFormatted;
    newTask.appendChild(setTime);

    const startButton = document.createElement("button");
    startButton.setAttribute("type", "button");
    startButton.setAttribute("id", "start-button");
    startButton.innerText = "開始";
    newTask.appendChild(startButton);
    
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
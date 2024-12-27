//　追加ボタンを押下→新しいタスクを追加し表示を更新
document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const newTask = document.createElement("li");
    
    //　チェックボックス
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", "checkbox");
    newTask.appendChild(checkBox);
    
    // タスク
    const textNode = document.createTextNode(taskInput.value);
    newTask.appendChild(textNode);

    // 設定時間
    const setTime = document.createElement("span")
    const setHour = document.getElementById("hour-range");
    const setMinute = document.getElementById("minute-range");
    const minuteFormatted = setMinute.value.padStart(2, "0");
    setTime.innerText = setHour.value + " : " + minuteFormatted;
    newTask.appendChild(setTime);

    //　開始ボタン
    const startButton = document.createElement("button");
    startButton.setAttribute("type", "button");
    startButton.setAttribute("id", "start-button");
    startButton.innerText = "開始";
    startButton.addEventListener("click", () => {
        const mainSection = document.getElementById("main-section");
        const timeDisplay = document.createElement("div");
        timeDisplay.setAttribute("id", "time-display");
        timeDisplay.innerHTML = `<span id="display-hour">${setHour.value}</span> : <span id="display-minute">${minuteFormatted}</span>`;
        mainSection.prepend(timeDisplay);
    })
    newTask.appendChild(startButton);
    
    //　削除ボタン
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

//　スライダーによる表示時間更新
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

//　開始ボタンを押す押下→指定していた時間分のタイマーを開始・表示

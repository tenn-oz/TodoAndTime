//　追加ボタンを押下→新しいタスクを追加し表示を更新
document.getElementById("task-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const newTask = document.createElement("li");
    
    //　チェックボックス
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "checkbox");
    newTask.appendChild(checkBox);
    
    // タスク
    const textNode = document.createTextNode(taskInput.value);
    newTask.appendChild(textNode);

    // 設定時間
    const setTime = document.createElement("span")
    const setHour = document.getElementById("hour-range");
    const setMinute = document.getElementById("minute-range");
    setTime.innerText = setHour.value + " : " + setMinute.value.padStart(2, "0");
    newTask.appendChild(setTime);

    //　開始ボタン
    const startButton = document.createElement("button");
    startButton.setAttribute("type", "button");
    startButton.setAttribute("class", "start-button");
    startButton.innerText = "開始";
    startButton.addEventListener("click", () => {
        const mainSection = document.getElementById("main-section");
        const timeDisplay = document.createElement("div");
        timeDisplay.setAttribute("id", "time-display");
        mainSection.prepend(timeDisplay);


        let remainingTime = parseInt(setHour.value) * 3600 + parseInt(setMinute.value) * 60;
        
        const updateDisplay = (time) => {
            const timeDisplay = document.getElementById("time-display");
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60)
            const seconds = time % 60;
            timeDisplay.innerHTML = `<span id="display-hour">${hours}</span>:<span id="display-minute">${String(minutes).padStart(2, "0")}</span>:<span id="display-second">${String(seconds).padStart(2, "0")}</span>`;
        }

        updateDisplay(remainingTime);
        const intervalID = setInterval(() => {
            remainingTime--;
            updateDisplay(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(intervalID);
            }
        }, 1000);
    });
    newTask.appendChild(startButton);
    
    //　削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.innerText = "X";
    deleteButton.addEventListener("click", () => {
        taskList.removeChild(newTask);
    });
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


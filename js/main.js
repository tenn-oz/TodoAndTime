//　スライダーによる表示時間更新
const addEventToSlider = () => {
    const hourSlider = document.getElementById("hour-range");
    hourSlider.addEventListener("change", () => {
        const setHour = document.getElementById("hour-value");
        setHour.innerText = hourSlider.value;
    });
    const minuteSlider = document.getElementById("minute-range");
    minuteSlider.addEventListener("change", () => {
        const setMinute = document.getElementById("minute-value");
        setMinute.innerText = minuteSlider.value;
    });
}

const allDoneHandler = () => {
    const allCheckBox = document.getElementsByClassName("checkbox");
    const allChecked = Array.from(allCheckBox).every((checkbox) => checkbox.checked);
    if (allChecked) {
        const message = document.createElement("p")
        message.setAttribute("id", "message");
        message.innerText = "All done!";
        const mainSection = document.getElementById("main-section");
        mainSection.append(message);
    } else {
        const message = document.getElementById("message");
        if (message) {
            message.remove();
        }
    }
}

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
    checkBox.addEventListener("change", allDoneHandler);
    newTask.appendChild(checkBox);
    
    // タスク
    const taskName = document.createElement("span");
    taskName.setAttribute("class", "task-name");
    taskName.innerText = taskInput.value;
    newTask.appendChild(taskName);

    // 設定時間
    const setTime = document.createElement("span")
    setTime.setAttribute("class", "task-time");
    const setHour = document.getElementById("hour-range");
    const setMinute = document.getElementById("minute-range");
    setTime.innerHTML = `<span class="set-hour">${setHour.value}</span>:<span class="set-minute">${setMinute.value.padStart(2, "0")}</span>`;
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

        const displayButtons = document.createElement("div");
        displayButtons.setAttribute("id", "display-buttons");
        mainSection.insertBefore(displayButtons, timeDisplay.nextSibling);

        const currentTask = document.createElement("div");
        currentTask.setAttribute("id", "current-task");
        currentTask.innerText = newTask.querySelector(".task-name").innerText;
        mainSection.insertBefore(currentTask, displayButtons.nextSibling);

        // 全タスクの開始ボタンを一時削除
        const taskList = document.getElementById("task-list");
        const originalStartButtons = [];
        taskList.querySelectorAll(".start-button").forEach((button) => {
            originalStartButtons.push(button);
            button.remove();
        });

        // フォームを一時削除
        const taskForm = document.getElementById("task-form");
        const originalForm = taskForm.innerHTML;
        taskForm.innerHTML = "";

        const setHour = newTask.querySelector(".set-hour").innerText;
        const setMinute = newTask.querySelector(".set-minute").innerText;
        let initSetTime = parseInt(setHour) * 3600 + parseInt(setMinute) * 60;
        let startTime = Date.now();
        
        const updateDisplay = (time) => {
            const timeDisplay = document.getElementById("time-display");
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60)
            const seconds = time % 60;
            timeDisplay.innerHTML = `<span id="display-hour">${hours}</span>:<span id="display-minute">${String(minutes).padStart(2, "0")}</span>:<span id="display-second">${String(seconds).padStart(2, "0")}</span>`;
        }

        const deleteDisplay = () => {
            timeDisplay.remove();
            displayButtons.remove();
            currentTask.remove();
        }

        const reappearFormAndTaskList = () => {
            taskForm.innerHTML = originalForm;
            taskForm.querySelector("#hour-value").innerText = "0";
            taskForm.querySelector("#minute-value").innerText = "0";
            addEventToSlider();
            for (let i = 0; i < taskList.children.length; ++i) {
                let taskli = taskList.children[i];
                taskli.insertBefore(originalStartButtons[i], taskli.children[taskli.children.length - 1]);
            }
        }

        const timerHandler = () => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const remainingTime = initSetTime - elapsedTime;
            updateDisplay(remainingTime);
            if (remainingTime <= 0) {
                endTimer();
                newTask.querySelector(".checkbox").checked = true;
            }
        }

        const visibilitychangeHandler = () => {
            if (!document.hidden && !nowPause) {
                allDoneHandler();
                timerHandler();
            }
        };

        const endTimer = () => {
            clearInterval(intervalID);
            deleteDisplay();
            document.removeEventListener("visibilitychange", visibilitychangeHandler);
            reappearFormAndTaskList();
        }

        updateDisplay(initSetTime);
        let intervalID = setInterval(timerHandler, 1000);

        //別タブから復帰した際に必ず更新
        document.addEventListener("visibilitychange", visibilitychangeHandler);

        const pauseButton = document.createElement("button");
        pauseButton.setAttribute("id", "pause-button");
        pauseButton.innerText = "一時停止";
        let nowPause = false;
        pauseButton.addEventListener("click", () => {
            nowPause = !nowPause;
            if (nowPause) {
                pauseButton.innerText = "再開";
                initSetTime -= Math.floor((Date.now() - startTime) / 1000);
                clearInterval(intervalID);
            } else {
                pauseButton.innerText = "一時停止";
                startTime = Date.now();
                intervalID = setInterval(timerHandler, 1000);
            }
        })
        displayButtons.appendChild(pauseButton);

        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("id", "cancel-button");
        cancelButton.innerText = "キャンセル";
        cancelButton.addEventListener("click", () => {
            endTimer();
        })
        displayButtons.appendChild(cancelButton);
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

    allDoneHandler();
    taskInput.value = "";
})

addEventToSlider();


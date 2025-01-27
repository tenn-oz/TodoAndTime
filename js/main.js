import { TodoItem } from "./TodoItem.js"

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

//　全タスクが完了しているかを確認し, その場合メッセージを表示
const allDoneHandler = () => {
    const allCheckBox = document.getElementsByClassName("checkbox");
    const message = document.getElementById("message");
    const allChecked = Array.from(allCheckBox).every((checkbox) => checkbox.checked) && allCheckBox.length != 0;
    if (allChecked && !message) {
        const newmessage = document.createElement("p")
        newmessage.setAttribute("id", "message");
        newmessage.innerText = "All done.";
        const mainSection = document.getElementById("main-section");
        mainSection.append(newmessage);
    } else if (!allChecked && message) {
        message.remove();
    }
}

const renderTodo = (todo) => {
    const todoName = todo.name;
    const todoHour = todo.hour;
    const todoMinute = todo.minute;
    const todoCompleted = todo.completed;

    const todoListElem = document.getElementById("todo-list");
    const todoElem = document.createElement("li");
    todoElem.setAttribute("id", `todo-${todo.id}`);

    //チェックボックス
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "checkbox button");
    checkBox.checked = todoCompleted;
    checkBox.addEventListener("click", (event) => {
        const todo = event.target.parentNode;
        const todoItem = JSON.parse(localStorage.getItem(todo.id));
        todoItem.completed = event.target.checked;
        localStorage.setItem(`todo-${todoItem.id}`, JSON.stringify(todoItem));
    })
    checkBox.addEventListener("change", allDoneHandler);
    todoElem.appendChild(checkBox);

    // タスク
    const todoNameElem = document.createElement("span");
    todoNameElem.setAttribute("class", "todo-name");
    todoNameElem.innerText = todoName;
    todoElem.appendChild(todoNameElem);

    // 設定時間
    const todoTimeElem = document.createElement("span")
    todoTimeElem.setAttribute("class", "todo-time");
    todoTimeElem.innerHTML = `<span class="set-hour">${todoHour}</span>:<span class="set-minute">${String(todoMinute).padStart(2, "0")}</span>`;
    todoElem.appendChild(todoTimeElem);

    //　開始ボタン
    const startButton = document.createElement("button");
    startButton.setAttribute("type", "button");
    startButton.setAttribute("class", "button start-button");
    startButton.innerText = "開始";
    startButton.addEventListener("click", () => {
        const mainSection = document.getElementById("main-section");
        const timeDisplay = document.createElement("div");
        timeDisplay.setAttribute("id", "time-display");
        mainSection.prepend(timeDisplay);

        const displayButtons = document.createElement("div");
        displayButtons.setAttribute("id", "display-buttons");
        mainSection.insertBefore(displayButtons, timeDisplay.nextSibling);

        const currentTodoElem = document.createElement("div");
        currentTodoElem.setAttribute("id", "current-todo");
        currentTodoElem.innerText = todoElem.querySelector(".todo-name").innerText;
        mainSection.insertBefore(currentTodoElem, displayButtons.nextSibling);

        // 全タスクの開始ボタンを一時削除
        const originalStartButtons = [];
        todoListElem.querySelectorAll(".start-button").forEach((button) => {
            originalStartButtons.push(button);
            button.remove();
        });

        //　全タスクの削除ボタンを一時削除
        const originalDeleteButtons = [];
        todoListElem.querySelectorAll(".delete-button").forEach((button) => {
            originalDeleteButtons.push(button);
            button.remove();
        });

        // フォームを一時削除
        const todoFormElem = document.getElementById("todo-form");
        const originalForm = todoFormElem.innerHTML;
        todoFormElem.innerHTML = "";

        //タイマー設定
        let initSetTime = todoHour * 3600 + todoMinute * 60;
        let startTime = Date.now();
        
        const updateDisplay = (time) => {
            const timeDisplay = document.getElementById("time-display");
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;
            timeDisplay.innerHTML = `<span id="display-hour">${hours}</span>:<span id="display-minute">${String(minutes).padStart(2, "0")}</span>:<span id="display-second">${String(seconds).padStart(2, "0")}</span>`;
        }

        const deleteDisplay = () => {
            timeDisplay.remove();
            displayButtons.remove();
            currentTodoElem.remove();
        }

        const reappearFormAndTodoList = () => {
            todoFormElem.innerHTML = originalForm;
            todoFormElem.querySelector("#hour-value").innerText = "0";
            todoFormElem.querySelector("#minute-value").innerText = "0";
            addEventToSlider();
            for (let i = 0; i < todoListElem.children.length; ++i) {
                let todoli = todoListElem.children[i];
                todoli.appendChild(originalStartButtons[i]);
                todoli.appendChild(originalDeleteButtons[i]);
            }
        }

        const timerHandler = () => {
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            const remainingTime = initSetTime - elapsedTime;
            updateDisplay(remainingTime);
            if (remainingTime <= 0) {
                endTimer();
                checkBox.checked = true;
                allDoneHandler();
                const loadedTodo = JSON.parse(localStorage.getItem(`todo-${todo.id}`));
                loadedTodo.completed = true;
                localStorage.setItem(`todo-${todo.id}`, JSON.stringify(loadedTodo));
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
            reappearFormAndTodoList();
        }

        updateDisplay(initSetTime);
        let intervalID = setInterval(timerHandler, 1000);

        //別タブから復帰した際に必ず更新
        document.addEventListener("visibilitychange", visibilitychangeHandler);

        const pauseButton = document.createElement("button");
        pauseButton.setAttribute("class", "button");
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
        });
        displayButtons.appendChild(pauseButton);

        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("class", "button");
        cancelButton.setAttribute("id", "cancel-button");
        cancelButton.innerText = "キャンセル";
        cancelButton.addEventListener("click", () => {
            endTimer();
        })
        displayButtons.appendChild(cancelButton);
    });
    todoElem.appendChild(startButton);  
    
    //　削除ボタン
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "button delete-button");
    deleteButton.innerText = "X";
    deleteButton.addEventListener("click", () => {
        todoListElem.removeChild(todoElem);
        //ストレージから削除
        localStorage.removeItem(`todo-${todo.id}`);
        allDoneHandler();
    });
    todoElem.appendChild(deleteButton);

    todoListElem.appendChild(todoElem);
}

const renderTodoList = () => {
    Object.keys(localStorage)
    .filter(key => key.startsWith("todo"))
    .sort((a, b) => parseInt(a.substring(5)) - parseInt(b.substring(5)))
    .forEach(key => {
        const loadedTodo = JSON.parse(localStorage.getItem(key));
        renderTodo(loadedTodo);
    });
}

const init = () => {
    addEventToSlider();
    renderTodoList();
    allDoneHandler();

    //　新しいタスクを追加し表示を更新
    document.getElementById("todo-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const todoName = document.getElementById("todo-input").value;
        const todoHour = document.getElementById("hour-range").value;
        const todoMinute = document.getElementById("minute-range").value;

        //Todoインスタンスの作成とストレージへの保存
        const newTodo = new TodoItem({name: todoName, hour: todoHour, minute: todoMinute, completed: false});
        localStorage.setItem(`todo-${newTodo.id}`, JSON.stringify(newTodo));

        renderTodo(newTodo);

        allDoneHandler();
        
        document.getElementById("todo-input").value = "";
    });

    document.getElementById("about-btn").addEventListener("click", (event) => {
        event.preventDefault();

        document.getElementById("about-modal").style.display = "block";
    });

    document.getElementById("about-close").addEventListener("click", (event) => {
        event.preventDefault();

        document.getElementById("about-modal").style.display = "none";
    });

    document.getElementById("contact-btn").addEventListener("click", (event) => {
        event.preventDefault();

        document.getElementById("contact-modal").style.display = "block";
    });

    document.getElementById("contact-close").addEventListener("click", (event) => {
        event.preventDefault();

        document.getElementById("contact-modal").style.display = "none";
    });

    Array.from(document.getElementsByClassName("modal-container")).forEach(container => {
        container.addEventListener("click", (event) => {
            if (event.target == container) {
                container.style.display = "none";
            }
        });
    });
}

init();

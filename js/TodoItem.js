let curIdx = parseInt(localStorage.getItem('curIdx')) || 0;

export class TodoItem {
    id;
    name;
    hour;
    minute;
    completed;

    constructor({name, hour, minute, completed}) {
        this.id = curIdx++;
        this.name = name;
        this.hour = hour;
        this.minute = minute;
        this.completed = completed;
        localStorage.setItem('curIdx', curIdx);
    }
}
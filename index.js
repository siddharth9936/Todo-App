const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const formBtn = document.querySelector("#form-btn");
const taskCount = document.querySelector("#task-count");
const completeCount = document.querySelector("#complete-count");
const cancelBtn = document.querySelector("#cancel-btn");



let todos = JSON.parse(localStorage.getItem("todos")) || [];

let editTodoId = null;
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const todoValue = todoInput.value.trim();

    if (!todoValue) {
        return
    }

    console.log({ editTodoId, todoValue });

    if (editTodoId) {
        todos = todos.map((todo) => {
            if (todo.id === Number(editTodoId)) {
                return {
                    ...todo,
                    text: todoValue
                }
            }
            return todo
        })
        localStorage.setItem("todos", JSON.stringify(todos));
    } else {
        let newTodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false
        }
        todos.push(newTodo)
        localStorage.setItem("todos", JSON.stringify(todos));
    }
    cancelEdit();
    renderTodo()


})

function renderTodo() {  //render
    todoList.innerHTML = ""
    todos.forEach((todo) => {
        const li = document.createElement("li")
        li.className = "flex gap-2 border border-slate-300 p-4 rounded-xl"
        li.dataset.id = todo.id

        li.innerHTML = `<input data-action="toogle" data-id=${todo.id} ${todo.isCompleted === true ? 'checked' : ""} type="checkbox">
                <p class="flex-1 ${todo.isCompleted ? "line-through text-red-400" : ""}">${todo.text}</p>
                <div class="flex gap-2">
                    <button data-action="edit" data-id=${todo.id}>Edit</button>
                    <button data-action="delete" data-id=${todo.id}>Delete</button>
                </div>`
        todoList.append(li)
    })
    taskCount.textContent = `TASK:${todos.length}`
    completeCount.textContent = `COMPLETED:${todos.filter((todo) => todo.isCompleted).length}`
}
renderTodo()

todoList.addEventListener('click', (e) => {
    e.stopPropagation()
    const li = e.target.closest('li')
    const id = li.dataset.id;
    let action = e.target.dataset.action;

    if (action === "edit") {
 
        startEdit(id)

    }

    if (action === "delete") {
      
        deleteTodo(id)


    }
    if (action === "toogle") {
       
        todos = todos.map((todo) => {
            if (todo.id === Number(id)) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted
                }
            }
            return todo
        })
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodo()
    }


})

function deleteTodo(id) {
    todos = todos.filter((todo) => {

        if (todo.id !== Number(id)) {
            return todo
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo()
}

function startEdit(id) {
    editTodoId = id;

    let currentTodo = todos.find((todo) => {
        if (todo.id === Number(id)) {
            return todo
        }
    })
    todoInput.value = currentTodo.text
    formBtn.textContent = "Update"
    formBtn.className = "px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors cursor-pointer";

    cancelBtn.classList.remove("hidden");
}

function cancelEdit() {
    editTodoId = null;

    todoInput.value = "";

    formBtn.textContent = "Add";

    formBtn.className = "px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer";
}
cancelBtn.addEventListener('click', () => {
    cancelEdit();
})

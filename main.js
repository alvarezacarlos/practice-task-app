const routes = {
  login: "LOGIN",
  register: "REGISTER",
  home: "HOME",
};

let router = routes.login;
let users = [];
let taskListArray = [];

const API_URL = "https://tasks-app-ecd71-default-rtdb.firebaseio.com";

//**************** Home - tasks

// generate Id
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36);
}

const handleClearInput = () => {
  const taskName = document.getElementById("taskNameInput");
  taskName.value = "";
};

const handleCompleteTask = (e) => {
  let clickedIcon = e.target;
  let clickedTask = clickedIcon.parentNode.parentNode;
  const clickedTaskId = clickedTask.getAttribute("data-id");
  const clickedTaskArrayItem = taskListArray.find(
    (task) => task._id === clickedTaskId
  );

  if (clickedTaskArrayItem.open) {
    clickedTaskArrayItem.open = false;

    clickedIcon.classList.remove("bi-check-circle-fill");
    clickedIcon.classList.add("bi-arrow-counterclockwise");

    let taskTitle = clickedTask.querySelector("p");
    taskTitle.style.textDecoration = "line-through";
  } else {
    clickedTaskArrayItem.open = true;

    clickedIcon.classList.remove("bi-arrow-counterclockwise");
    clickedIcon.classList.add("bi-check-circle-fill");

    let taskTitle = clickedTask.querySelector("p");
    taskTitle.style.textDecoration = "none";
  }


  fetch(`${API_URL}/tasks/${clickedTaskId}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(clickedTaskArrayItem)
  })
  .then(res => res.json())
  .then(res => console.log(res))
};

const handleDeleteTask = (e) => {
  let clickedIcon = e.target;
  let clickedTask = clickedIcon.parentNode.parentNode;
  const clickedTaskId = clickedTask.getAttribute("data-id");
  const clickedTaskIndex = taskListArray.findIndex(
    (task) => task._id === clickedTaskId
  );
  taskListArray.splice(clickedTaskIndex, 1);

  fetch(`${API_URL}/tasks/${clickedTaskId}.json`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      const taskListContainer = document.getElementById("taskListContainer");
      taskListContainer.removeChild(clickedTask);
      console.log(taskListArray);
    });
};

function handleCreateTask() {
  let taskName = document.getElementById("taskNameInput");

  if (taskName.value.trim() === "") {
    return;
  }

  let taskList = document.getElementById("taskListContainer");

  // create new task container
  let newTask = document.createElement("div");

  // add new task description
  let newTaskTitle = document.createElement("p");
  newTaskTitle.innerHTML = taskName.value;
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const newTaskItem = {
    title: taskName.value,
    open: true,
    userId: user.userId,
  };

  fetch(`${API_URL}/tasks.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTaskItem),
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log('response', res.name)
      taskListArray.push({ ...newTaskItem, _id: res.name });
      newTask.appendChild(newTaskTitle);

      // add new
      newTask.classList.add("task");
      newTask.setAttribute("data-id", res.name);

      // add task Icons
      let taskIconsContainer = document.createElement("div");
      taskIconsContainer.classList.add("iconsContainer");

      // add complete icon
      let completeIcon = document.createElement("i");
      completeIcon.classList.add(
        "bi",
        "bi-check-circle-fill",
        "completeIcon",
        "taskIcon"
      );
      completeIcon.addEventListener("click", handleCompleteTask);
      taskIconsContainer.append(completeIcon);

      // add delete icon
      let deleteIcon = document.createElement("i");
      deleteIcon.classList.add("bi", "bi-trash-fill", "deleteIcon", "taskIcon");
      deleteIcon.addEventListener("click", handleDeleteTask);
      taskIconsContainer.append(deleteIcon);

      newTask.appendChild(taskIconsContainer);
      taskList.appendChild(newTask);

      // clear textinput
      handleClearInput();
      console.log(taskListArray);
    });
}

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handleCreateTask();
  }
};
//-- home tasks

const clearApp = () => {
  let app = document.getElementById("app");
  if (app.firstElementChild) {
    app.removeChild(app.firstElementChild);
  }
};

const handleLoginLink = () => {
  router = routes.login;
  clearApp();
  redirect();
};

const validateRegisterForm = () => {
  const usernameInput = document.querySelector("#register-username");
  const passwordInput = document.querySelector("#register-password");

  const validation = {
    authMessage: null,
    authenticated: null,
  };

  if (usernameInput.value.trim() && passwordInput.value.trim()) {
    const user = users.find(
      (user) => user.username === usernameInput.value.trim()
    );
    if (user) {
      validation.authMessage = "The username already exists";
      validation.authenticated = false;
      return;
    }

    const newUser = {
      username: usernameInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    fetch(`${API_URL}/users.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).then((res) => {
      validation.authMessage = "User registered Successfully";
      validation.authenticated = true;

      router = routes.login;
      clearApp();
      redirect();
    });
  }

  validation.authMessage = "Please fill the form";
  validation.authenticated = false;
};

const handleRegisterForm = () => {
  validateRegisterForm();
};

const renderRegister = () => {
  let app = document.getElementById("app");
  let registerTemplate = document.getElementById("register-form-template");
  let registerTemplateContentNode = document.importNode(
    registerTemplate.content,
    true
  );

  clearApp();
  app.insertAdjacentElement(
    "beforeend",
    registerTemplateContentNode.firstElementChild
  );

  // init login link
  let signinLink = document.querySelector("#signin-account-link");
  signinLink.addEventListener("click", handleLoginLink);

  // init register button
  const registerFormButton = document.getElementById("register-form-buttom");
  registerFormButton.addEventListener("click", handleRegisterForm);
};

const handleRegisterLink = () => {
  router = routes.register;
  redirect();
};

const handleFetchTasks = () => {

  const user = JSON.parse(localStorage.getItem('user'))

  // console.log(user, `${API_URL}/tasks.json?orderBy="userId"&equalTo="${user.userId}"`)

  fetch(`${API_URL}/tasks.json?orderBy="userId"&equalTo="${user.userId}"`)
    .then((res) => res.json())
    .then((tasks) => {
      for (let key in tasks) {
        let newTaskContainer = document.createElement("div");
        newTaskContainer.classList.add("task");
        newTaskContainer.setAttribute("data-id", key);

        let taskTitle = document.createElement("p");
        taskTitle.innerHTML = `${tasks[key].title}`;        
        let iconsContainer = document.createElement("div");
        let completeIcon = document.createElement("i");
        let deleteIcon = document.createElement("i");       

        deleteIcon.classList.add(
          "bi",
          "bi-trash-fill",
          "deleteIcon",
          "taskIcon"
        );
        deleteIcon.addEventListener("click", handleDeleteTask);
        iconsContainer.classList.add("iconsContainer");        
        let taskListContainer = document.querySelector("#taskListContainer");

        if (tasks[key].open) {   
          completeIcon.classList.add(
            "bi",
            "bi-check-circle-fill",
            "completeIcon",
            "taskIcon"
          );
          // taskTitle.style.textDecoration = "none";
        } else {
          completeIcon.classList.add(
            "bi",
            "bi-arrow-counterclockwise",
            "completeIcon",
            "taskIcon"
          );  
          taskTitle.style.textDecoration = "line-through";
        }
        
        newTaskContainer.appendChild(taskTitle);

        completeIcon.addEventListener("click", handleCompleteTask);
        iconsContainer.append(completeIcon);
        iconsContainer.append(deleteIcon);

        newTaskContainer.appendChild(iconsContainer);
        taskListContainer.appendChild(newTaskContainer);

        taskListArray.push({
          title: tasks[key].title,
          open: tasks[key].open,
          userId: tasks[key].userId,
          _id: key,
        });
      }

      console.log(taskListArray);
    });
};

const renderHome = () => {
  let app = document.getElementById("app");
  let homeTemplate = document.getElementById("home-template");
  let homeTemplateContentNode = document.importNode(homeTemplate.content, true);

  clearApp();
  app.insertAdjacentElement(
    "beforeend",
    homeTemplateContentNode.firstElementChild
  );

  let taskName = document.getElementById("taskNameInput");
  taskName.addEventListener("keydown", handleKeyDown);
  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", handleCreateTask);

  const logout = document.getElementById('logout')
  logout.addEventListener('click', () => {
    localStorage.removeItem('user')
    clearApp()
    checkForAuth()
  })  

  handleFetchTasks();
};

const validateLoginForm = () => {
  const usernameInput = document.querySelector("#login-username");
  const passwordInput = document.querySelector("#login-password");

  let validation = {
    authMessage: null,
    authenticated: null,
  };

  if (usernameInput.value.trim() && passwordInput.value.trim()) {
    // console.log(usernameInput.value.trim(), passwordInput.value.trim());

    fetch("https://tasks-app-ecd71-default-rtdb.firebaseio.com/users.json")
      .then((response) => {
        if (!response.ok) {
          validation.authMessage = "Invalid Username or Password";
          validation.authenticated = false;
        }
        return response.json();
      })
      .then((users) => {
        let userFound = false;
        for (let key in users) {
          if (
            users[key].username === usernameInput.value.trim() &&
            users[key].password === passwordInput.value.trim()
          ) {
            validation.authMessage = "User authenticated successfully";
            validation.authenticated = true;
            router = routes.home;
            localStorage.setItem("user", JSON.stringify({ userId: key }));
            console.log(validation.authMessage);
            userFound = true;
            break;
          }
        }

        if (userFound) {
          redirect();
        }
      });
  }
};

const handleSigninForm = () => {
  validateLoginForm();
};

const renderLogin = () => {
  let app = document.getElementById("app");
  let loginTemplate = document.getElementById("signin-form-template");
  let loginTemplateContentNode = document.importNode(
    loginTemplate.content,
    true
  );
  app.insertAdjacentElement(
    "beforeend",
    loginTemplateContentNode.firstElementChild
  );

  // init link
  let registerLink = document.querySelector("#register-account-link");
  registerLink.addEventListener("click", handleRegisterLink);

  // init signin button
  const signinFormButton = document.getElementById("signin-form-buttom");
  signinFormButton.addEventListener("click", handleSigninForm);
};

const checkForAuth = () => {
  const user = localStorage.getItem("user");
  if (user) {
    router = routes.home;
  }else{
    router = routes.login;
  }
  redirect();
};

const redirect = () => {
  console.log(router);
  if (router === routes.login) {
    renderLogin();
    return;
  }

  if (router === routes.register) {
    renderRegister();
    return;
  }

  if (router === routes.home) {
    renderHome();
  }
};


window.onload = () => {
  checkForAuth()
};

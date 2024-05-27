const routes = {
  login: "LOGIN",
  register: "REGISTER",
  home: "HOME",
};

let router = routes.login;

let users = [];

const clearApp = () => {
  let app = document.getElementById("app");
  app.removeChild(app.firstElementChild);
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
      return validation
    }

    const newUser = {
      username: usernameInput.value.trim(),
      password: passwordInput.value.trim(),
    };
    users.push(newUser);

    validation.authMessage = "User registered Successfully";
    validation.authenticated = true;

    return validation
  }

  validation.authMessage = "Please fill the form";
  validation.authenticated = false;

  return validation;
};

const handleRegisterForm = () => {
  const {authMessage, authenticated} = validateRegisterForm()
  if (!authenticated) {
    console.log(authMessage)
    return
  }

  router = routes.login;
  console.log(authMessage);
  console.log(users);
  clearApp()
  redirect();
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

const renderHome = () => {
  let app = document.getElementById("app");
  let homeTemplate = document.getElementById("home-template");
  let homeTemplateContentNode = document.importNode(homeTemplate.content, true);
  clearApp();
  app.insertAdjacentElement(
    "beforeend",
    homeTemplateContentNode.firstElementChild
  );
};

const validateLoginForm = () => {
  const usernameInput = document.querySelector("#login-username");
  const passwordInput = document.querySelector("#login-password");

  let validation = {
    authMessage: null,
    authenticated: null,
  };

  if (usernameInput.value.trim() && passwordInput.value.trim()) {
    const user = users.find(
      (user) => user.username === usernameInput.value.trim()
    );

    if (!user) {
      validation.authMessage = "Invalid Username or Password";
      validation.authenticated = false;
      return validation;
    }

    if (user.password !== passwordInput.value.trim()) {
      validation.authMessage = "Invalid Username or Password";
      validation.authenticated = false;
      return validation;
    }

    validation.authMessage = "User authenticated successfully";
    validation.authenticated = true;

    return validation;
  }

  validation.authMessage = "Please fill the form";
  validation.authenticated = false;

  return validation;
};

const handleSigninForm = () => {
  const { authMessage, authenticated } = validateLoginForm();
  if (!authenticated) {
    console.log(authMessage);
    return;
  }

  router = routes.home;
  console.log(authMessage);  
  redirect();
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

const redirect = () => {
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

window.onload = redirect;

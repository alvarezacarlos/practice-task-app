const routes = {
  login: 'LOGIN',
  register: 'REGISTER',
  home: 'HOME'
}

let router = routes.login


const clearApp = () => {
  let app = document.getElementById('app')
  app.removeChild(app.firstElementChild)
}

const handleLoginLink = () => {
  router = routes.login
  clearApp()
  redirect()
}

const renderRegister = () => {
  let app = document.getElementById('app')
  let registerTemplate = document.getElementById('register-form-template')
  let registerTemplateContentNode = document.importNode(registerTemplate.content, true)

  clearApp()
  app.insertAdjacentElement('beforeend', registerTemplateContentNode.firstElementChild)

  let signinLink = document.querySelector('#signin-account-link')
  signinLink.addEventListener('click', handleLoginLink)
}

const handleRegisterLink = () => {
  router = routes.register
  redirect()
}

const renderHome = () => {
  let app = document.getElementById('app')
  let homeTemplate = document.getElementById('home-template')
  let homeTemplateContentNode = document.importNode(homeTemplate.content, true)  
  clearApp()  
  app.insertAdjacentElement('beforeend', homeTemplateContentNode.firstElementChild)
}

const handleSigninForm = () => {
  if (true){
    router = routes.home    
    redirect()
  }
}

const renderLogin = () => {
  let app = document.getElementById('app')
  let loginTemplate = document.getElementById('signin-form-template')
  let loginTemplateContentNode = document.importNode(loginTemplate.content, true)
  app.insertAdjacentElement('beforeend', loginTemplateContentNode.firstElementChild)

  // init link
  let registerLink = document.querySelector('#register-account-link')
  registerLink.addEventListener('click', handleRegisterLink)

  // init signin button
  const signinFormButton = document.getElementById('signin-form-buttom')
  signinFormButton.addEventListener('click', handleSigninForm)
}


const redirect = () => {
  if(router === routes.login) {
    renderLogin()
    return
  }

  if (router === routes.register) {
    renderRegister()
    return
  }

  if (router === routes.home) {
    renderHome()
  }  
}

window.onload = redirect
import {fetchBoard, buildBoardForm} from './board.js'
import {createOrEditGoal} from './goal.js'

// const BASE_URL = "https://module-3-vision-board-backend.herokuapp.com"
const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
export const BOARDS_URL = `${BASE_URL}/boards`
const GOALS_URL = `${BASE_URL}/goals`

const loginFormDiv = document.getElementById("login-form-div")
const signupFormDiv = document.getElementById("signup-form-div")
const loginForm = document.getElementById("login-form")
const signupForm = document.getElementById("signup-form")
const loginBtn = document.getElementById("loginButton")
const signupBtn = document.getElementById("signupButton")
const cancelBtns = document.querySelectorAll(".cancel")
const confirmSignup = document.getElementById("signup-submit")
const confirmLogin = document.getElementById("login-submit")

export const newGoalForm = document.querySelector(".new-goal-container")
const goalFormLabel = document.getElementById("form-label")
const header = document.querySelector("header")
const boardsBtn = document.getElementById("boardsbtn")
const menuList = document.getElementById("menuList")
const boardsList = document.getElementById("boardsList")
const errorBox = document.getElementById("error-div")
const errorListDiv = document.querySelector(".errors")
const newBoardBtn = document.getElementById("newBoardButton")
const logoutBtn = document.getElementById("logoutButton")
newBoardBtn.style.display ="none"
logoutBtn.style.display ="none"
newGoalForm.style.padding = "25px"

newBoardBtn.addEventListener("click", event => buildBoardForm())

//////////////////////////
// Error Rendering Start//
//////////////////////////
function buildErrorMsg(data) {
  // signupForm.reset();
  let errors = data["errors"];
  for (const error of errors) {
    let errorP = document.createElement("p");
    errorP.innerText = error;
    errorP.style.color = "black";
    errorP.style.fontSize = "12px";
    errorP.style.textAlign = "center";
    renderError(errorP);
  }
}

function renderError(errorMsg) {
  errorListDiv.appendChild(errorMsg);
  errorBox.style.display = "block";
  setTimeout(() => {
    errorBox.style.display = "none";
    errorListDiv.innerHTML = "";
  }, 2000);
}

//////////////////////////
// Error Rendering End  //
//////////////////////////

///////////////////////////
// User Functions: Start //
///////////////////////////
//event handlers
function handleLogin(e) {
  e.preventDefault();
  let email = e.target.email.value;
  loginUser(email);
}

function handleSignup(e) {
  e.preventDefault();
  let firstName = e.target.fname.value;
  let lastName = e.target.lname.value;
  let email = e.target.email.value;
  fetchSignupUser(firstName, lastName, email);
}

//Fetches
//recieve user email from login handler and fetch user data, send to loginUser
async function fetchUser(email) {
  let configObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  };
  return fetch(`${BASE_URL}/login`, configObject)
    .then((res) => res.json())
    .then(function (json) {
      if (json.errors) {
        buildErrorMsg(json);
      } else {
        loginForm.reset();
        loginFormDiv.style.display = "none";
        localStorage.user = JSON.stringify(json.data);
      }
    });
}

function fetchSignupUser(firstName, lastName, email) {
  let configObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email,
      first_name: firstName,
      last_name: lastName,
    }),
  };
  fetch(`${USERS_URL}`, configObject).then((res) => {
    if (res.status == 201) {
      confirmUserSignup();
    } else {
      res.json().then((errorData) => {
        buildErrorMsg(errorData);
      });
    }
  });
}

async function loginUser(email) {
  await fetchUser(email);
  renderUser();
}

function renderUser() {
  document.querySelector(".home-page-text").hidden = true
  // Generate first board if it exists
  if (JSON.parse(localStorage.user).attributes.boards.length > 0) {
    fetchBoard(JSON.parse(localStorage.user).attributes.boards[0].id);
  } else {
    buildBoardForm();
  }
  // Update nav bar
  changeNavbar(JSON.parse(localStorage.user));
}

function confirmUserSignup() {
  signupForm.reset();
  let p = document.createElement("p");
  p.innerText = "Account created! You can now sign in with your email";
  p.style.color = "green";
  p.style.fontSize = "12px";
  loginForm.insertBefore(p, confirmLogin);
  setTimeout(() => {
    signupFormDiv.style.display = "";
    loginFormDiv.style.display = "block";
  });
  setTimeout(() => {
    p.remove();
  }, 2000);
}

function changeNavbar(currentUser){
let currentUserUrl = `${USERS_URL}/${JSON.parse(localStorage.user).id}`

fetch(currentUserUrl)
.then(resp => resp.json())
.then(object => buildBoardsList(object.data.attributes.boards))
loginBtn.style.display = "none"
newBoardBtn.style.display = "inline-block"
logoutBtn.style.display = "inline-block"
logoutBtn.addEventListener("click", () => {logoutUser(navbarUsername)}
)
const navbarUsername = document.createElement("li")
navbarUsername.style.float="right"
navbarUsername.innerHTML = `<a>Logged in as: ${currentUser.attributes.first_name}</a>`
menuList.replaceChild(navbarUsername, signupBtn)
}

function logoutUser(navbarUsername) {
  // Remove board and board form from DOM
  if (document.getElementById("board-form")) {document.getElementById("board-form").remove()}
  if(document.getElementById("board-card")){document.getElementById("board-card") .remove()}
 

  document.querySelector(".home-page-text").hidden = false
  
  newBoardBtn.style.display = "none"
  logoutBtn.style.display = "none" 
  loginBtn.style.display = "inline-block"

  menuList.replaceChild(signupBtn, navbarUsername)
  delete localStorage.user
  location.reload()
}

function buildBoardsList(boards) {
  for(const board of boards){
    const item = document.createElement("li")
    item.innerHTML = `<a>○${board.title}</a>`
    item.setAttribute(`board-id`, board.id)
    item.addEventListener("click", function(event) {
      fetchBoard(event.target.parentElement.getAttribute("board-id"))
    })
    boardsList.appendChild(item)
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //event listeners
  //login/signup form submission
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);

  //login/signup toggle form on button click and toggle hide on cancel
  loginBtn.addEventListener("click", function () {
    loginFormDiv.style.display = "block";
  });

  //Edit navbar on login.  login becomes logout. signup button replaced with current useer firstname.

  signupBtn.addEventListener("click", function () {
    signupFormDiv.style.display = "block";
  });

  for (const button of cancelBtns) {
    button.addEventListener("click", closeForm);
  }
  function closeForm() {
    loginFormDiv.style.display = "";
    signupFormDiv.style.display = "";
  }

  // Auto login user
  if (localStorage.user) {
    renderUser()
  }
  /////////////////////////
  // User Functions: End //
  /////////////////////////

  createOrEditGoal()
});
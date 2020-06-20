const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const BOARDS_URL = `${BASE_URL}/boards`
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

const newGoalForm = document.querySelector(".new-goal-container")
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
////////////////////////////
// Board Functions: Start //
////////////////////////////

function fetchBoard(boardId) {
  fetch(BOARDS_URL + "/" + boardId)
    .then((resp) => resp.json())
    .then((json) => buildBoardCard(json.data));
}

function buildBoardCard(board) {
  // Delete old board if it exists
  if (document.getElementById("board-card")) {
    document.getElementById("board-card").remove();
  }
  // Build board card elements
  const boardCard = document.createElement("div")
  boardCard.id = "board-card"
  boardCard.setAttribute("board-id", board.id)
  boardCard.style.background = `url(assets/boards/${board.attributes.background})`

  const boardHeader = document.createElement("div")
  boardHeader.id = "board-header"

  const addGoalButton = document.createElement("button")
  addGoalButton.id = "add-goal-button"
  addGoalButton.setAttribute("board-id", board.id)
  addGoalButton.className = "togglebutton"
  addGoalButton.innerText = "Add Goal"
  addGoalButton.addEventListener("click", function() {
    newGoalForm.hidden = false
  })

  const boardTitleCard = document.createElement("div")
  boardTitleCard.id = "board-title-card"

  const boardTitle = document.createElement("h2")
  boardTitle.id = "board-title"
  boardTitle.innerText = board.attributes.title

  const boardCategory = document.createElement("h4")
  boardCategory.id = "board-category"
  boardCategory.innerText = board.attributes.category

  const boardButtonsCard = document.createElement("div")
  boardButtonsCard.id = "board-buttons-card"

  const editBoardButton = document.createElement("button")
  editBoardButton.id = "edit-board-button"
  editBoardButton.className = "togglebutton"
  editBoardButton.innerText = "Edit Board"
  editBoardButton.addEventListener("click", event => buildBoardForm(board.id))

  const deleteBoardButton = document.createElement("button")
  deleteBoardButton.id = "delete-board-button"
  deleteBoardButton.className = "togglebutton"
  deleteBoardButton.innerText = "Delete Board"
  deleteBoardButton.addEventListener("click", event => deleteBoard(board.id))

  const goalsGrid = document.createElement("div")
  // goalsGrid.id = "goals-grid"
  goalsGrid.id = "notes";

  // Assemble board card elements
  boardHeader.append(addGoalButton)
  boardTitleCard.append(boardTitle)
  boardTitleCard.append(boardCategory)
  boardHeader.append(boardTitleCard)
  boardButtonsCard.append(editBoardButton)
  boardButtonsCard.append(deleteBoardButton)
  boardHeader.append(boardButtonsCard)
  boardCard.append(boardHeader)
  boardCard.append(goalsGrid)
  document.querySelector("main").append(boardCard)

  // Fill board with goals
  board.attributes.goals.forEach(function (goal) {
    createGoalCard(goal);
  });
}

function buildBoardForm(boardId) {
  // Create form
  const boardForm = document.createElement("form");
  boardForm.id = "board-form";
  boardForm.className = "form-container"

  // Label form
  const formLabel = document.createElement("h2");

  // Create from fields
  const titleCard = document.createElement("div");
  titleCard.className = "board-form-input";
  const titleLabel = document.createElement("p");
  titleLabel.innerText = "Title: ";
  const titleInput = document.createElement("input");
  titleInput.name = "title";

  const categoryCard = document.createElement("div");
  categoryCard.className = "board-form-input";
  const categoryLabel = document.createElement("p");
  categoryLabel.innerText = "Category: ";
  const categoryInput = document.createElement("select");
  categoryInput.name = "category";

  let values = ["Career", "Education", "Family", "Financial", "Health", "Home", "Other", "Personal", "Relationship", "Self Improvement", "Travel"];
  for (const val of values) {
    const option = document.createElement("option");
    option.value = val;
    option.text = val;
    categoryInput.appendChild(option);
  }

  const backgroundCard = document.createElement("div");
  backgroundCard.className = "board-form-input";
  const backgroundLabel = document.createElement("p");
  backgroundLabel.innerText = "Background: ";
  const backgroundInput = document.createElement("select");
  backgroundInput.setAttribute("type", "text");
  backgroundInput.name = "background";

  
  values = ["black_board.jpg", "cork_board.jpg", "dragon.jpg", "green_board.jpg", "monster_truck.jpg", "rocket.png", "school.jpg", "space.jpg", "unicorn.jpg"]
  for (const val of values) {
    const option = document.createElement("option");
    option.value = val;
    option.text = val;
    backgroundInput.appendChild(option);
  }
  
  // Create from buttons
  const buttonCard = document.createElement("div");
  backgroundCard.className = "board-form-input";
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";
  cancelButton.className = "btn2"
  cancelButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("board-form").remove();
  });
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  submitButton.className = "btn"
  if (!!boardId) {
    submitButton.setAttribute("board-id", boardId);
  }
  submitButton.addEventListener("click", (event) => createEditBoard(event));

  // Fill form if it is an edit form
  if (!!boardId) {
    formLabel.innerText = "Edit Board";
    titleInput.value = document.getElementById("board-title").innerText;
    categoryInput.value = document.getElementById("board-category").innerText;
    backgroundInput.value = document
      .getElementById("board-card")
      .style.background.split("/")
      .slice(-1)[0]
      .slice(0, -2);
  } else {
    formLabel.innerText = "New Board";
  }

  // Assemble form elements
  boardForm.append(formLabel);
  titleCard.append(titleLabel);
  titleCard.append(titleInput);
  boardForm.append(titleCard);
  boardForm.append(document.createElement("br"));
  categoryCard.append(categoryLabel);
  categoryCard.append(categoryInput);
  boardForm.append(document.createElement("br"));
  boardForm.append(categoryCard);
  backgroundCard.append(backgroundLabel);
  backgroundCard.append(backgroundInput);
  boardForm.append(document.createElement("br"));
  boardForm.append(backgroundCard);
  buttonCard.append(submitButton);
  buttonCard.append(cancelButton);
  boardForm.append(buttonCard);

  document.querySelector("main").append(boardForm);
}

function createEditBoard(event) {
  // Prevent redirect from submit button press
  event.preventDefault();
  // Setup fetch options for PATCH request, these will be changed for a new POST request
  const body = {
    title: event.target.form.querySelector("input[name='title']").value,
    category: event.target.form.querySelector("select[name='category']").value,
    background: event.target.form.querySelector("select[name='background']").value,
  };
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  };
  // Check if the board ID is present to determine if this is a new or edited board
  if (event.target.getAttribute("board-id")) {
    // Create board edit fetch request
    const boardId = event.target.getAttribute("board-id");
    options.body = JSON.stringify(body);
    fetch(BOARDS_URL + "/" + boardId, options)
      .then((resp) => resp.json())
      .then(function (json) {
        if (json.errors) {
          buildErrorMsg(json)
        } else if(json.data.id === boardId){
          event.target.form.remove();
          buildBoardCard(json.data);
        }
      });
  } else {
    // Create new board fetch request
    options.method = "POST";
    body.user_id = window.user.id;
    options.body = JSON.stringify(body);
    fetch(BOARDS_URL, options)
      .then((resp) => resp.json())
      .then(function (json) {
        if (json.errors) {
          // build error message from server for rendering
          buildErrorMsg(json)
        } else if (json.data) {
          console.log(json.data)
          event.target.form.remove();
          buildBoardCard(json.data);
          buildBoardsList(json.data)
        }
      });
  }
}

function deleteBoard(boardId) {
  // Confirm delete request
  if (
    confirm(
      "Deleting a board will also delete all related goals. This action cannot be undone. Are you sure you want to delete this board?"
    )
  ) {
    // Setup delete request options
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };
    // Send delete request to server
    fetch(BOARDS_URL + "/" + boardId, options)
      .then((resp) => resp.json())
      .then(async function (json) {
        // Verify the data was deleted on server side via confirmation
        if (json.data.id) {
          // Delete board from DOM
          document.querySelector("#board-card").remove()
          //Delete Board from boards list
         boardsList.querySelector(`li[board-id="${boardId}"]`).remove()
          // Update user data now that board has been deleted
          await fetchUser(window.user.attributes.email)
          if (window.user.attributes.boards.length > 0) {
            fetchBoard(window.user.attributes.boards[0].id);
          } else {
            buildBoardForm();
          }
        }
      });
  }
}

//////////////////////////
// Board Functions: End //
//////////////////////////

///////////////////////////
// Goal Functions: Start //
///////////////////////////

const statusInput = document.getElementById("status")
statusInput.style.margin = "25px"
const submitButton = document.getElementById("submit-button")
const newGoalEditButton = document.getElementById("cancel-button")

newGoalEditButton.addEventListener("click", function(event) {
  event.preventDefault();
  document.getElementById("new-goal").reset()
  newGoalForm.hidden = true
})

function createGoalCard(goal) {
  const goalsSection = document.getElementById("notes");
  const note = document.createElement("div");
  const h2 = document.createElement("h2");
  const p = document.createElement("p");
  const h4 = document.createElement("h4");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  const nameInput = document.getElementById("name")
  const descriptionInput = document.getElementById("description")

  editButton.innerText = "Edit";
  deleteButton.innerText = "Delete";
  editButton.style.marginRight = "5px";
  deleteButton.style.marginLeft = "5px";
  editButton.className = "togglebutton";
  deleteButton.className = "togglebutton";

  goalsSection.appendChild(note);
  note.appendChild(h2);
  note.appendChild(p);
  note.appendChild(h4);
  note.appendChild(deleteButton);
  note.appendChild(editButton);

  note.setAttribute("goal-id", goal.id);
  h2.innerHTML = goal.title;
  p.innerHTML = goal.content;
  h4.innerHTML = goal.status;

  deleteButton.addEventListener("click", function () {
    note.remove();
    return fetch(`${GOALS_URL}/${goal.id}`, {
      method: "DELETE",
    }).then((response) =>
      response.json().then((json) => {
        return json;
      })
    );
  });

  editButton.addEventListener("click", function() {
    newGoalForm.hidden = false
    goalFormLabel.innerHTML = `<strong>Edit ${goal.title}</strong>`
    nameInput.value = goal.title
    descriptionInput.value = goal.content
    statusInput.value = goal.status
    submitButton.setAttribute("goal-id", goal.id)
    submitButton.value = "Complete Edit"
  })
}

function createOrEditGoal() {
  newGoalForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const goal = {
      id: event.target[3].getAttribute("goal-id"),
      title: `${event.target[0].value}`,
      content: `${event.target[1].value}`,
      status: `${event.target[2].value}`,
    };
    const data = {
      board_id: document.getElementById("board-card").getAttribute("board-id"),
      title: goal.title,
      content: goal.content,
      status: goal.status
    }
    if (submitButton.value === "Complete Edit") {
      let editedGoal = document.querySelector(`div[goal-id = "${goal.id}"]`)
      let title = editedGoal.querySelector("h2")
      let content = editedGoal.querySelector("p")
      let status = editedGoal.querySelector("h4")
      title.innerHTML = `${event.target[0].value}`
      content.innerHTML = `${event.target[1].value}`
      status.innerHTML = `${event.target[2].value}`
      fetch(`${GOALS_URL}/${goal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
    }
    else {
      fetch(`${GOALS_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(function(json) {
        if (json.errors){
          buildErrorMsg(json)
        } else {
        fetchBoard(data.board_id)
        document.getElementById("new-goal").reset()
        goalFormLabel.innerHTML = `<strong>Create New Goal</strong>`
        statusInput.value = "-- Select a Status --"
        newGoalForm.hidden = true
        submitButton.value = "Submit"
        }  
      })
  }
  
  });
}

/////////////////////////
// Goal Functions: End //
/////////////////////////

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
        window.user = json.data;
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
  if (window.user.attributes.boards.length > 0) {
    fetchBoard(window.user.attributes.boards[0].id);
  } else {
    buildBoardForm();
  }
  // Update nav bar
  changeNavbar(window.user);
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
let currentUserUrl = `http://localhost:3000/users/${window.user.id}`

fetch(currentUserUrl)
.then(resp => resp.json())
.then(object => buildBoardsList(object.data.attributes.boards))
loginBtn.style.display = "none"
newBoardBtn.style.display = "inline-block"
logoutBtn.style.display = "inline-block"
newBoardBtn.addEventListener("click", () => buildBoardForm())
logoutBtn.addEventListener("click", () => {logoutUser(navbarUsername)})
const navbarUsername = document.createElement("li")
navbarUsername.style.float="right"
navbarUsername.innerHTML = `<a>Logged in as: ${currentUser.attributes.first_name}</a>`
menuList.replaceChild(navbarUsername, signupBtn)
}

function logoutUser(navbarUsername) {
  document.querySelector(".home-page-text").hidden = false
  newBoardBtn.style.display = "none"
  logoutBtn.style.display = "none" 
  loginBtn.style.display = "inline-block"
  menuList.replaceChild(signupBtn, navbarUsername)
  window.user = ""
  location.reload()
}

function buildBoardsList(boards) { // Refactor WIP 
  if (boards.length > 1){ 
  for(board of boards){
    const item = document.createElement("li")
    item.innerHTML = `<a>○${board.title}</a>`
    item.setAttribute(`board-id`, board.id)
    item.addEventListener("click", function(event) {
      fetchBoard(event.target.parentElement.getAttribute("board-id"))
    })
    boardsList.appendChild(item)
  
    }
  } else {
    const item = document.createElement("li")
    item.innerHTML = `<a>○${boards.attributes.title}</a>`
    console.log(boards)
    item.setAttribute(`board-id`, boards.id)
    item.addEventListener("click", function(event) {
      fetchBoard(event.target.parentElement.getAttribute("board-id"))
    })
    if(!boardsList.contains(item)){
    boardsList.appendChild(item)
    }
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
  /////////////////////////
  // User Functions: End //
  /////////////////////////

  createOrEditGoal()
});


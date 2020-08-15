import { BOARDS_URL, newGoalForm } from "./index.js";

export function fetchBoard(boardId) {
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

export function buildBoardForm(boardId) {
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
      }).then(location.reload());
  } else {
    // Create new board fetch request
    options.method = "POST";
    body.user_id = JSON.parse(localStorage.user).id;
    options.body = JSON.stringify(body);
    fetch(BOARDS_URL, options)
      .then((resp) => resp.json())
      .then(function (json) {
        if (json.errors) {
          // build error message from server for rendering
          buildErrorMsg(json)
        } else if (json.data.id) {
          event.target.form.remove();
          buildBoardCard(json.data);
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
          // Update user data now that board has been deleted
          await fetchUser(JSON.parse(localStorage.user).attributes.email)
          if (JSON.parse(localStorage.user).attributes.boards.length > 0) {
            fetchBoard(JSON.parse(localStorage.user).attributes.boards[0].id);
          } else {
            buildBoardForm();
          }
        }
      });
  }
}
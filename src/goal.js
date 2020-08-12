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
        fetchBoard(data.board_id)
      })
  }
    document.getElementById("new-goal").reset()
    goalFormLabel.innerHTML = `<strong>Create New Goal</strong>`
    statusInput.value = "-- Select a Status --"
    newGoalForm.hidden = true
    submitButton.value = "Submit"
  });
}
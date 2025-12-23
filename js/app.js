// Student: lama issa (12326179)

const STUDENT_ID = "12326179";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";


const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}


document.addEventListener("DOMContentLoaded", function () {
  setStatus("loading tasks..." );

  fetch(API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY)
    .then(function (res) 
    {
      return res.json();
    })
    .then(function (data) 
    {
      list.innerHTML = "";

      if (data.tasks) 
        {
        data.tasks.forEach(function (task) 
        {
          renderTask(task);
        });

        setStatus("");
      } else
         {
        setStatus("no tasks found");
      }
    })

    .catch(function () 
    {
      setStatus("Error loading tasks", true);
    });
});


if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var title = input.value.trim();
    if (title === "") return;
    setStatus("adding task...");

    fetch(API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY, 
      {
      method: "POST",
      headers: 
      {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( { title: title } ),
    })

      .then(function (res) 
      {
        return res.json();
      })

      .then(function (data)
       {
        if (data.success)
           {
          renderTask(data.task);
          input.value = "";
          setStatus("task added");
        } 
        else 
          {
          setStatus("Error adding task" , true );
        }
      })

      .catch(function ()
       {
        setStatus("Error adding task" , true );
      });
  });
}


function renderTask(task) {

  var li = document.createElement("li");
  li.className = "task-item";
  var span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;
  var btn = document.createElement("button");
  btn.className = "task-delete";
  btn.textContent = "Delete";

  btn.addEventListener("click", function ()
   {
    if (!confirm("delete this task?" )) return;

    setStatus("deleting task..." );

   fetch(API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + task.id)
  .then(function (res)
   {
    return res.json();
  })
  .then(function (data) 
  {
    if (data.success)
       {
      li.remove();
      setStatus("task deleted" );
    }
  })
  .catch(function () 
  {
    setStatus("Error deleting task", true) ;
  });

  });

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}

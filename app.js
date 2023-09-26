const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { format, isValid } = require("date-fns");
let db = null;
let dbPath = path.join(__dirname, "todoApplication.db");
initializeDbServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => console.log("Server Running..."));
};

initializeDbServer();

statusChecking = (request, response, next) => {
  let { status = "" } = request.query;
  if (status !== "") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    next();
  }
};

priorityChecking = (request, response, next) => {
  let { priority = "" } = request.query;
  if (priority !== "") {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else {
    next();
  }
};

categoryChecking = (request, response, next) => {
  let { category = "" } = request.query;
  if (category !== "") {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    next();
  }
};

statusCheckingUpdate = (request, response, next) => {
  let { status = "" } = request.body;
  if (status !== "") {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    next();
  }
};

priorityCheckingUpdate = (request, response, next) => {
  let { priority = "" } = request.body;
  if (priority !== "") {
    if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else {
    next();
  }
};

categoryCheckingUpdate = (request, response, next) => {
  let { category = "" } = request.body;
  if (category !== "") {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    next();
  }
};

statusCheckingBody = (request, response, next) => {
  let { status = "" } = request.body;
  if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
    next();
  } else {
    response.status(400);
    response.send("Invalid Todo Status");
  }
};

priorityCheckingBody = (request, response, next) => {
  let { priority = "" } = request.body;
  if (priority === "HIGH" || priority === "MEDIUM" || priority === "LOW") {
    next();
  } else {
    response.status(400);
    response.send("Invalid Todo Priority");
  }
};

categoryCheckingBody = (request, response, next) => {
  let { category = "" } = request.body;
  if (category === "WORK" || category === "HOME" || category === "LEARNING") {
    next();
  } else {
    response.status(400);
    response.send("Invalid Todo Category");
  }
};

dateCheckingBody = (request, response, next) => {
  let { dueDate = "" } = request.body;
  if (isValid(new Date(dueDate))) {
    next();
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
};

app.get(
  "/todos/",
  statusChecking,
  priorityChecking,
  categoryChecking,
  async (request, response) => {
    let {
      status = "",
      category = "",
      search_q = "",
      priority = "",
    } = request.query;

    const getTodosQuery = `
   SELECT id,todo,priority,status,category,due_date AS dueDate
   FROM todo
   WHERE status LIKE '%${status}%' AND 
   category LIKE '%${category}%' AND 
   todo LIKE '%${search_q}%'
   AND priority LIKE '%${priority}%'`;
    let getTodos = await db.all(getTodosQuery);
    response.status(200);
    response.send(getTodos);
  }
);

app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const getTodoQuery = `SELECT id,todo,priority,status,category,due_date AS dueDate
FROM todo 
WHERE id = ${todoId}`;
  let getTodo = await db.get(getTodoQuery);
  response.send(getTodo);
});

app.get("/agenda/", async (request, response) => {
  let { date } = request.query;
  if (isValid(new Date(date))) {
    let formatted_date = format(new Date(date), "yyyy-MM-dd");
    const getTodoQuery = `SELECT id,todo,category,priority,status,due_date AS dueDate
   FROM todo
   WHERE due_date = '${formatted_date}'`;
    const getTodo = await db.all(getTodoQuery);
    response.send(getTodo);
  } else {
    response.status(400);
    response.send("Invalid Due Date");
  }
});

app.post(
  "/todos/",
  statusCheckingBody,
  priorityCheckingBody,
  categoryCheckingBody,
  dateCheckingBody,
  async (request, response) => {
    const { id, todo, priority, status, category, dueDate } = request.body;
    let formatted_date = format(new Date(dueDate), "yyyy-MM-dd");
    const createTodoQuery = `INSERT INTO todo(id,todo,priority,status,category,due_date)
    VALUES(${id},'${todo}','${priority}','${status}','${category}','${formatted_date}')`;
    await db.run(createTodoQuery);
    response.status(200);
    response.send("Todo Successfully Added");
  }
);

app.put(
  "/todos/:todoId/",
  statusCheckingUpdate,
  priorityCheckingUpdate,
  categoryCheckingUpdate,
  async (request, response) => {
    let { todoId } = request.params;
    const {
      status = "",
      priority = "",
      category = "",
      dueDate = "",
      todo = "",
    } = request.body;
    if (status !== "") {
      const updateQuery = `UPDATE todo SET status='${status}' WHERE id = ${todoId}`;
      await db.run(updateQuery);
      response.status(200);
      response.send("Status Updated");
    } else if (priority !== "") {
      const updateQuery = `UPDATE todo SET priority='${priority}' WHERE id = ${todoId}`;
      await db.run(updateQuery);
      response.status(200);
      response.send("Priority Updated");
    } else if (todo !== "") {
      const updateQuery = `UPDATE todo SET todo='${todo}' WHERE id = ${todoId}`;
      await db.run(updateQuery);
      response.status(200);
      response.send("Todo Updated");
    } else if (category !== "") {
      const updateQuery = `UPDATE todo SET category='${category}' WHERE id = ${todoId}`;
      await db.run(updateQuery);
      response.status(200);
      response.send("Category Updated");
    } else if (dueDate !== "") {
      if (isValid(new Date(dueDate))) {
        let formatted_date = format(new Date(dueDate), "yyyy-MM-dd");
        const getTodoQuery = `UPDATE todo SET due_date='${formatted_date}' WHERE id = ${todoId}`;
        await db.run(getTodoQuery);
        response.send("Due Date Updated");
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
    }
  }
);

app.delete("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  const deleteTodo = `DELETE FROM todo WHERE id = ${todoId}`;
  await db.run(deleteTodo);
  response.status(200);
  response.send("Todo Deleted");
});

module.exports = app;

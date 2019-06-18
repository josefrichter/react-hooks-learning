import React, { useState, useReducer } from "react";
import uuid from "uuid";

const initialTodos = [
  {
    id: uuid(),
    task: "Learn React",
    complete: true
  },
  {
    id: uuid(),
    task: "Learn Firebase",
    complete: true
  },
  {
    id: uuid(),
    task: "Learn GraphQL",
    complete: false
  }
];

const App = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(initialTodos);

  const handleChangeInput = event => {
    setTask(event.target.value);
  };

  const handleSubmit = e => {
    if (task) {
      setTodos(todos.concat({ id: uuid(), task, complete: false }));
    }
    setTask("");
    e.preventDefault();
  };

  const handleChangeCheckbox = id => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, complete: !todo.complete };
        } else {
          return todo;
        }
      })
    );
    // console.log(todos);
  };

  const handleShowAll = () => {
    dispatchFilter({ type: "SHOW_ALL" });
  };

  const handleShowComplete = () => {
    dispatchFilter({ type: "SHOW_COMPLETE" });
  };

  const handleShowIncomplete = () => {
    dispatchFilter({ type: "SHOW_INCOMPLETE" });
  };

  // The reducer function computes the new state. Often the current state from the reducer function’s argument is used to compute the new state with the incoming action. But in this simpler example, we only transition from one JavaScript string to another string as state.
  const reducer = (state, action) => {
    switch (action.type) {
      case "SHOW_ALL":
        return "ALL";
      case "SHOW_COMPLETE":
        return "COMPLETE";
      case "SHOW_INCOMPLETE":
        return "INCOMPLETE";
      default:
        throw new Error();
    }
  };

  const [filter, dispatchFilter] = useReducer(reducer, "ALL");

  const filteredTodos = todos.filter(todo => {
    if (filter === "ALL") {
      return true;
    }
    if (filter === "COMPLETE" && todo.complete) {
      return true;
    }
    if (filter === "INCOMPLETE" && !todo.complete) {
      return true;
    }
    return false;
  });

  return (
    <div>
      <div>
        <button type="button" onClick={handleShowAll}>
          Show All
        </button>
        <button type="button" onClick={handleShowComplete}>
          Show Complete
        </button>
        <button type="button" onClick={handleShowIncomplete}>
          Show Incomplete
        </button>
      </div>
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            {todo.task}
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => handleChangeCheckbox(todo.id)}
            />
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={task} onChange={handleChangeInput} />

        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export default App;

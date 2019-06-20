// based on https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext/
import React, { useState, useReducer, createContext, useContext } from "react";
import uuid from "uuid/v4";

// here I initialize a context with no initial value
const TodoContext = createContext(null);

// this is dummy data
const initalTodos = [
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

// reducer for filtering ToDos
// this is a dumb one that just "translates" action type to a string
// but it does NOT modify the state at all, which is usually the point of reducers
const filterReducer = (state, action) => {
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

// this is a typical reducer
// it receives a state and action, performs that action and returns new state
const todoReducer = (state, action) => {
  switch (action.type) {
    case "DO_TODO":
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: true };
        } else {
          return todo;
        }
      });
    case "UNDO_TODO":
      return state.map(todo => {
        if (todo.id === action.id) {
          return { ...todo, complete: false };
        } else {
          return todo;
        }
      });
    case "ADD_TODO":
      // Array concat appends new items to array and returns NEW array
      return state.concat({
        task: action.task,
        id: uuid(),
        complete: false
      });
    default:
      throw new Error();
  }
};

const App = () => {
  // the useReducer hook basically holds the state, kinda like useState
  // const [state, modifyState] = useState(defaultValue)
  const [filter, dispatchFilter] = useReducer(filterReducer, "ALL");
  const [todos, dispatchTodos] = useReducer(todoReducer, initalTodos);

  // not 100% sure how this one triggers re-rendering??
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
    // replaced the wrapper <div> with the Provider
    // so that no nested component needs to receive dispatch={dispatchTodos}
    // instead we can use it in any component via useContext
    <TodoContext.Provider value={dispatchTodos}>
      <Filter dispatch={dispatchFilter} />
      <TodoList todos={filteredTodos} />
      <AddTodo />
    </TodoContext.Provider>
  );
};

// Filter components receives the dispatchFilter function
// via the dispatch prop
const Filter = ({ dispatch }) => {
  const handleShowAll = () => {
    dispatch({ type: "SHOW_ALL" });
  };

  const handleShowComplete = () => {
    dispatch({ type: "SHOW_COMPLETE" });
  };

  const handleShowIncomplete = () => {
    dispatch({ type: "SHOW_INCOMPLETE" });
  };

  return (
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
  );
};

const TodoList = ({ todos }) => (
  <ul>
    {todos.map(todo => (
      <TodoItem key={todo.id} todo={todo} />
    ))}
  </ul>
);

// on the other hand, TodoItem component doesn't receive the dispatchTodos function via props
// but instead directly via useContext
// As a benefit, the dispatch prop doesn't need to pass through the parent TodoList component
// which it initially did using dispatch={dispatch} prop (aka. prop drilling)
const TodoItem = ({ todo }) => {
  const dispatch = useContext(TodoContext);
  const handleChange = () =>
    dispatch({
      type: todo.complete ? "UNDO_TODO" : "DO_TODO",
      id: todo.id
    });

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.complete}
          onChange={handleChange}
        />
        {todo.task}
      </label>
    </li>
  );
};

// AddTodo uses useState to keep input field content as its state
// Once submitted, it dispatches this state with ADD_TODO action to the todoReducer
const AddTodo = () => {
  const [task, setTask] = useState("");
  const dispatch = useContext(TodoContext);

  const handleSubmit = event => {
    if (task) {
      dispatch({ type: "ADD_TODO", task });
    }

    setTask("");

    event.preventDefault();
  };

  const handleChange = event => setTask(event.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={task} onChange={handleChange} />
      <button type="submit">Add Todo</button>
    </form>
  );
};

export default App;

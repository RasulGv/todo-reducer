
import React, { useReducer, useState, useEffect } from 'react';
import './App.css';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { GiSaveArrow } from "react-icons/gi";
import { IoAddOutline } from "react-icons/io5";

const initialState = JSON.parse(localStorage.getItem('todos')) || [];

function reducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, { id: action.id, text: action.text }];
    case 'delete':
      return state.filter(todo => todo.id !== action.id);
    case 'edit':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, text: action.text } : todo
      );
    default:
      return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(state));
  }, [state]);

  const handleAddTodo = () => {
    if (text.trim() !== '') {
      dispatch({ type: 'add', id: Date.now(), text });
      setText('');
    }
  };

  const handleEditTodo = (id, text) => {
    setIsEditing(true);
    setText(text);
    setCurrentTodoId(id);
  };

  const handleSaveEdit = () => {
    dispatch({ type: 'edit', id: currentTodoId, text });
    setText('');
    setIsEditing(false);
    setCurrentTodoId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (isEditing) {
        handleSaveEdit();
      } else {
        handleAddTodo();
      }
    }
  };

  return (
    <div className="App">
     <span>Todolist</span>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Press Enter "
      />
      {isEditing ? (
        <button onClick={handleSaveEdit}><GiSaveArrow /></button>
      ) : (
        <button onClick={handleAddTodo}><IoAddOutline /></button>
      )}
      <ul>
        {state.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <div>
              <button onClick={() => handleEditTodo(todo.id, todo.text)}><CiEdit /></button>
              <button onClick={() => dispatch({ type: 'delete', id: todo.id })}><MdDelete /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;

// frontend/src/components/TodoList.js
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001/api';

function TodoList({ username, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, [username]); // Refetch when username changes (e.g., after login)

    // 1. READ: Fetch all todos for the current user
    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/todos/${username}`);
            
            if (!response.ok) {
                console.error('Failed to fetch todos:', response.statusText);
                return;
            }

            const data = await response.json();
            setTodos(data);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    // 2. CREATE: Add a new todo
    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await fetch(`${API_URL}/todos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, task: newTask }),
            });

            if (!response.ok) {
                console.error('Failed to add todo:', response.statusText);
                return;
            }

            const newTodo = await response.json();
            // Add the new item to the beginning of the list
            setTodos([newTodo, ...todos]); 
            setNewTask('');
        } catch (err) {
            console.error('Error adding todo:', err);
        }
    };

    // 3. UPDATE: Toggle the 'done' status
    const handleToggleDone = async (id, currentDoneStatus) => {
        const newDoneStatus = !currentDoneStatus;
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: newDoneStatus }),
            });

            if (!response.ok) {
                console.error('Failed to update todo:', response.statusText);
                return;
            }

            // Update the status in the local state immediately
            setTodos(todos.map(todo => 
                todo.id === id ? { ...todo, done: newDoneStatus } : todo
            ));
        } catch (err) {
            console.error('Error toggling done status:', err);
        }
    };

    // 4. DELETE: Remove a todo item
    const handleDeleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                 console.error('Failed to delete todo:', response.statusText);
                return;
            }

            // Filter out the deleted item from the state
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const handleLogout = () => {
        // Clear storage and trigger state change in App.js
        localStorage.removeItem('todo_username');
        onLogout();
    };

    return (
        <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            <div style={{justifyContent: 'space-between', alignItems: 'center',display: 'block', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
                <h3>Todo List for: {username}</h3>
                <button className="btn btn-outline-danger" onClick={handleLogout} style={{ marginTop:'0px', marginBottom: '5px'}}>Logout</button>
            </div>
            
            <form onSubmit={handleAddTodo} style={{marginTop: '5px',marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="New Task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit">Add Task</button>
            </form>

            <ul style={{ display: 'table', listStyleType: 'none',  padding: 0, marginLeft: 'auto', marginRight: 'auto', borderTop: '1.5px solid #727070ff', minWidth: '300px' }}>
                
                {todos.map(todo => (
                    <li key={todo.id} style={{ marginTop: '10px', marginBottom: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', backgroundColor: '#f9fafb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                                type="checkbox"
                                checked={!!todo.done} // Convert MySQL's 0/1 to boolean
                                onChange={() => handleToggleDone(todo.id, todo.done)}
                            />
                            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.task}</span>
                            <button className="btn btn-outline-danger" onClick={() => handleDeleteTodo(todo.id)} style={{ marginLeft: '15px', padding: '5px 10px', fontSize: '14px'}}>Delete</button>
                        </div>
                        <small> (Updated: {new Date(todo.updated).toLocaleString()})</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
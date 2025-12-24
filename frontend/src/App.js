// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TodoList from './components/TodoList';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from './ceip_logo.png';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // Check for stored username on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('todo_username');
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    const handleLogin = (username) => {
        setCurrentUser(username);
    };

    const handleLogout = () => {
        // Clear username from local storage and state
        localStorage.removeItem('todo_username');
        setCurrentUser(null);
    };

    return (
        <div style={{ display: 'table', width: '80%', minHeight: '100% ', margin: '0 auto',marginTop: '20px', marginBottom: 'auto'}}>
            <div style={{ display: 'table-cell' }}>
                <div className="App" style={{ margin: '0 auto', textAlign: 'center', minHeight: '95vh', border: '1.5px solid #727070ff', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="Header">
                        <img 
                            src={logo} 
                            alt="Todo App Logo" 
                            style={{ width: '100px', marginBottom: '15px', marginTop: 'auto' }} 
                        />
                        <h2>Full Stack Todo App</h2>
                    </div>
                    {/* Conditional rendering based on login status */}
                    {currentUser ? (
                        <TodoList username={currentUser} onLogout={handleLogout} />
                    ) : (
                        <Login onLogin={handleLogin} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
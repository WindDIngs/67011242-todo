// frontend/src/components/Login.js
import React, { useState } from 'react';
import logo from '../ceip_logo.png';    

const API_URL = 'http://localhost:5001/api';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }

        try {
            // Use Fetch API for POST request
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }), // Convert object to JSON string
            });

            // Check if the response status is OK (200-299)
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed due to server error.');
                return;
            }

            const data = await response.json(); // Parse the response body as JSON

            if (data.success) {
                localStorage.setItem('todo_username', username);
                onLogin(username); // Update App component state
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            // Handle network connection errors
            setError('Network error: Could not connect to the server.');
            console.error(err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <table style={{ border: '1px solid #ccc', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ccc' }}>
                            <h2 style={{ margin: 0 }}>Login (Username Only)</h2>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '30px' }}>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button type="submit" className="btn btn-outline-primary" style={{ padding: '8px 16px' }}>
                                    Login
                                </button>
                            </form>
                            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Login;
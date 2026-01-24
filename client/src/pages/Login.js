import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            setLoggedIn(true);
            const storedUsername = localStorage.getItem('username') || username;
            if (storedUsername) {
                navigate('/dashboard/' + storedUsername);
            }
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            // FIXED: Use regular fetch, not fetchWithAuth (no token yet)
            // FIXED: Use relative URL instead of environment variable
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });

            const result = await response.json();
            
            if (response.ok) {
                // FIXED: Handle new response format with user object
                const { authToken, user } = result;
                localStorage.setItem('authToken', authToken);
                
                // Store user info
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('username', user.username);
                    navigate(`/dashboard/${user.username}`);
                } else {
                    // Fallback if backend doesn't return user object
                    localStorage.setItem('username', username);
                    navigate(`/dashboard/${username}`);
                }
            } else {
                setError(result.message || 'Failed to log in');
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            setError(error.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Please Log In
            </Typography>
            
            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: '400px',
                    width: '100%',
                }}
            >
                <TextField 
                    label="Username" 
                    variant="outlined" 
                    fullWidth 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField 
                    type="password" 
                    label="Password" 
                    variant="outlined" 
                    fullWidth 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Box>
    );
}

export default Login;
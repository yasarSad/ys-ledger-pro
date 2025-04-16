import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { fetchWithAuth } from '../api/api';
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false); // Changed from true
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Changed from useHistory

    useEffect(() => {
        const authToken = localStorage.getItem('authToken'); // Fixed authToken reference
        if (authToken) {
            setLoggedIn(true);
            navigate('/dashboard/' + username); // Changed from history.push
        }
    }, [username, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/auth/login`, {
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
            if (response.ok) { // Changed from result.ok
                const { authToken, username } = result;
                localStorage.setItem('authToken', authToken);
                navigate(`/dashboard/${username}`); // Changed from history.push
                setLoading(false);
            } else {
                setError(result.message || 'Failed to log in');
                setLoading(false);
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            setError(error.message);
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
            <Typography variant="h4" gutterBottom> {/* Changed from h1 for better sizing */}
                Please Log In
            </Typography>
            

            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Added for better form layout
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
                />
                <TextField 
                    type="password" 
                    label="Password" 
                    variant="outlined" 
                    fullWidth 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    disabled={loading} // Changed from loaded
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </form>
        </Box>
    );
}

export default Login;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, TextField, Button, Box } from '@mui/material';
import { fetchWithAuth } from '../api/api';
function EditProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [monthlySpendings, setMonthlySpendings] = useState(0);
    const [goals, setGoals] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const response = await fetchWithAuth('/api/users/get-signup', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Failed to fetch user data');

                const data = await response.json();
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setMonthlySpendings(data.monthly_spendings || 0);
                setGoals(data.goals || '');
                setPassword(data.password || '');
            } catch (error) {
                setError(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!firstName || !lastName || !monthlySpendings || !goals || !password) {
            setError('Please fill out all fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/users/edit-signup', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ first_name: firstName, last_name: lastName, monthly_spendings: monthlySpendings, goals, username, password }),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            navigate('/dashboard');
        } catch (error) {
            setError(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

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
                Edit Profile
            </Typography>
        
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
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
                    <TextField label="First Name" variant="outlined" fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <TextField label="Last Name" variant="outlined" fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <TextField type="number" label="Monthly Spendings" variant="outlined" fullWidth value={monthlySpendings} onChange={(e) => setMonthlySpendings(e.target.value)} />
                    <TextField label="Goals" variant="outlined" fullWidth value={goals} onChange={(e) => setGoals(e.target.value)} />
                    <TextField label="Username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField type="password" label="Password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                        Edit
                    </Button>
                </form>
            )}
        </Box>
    );
}

export default EditProfile;

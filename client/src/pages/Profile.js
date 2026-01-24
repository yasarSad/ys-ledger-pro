import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import LogOff from '../components/LogOff';
import { fetchWithAuth } from '../api/api';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await fetchWithAuth('/api/users/get-signup');
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch');
                }

                const result = await response.json();
                // FIXED: Removed incorrect result.ok check
                setUserData(result);

            } catch (error) {
                console.error("Error:", error.message);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        getUserInfo();
    }, []);

    const username = localStorage.getItem('username');

    const seeAllTransaction = () => {
        window.location.href = `/all-transactions/${username}`;
    };

    const seeGoalVisual = () => {
        window.location.href = `/monthly-visual/${username}`;
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <LogOff />
            <Typography variant="h2" sx={{ mt: 2, mb: 3 }}>
                Welcome to your profile {userData?.first_name || 'User'}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4 }}>
                This is where you can see your organized consumption
                and see if it's all aligned with your goals.
            </Typography>

            <Box
                component="button"
                onClick={seeAllTransaction}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    mb: 2,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
            >
                <img
                    src="/pictures/data.jpg"
                    style={{ width: '100px', height: '100px' }}
                    alt="Data icon"
                />
                <Typography variant="h6">See all Transactions</Typography>
            </Box>

            <Box
                component="button"
                onClick={seeGoalVisual}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
            >
                <img
                    src="/pictures/bar-chart.png"
                    style={{ width: '100px', height: '100px' }}
                    alt="Bar chart icon"
                />
                <Typography variant="h6">See Goal Results</Typography>
            </Box>
        </Box>
    );
}

export default Profile;
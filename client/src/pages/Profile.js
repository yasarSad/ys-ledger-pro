import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import LogOff from '../components/LogOff';
import { fetchWithAuth } from '../api/api';

function Profile() {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await fetchWithAuth('/api/users/get-signup');
                if (!response.ok) {
                    console.log("Failed to Fetch")
                    return;
                }

                const result = await response.json();
                if (!result.ok) {
                    console.log("No data received")
                    return;
                }
                setUserData(result);

            } catch (error) {
                console.error("Error: ", error.message);
            }
        }
        getUserInfo();
    }, []); // Added dependency array

    const username = localStorage.getItem('username');

    const seeAllTransaction = () => {
        window.location.href = `/all-transactions/${username}`;
    }

    const seeGoalVisual = () => {
        window.location.href = `/monthly-visual/${username}`;
    }

    return (
        <Box>
            <LogOff />
            <Typography variant="h2">
                Welcome to your profile {userData?.first_name || 'User'}
            </Typography>

            <Typography>
                This where you can see you organized consumption
                and see if its all aligned with your goals
            </Typography>

            <Box
                component="button"
                onClick={seeAllTransaction}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 4  // fixed typo from 'gab' to 'gap'
                }}
            >
                <img
                    src="./pictures/data"
                    style={{ width: '100px', height: '100px' }}
                    alt="Data icon"  // added alt for accessibility
                />
                <Typography>See all Transactions</Typography>
            </Box>

            <Box
                component="button"
                onClick={seeGoalVisual}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 4  // fixed typo from 'gab' to 'gap'
                }}
            >
                <img
                    src="./pictures/bar-chart"
                    style={{ width: '100px', height: '100px' }}
                    alt="Bar chart icon"  // added alt for accessibility
                />
                <Typography>See Goal Results</Typography>
            </Box>
        </Box>
    );
}

export default Profile;
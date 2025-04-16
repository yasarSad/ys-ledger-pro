import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import LogOff  from '../components/LogOff';
import { fetchWithAuth } from '../api/api';

function Dashboard() {
    // fetch info and get user profile data (first name, last name, goal, and monthly_spending)

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [monthly_spendings, setMonthlySpendings] = useState(0);
    const [goals, setGoals] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
    try{
        const response = await fetchWithAuth('/api/users/get-signup',
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
                      Authorization : `Bearer ${localStorage.getItem('authToken')}`},
            
            body: JSON.stringify({
                first_name,
                last_name,
                monthly_spendings,
                goals
            }),


        });

        const result = await response.json();
            
        
        if(result.ok){
            setFirstName(result.first_name);
            setLastName(result.last_name);
            setMonthlySpendings(result.monthly_spendings);
            setGoals(result.goals);
            
        }
        else{
            console.log('failed to fetch user info');
            setError('Failed to load data');

        }
    }catch(error){
        console.error('The error is ', error);
    }finally{
        setLoading(false);

    }
}

fetchData();

        
}, []);

if (loading){
    return (
        <Box sx={{display: 'flex', justifyContent:'center', alighnItems: 'center', minHeight: '100vh'}}>
        <CircularProgress/>
        </Box>
    )
}



    return(
    
        <Box>
        <LogOff/>
        <Typography variant="h2"
        sx={{fontSize: '2rem',
        fontWeight: '700',
        color: '#084298'}}>
            Welcome {first_name} {last_name}
        </Typography>
        <Typography
        variant="body1">
            I see your goals are to <strong>{goals} </strong> and
            trying to  see your goals are to: {goals} and trying to spend at a minimum of <strong>{monthly_spendings} </strong>

        </Typography>
        <Typography
        variant="body1">
           At Zai Finacial Management we believe the more visual we provide a user the better they are to understand
                their progress. To acheive your goals financially you are provided with high quality visual representations of
                your spendings throughout the course of the month

        </Typography>

        </Box>
    );

};

export default Dashboard;

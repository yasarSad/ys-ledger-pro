import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    Card, 
    CardContent, 
    Grid,
    LinearProgress,
    Chip,
    Paper,
    Avatar,
    Divider,
    Alert
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    AccountBalance as AccountBalanceIcon,
    Timeline as TimelineIcon,
    EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import LogOff from '../components/LogOff';
import { fetchWithAuth } from '../api/api';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [monthly_spendings, setMonthlySpendings] = useState(0);
    const [goals, setGoals] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentSpending, setCurrentSpending] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchWithAuth('/api/users/get-signup', {
                    method: 'GET'
                });

                if (response.ok) {
                    const result = await response.json();
                    setFirstName(result.first_name);
                    setLastName(result.last_name);
                    setMonthlySpendings(result.monthly_spendings);
                    setGoals(result.goals);
                    
                    // Simulate current spending (you can replace with actual data)
                    setCurrentSpending(Math.floor(Math.random() * result.monthly_spendings));
                } else {
                    const result = await response.json();
                    console.error('Failed to fetch user info:', result.message);
                    setError(result.message || 'Failed to load data');
                }
            } catch (error) {
                console.error('The error is:', error);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading your dashboard...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Please try logging in again.
                </Typography>
            </Box>
        );
    }

    // Calculate percentage
    const spendingPercentage = Math.min((currentSpending / monthly_spendings) * 100, 100);
    const remainingBudget = monthly_spendings - currentSpending;
    const isOverBudget = currentSpending > monthly_spendings;

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 3
        }}>
            {/* Header Section */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 4
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                        sx={{ 
                            width: 64, 
                            height: 64, 
                            bgcolor: '#FF6B6B',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {first_name[0]}{last_name[0]}
                    </Avatar>
                    <Box>
                        <Typography 
                            variant="h3"
                            sx={{
                                fontWeight: '700',
                                color: 'white',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            Welcome back, {first_name}! 👋
                        </Typography>
                        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                            Let's check your financial progress
                        </Typography>
                    </Box>
                </Box>
                <LogOff />
            </Box>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Budget Overview Card */}
                <Grid item xs={12} md={8}>
                    <Card 
                        elevation={4}
                        sx={{ 
                            height: '100%',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            borderRadius: 3
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <AccountBalanceIcon sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
                                <Typography variant="h4" fontWeight="600">
                                    Monthly Budget Overview
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        Current Spending
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color={isOverBudget ? 'error' : 'primary'}>
                                        ${currentSpending.toLocaleString()}
                                    </Typography>
                                </Box>

                                <Box sx={{ position: 'relative', mb: 2 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={spendingPercentage}
                                        sx={{
                                            height: 20,
                                            borderRadius: 2,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 2,
                                                background: isOverBudget 
                                                    ? 'linear-gradient(90deg, #ff6b6b 0%, #ff5252 100%)'
                                                    : 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)'
                                            }
                                        }}
                                    />
                                    <Typography 
                                        variant="caption" 
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                        }}
                                    >
                                        {spendingPercentage.toFixed(1)}%
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Budget: ${monthly_spendings.toLocaleString()}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        fontWeight="bold"
                                        color={isOverBudget ? 'error' : 'success.main'}
                                    >
                                        {isOverBudget ? 'Over' : 'Remaining'}: $
                                        {Math.abs(remainingBudget).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Box>

                            {isOverBudget && (
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    You're over budget! Consider reviewing your spending habits.
                                </Alert>
                            )}

                            <Divider sx={{ my: 3 }} />

                            {/* Quick Stats */}
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 2, 
                                            bgcolor: '#f0f7ff',
                                            borderRadius: 2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            Daily Average
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold" color="primary">
                                            ${(currentSpending / 30).toFixed(2)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6}>
                                    <Paper 
                                        elevation={0}
                                        sx={{ 
                                            p: 2, 
                                            bgcolor: '#f0fff4',
                                            borderRadius: 2,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            Days Left
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold" color="success.main">
                                            {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Goals & Actions Card */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={3}>
                        {/* Financial Goal Card */}
                        <Grid item xs={12}>
                            <Card 
                                elevation={4}
                                sx={{ 
                                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                                    color: 'white',
                                    borderRadius: 3
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <TrophyIcon sx={{ fontSize: 36, mr: 1.5 }} />
                                        <Typography variant="h5" fontWeight="600">
                                            Your Goal
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
                                        "{goals}"
                                    </Typography>
                                    <Chip 
                                        label="In Progress" 
                                        sx={{ 
                                            mt: 2,
                                            bgcolor: 'rgba(255,255,255,0.3)',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Quick Actions Card */}
                        <Grid item xs={12}>
                            <Card elevation={4} sx={{ borderRadius: 3 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight="600" gutterBottom>
                                        Quick Actions
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                        <Paper 
                                            component={Link}
                                            to="/all-transactions"
                                            elevation={0}
                                            sx={{ 
                                                p: 2,
                                                bgcolor: '#f0f7ff',
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    bgcolor: '#e3f2fd',
                                                    transform: 'translateX(5px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TimelineIcon sx={{ color: '#667eea', mr: 2 }} />
                                                <Typography fontWeight="500" color="text.primary">
                                                    View All Transactions
                                                </Typography>
                                            </Box>
                                        </Paper>

                                        <Paper 
                                            component={Link}
                                            to="/monthly-visual"
                                            elevation={0}
                                            sx={{ 
                                                p: 2,
                                                bgcolor: '#f0fff4',
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                transition: 'all 0.3s',
                                                '&:hover': {
                                                    bgcolor: '#e8f5e9',
                                                    transform: 'translateX(5px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                {spendingPercentage < 75 ? 
                                                    <TrendingUpIcon sx={{ color: '#4caf50', mr: 2 }} /> :
                                                    <TrendingDownIcon sx={{ color: '#ff6b6b', mr: 2 }} />
                                                }
                                                <Typography fontWeight="500" color="text.primary">
                                                    Monthly Analytics
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Info Banner */}
                <Grid item xs={12}>
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: 3,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            borderRadius: 3
                        }}
                    >
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            💡 Financial Tip
                        </Typography>
                        <Typography variant="body1">
                            At Zai Financial Management, we believe visualization is key to understanding your financial health. 
                            Track your progress daily and adjust your spending to meet your goals!
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;
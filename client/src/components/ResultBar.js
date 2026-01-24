import React, { useEffect, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { 
    Typography, 
    Box, 
    CircularProgress,
    Card,
    CardContent,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Paper,
    Chip
} from '@mui/material';
import {
    BarChart as BarChartIcon,
    ShowChart as LineChartIcon,
    DonutLarge as DonutIcon
} from '@mui/icons-material';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ResultBar = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartType, setChartType] = useState('bar');
    const [monthlySpending, setMonthlySpending] = useState([]);
    const [userGoal, setUserGoal] = useState(0);

    useEffect(() => {
        const getBarData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                
                const response_bank = await fetch('/api/bank/purchases', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const response_user = await fetch('/api/users/get-signup', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response_bank.ok || !response_user.ok) {
                    throw new Error("Failed to fetch data");
                }

                const results_bank = await response_bank.json();
                const results_user = await response_user.json();

                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const labels = results_bank.map(item => {
                    const monthName = months[item.month - 1];
                    return `${monthName} ${item.year}`;
                });

                const amounts = results_bank.map(item => item.total_spent);
                const goal = results_user.monthly_spendings;

                setMonthlySpending(results_bank);
                setUserGoal(goal);

                // Create gradient for bar chart
                const createGradient = (ctx, chartArea) => {
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
                    gradient.addColorStop(1, 'rgba(75, 192, 192, 1)');
                    return gradient;
                };

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Monthly Spending',
                            data: amounts,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            borderRadius: 8,
                            hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                            hoverBorderColor: 'rgba(75, 192, 192, 1)',
                            hoverBorderWidth: 3
                        },
                        {
                            label: 'Spending Goal',
                            data: new Array(amounts.length).fill(goal),
                            type: 'line',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            pointRadius: 0,
                            borderWidth: 3,
                            borderDash: [10, 5],
                            fill: false,
                            tension: 0
                        }
                    ]
                });
                setLoading(false);

            } catch (err) {
                console.error('Error fetching chart data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        getBarData();
    }, []); 

    const handleChartTypeChange = (event, newType) => {
        if (newType !== null) {
            setChartType(newType);
        }
    };

    // Chart options with animations and interactivity
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            title: {
                display: true,
                text: 'Your Spending Journey',
                font: {
                    size: 20,
                    weight: 'bold'
                },
                padding: 20
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 16,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += '$' + context.parsed.y.toLocaleString();
                        
                        if (context.dataset.label === 'Monthly Spending' && userGoal > 0) {
                            const percentage = ((context.parsed.y / userGoal) * 100).toFixed(1);
                            label += ` (${percentage}% of goal)`;
                        }
                        return label;
                    },
                    footer: function(tooltipItems) {
                        const spending = tooltipItems[0].parsed.y;
                        if (spending > userGoal) {
                            return `⚠️ Over budget by $${(spending - userGoal).toLocaleString()}`;
                        } else {
                            return `✅ Under budget by $${(userGoal - spending).toLocaleString()}`;
                        }
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    },
                    font: {
                        size: 12
                    }
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeInOutQuart'
        }
    };

    const lineOptions = {
        ...commonOptions,
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 6,
                hoverRadius: 8,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: '#fff',
                borderWidth: 2
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh',
                flexDirection: 'column',
                gap: 2
            }}>
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                    Loading your analytics...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="error" variant="h6">
                    Error loading chart: {error}
                </Typography>
            </Box>
        );
    }

    if (!chartData.labels || chartData.labels.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">
                    No spending data available yet
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Start tracking your expenses to see beautiful visualizations!
                </Typography>
            </Box>
        );
    }

    // Calculate statistics
    const totalSpent = monthlySpending.reduce((sum, item) => sum + item.total_spent, 0);
    const averageSpending = totalSpent / monthlySpending.length;
    const highestMonth = monthlySpending.reduce((max, item) => 
        item.total_spent > max.total_spent ? item : max
    );

    return (
        <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    📊 Monthly Analytics Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Visualize your spending patterns and track your financial goals
                </Typography>
            </Box>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Total Spent
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                                ${totalSpent.toLocaleString()}
                            </Typography>
                            <Chip 
                                label={`${monthlySpending.length} months`} 
                                size="small" 
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Average/Month
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                ${averageSpending.toFixed(0)}
                            </Typography>
                            <Chip 
                                label={averageSpending < userGoal ? '✅ On track' : '⚠️ Review'} 
                                size="small" 
                                color={averageSpending < userGoal ? 'success' : 'warning'}
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Monthly Goal
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="secondary">
                                ${userGoal.toLocaleString()}
                            </Typography>
                            <Chip 
                                label="Target" 
                                size="small" 
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>
                                Highest Month
                            </Typography>
                            <Typography variant="h4" fontWeight="bold" color="error">
                                ${highestMonth.total_spent.toLocaleString()}
                            </Typography>
                            <Chip 
                                label={`Month ${highestMonth.month}`} 
                                size="small" 
                                sx={{ mt: 1 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Chart Type Toggle */}
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                        Chart View
                    </Typography>
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={handleChartTypeChange}
                        aria-label="chart type"
                    >
                        <ToggleButton value="bar" aria-label="bar chart">
                            <BarChartIcon sx={{ mr: 1 }} />
                            Bar Chart
                        </ToggleButton>
                        <ToggleButton value="line" aria-label="line chart">
                            <LineChartIcon sx={{ mr: 1 }} />
                            Line Chart
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Paper>

            {/* Main Chart */}
            <Card elevation={4}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ height: 500 }}>
                        {chartType === 'bar' && (
                            <Bar data={chartData} options={commonOptions} />
                        )}
                        {chartType === 'line' && (
                            <Line data={chartData} options={lineOptions} />
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Insights Section */}
            <Card elevation={2} sx={{ mt: 3, bgcolor: '#e3f2fd' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        💡 Insights
                    </Typography>
                    <Typography variant="body1">
                        {averageSpending < userGoal 
                            ? `Great job! You're staying under your monthly goal of $${userGoal.toLocaleString()} on average.`
                            : `You're averaging $${(averageSpending - userGoal).toFixed(0)} over your monthly goal. Consider reviewing your spending habits.`
                        }
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ResultBar;
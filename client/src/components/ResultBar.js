import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography, Box } from '@mui/material';

const ResultBar = () => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBarData = async () => {
            try {
                const response_bank = await fetch('/api/bank/purchases');
                const response_user = await fetch('api/user/profile');

                if (!response_bank.ok || !response_user.ok) {
                    throw new Error("Failed to fetch data");
                }

                const results_bank = await response_bank.json();
                const results_user = await response_user.json();

                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const labels = results_bank.map(item => {
                    const month = item._id.month - 1;
                    return months[month];
                });

                const monthlySpendings = results_bank.monthlySpendings;
                const amounts = monthlySpendings.map(item => item.totalSpent);
                const userGoal = results_user.monthly_spendings;

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Monthly Spending',
                            data: amounts,
                            backgroundColor: 'rgba(75,192,192,0.6)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Spending Goal',
                            data: new Array(amounts.length).fill(userGoal),
                            type: 'line',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            pointRadius: 0,
                            borderWidth: 1,
                            fill: false
                        }
                    ]
                });
                setLoading(false);

            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        getBarData();
    }, []); 
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Box>
            <Typography variant="h2" sx={{ mb: 2 }}>
                Monthly Goals Visual
            </Typography>

            <Bar
                data={chartData}
                options={{
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Month/Year'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Amount ($)'
                            },
                            beginAtZero: true
                        }
                    }
                }}
            />
        </Box>
    );
};

export default ResultBar;
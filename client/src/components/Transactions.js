import React, { useState, useEffect } from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  CircularProgress,
  Box,
  Typography
} from '@mui/material';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const fetchInfo = await fetch('/api/plaid/get-plaid-transactions', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (!fetchInfo.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const data = await fetchInfo.json();
                
                // FIXED: Handle new response format
                if (data.transactions) {
                    // New format: { message, count, transactions }
                    setTransactions(data.transactions);
                } else if (Array.isArray(data)) {
                    // Old format: direct array (backward compatible)
                    setTransactions(data);
                } else {
                    setTransactions([]);
                }
                
                setLoading(false);

            } catch (error) {
                console.error("Failed to get transactions:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        getTransactions();
    }, []);

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
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Please make sure you've connected your bank account.
                </Typography>
            </Box>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">
                    No transactions found
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Connect your bank account to see transactions.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table aria-label="transactions table">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Amount</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map(transaction => (
                        // FIXED: Changed _id to id (MongoDB → PostgreSQL)
                        <TableRow 
                            key={transaction.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                            }}
                        >
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>${transaction.amount}</TableCell>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Transactions;
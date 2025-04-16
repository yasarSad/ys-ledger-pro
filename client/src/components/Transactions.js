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
  Box 
} from '@mui/material';

const Transactions = () => {
    const[transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    useEffect(() => {
    const getTransactions = async () => {
        try{

            const fetchInfo = await fetch('/api/plaid/get-plaid-transactions',{
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            const data = await fetchInfo.json();
            setLoading(false);
            setTransactions(data);

        }catch(error){
            console.log("Failed to get transactions Error: ", error);
            setError(error);

        }
    };

    getTransactions();


    }, []);

    if (loading){
        return (
            <Box sx={{display: 'flex', justifyContent:'center', alighnItems: 'center', minHeight: '100vh'}}>
            <CircularProgress/>
            </Box>
        )
    }
    


    return(

    <TableContainer component={Paper}>
        <Table aria-label='simple table'>
            <TableHead>
                <TableRow>
                    <TableCell> Purchase </TableCell>
                    <TableCell> Amount </TableCell>
                    <TableCell> Date </TableCell>
        

                </TableRow>
            </TableHead>
            <TableBody>
                {transactions.map(transaction => (

                <TableRow key={transaction._id}
                sx={{
                    '&:last-child td, &last-child th': {border: 0}
            }}
                >
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.date}</TableCell>

                </TableRow>

                ))}
            </TableBody>
        </Table>
    </TableContainer>
        
    );
    

}

export default Transactions;
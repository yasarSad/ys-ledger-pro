import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import {Link} from 'react-router-dom';

function Home() {

    
    return(

    <Box
    sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        background: "linear-gradient(to bottom, #ED7845, #F95CA4)",
        color: "white",
        padding:"20px",
        textAlign: 'center',
    }}>
        <Typography variant="h3" fontWeight="700" gutterBottom>
            Welcome to YS Ledger Pro!
        </Typography>
        <Typography variant="h6" fontWeight="300" gutterBottom>
            Where all your financial goals are made easy!
        </Typography>
        <Button 
        component={Link}
        to="/signup"
        sx={{backgroundColor: "#141414",
                    color:"white",
                    fontWeight: "600",
                    padding: "10px 20px",
                    marginTop:"20px",
                    borderRadius: "5px",
                    "&:hover": {backgroundColor: "#273DB4"}}}
        >
            Get Started
        </Button>
    </Box>
    
    );

}

export default Home;
import React from 'react';
import logo from './pictures/logo.png';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

function Header() {
    return (
        <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            borderRadius="3px"
            sx={{
                backgroundColor: '#CF9FFF',
                color: 'white',
                width: '100%', // Changed to '100%' to ensure full width
                marginBottom: '2px',
                textAlign: 'center',
                padding: '10px 0',
            }}
        >
            <Typography variant="h1">
                Finance Manager Zai version
            </Typography>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ marginTop: '10px' }}
            >
                <Link to="/" style={{ color: 'white', marginLeft: '10px', textDecoration: 'none' }}>
                    <Box
                        component="img"
                        src={logo}
                        alt="Company Logo"
                        sx={{
                            width: '48px',
                            height: '48px',
                            marginRight: '8px',
                        }}
                    />
                </Link>
        
            </Box>
        </Box>
    );
}

export default Header;
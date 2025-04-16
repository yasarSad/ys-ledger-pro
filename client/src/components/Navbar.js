import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

function NavBar(){
    const location = useLocation();

    return(

        <AppBar position="static" sx={{backgroundColor: '#0d6efd'}}>
           <Toolbar sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}>

            <Typography variant="h6" component="div">
                Finance Manager
            </Typography>

            <Box>
                <Button
                    component={Link}
                    to='/'
                    sx={navButtonStyle}

                    >
                        Home

                    </Button>
                    <Button
                    component={Link}
                    to='/login'
                    sx={navButtonStyle}

                    >
                        Log In

                    </Button>

                    <Button
                    component={Link}
                    to='/signup'
                    sx={navButtonStyle}

                    >
                        Sign Up

                    </Button>

                    <Button
                    component={Link}
                    to='/edit-profile/:username'
                    sx={navButtonStyle}

                    >
                        Edit Profile

                    </Button>
            </Box>


            </Toolbar>



        </AppBar>
        
    );
 }

 const navButtonStyle = {
    color: "white",
    fontWeight: "600",
    padding: "10px 20px",
    textTransform: "none",
    "&:hover": {backgroundColor: "#084298"},
 };

export default NavBar;
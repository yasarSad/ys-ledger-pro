import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Box } from '@mui/material';
const NotFound = () => (
  <Box 
  sx={ {textAlign: 'center',
  marginTop:'50px',
  color: '#555',}}>
  
  <Typography
  variant="h1">
The page you are looking for does not exist
  </Typography>
  <Button
  variant="contained"
  color="primary"
  component={Link}
  to="/"
  sx = {{
    display: "inline-block",
    marginTop: "20px",
    padding: '10px 20 px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  }}>
    Back Home
  </Button>
  </Box>
 
  );
  
  export default NotFound;


  
import React from 'react';
import { Link, Box, Typography } from '@mui/material';

function Footer(){
    return(

        <Box 
       
        sx={{backgroundColor: '#f8f9fa', // Light background color for footer
        color: '#6c757d', // Muted text color for footer
        padding: '10px 0',
        textAlign: 'center',
        bottom: 0,
        position: 'fixed',
        width: '100%',
        borderTop: '1px solid #e9ecef', // Subtle border to separate footer
        fontFamily: "'Roboto', sans-serif"
        }}>
        
        <Typography
        variant="body2" align="center">
            &copy; {new Date().getFullYear()} Zai Finance.
        
        <Link href="mailto:yasarsadozai@gmail.com" 
        style={{
                color:'#084298', fontWeight: "bold",
            }} > 
            
    

            
                Contact
            

            
            </Link>

            

        </Typography>
        
        </Box>

        /*
        <footer style={footerStyle}> 
        <p>&copy; {new Date().getFullYear()} Finance Manager. </p>
        <p>
            <a href="/privacy_policy" style={linkStyle}> Privacy Policy</a>
            <a href="/contact" style={linkStyle}> Contact if you need help</a>
        </p>
        </footer>

        */

    );
}




const linkStyle ={
    color: '#6c757d',
    margin: '0 10px',
}

export default Footer;
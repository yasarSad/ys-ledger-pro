import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette:{
        
        primary: {
            main: '#0d6efd',
        },
        secondary: {
            main: '#ED7845'
        }
    },

    typography:{
        fontFamily: 'Raleway, sans-serif',
        h1:{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#084298',
        },
        body1:{
            fontSize:'1rem',
            lineHeight: 1.6,
            color:'#080808'
        },


    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px'
                },
            },
        },
    }

});

export default theme;
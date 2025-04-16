import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const LogOff = () => {

    const nav = useNavigate();
    
    const handleLogOff = () => {
        const confirm = window.confirm("Are you sure you want to log out");
        if(confirm){
            localStorage.removeItem('authToken');
            console.log("Log Off Sucessful!");
            nav('/');

        }else{
            console.log("Log Off canceled")
        }
        
    };

    return(
        <Button
        onClick={handleLogOff}
        width="100px"
        height="30px"
        marginRight="10px"
        > Log Off </Button>
            

    );
};

export default LogOff;
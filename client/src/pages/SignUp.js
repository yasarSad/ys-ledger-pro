import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaidLink } from 'react-plaid-link';
import { 
    Box, 
    Typography, 
    CircularProgress, 
    TextField,
    Button
} from '@mui/material';

function Signup() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [monthly_spendings, setMonthlySpendings] = useState(0);
    const [goals, setGoals] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [linkToken, setLinkToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const createLinkToken = async () => {
            try {
                const response = await fetch('api/plaid/create-link-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const { link_token } = await response.json();
                setLinkToken(link_token);
            } catch (error) {
                console.error('Error with get link token', error);
            }
        };
        createLinkToken();
    }, []);

    const PlaidLinkComponent = ({ linkToken }) => {
        const onSuccess = async (public_token, metadata) => {
            try {
                const response = await fetch('/api/plaid/exchange-public-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ public_token }),
                });

                if (response.ok) {
                    console.log('Access token exchange was successful');
                } else {
                    console.error('Failed to exchange');
                }
            } catch (error) {
                console.error('Error: ', error);
            }
        };

        const config = {
            token: linkToken,
            onSuccess,
            onExit: (error, metadata) => {
                if (error) {
                    console.error('Error because of exit', error);
                }
            },
        };

        const { open, ready } = usePlaidLink(config);

        return (
            <Button 
                onClick={() => open()} 
                disabled={!ready}
                variant="contained"
                color="secondary"
                fullWidth
            >
                Link to your bank account
            </Button>
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    monthly_spendings: Number(monthly_spendings),
                    goals,
                    username,
                    password,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                const authToken = result.authToken;
                localStorage.setItem('authToken', authToken);
                console.log("Successfully logged in");
                navigate(`/dashboard/${username}`);
            } else {
                console.log('Signup failed:', result.message);
                setError(result.message);
            }
        } catch (error) {
            console.log('Error during signup:', error.message);
            setError('Failed to sign up. Please try again');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            backgroundColor: 'background.default',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
        }}>
            <Typography variant="h1" gutterBottom>
                Please fill out to Sign Up
            </Typography>
            
            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <form 
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    maxWidth: '400px',
                    width: '100%',
                }}
            >
                <TextField label="First Name" variant="outlined" fullWidth value={first_name} onChange={(e) => setFirstName(e.target.value)} />
                <TextField label="Last Name" variant="outlined" fullWidth value={last_name} onChange={(e) => setLastName(e.target.value)} />
                <TextField type="number" label="Monthly Spendings" variant="outlined" fullWidth value={monthly_spendings} onChange={(e) => setMonthlySpendings(e.target.value)} />
                <TextField label="Goals" variant="outlined" fullWidth value={goals} onChange={(e) => setGoals(e.target.value)} />
                <TextField label="Username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
                <TextField type="password" label="Password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
                
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                    {loading ? 'Signing up...' : 'Submit'}
                </Button>
                
                {linkToken && <PlaidLinkComponent linkToken={linkToken} />}
            </form>
        </Box>
    );
}

export default Signup;
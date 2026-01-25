import React from 'react';
import Routes from './Routes';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import theme from './styles/theme';
import "@fortawesome/fontawesome-free/css/all.min.css";


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <Header />
        <Navbar />
        <main>
          <Routes />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;

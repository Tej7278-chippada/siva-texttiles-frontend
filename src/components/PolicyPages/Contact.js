// src/components/PolicyPages/Contact.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';

const Contact = () => (
  <div>
    <Header/>
    <Container>
      <Box py={4}>
        <Typography variant="h4">Contact Us</Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns, please feel free to reach out to us.
        </Typography>
        {/* Provide contact details or a form for inquiries */}
        <Typography variant="body1" paragraph>
          Mail to: tejachippada14@gmail.com
        </Typography>
      </Box>
    </Container>
    <Footer/>
  </div>
);

export default Contact;

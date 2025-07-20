// src/components/PolicyPages/CancellationRefund.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Header from '../Header';
import Footer from '../Footer';
// import Header from "./Header";

const CancellationRefund = () => {


  return (
    <div>
      <Header/>
      <Container>
        <Box py={4}>
          <Typography variant="h4">Cancellation and Refund Policy</Typography>
          <Typography variant="body1" paragraph>
            This policy outlines our cancellation and refund process.
          </Typography>
          {/* Detail your cancellation and refund policy here */}
          <Typography variant="body">Refund amount will be processed in 2 to 3 working days.</Typography>
        </Box>
      </Container>
      <Footer/>
    </div>
  );
};
export default CancellationRefund;

// src/components/PolicyPages/CancellationRefund.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../Layout/Layout';
// import Header from '../Header';
// import Footer from '../Footer';
// import Header from "./Header";

const CancellationRefund = () => {


  return (
      <Layout>
      <Container>
        <Box py={4}>
          <Typography variant="h4">Cancellation and Refund Policy</Typography>
          <Typography variant="body1" paragraph>
            This policy outlines our cancellation and refund process.
          </Typography>
          {/* Detail your cancellation and refund policy here */}
          <Typography variant="body">Refund amount will be processed in 2 to 3 working days to your payment method. </Typography>
          <Typography variant="body">Incase any assistance, please contact our customer support.</Typography>
        </Box>
      </Container>
      </Layout>
  );
};
export default CancellationRefund;

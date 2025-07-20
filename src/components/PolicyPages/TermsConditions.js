// src/components/PolicyPages/TermsConditions.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
// import Header from '../Header';
// import Footer from '../Footer';
import Layout from '../Layout/Layout';

const TermsConditions = () => (
  <Layout>
    <Container>
      <Box py={4}>
        <Typography variant="h4">Terms and Conditions</Typography>
        <Typography variant="body1" paragraph>
          These terms and conditions govern your use of our website/app and services.
        </Typography>
        {/* Detail your terms and conditions here */}
      </Box>
    </Container>
    </Layout>
);

export default TermsConditions;

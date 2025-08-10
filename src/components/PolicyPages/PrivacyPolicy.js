// src/components/PolicyPages/PrivacyPolicy.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../Layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Privacy Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>

          <Typography variant="body1" paragraph>
            We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We may collect personal information including but not limited to:
            <br />• Name and contact details
            <br />• Payment and transaction information
            <br />• Device and usage data
            <br />• Cookies and tracking technologies
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            Your information may be used to:
            <br />• Process transactions and provide services
            <br />• Improve our products and services
            <br />• Communicate with you
            <br />• Comply with legal obligations
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            3. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            We may share information with:
            <br />• Payment processors like Razorpay
            <br />• Shipping and logistics partners
            <br />• Legal authorities when required
            <br />• Third-party service providers
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            4. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            5. Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You may have rights to:
            <br />• Access and correct your data
            <br />• Request deletion of your data
            <br />• Opt-out of marketing communications
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            6. Changes to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this policy periodically. The updated version will be posted on our website with a revised "Last updated" date.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            7. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            For any privacy-related concerns, please contact:
            <br /><strong>Email:</strong> skd.handlooms@gmail.com
            <br /><strong>Phone:</strong> +91 7730 020821
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default PrivacyPolicy;
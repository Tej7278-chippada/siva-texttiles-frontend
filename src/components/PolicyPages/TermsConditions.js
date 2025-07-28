// src/components/PolicyPages/TermsConditions.js
import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import Layout from '../Layout/Layout';

const TermsConditions = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Terms and Conditions
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>

          <Typography variant="body1" paragraph>
            Welcome to Siva Textiles. These Terms and Conditions ("Terms") govern your use of our website, mobile application, and services ("Platform").
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using our Platform, you agree to be bound by these Terms. If you disagree with any part, you may not access the Platform.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            2. User Responsibilities
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• You must be at least 18 years old to use our services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• You agree to provide accurate and complete information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• You are responsible for maintaining the confidentiality of your account credentials" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Any fraudulent activity may result in termination of your access" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            3. Payments and Refunds
          </Typography>
          <Typography variant="body1" paragraph>
            All payments are processed through secure third-party payment gateways. Refunds will be governed by our Cancellation & Refund Policy.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            4. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content on this Platform, including text, graphics, logos, and software, is our property or licensed to us and protected by copyright laws.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            5. Prohibited Activities
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Reverse engineering or hacking our Platform" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Posting unlawful, defamatory, or harmful content" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Using automated systems to extract data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Any activity that disrupts service to other users" />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            6. Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            Chukkala Nagasiva shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            7. Governing Law
          </Typography>
          <Typography variant="body1" paragraph>
            These Terms shall be governed by and construed in accordance with the laws of India, with courts in Kakinada having exclusive jurisdiction.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            8. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms at any time. Your continued use after changes constitutes acceptance of the modified Terms.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For any questions regarding these Terms:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
            Email: tejachippada14@gmail.com<br />
            Phone: +91 7730 020821<br />
            {/* Address: [Your Registered Business Address] */}
            Address: Siva Textiles, opposite to Union Bank of India, P Kottam, Kotananadhuru, Madealam, Kakinada district - 533407, India
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default TermsConditions;
// src/components/PolicyPages/CancellationRefund.js
import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText } from '@mui/material';
import Layout from '../Layout/Layout';

const CancellationRefund = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Cancellation and Refund Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            1. Cancellation Policy
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Customers may cancel their subscription/service within 24 hours of purchase for a full refund."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• After 24 hours, cancellations will be effective at the end of the current billing cycle with no prorated refunds."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• To cancel, please contact our support team or use the cancellation option in your account dashboard."
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            2. Refund Policy
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Refunds are processed only for requests made within the eligible cancellation period."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Approved refunds will be credited to the original payment method within 7-10 business days."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Service fees or one-time setup charges are non-refundable after service commencement."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Refunds will not be provided for partial usage or dissatisfaction with the service."
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            3. Processing Details
          </Typography>
          <Typography variant="body1" paragraph>
            Refund processing times may vary depending on your bank or payment provider. Typically, refunds appear in your account within:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Credit/Debit Cards: 5-7 business days"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Net Banking: 7-10 business days"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• UPI/Wallets: 3-5 business days"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            4. Exceptions
          </Typography>
          <Typography variant="body1" paragraph>
            No refunds will be granted for:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Services already rendered or partially used"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Violations of our terms of service"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Special promotions or discounted purchases marked 'non-refundable'"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            5. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            For any questions regarding our cancellation and refund policy, please contact our customer support team at:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
            Email: tejachippada14@gmail.com<br />
            Phone: +91 77330 020821<br />
            Hours: Monday-Friday, 9AM-5PM (IST)
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default CancellationRefund;
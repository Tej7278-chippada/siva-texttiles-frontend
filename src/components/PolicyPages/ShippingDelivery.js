// src/components/PolicyPages/ShippingDelivery.js
import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import Layout from '../Layout/Layout';

const ShippingDelivery = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Shipping and Delivery Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            1. Shipping Information
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• We ship to all major cities and towns across India"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• International shipping available to select countries"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Orders are processed within 1-2 business days (excluding weekends and holidays)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• You will receive tracking information via email/SMS once your order ships"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            2. Delivery Timeframes
          </Typography>
          <Typography variant="body1" paragraph>
            Standard delivery times (after processing):
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Metro Cities: 3-5 business days"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Tier 2/3 Cities: 5-7 business days"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Rural Areas: 7-10 business days"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• International: 10-15 business days (varies by destination)"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            3. Shipping Partners
          </Typography>
          <Typography variant="body1" paragraph>
            We partner with leading logistics providers including:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Delhivery"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• FedEx"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Blue Dart"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• India Post (for remote areas)"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            4. Shipping Charges
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Free shipping on orders above ₹999"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Standard shipping fee: ₹49 for orders below ₹999"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Express shipping (2-day delivery): ₹99 additional"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• International shipping charges vary by destination"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            5. Important Notes
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="• Delivery times are estimates and not guarantees"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Please ensure your shipping address is complete and accurate"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• We're not responsible for delays caused by incorrect addresses, customs clearance, or unforeseen circumstances"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="• Signature may be required for delivery of high-value items"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
            6. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            For any shipping-related inquiries, please contact:
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
            Email: tejachippada14@gmai.com<br />
            Phone: +91 77330 020821<br />
            Hours: Monday-Saturday, 9AM-6PM (IST)
          </Typography>
          <Typography variant="body1" paragraph>
            Please have your order number ready when contacting us about your shipment.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default ShippingDelivery;
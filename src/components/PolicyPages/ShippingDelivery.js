// src/components/PolicyPages/ShippingDelivery.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../Layout/Layout';

const ShippingDelivery = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Shipping & Delivery Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold' }}>
            For International buyers:
          </Typography>
          <Typography variant="body1" paragraph>
            Orders are shipped and delivered through registered international courier companies and/or International speed post only.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontWeight: 'bold', mt: 2 }}>
            For domestic buyers:
          </Typography>
          <Typography variant="body1" paragraph>
            Orders are shipped through registered domestic courier companies and/or speed post only.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation. Delivery of the shipment is subject to Courier Company/post office norms. Chukkala Nagasiva is not liable for any delay in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Delivery of all orders will be to the address provided by the buyer. Delivery of our services will be confirmed on your mail ID as specified during registration.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 4, fontWeight: 'bold' }}>
            For any issues in utilizing our services, you may contact our helpdesk:
            <br />Phone: +91 7730 020821
            <br />Email: skd.handlooms@gmail.com
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default ShippingDelivery;
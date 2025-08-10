// src/components/PolicyPages/CancellationRefund.js
import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../Layout/Layout';

const CancellationRefund = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Cancellation & Refund Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>

          <Typography variant="body1" paragraph>
            Chukkala Nagasiva believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            <strong>Cancellations</strong> will be considered only if the request is made within 2 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Chukkala Nagasiva <strong>does not accept cancellation requests</strong> for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            In case of receipt of <strong>damaged or defective items</strong> please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 2 days of receipt of the products.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            In case you feel that the product received is <strong>not as shown on the site</strong> or as per your expectations, you must bring it to the notice of our customer service within 2 days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            In case of complaints regarding products that come with a <strong>warranty from manufacturers</strong>, please refer the issue to them.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            In case of any <strong>Refunds approved</strong> by the Chukkala Nagasiva, it'll take 3-5 days for the refund to be processed to the end customer.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 4, fontWeight: 'bold' }}>
            For any issues, contact our customer service:
            <br />Phone: +91 7730 020821
            <br />Email: skd.handlooms@gmail.com
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default CancellationRefund;
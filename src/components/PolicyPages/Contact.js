// src/components/PolicyPages/Contact.js
import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import Layout from '../Layout/Layout';

const Contact = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Contact Us
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last updated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            For any queries, complaints, or assistance regarding our services, please contact us through the following channels:
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Customer Support
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Email:</strong> tejachippada14@gmail.com<br />
              <strong>Phone:</strong> +91 7730 020821<br />
              <strong>Hours:</strong> Monday-Saturday, 9:00 AM - 6:00 PM (IST)
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Business Address
            </Typography>
            <Typography variant="body1" paragraph>
              Siva Textiles<br />
              {/* [Your Company Address Line 1]<br /> */}
              opposite to Union Bank of India <br/>
              {/* [Your Company Address Line 2]<br /> */}
              P Kottam, Kotananadhuru <br/>
              {/* [City, State - PIN Code]<br /> */}
              Madealam, Kakinada district - 533407 <br/>
              India
            </Typography>
          </Box>

          {/* <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Grievance Officer
            </Typography>
            <Typography variant="body1" paragraph>
              As required under the Information Technology Act, 2000:<br />
              <strong>Name:</strong> [Your Grievance Officer Name]<br />
              <strong>Email:</strong> grievance@yourdomain.com<br />
              <strong>Phone:</strong> +91 XXXX XXX XXX
            </Typography>
            <Typography variant="body2" paragraph>
              Please include "Grievance" in the subject line for faster resolution.
            </Typography>
          </Box> */}

          <Typography variant="body1" paragraph sx={{ mt: 3, fontStyle: 'italic' }}>
            Note: Response times may vary depending on the nature of your inquiry. We strive to respond to all queries within 24-48 business hours.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
};

export default Contact;
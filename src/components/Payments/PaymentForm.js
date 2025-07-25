// src/components/Products/PaymentForm.js
import React, { useState } from "react";
import { Button, Typography, Box, useMediaQuery, ThemeProvider, createTheme, Snackbar, Alert } from "@mui/material";
import axios from "axios";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const PaymentForm = ({amount, onPaymentComplete, stockCountId, name, email, contact, productDesc, selectedItem, sellerTitle, sellerId, productId}) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm')); // Media query for small screens
  // const userId = localStorage.getItem('userId');

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Round the amount to 2 decimal places before sending
      const roundedAmount = Math.round(amount * 100) / 100;

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments`,
      { amount: roundedAmount,
        sellerId: sellerId, // Pass sellerId
        userId: localStorage.getItem('userId'), // Pass userId from local storage
        productId: productId, // Pass productId
        name: name,
        contact: contact, // Replace with actual user contact
        email: email, // Replace with actual user email
        order_title: productDesc,
      });
      const options = {
        key: "rzp_test_TDaoSZ9d4v5hio",
        amount: data.amount,
        currency: data.currency,
        name: "Siva Textiles",
        description: productDesc, // "Test Transaction",
        order_id: data.id,
        handler: async (response) => {
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              // name: name,
              // contact: contact, // Replace with actual user contact
              // order_title: productDesc,
              seller_title: sellerTitle,
              // email: email, // Replace with actual user email
              payment_method: data.payment_method, // Replace with actual payment method if applicable
              
            });
            setAlert({
              open: true,
              message: `Payment successful! Order ID: ${response.razorpay_order_id}, Payment ID: ${response.razorpay_payment_id}`,
              severity: "success",
            });
            onPaymentComplete("success", data.id);
          } catch (error) {
            console.error("Failed to update payment details:", error);
            setAlert({
              open: true,
              message: `Payment successful but failed to update details. Order ID: ${response.razorpay_order_id}`,
              severity: "warning",
            });
          }
          setAlert({
            open: true,
            message: `Payment done successfully on Order ID: ${data.id} and Payment ID: ${response.razorpay_payment_id}`,
            severity: "success",
          });
        },
        prefill: {
          name: name, //"Customer Name",
          email: email, // "customer@example.com",
          contact: contact, // "1234567890",
        },
        modal: {
          ondismiss: async () => {
            setAlert({
              open: true,
              message: `Payment cancelled by User on Order ID: ${data.id}`,
              severity: "warning",
            });
            onPaymentComplete("Decliened", data.id);
            try {
              await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
                razorpay_order_id: data.id,
                razorpay_payment_id: data.razorpay_payment_id,
                status: "Decliened",
                contact: data.contact, // Replace with actual user contact
                email: data.email, // Replace with actual user email
                payment_method: data.payment_method, // Replace with actual payment method if applicable
              });
            } catch (error) {
              console.error("Error updating failed payment:", error);
            }
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", async (response) => {
        setAlert({
          open: true,
          message: `Payment failed on Order ID: ${data.id}. Reason: ${response.error.description}`,
          severity: "error",
        });
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
            razorpay_order_id: data.id,
            status: "failed",
            contact: data.contact, // Replace with actual user contact
            email: data.email, // Replace with actual user email
            payment_method: data.payment_method, // Replace with actual payment method if applicable
          });
        } catch (error) {
          console.error("Error updating failed payment:", error);
        }
        onPaymentComplete("failure");
      });
      
      rzp.open();
    } catch (error) {
      setAlert({ open: true, message: "Failed to initiate payment.", severity: "error" });
      console.error("Payment initiation failed:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="30vh" sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}
      padding={isMobile ? 2 : 4} // Adjust padding for mobile
      >
        <Typography variant={isMobile ? "h6" : "h5"} mb={2}>Order Payment amount</Typography>
        {/* <Typography variant="h5" mb={2}>{sellerTitle}</Typography>
        <Typography variant="h5" mb={2}>{sellerId}</Typography>
        <Typography variant="h5" mb={2}>{userId}</Typography>
        <Typography variant="h5" mb={2}>{productId}</Typography>
        <Typography variant="h5" mb={2}>{productDesc}</Typography>
        <Typography variant="h5" mb={2}>{selectedItem}</Typography> */}
        <Typography variant="h5" mb={2}>Pay ₹{amount}</Typography>
        {/* <Button variant="contained" color="primary" onClick={handlePayment} disabled={loading || stockCountId === 0}>
          {loading ? "Processing..." : "Pay Now"}
        </Button> */}
        <Button
          variant="contained"
          // size="small"
          sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
              textTransform: 'none',
              fontWeight: 'medium',
              '&:hover': {
              background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(67, 97, 238, 0.3)',
              },
              transition: 'all 0.3s ease',
          }}
          onClick={handlePayment}
          disabled={loading || stockCountId === 0}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </Box>
      <Snackbar
          open={alert.open}
          autoHideDuration={9000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={alert.severity}>{alert.message}</Alert>
        </Snackbar>
      </ThemeProvider>
    </div>
  );
};

export default PaymentForm;

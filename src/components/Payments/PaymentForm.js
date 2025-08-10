// src/components/Products/PaymentForm.js
import React, { useState } from "react";
import { Button, Typography, Box, useMediaQuery, ThemeProvider, createTheme, Snackbar, Alert, Divider, Grid, CircularProgress } from "@mui/material";
import axios from "axios";
import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';

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

const PaymentForm = ({amount, discount, originalPrice, onPaymentComplete, stockData, name, email, contact, productDesc, selectedItem, sellerTitle, sellerId, productId, onPaymentInitiated, onPaymentModalClosed }) => {
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm')); // Media query for small screens
  // const userId = localStorage.getItem('userId');

  const handlePayment = async () => {
    if (stockData?.selectedItemStock === 0 || stockData?.totalStock === 0) {
      setAlert({
        open: true,
        message: stockData.selectedItemStock ? 'Selected size/color is out of stock' : 'Product is out of stock',
        severity: "warning"
      });
      return;
    }
    setLoadingPayment(true);
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
        key: process.env.REACT_APP_RAZORPAY_KEY,
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
            onPaymentComplete("success", data.id);
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
            // Call the callback to update parent state
            if (onPaymentModalClosed) {
              onPaymentModalClosed();
            }
            onPaymentComplete("Declined", data.id);
            try {
              await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
                razorpay_order_id: data.id,
                razorpay_payment_id: data.razorpay_payment_id,
                status: "declined",
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
        onPaymentComplete("failure", data.id);
      });

      // Call callback to indicate payment initiated
      if (onPaymentInitiated) {
        onPaymentInitiated();
      }
      
      rzp.open();
    } catch (error) {
      setAlert({ open: true, message: "Failed to initiate payment.", severity: "error" });
      console.error("Payment initiation failed:", error);
    }
    setLoadingPayment(false);
  };

  const handleCashOnDelivery = async () => {
    if (stockData?.selectedItemStock === 0 || stockData?.totalStock === 0) {
      setAlert({
        open: true,
        message: stockData.selectedItemStock ? 'Selected size/color is out of stock' : 'Product is out of stock',
        severity: "warning"
      });
      return;
    }
    setLoading(true);
    try {
      onPaymentComplete("Pending", null);
    } catch (error) {
      setAlert({ open: true, message: "Failed to place Cash on Delivery.", severity: "error" });
      console.error("Failed to place Cash on Delivery:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
      
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="30vh" sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}
      padding={isMobile ? 2 : 4} // Adjust padding for mobile
      >
        {/* <Typography variant={isMobile ? "h6" : "h5"} mb={2}>Order Payment amount</Typography> */}
        {/* <Typography variant="h5" mb={2}>{sellerTitle}</Typography>
        <Typography variant="h5" mb={2}>{sellerId}</Typography>
        <Typography variant="h5" mb={2}>{userId}</Typography>
        <Typography variant="h5" mb={2}>{productId}</Typography>
        <Typography variant="h5" mb={2}>{productDesc}</Typography>
        <Typography variant="h5" mb={2}>{selectedItem}</Typography> */}
        {/* <Typography variant="h5" mb={2}>Pay ₹{amount}</Typography> */}
        {/* <Button variant="contained" color="primary" onClick={handlePayment} disabled={loading || stockCountId === 0}>
          {loading ? "Processing..." : "Pay Now"}
        </Button> */}
        <CurrencyRupeeRoundedIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant={isMobile ? "h6" : "h5"} mb={1}>
          Complete Your Purchase
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            width: '100%', maxWidth: isMobile ? '250px' : '300px',
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ mb: 2 }}>
            {discount > 0 ? (
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Original Price:
                    </Typography>
                    <Typography variant="body2" 
                    // sx={{ textDecoration: 'line-through' }}
                    >
                      ₹{originalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Discount:
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {discount}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      You Save:
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      ₹{(originalPrice - amount).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Delivery charges:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹00.00
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Original Price:
                    </Typography>
                    <Typography variant="body2" >
                      ₹{amount.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Delivery charges:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹00.00
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      You Save:
                    </Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      ₹{(originalPrice - amount).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid> */}
              </Grid>
            )}
          
            </Box>

          <Divider sx={{ my: 2 }} />

          <Box textAlign="center">
            <Typography variant="overline" color="text.secondary">
              Total amount to be paid
            </Typography>
            <Typography 
              variant="h4" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold',
                mt: 1,
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ₹{amount}
            </Typography>
          </Box>
        </Box>
        <Typography 
          variant="overline"
          sx={{ 
            mb: 1,
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '0.7rem', sm: '0.75rem' }, // Responsive font size
            gap: 1
          }}
        >
          <PaymentIcon fontSize="small" /> Choose your Payment Method
        </Typography>
        <Box sx={{display: 'flex', gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, width: '100%'}}>
          <Button
            variant="contained" fullWidth={{ xs: true, sm: false }}
            // size="small"
            sx={{
              borderRadius: '12px',
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #3a56e8 0%, #2c3dd9 100%)' 
                : 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',textTransform: 'none',
              fontWeight: 'medium',
              fontSize: { xs: '14px', sm: '16px' },
              py: 1.5,
              px: 3,
              minWidth: { sm: '180px' }, maxWidth: isMobile ? '250px' : '300px',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(67, 97, 238, 0.3)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0',
                color: '#a0a0a0'
              },
              transition: 'all 0.2s ease',
            }}
            onClick={handleCashOnDelivery}
            disabled={loading || loadingPayment || stockData?.selectedItemStock === 0 || stockData?.totalStock === 0}
            startIcon={!loading && <LocalShippingIcon />}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} thickness={5} sx={{ color: 'white' }} />
                Processing...
              </Box>
            ) : "Cash on Delivery"}
          </Button>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'flex' }, // Hide "or" on mobile
              alignItems: 'center',
              gap: 1
            }}
          >
            or
          </Typography>
          {/* Mobile-only divider */}
          <Box sx={{ 
            display: { xs: 'flex', sm: 'none' }, 
            alignItems: 'center', 
            // my: 2,
            width: '100%', maxWidth: isMobile ? '220px' : '300px',
          }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="caption" sx={{ px: 2, color: 'text.secondary' }}>or</Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>
          <Button
            fullWidth={{ xs: true, sm: false }} // Full width on mobile
            variant="contained"
            color="success"
            sx={{
              borderRadius: '12px',
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' 
                : 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
              textTransform: 'none',
              fontWeight: 'medium',
              fontSize: { xs: '14px', sm: '16px' },
              py: 1.5,
              px: 3,
              minWidth: { sm: '180px' }, maxWidth: isMobile ? '250px' : '300px',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(76, 175, 80, 0.3)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0',
                color: '#a0a0a0'
              },
              transition: 'all 0.2s ease',
            }}
            onClick={handlePayment}
            disabled={loadingPayment || loading || stockData?.selectedItemStock === 0 || stockData?.totalStock === 0}
            startIcon={!loadingPayment && <CreditCardIcon />}
          >
            {loadingPayment ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} thickness={5} sx={{ color: 'white' }} />
                Processing...
              </Box>
            ) : "Pay Now"}
          </Button>
        </Box>
        {/* Security Notice */}
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 4, 
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🔒 Secure payment powered by Razorpay
        </Typography>
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

// components/Seller/OrderData.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
//   CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import { fetchPaymentDetails, updateOrderStatus } from '../Apis/SellerApis';

const OrderData = ({ order, open, onClose, darkMode, onStatusUpdate, openProductDetail }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [currentStatus, setCurrentStatus] = useState(order?.orderStatus || 'Created');
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || null);
  const [updatedAt, setUpdatedAt] = useState(order?.updatedAt || null);

  // Handle browser back button
//   useEffect(() => {
//     if (!open) return;

//     const handleBackButton = (e) => {
//       e.preventDefault();
//       onClose(false);
//     };

//     // Add event listener when dialog opens
//     window.history.pushState(null, '', window.location.pathname);
//     window.addEventListener('popstate', handleBackButton);

//     // Clean up event listener when dialog closes
//     return () => {
//       window.removeEventListener('popstate', handleBackButton);
//       if (window.history.state === null) {
//         window.history.back();
//       }
//     };
//   }, [open, onClose]);

  // Memoize the fetchPaymentData function to prevent unnecessary recreations
  const fetchPaymentData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchPaymentDetails(order.paymentId);
      setPaymentData(response.data);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch payment details',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [order?.paymentId]);

  // Fetch payment data when order changes and dialog is open
  useEffect(() => {
    if (open && order?.paymentId ) {
      fetchPaymentData();
      setCurrentStatus(order?.orderStatus || 'Created');
    }
  }, [open, order, fetchPaymentData]); // Added fetchPaymentData to dependencies

  // Fetch payment data when order changes and dialog is open
  useEffect(() => {
    if (open && order?.paymentStatus ) {
      setPaymentStatus(order?.paymentStatus || null);
      setUpdatedAt(order?.updatedAt)
    }
  }, [open, order, order?.paymentStatus]); // Added fetchPaymentData to dependencies


  // Update currentStatus when order prop changes
  useEffect(() => {
    if (order && order?.orderStatus) {
      setCurrentStatus(order.orderStatus);
      setUpdatedAt(order?.updatedAt);
    }
  }, [order, order?.orderStatus]);

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await updateOrderStatus(order._id, newStatus);
      setCurrentStatus(newStatus);
      setPaymentStatus(response?.data?.paymentStatus);
      setUpdatedAt(response?.data?.updatedAt);
      if (onStatusUpdate) {
        onStatusUpdate(order._id, newStatus, response?.data?.updatedAt, response?.data?.paymentStatus);
      }
      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update order status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose(false);
    setPaymentData(null);
    // setCurrentStatus(null);
    setPaymentStatus(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Cancelled':
      case 'Failed':
      case 'Declined':
        return 'error';
      case 'Packing':
      case 'Ready to Deliver':
      case 'On Delivery':
        return 'warning';
      case 'Created':
        return 'info';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '12px',
          backgroundColor: darkMode ? '#121212' : '#ffffff',
          backgroundImage: 'none'
        }
      }}
    >
      <DialogContent sx={{ p: isMobile ? 1 : 3, position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* {loading && !paymentData ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : ( */}
          <Grid container spacing={isMobile ? 1 : 3}>
            {/* Left Column - Product and Order Info */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 2, borderRadius: 2, }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Order #{order?._id?.substring(0, 8).toUpperCase()}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={2} justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Ordered on: {formatDate(order?.createdAt)}
                    </Typography>
                    <Chip
                      label={currentStatus}
                      color={getStatusColor(currentStatus)}
                      size="small"
                      sx={{ fontWeight: 600, ml: 1 }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Product Info */}
                  <Box display="flex" mb={3}>
                    <Avatar
                      src={order?.productPic ? `data:image/jpeg;base64,${order.productPic}` : ''}
                      alt={order?.productTitle}
                      sx={{ width: 80, height: 120, mr: 2, cursor: 'pointer'}}
                      variant="rounded"
                      onClick={(e) => { e.stopPropagation(); openProductDetail(order); }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} onClick={(e) => { e.stopPropagation(); openProductDetail(order); }}>
                        {order?.productTitle}
                      </Typography>
                      <Box sx={{display: 'flex', }}>
                        <Box
                            sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: order?.selectedItem[0]?.colorCode,
                            border: '1px solid #ddd',
                            mr: 1
                            }}
                        />
                        {order?.selectedItem && <Typography variant="body2" color="text.secondary">
                            {order?.selectedItem?.[0]?.colorName} ({order?.selectedItem?.[0]?.size})
                        </Typography>}
                      </Box>
                      <Box display="flex" alignItems="center" mt={1}>
                        <PriceChangeIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body1" fontWeight={600}>
                          ₹{order?.orderPrice}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Delivery Info */}
                  <Box mb={3}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      <LocalShippingIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Delivery Information
                    </Typography>
                    {order?.deliveryBy?.[0]?.date ? (
                      <Typography variant="body2">
                        Expected delivery by: {formatDate(order.deliveryBy[0].date)}
                      </Typography>
                    ) : (
                      <Typography variant="body2">
                        Delivery in {order?.deliveryBy?.[0]?.days || 'N/A'} days
                      </Typography>
                    )}
                  </Box>

                  {/* Status Actions */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Update Order Status
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {['Created', 'Packing', 'Ready to Deliver', 'On Delivery', 'Delivered'].map((status) => (
                        <Button
                          key={status}
                          variant={currentStatus === status ? 'contained' : 'outlined'}
                          size="small"
                          disabled={loading || currentStatus === status}
                          onClick={() => handleStatusChange(status)}
                          sx={{ mb: 1 }}
                        >
                          {status}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                  {updatedAt &&
                  <Typography variant="body2" mt={1} color="text.secondary">
                    Updated on: {formatDate(updatedAt)}
                  </Typography>}
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Customer and Payment Info */}
            <Grid item xs={12} md={6}>
              {/* Customer Info */}
              <Card sx={{ mb: 2, borderRadius: 2, }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Customer Information
                  </Typography>
                  {order?.userDeliveryAddresses?.[0] ? (
                    <>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PersonIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        <Typography>{order.userDeliveryAddresses[0].name}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <EmailIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        <Typography>{order.userDeliveryAddresses[0].email || 'N/A'}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                        <Typography>{order.userDeliveryAddresses[0].phone}</Typography>
                      </Box>
                      <Box display="flex" alignItems="flex-start" mb={1}>
                        <HomeIcon color="action" fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                        <Typography>
                          {order.userDeliveryAddresses[0].address.street},<br />
                          {order.userDeliveryAddresses[0].address.area},<br />
                          {order.userDeliveryAddresses[0].address.city},<br />
                          {order.userDeliveryAddresses[0].address.state} -{' '}
                          {order.userDeliveryAddresses[0].address.pincode}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2">No delivery address provided</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card sx={{borderRadius: 2, mb: isMobile ? 3 : 0 }}>
                <CardContent>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    <PaymentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Payment Information
                  </Typography>
                  {(order?.paymentMode === "Cash on Delivery") ? (
                    <>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Payment Mode:</Typography>
                      {/* <Typography variant="body2" fontWeight={500}>
                        {order?.paymentMode || 'N/A'}
                      </Typography> */}
                      <Chip
                        label={order?.paymentMode || 'N/A'}
                        size="small"
                        color={
                          order?.paymentMode === 'Online Payment'
                            ? 'success'
                              : 'warning'
                        }
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Amount:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        ₹{order?.orderPrice}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Payment Status:</Typography>
                      <Chip
                        label={paymentStatus}
                        size="small"
                        color={
                          paymentStatus === 'Completed'
                            ? 'success'
                            : paymentStatus === 'Pending'
                              ? 'warning'
                              : 'error'
                        }
                      />
                    </Box>
                    </>
                  ) : (
                    paymentData ? (
                      <>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Payment Mode:</Typography>
                          {/* <Typography variant="body2" fontWeight={500}>
                            {order?.paymentMode || 'N/A'}
                          </Typography> */}
                          <Chip
                            label={order?.paymentMode || 'N/A'}
                            size="small"
                            color={
                              order?.paymentMode === 'Online Payment'
                                ? 'success'
                                  : 'warning'
                            }
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Payment ID:</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {paymentData.razorpay_payment_id || 'Pending'}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Amount:</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            ₹{paymentData.amount}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Status:</Typography>
                          <Chip
                            label={paymentData.status}
                            size="small"
                            color={
                              paymentData.status === 'captured'
                                ? 'success'
                                : paymentData.status === 'failed'
                                  ? 'error'
                                  : 'warning'
                            }
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Method:</Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {paymentData.payment_method || 'N/A'}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="body2">Date:</Typography>
                          <Typography variant="body2">
                            {formatDate(paymentData.createdAt)}
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body2">
                        {loading ? 'Loading payment details...' : 'No payment details available'}
                      </Typography>
                    )
                  )}
                  
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        {/* )} */}
      </DialogContent>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default OrderData;
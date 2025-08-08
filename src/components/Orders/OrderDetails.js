// src/components/Orders/OrderDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, useMediaQuery, Snackbar, Alert, Avatar, Stepper,
  Step,
  StepLabel,
  StepConnector,
  Chip, 
  CircularProgress} from '@mui/material';
// import { fetchOrderById } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
// import Layout from '../Layout';
import { useTheme } from '@emotion/react';
// import SkeletonProductDetail from './SkeletonProductDetail';
// import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import { fetchOrderById, deleteRating, fetchRatingByOrderId, submitRating, updateRating, updateDeliveryAddress } from '../Apis/UserApis';
import Layout from '../Layout/Layout';
import SkeletonProductDetail from '../Layout/SkeletonProductDetail';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PackageIcon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import HomeIcon from '@mui/icons-material/Home';
import UndoIcon from '@mui/icons-material/Undo';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useCallback } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import CircleIcon from '@mui/icons-material/Circle';
// Custom Stepper Connector
// const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${StepConnector.alternativeLabel}`]: {
//     top: 22,
//   },
//   [`&.${StepConnector.active}`]: {
//     [`& .${StepConnector.line}`]: {
//       background: 'linear-gradient(95deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)',
//       height: 3,
//       border: 0,
//       borderRadius: 1,
//     },
//   },
//   [`&.${StepConnector.completed}`]: {
//     [`& .${StepConnector.line}`]: {
//       background: 'linear-gradient(95deg, #4CAF50 0%, #8BC34A 50%, #CDDC39 100%)',
//       height: 3,
//       border: 0,
//       borderRadius: 1,
//     },
//   },
//   [`& .${StepConnector.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor: '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// // Custom Step Icon
// const CustomStepIcon = styled('div')(({ theme, ownerState }) => ({
//   backgroundColor: ownerState.completed || ownerState.active ? '#4CAF50' : '#ccc',
//   zIndex: 1,
//   color: '#fff',
//   width: 50,
//   height: 50,
//   display: 'flex',
//   borderRadius: '50%',
//   justifyContent: 'center',
//   alignItems: 'center',
//   boxShadow: ownerState.active ? '0 4px 10px 0 rgba(76,175,80,.3)' : 'none',
//   transition: 'all 0.3s ease',
//   transform: ownerState.active ? 'scale(1.1)' : 'scale(1)',
// }));

function OrderDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [order, setOrder] = useState(null);
  // const [hoveredId, setHoveredId] = useState(null);
  // Order status configuration
  const orderSteps = [
    { label: 'Order Created', status: 'Created', icon: CheckCircleIcon, color: '#4CAF50' },
    { label: 'Packing', status: 'Packing', icon: PackageIcon, color: '#FF9800' },
    { label: 'Ready to Deliver', status: 'Ready to Deliver', icon: LocalShippingIcon, color: '#2196F3' },
    { label: 'On Delivery', status: 'On Delivery', icon: DeliveryDiningIcon, color: '#9C27B0' },
    { label: 'Delivered', status: 'Delivered', icon: HomeIcon, color: '#4CAF50' },
  ];

  const specialStatuses = ['Returned', 'Refunded'];

  const getActiveStep = (currentStatus) => {
    if (specialStatuses.includes(currentStatus)) return -1;
    return orderSteps.findIndex(step => step.status === currentStatus);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Created': '#4CAF50',
      'Packing': '#FF9800',
      'Ready to Deliver': '#2196F3',
      'On Delivery': '#9C27B0',
      'Delivered': '#4CAF50',
      'Returned': '#F44336',
      'Refunded': '#795548'
    };
    return statusColors[status] || '#757575';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'captured': '#4CAF50',
      'Completed': '#4CAF50',
      'Pending': '#9C27B0',
      'refunded': '#FF9800',
      'failed': '#F44336',
      'declined': '#F44336'
    };
    return colors[status] || '#757575';
  };

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [existingRating, setExistingRating] = useState(null);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [loadingAddressUpdating, setLoadingAddressUpdating] = useState(false);

  // const StepIconComponent = (props) => {
  //   const { active, completed, className } = props;
  //   const stepIndex = parseInt(props.icon) - 1;
  //   const IconComponent = orderSteps[stepIndex]?.icon || CheckCircleIcon;

  //   return (
  //     <CustomStepIcon ownerState={{ completed, active }} className={className}>
  //       <IconComponent />
  //     </CustomStepIcon>
  //   );
  // };


  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        // const authToken = localStorage.getItem('authToken');
        // setIsAuthenticated(!!authToken); // Check if user is authenticated

        const response = await fetchOrderById(id);
        setOrder({
          ...response.data,
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
    // setLoading(false);
  }, [id]); // order,

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Updated Order Status Section in OrderDetails.js
  const VerticalStepConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${StepConnector.active}`]: {
      [`& .${StepConnector.line}`]: {
        borderColor: theme.palette.success.main,
      },
    },
    [`&.${StepConnector.completed}`]: {
      [`& .${StepConnector.line}`]: {
        borderColor: theme.palette.success.main,
      },
    },
    [`& .${StepConnector.line}`]: {
      borderLeftWidth: 3,
      borderLeftStyle: 'dashed',
      minHeight: 30,
      marginLeft: 24,
    },
  }));

  const VerticalStepIcon = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: ownerState.completed || ownerState.active ? 
      theme.palette.success.main : theme.palette.grey[300],
    color: ownerState.completed || ownerState.active ? 
      theme.palette.common.white : theme.palette.text.secondary,
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: theme.spacing(1),
    boxShadow: ownerState.active ? theme.shadows[4] : 'none',
    transition: theme.transitions.create(['background-color', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
  }));

  const renderOrderStatusSection = () => {
    if (!order) return null;

    const activeStep = getActiveStep(order.orderStatus);
    const isSpecialStatus = specialStatuses.includes(order.orderStatus);

    return (
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        // bgcolor: 'background.paper', 
        bgcolor: '#f8f9fa',
        borderRadius: 2,
        // boxShadow: 1
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Order Status
        </Typography>
        
        {/* Current Status Chip */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
          
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(order.updatedAt || order.createdAt).toLocaleString()}
          </Typography>
          <Chip
            label={order.orderStatus}
            sx={{
              bgcolor: getStatusColor(order.orderStatus),
              color: 'white',
              fontWeight: 600,
              px: 1,
              fontSize: '0.9rem'
            }}
            icon={isSpecialStatus ? 
              (order.orderStatus === 'Returned' ? <UndoIcon /> : <MonetizationOnIcon />) : 
              null
            }
          />
        </Box>

        {/* Vertical Stepper for normal statuses */}
        {!isSpecialStatus && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <Stepper 
              orientation={"vertical"} // {isMobile ? "horizontal" : "vertical"}
              activeStep={activeStep} 
              connector={<VerticalStepConnector />}
            >
              {orderSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < activeStep;
                const isActive = index === activeStep;
                
                return (
                  <Step key={step.status}>
                    <StepLabel
                      StepIconComponent={() => (
                        <VerticalStepIcon ownerState={{ completed: isCompleted, active: isActive }}>
                          <StepIcon />
                        </VerticalStepIcon>
                      )}
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: isMobile ? '0.75rem' : '0.875rem',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'text.primary' : 'text.secondary'
                        }
                      }}
                    >
                      {step.label} <br/>
                      {(step.label === 'Delivered' && order.orderStatus !== 'Delivered') && <Typography variant="caption" color="textSecondary" sx={{ mb: 2,  }}>Estimated delivery on {new Date(order.deliveryBy[0]?.date).toDateString()}</Typography>}
                      {isActive && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {getStatusDescription(order.orderStatus)}
                        </Typography>
                      )}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            
            {/* Progress Bar - Only show on mobile */}
            {/* {isMobile && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(activeStep + 1) / orderSteps.length * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'success.main',
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  {Math.round((activeStep + 1) / orderSteps.length * 100)}% Complete
                </Typography>
              </Box>
            )} */}
          </Box>
        )}

        {/* Special Status Display */}
        {isSpecialStatus && (
          <Box sx={{ 
            textAlign: 'center', 
            p: 3, 
            // bgcolor: order.orderStatus === 'Returned' ? 'error.light' : 'warning.light',
            bgcolor: '#fff',
            borderRadius: 2,
            border: `1px solid ${getStatusColor(order.orderStatus)}`
          }}>
            {order.orderStatus === 'Returned' ? 
              <UndoIcon sx={{ fontSize: 48, color: 'error.main', mb: 1 }} /> :
              <MonetizationOnIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
            }
            <Typography variant="h6" sx={{ color: getStatusColor(order.orderStatus), fontWeight: 600 }}>
              Order {order.orderStatus}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {order.orderStatus === 'Returned' ? 
                'Your order has been returned to the seller' : 
                'Refund has been processed for this order'}
            </Typography>
          </Box>
        )}

        {['Created', 'Packing', 'Ready to Deliver', 'On Delivery'].includes(order?.orderStatus) &&
        <Button
          variant="outlined" size="small" fullWidth sx={{borderRadius: '8px', textTransform:'none', mt: 1}}
          // startIcon={<EditIcon />}
          // onClick={handleRatingOpen}
          disabled={!['Created', 'Packing'].includes(order?.orderStatus)}
        >
          Cancel Order
        </Button>}
        {order?.orderStatus === 'Delivered' && 
        <Button
          variant="outlined" size="small" fullWidth sx={{borderRadius: '8px', textTransform:'none', mt: 2}}
          // startIcon={<EditIcon />}
          // onClick={handleRatingOpen}
          // disabled={!['Delivered'].includes(order?.orderStatus)}
        >
          Return Product
        </Button>}
      </Box>
    );
  };

  // Helper function for status descriptions
  const getStatusDescription = (status) => {
    const descriptions = {
      'Created': 'Your order has been placed successfully.',
      'Packing': 'Seller is preparing your order for shipment.',
      'Ready to Deliver': 'Your order is packed and ready to be shipped.',
      'On Delivery': 'Your order is on its way to you!',
      'Delivered': 'Your order has been delivered successfully.'
    };
    return descriptions[status] || '';
  };

  // if (loading || !order) {
  //   return (
  //     <Layout>
  //       <SkeletonProductDetail />
  //     </Layout>
  //   );
  // }

  const handleRatingOpen = () => {
    setRatingDialogOpen(true);
  };

  const handleRatingClose = () => {
    setRatingDialogOpen(false);
    // setCurrentRating(0);
    // setReviewText('');
  };

  const fetchExistingRating = useCallback(async () => {
    try {
      const response = await fetchRatingByOrderId(id);
      if (response.data) {
        setExistingRating(response.data);
        setCurrentRating(response.data.rating);
        setReviewText(response.data.review || '');
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
      setSnackbar({ open: true, message: 'Error fetching rating', severity: 'error' });
    }
  }, [id, setExistingRating, setCurrentRating, setReviewText]);

  const handleSubmitRating = async () => {
    if (currentRating === null || currentRating === undefined || currentRating === 0 || order.orderStatus !== 'Delivered') {
      setSnackbar({ open: true, message: 'Please give a valid rating!', severity: 'error' });
      return;
    }
    try {
      const ratingData = {
        productId: order.product,
        orderId: id,
        rating: currentRating,
        review: reviewText
      };

      if (existingRating) {
        // Update existing rating
        await updateRating(existingRating._id, ratingData);
        setSnackbar({ open: true, message: 'Rating updated successfully!', severity: 'success' });
      } else {
        // Create new rating
        await submitRating(ratingData);
        setSnackbar({ open: true, message: 'Rating submitted successfully!', severity: 'success' });
      }
      
      fetchExistingRating(); // Refresh rating data
      handleRatingClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setSnackbar({ open: true, message: 'Error submitting rating', severity: 'error' });
    }
  };

  const handleDeleteRating = async () => {
    try {
      await deleteRating(existingRating._id);
      setSnackbar({ open: true, message: 'Rating deleted successfully!', severity: 'success' });
      setExistingRating(null);
      setCurrentRating(0);
      setReviewText('');
      handleRatingClose();
    } catch (error) {
      console.error('Error deleting rating:', error);
      setSnackbar({ open: true, message: 'Error deleting rating', severity: 'error' });
    }
  };

  // Call this in useEffect after setting order
  useEffect(() => {
    const fetchRating = async () => {
      if (order && order.orderStatus === 'Delivered') {
        try {
          await fetchExistingRating();
        } catch (error) {
          console.error('Error in rating fetch:', error);
        }
      }
    };
    
    fetchRating();
  }, [order, id, fetchExistingRating]);

  const renderRatingDialog = () => (
    <Dialog open={ratingDialogOpen} onClose={handleRatingClose} maxWidth="sm" fullWidth sx={{
      '& .MuiPaper-root': { // Target the dialog paper
        borderRadius: '16px', // Apply border radius
        scrollbarWidth: 'thin', scrollbarColor: '#aaa transparent',
      }, 
      '& .MuiDialogActions-root': {
        margin: '8px',
      },
    }}>
      <DialogTitle>{existingRating ? 'Edit Rating' : 'Rate this Product'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Rating
            name="product-rating"
            value={currentRating}
            onChange={(event, newValue) => setCurrentRating(newValue)}
            precision={0.5}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          <Typography sx={{ ml: 2 }}>
            {currentRating !== null && currentRating !== undefined
              ? currentRating.toFixed(1)
              : 'Not rated'}
          </Typography>
        </Box>
        <TextField
          autoFocus
          margin="dense"
          id="review"
          label="Review (optional)"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={6}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' }, '& .MuiInputBase-input': { scrollbarWidth: 'thin' }  }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRatingClose} sx={{borderRadius: '8px'}}>Cancel</Button>
        {existingRating && (
          <Button 
            onClick={handleDeleteRating}
            color="error" sx={{borderRadius: '8px'}}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        )}
        <Button onClick={handleSubmitRating} variant="contained" sx={{borderRadius: '8px'}}>
          {existingRating ? 'Update' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleEditAddressOpen = () => {
    if (order && order.userDeliveryAddresses && order.userDeliveryAddresses[0]) {
      const address = order.userDeliveryAddresses[0];
      setAddressForm({
        name: address.name || '',
        phone: address.phone || '',
        email: address.email || '',
        street: address.address.street || '',
        area: address.address.area || '',
        city: address.address.city || '',
        state: address.address.state || '',
        pincode: address.address.pincode || ''
      });
    }
    setEditAddressOpen(true);
  };

  const handleEditAddressClose = () => {
    setEditAddressOpen(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSubmit = async () => {
    setLoadingAddressUpdating(true);
    try {
      const addressData = {
        name: addressForm.name,
        phone: addressForm.phone,
        email: addressForm.email,
        address: {
          street: addressForm.street,
          area: addressForm.area,
          city: addressForm.city,
          state: addressForm.state,
          pincode: addressForm.pincode
        }
      };

      await updateDeliveryAddress(id, addressData);
      
      // Refresh order data
      const response = await fetchOrderById(id);
      setOrder({
        ...response.data,
      });
      
      setSnackbar({ open: true, message: 'Address updated successfully!', severity: 'success' });
      handleEditAddressClose();
    } catch (error) {
      // console.error('Error updating address:', error);
      setSnackbar({ open: true, message: 'Failed to update address', severity: 'error' });
    } finally {
      setLoadingAddressUpdating(false);
    }
  };

  const renderEditAddressDialog = () => (
    <Dialog 
      open={editAddressOpen} 
      onClose={handleEditAddressClose} 
      maxWidth="sm" 
      fullWidth fullScreen={isMobile ? true : false}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: isMobile ? '0px' : '16px',
          background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        color: 'white',
        fontWeight: 600,
        borderRadius: isMobile ? '0px' : '16px 16px 0 0',
        padding: '16px 24px',
      }}>
        Edit Delivery Address
        <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
          Only editable for orders in "Created" or "Packing" status
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        <Box sx={{ marginTop: 3 }}>
          <Grid container spacing={3}>
            {[
              { field: 'name', label: 'Full Name', required: true },
              { field: 'phone', label: 'Phone Number', required: true, type: 'tel' },
              { field: 'email', label: 'Email', required: true, type: 'email' },
              { field: 'street', label: 'Street Address', required: true, fullWidth: true },
              { field: 'area', label: 'Area/Locality', required: true },
              { field: 'city', label: 'City', required: true },
              { field: 'state', label: 'State', required: true },
              { field: 'pincode', label: 'Pincode', required: true, type: 'number' },
            ].map(({ field, label, required, type, fullWidth }) => (
              <Grid item xs={12} sm={fullWidth ? 12 : 6} key={field}>
                <TextField
                  name={field}
                  label={label}
                  fullWidth
                  required={required}
                  type={type}
                  value={addressForm[field]}
                  onChange={handleAddressChange}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#5f6368',
                    },
                  }}
                  InputProps={{
                    startAdornment: field === 'phone' && (
                      <InputAdornment position="start">
                        +91
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        padding: '16px 24px',
        borderTop: '1px solid #e0e0e0',
        justifyContent: 'space-between',
      }}>
        <Button 
          onClick={handleEditAddressClose}
          variant="outlined"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            padding: '8px 16px',
            borderColor: '#e0e0e0',
            color: '#5f6368',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
          // startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleAddressSubmit} 
          variant="contained"
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            padding: '8px 24px',
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
            },
          }}
          disabled={loadingAddressUpdating}
          // startIcon={<SaveIcon />}
        >
          {loadingAddressUpdating ? <><CircularProgress size={20} sx={{mr: 1, color: '#fff'}} /> updating...</> : 'Update Address'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Layout>
      {/* <Box> */}
        {/* <div style={{
          padding: '8px',
          // position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px', scrollbarWidth: 'thin'
        }}> */}
        <Box mb={1} sx={{ mx: isMobile ? '6px' : '8px', my: isMobile ? '6px' : '8px', }} > {/* sx={{ p: 2 }} */}
                  {(loading || !order) ? (
                      <SkeletonProductDetail/>
                    ) : 
                    (
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2} sx={{ bgcolor: '#f5f5f5', borderRadius: '10px', padding: '6px', paddingBottom: '10px', paddingTop: '10px' }}
          >

            {/* <Box sx={{
              flex: 1,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              // bgcolor: 'transparent', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin'
            }}>
              <Box
                flex={isMobile ? "1" : "0 0 30%"}
                style={{ paddingRight: isMobile ? "0" : "0rem" }}
              >

                <CardMedia>
                  <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    scrollbarColor: '#888 transparent',
                    // borderRadius: '8px',
                    gap: '1rem',
                    // height: '300px',
                  }}>

                    {order.productPic ? (
                      <Avatar
                        src={`data:image/jpeg;base64,${order.productPic}`} // Render the image
                        alt={order.productTitle}
                        sx={{ width: 210, height: 260, margin: 0, borderRadius: '10px' }}
                      />
                    ) : (
                      <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                        No Product Image available
                      </Typography>
                    )}
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the parent onClick
                        navigate(`/product/${order.product}`)
                      }}
                      onMouseEnter={() => setHoveredId(order._id)} // Set hoveredId to the current button's ID
                      onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
                      style={{
                        position: 'relative', float: 'right',
                        bottom: '6px', marginTop: '1rem',
                        right: '8px',
                        backgroundColor: hoveredId === order._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: hoveredId === order._id ? '16px' : '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center', color: 'red'
                        // transition: 'all 0.2s ease',
                      }}
                    >
                      {hoveredId === order._id && (
                        <span
                          style={{
                            fontSize: '14px', marginLeft: '16px',
                            color: '#ff0000',
                            marginRight: '8px',
                            whiteSpace: 'nowrap',
                            opacity: hoveredId === order._id ? 1 : 0,
                            transform: hoveredId === order._id ? 'translateX(0)' : 'translateX(10px)',
                            transition: 'opacity 0.3s, transform 0.3s',
                          }}
                        >
                          See Product Details
                        </span>
                      )}
                      <LocalMallRoundedIcon />
                    </IconButton>
                  </div>
                </CardMedia>
              </Box>
            </Box> */}
           

            <Box sx={{
              flex: 3,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              bgcolor: 'white', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin', padding: '1rem'
            }}>
              <Box flex={isMobile ? "1" : "0 0 70%"}>

                

                {/* Product Details */}
                <Grid container spacing={2}>
                  <Grid item sm={3.5} 
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent triggering the parent onClick
                      navigate(`/product/${order.product}`)
                    }}
                    sx={{cursor: 'pointer'}}
                  >
                    {order.productPic ? (
                      <Avatar
                        src={`data:image/jpeg;base64,${order.productPic}`} // Render the image
                        alt={order.productTitle}
                        sx={{ width:  120, height: 160, margin: 0, borderRadius: '10px' }}
                      />
                    ) : (
                      <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                        No Product Image available
                      </Typography>
                    )}
                    
                  </Grid>
                  <Grid item xs={6} sm={6} >
                    {/* <IconButton
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the parent onClick
                        navigate(`/product/${order.product}`)
                      }}
                      onMouseEnter={() => setHoveredId(order._id)} // Set hoveredId to the current button's ID
                      onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
                      style={{
                        position: 'relative', float:'inline-end',
                        // bottom: '6px', marginTop: '1rem',
                        // right: '8px',
                        backgroundColor: hoveredId === order._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: hoveredId === order._id ? '16px' : '16px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center', color: 'red'
                        // transition: 'all 0.2s ease',
                      }}
                    >
                      {hoveredId === order._id && (
                        <span
                          style={{
                            fontSize: '14px', marginLeft: '16px',
                            color: '#ff0000',
                            marginRight: '8px',
                            whiteSpace: 'nowrap',
                            opacity: hoveredId === order._id ? 1 : 0,
                            transform: hoveredId === order._id ? 'translateX(0)' : 'translateX(10px)',
                            transition: 'opacity 0.3s, transform 0.3s',
                          }}
                        >
                          See Product Details
                        </span>
                      )}
                      <LocalMallRoundedIcon />
                    </IconButton> */}
                    <Typography variant="h5" style={{
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#333', cursor: 'pointer'
                    }}
                    onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the parent onClick
                        navigate(`/product/${order.product}`)
                      }}>
                      {order.productTitle}
                    </Typography>
                    <Box sx={{display: 'flex', gap: 1, mb: 1 }}>
                      <Avatar sx={{ 
                        bgcolor: order.selectedItem[0]?.colorCode,
                        width: 20, 
                        height: 20,
                      }}>
                        <CircleIcon sx={{ color: order.selectedItem[0]?.colorCode, }} />
                      </Avatar>
                      <Typography variant="body2" color="textSecondary">
                        {order.selectedItem[0]?.colorName || 'No Color'}, {order.selectedItem[0]?.size || 'No Size'}
                      </Typography>
                    </Box>
                    <Box alignItems="center" display="flex">
                      <Typography variant="body1" style={{ fontWeight: 500, float:'inline-start', marginRight:'1rem' }}>
                        Price:
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ₹{order.orderPrice}
                      </Typography>
                    </Box>
                  </Grid>
                  {/* <Grid item xs={6} sm={6}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Order Status:
                    </Typography>
                    <Typography variant="body2" color={order.orderStatus === 'Created' ? 'green' : 'rgba(194, 28, 28, 0.89)'}>
                      {order.orderStatus}
                    </Typography>
                  </Grid> */}
                  <Grid item xs={12} sm={12} alignItems="center" display="flex">
                    <Typography variant="body1" style={{ fontWeight: 500, float:'inline-start', marginRight:'1rem' }}>
                      Ordered on:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" >
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                    {/* <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Price:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ₹{order.orderPrice}
                    </Typography> */}
                  </Grid>
                  <Grid item xs={12} sm={12} alignItems="center" display="flex">
                    <Typography variant="body1" style={{ fontWeight: 500, float:'inline-start', marginRight:'1rem' }}>
                      Estimated delivery date:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" >
                      {new Date(order.deliveryBy[0]?.date).toDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                        Delivery Address Details:
                      </Typography>
                      <Button
                        variant="outlined" size="small" sx={{borderRadius: '8px', textTransform:'none'}}
                        disabled={!['Created', 'Packing'].includes(order?.orderStatus)}
                        onClick={handleEditAddressOpen}
                      >
                        Edit Address
                      </Button>
                    </Box>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Name: {order.userDeliveryAddresses[0]?.name || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Phone: {order.userDeliveryAddresses[0]?.phone || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Email: {order.userDeliveryAddresses[0]?.email || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Address: {`${order.userDeliveryAddresses[0]?.address.street || "N/A"}, ${order.userDeliveryAddresses[0]?.address.area || "N/A"}, ${order.userDeliveryAddresses[0]?.address.city || "N/A"}`},
                      <br /> {`${order.userDeliveryAddresses[0]?.address.state || "N/A"} - ${order.userDeliveryAddresses[0]?.address.pincode || "N/A"}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Seller Title:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {order.sellerTitle}
                    </Typography>
                  </Grid>

                  {order.orderStatus === 'Delivered' && (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        Product Rating
                      </Typography>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: '#f8f9fa', 
                        borderRadius: 2,
                        // display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}>
                        {existingRating ? (
                          <>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2, mb: 1}}>
                              <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                <Rating
                                  value={existingRating.rating}
                                  readOnly
                                  precision={0.5}
                                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                <Typography sx={{ ml: 1 }}>
                                  {existingRating.rating.toFixed(1)}
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined" size="small" sx={{borderRadius: '8px'}}
                                startIcon={<EditIcon />}
                                onClick={handleRatingOpen}
                              >
                                Edit
                              </Button>
                            </Box>
                            {existingRating.review && (
                              <Typography variant="body2" sx={{ mb: 2,
                                // marginTop: '0.5rem',
                                lineHeight: '1.5',
                                // textAlign: 'justify',
                                whiteSpace: "pre-wrap", // Retain line breaks and tabs
                                wordWrap: "break-word", // Handle long words gracefully
                                // backgroundColor: "#f5f5f5",
                                padding: "6px",
                                borderRadius: "8px",
                                // border: "1px solid #ddd",
                              }}>
                                {existingRating.review}
                              </Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">
                              Added on: {new Date(existingRating.createdAt).toLocaleString()}
                            </Typography>
                            {existingRating.updatedAt && (
                              <Typography variant="body2" mt={1} color="text.secondary">
                                Updated on: {new Date(existingRating.updatedAt).toLocaleString()}
                              </Typography>
                            )}
                            
                          </>
                        ) : (
                          <Button
                            variant="contained" 
                            onClick={handleRatingOpen} sx={{borderRadius: '8px', textTransform: 'none',}}
                          >
                            Rate this Product
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  )}
                   
                </Grid>
              </Box>
            </Box>

            <Box sx={{
              flex: 2,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              bgcolor: 'white', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin', padding: '1rem'
            }}>
              <Box flex={isMobile ? "1" : "0 0 70%"}>

                {/* Enhanced Order Status Section */}
                {renderOrderStatusSection()}

                {/* <Divider/> */}

                {/* Product Details */}
                <Grid container spacing={0} mt={2}>
                   {/* Payment Details Section */}
                {/* {order.paymentId && ( */}
                  <>
                    <Grid item xs={12} sm={12}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                        Payment Details
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            Payment Status
                          </Typography>
                          {order?.paymentMode === "Cash on Delivery" ? (
                            <Chip
                              label={order.paymentStatus}
                              sx={{
                                bgcolor: getPaymentStatusColor(order.paymentStatus),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          ) : (
                            <Chip
                              label={order?.paymentId?.status}
                              sx={{
                                bgcolor: getPaymentStatusColor(order?.paymentId?.status),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>

                        <Typography variant="body1" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                          Payment mode:
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                          {order?.paymentMode || "N/A"}
                        </Typography>
                        
                        <Typography variant="body1" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                          Payment ID:
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                          {order?.paymentId?.razorpay_order_id || "N/A"}
                        </Typography>
                        
                        <Typography variant="body1" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                          Amount Paid:
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                          ₹{order?.paymentId?.amount || order?.orderPrice || "N/A"}
                        </Typography>
                      </Box>
                    </Grid>
                    {/* <Grid item xs={6} sm={6}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        Payment Status:
                      </Typography>
                      <Typography variant="body2" color={order.paymentStatus === 'Completed' ? 'green' : 'rgba(194, 28, 28, 0.89)'}>
                        {order.paymentId.status}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        Payment Amount:
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ₹{order.paymentId.amount}
                      </Typography>
                    </Grid> */}
                  </>
                {/* )} */}


                </Grid>
              </Box>
            </Box>
          </Box>
                    )}
                    </Box>

        {renderRatingDialog()}

        {renderEditAddressDialog()}

        {/* </div> */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{borderRadius: '12px'}}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      {/* </Box> */}
    </Layout>
  );
}

export default OrderDetails;

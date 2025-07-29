// src/components/Orders/OrderDetails.js
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, useMediaQuery, Snackbar, Alert, Avatar, Stepper,
  Step,
  StepLabel,
  StepConnector,
  Chip } from '@mui/material';
// import { fetchOrderById } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
// import Layout from '../Layout';
import { useTheme } from '@emotion/react';
// import SkeletonProductDetail from './SkeletonProductDetail';
// import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import { fetchOrderById } from '../Apis/UserApis';
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
      'refunded': '#FF9800',
      'failed': '#F44336',
      'declined': '#F44336'
    };
    return colors[status] || '#757575';
  };

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
                      <Box 
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: order.selectedItem[0]?.colorCode,
                          border: '1px solid #ddd'
                        }}
                      />
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
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      Delivery Address Details:
                    </Typography>
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
                {order.paymentId && (
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
                          <Chip
                            label={order.paymentId.status}
                            sx={{
                              bgcolor: getPaymentStatusColor(order.paymentId.status),
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        
                        <Typography variant="body1" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                          Payment ID:
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontFamily: 'monospace' }}>
                          {order.paymentId.razorpay_order_id || "N/A"}
                        </Typography>
                        
                        <Typography variant="body1" style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                          Amount Paid:
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                          ₹{order.paymentId.amount}
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
                )}


                </Grid>
              </Box>
            </Box>
          </Box>
                    )}
                    </Box>

        {/* </div> */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      {/* </Box> */}
    </Layout>
  );
}

export default OrderDetails;

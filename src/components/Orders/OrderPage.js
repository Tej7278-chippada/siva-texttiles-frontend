// components/Products/Orderpage.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Grid, Snackbar, Alert, Stepper, Step, StepLabel, List, ListItem, ListItemText, Paper, IconButton, Card, Avatar, CardContent, Tooltip, useMediaQuery, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
// import API, { addDeliveryAddresses, fetchProductById, fetchProductStockCount, saveOrder, sendOrderConfirmationEmail } from "../../api/api";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import Layout from "../Layout";
// import SkeletonProductDetail from "./SkeletonProductDetail";
// import PaymentForm from "./PaymentForm";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTheme } from "@emotion/react";
import API, { addDeliveryAddresses, deleteDeliveryAddress, fetchProductById, fetchProductStockCount, saveOrder, sendOrderConfirmationEmail, updateDeliveryAddress } from "../Apis/UserApis";
import Layout from "../Layout/Layout";
import SkeletonProductDetail from "../Layout/SkeletonProductDetail";
import PaymentForm from "../Payments/PaymentForm";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import PaymentIcon from '@mui/icons-material/Payment';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';

const OrderPage = ({ user }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams(); // Extract product ID from URL
  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addressAddedMessage, setAddressAddedMessage] = useState('');
  const [addressFailedMessage, setAddressFailedMessage] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();
  const [stockWarningMessage, setStockWarningMessage] = useState('');
  // const [stockCountId, setStockCountId] = useState(null); // Track only stock count
  // const [isStockFetched, setIsStockFetched] = useState(false); // Track if stock data has been fetched
  const [isAddAddressBoxOpen, setIsAddAddressBoxOpen] = useState(false); // to toggle the Add Address button
  const location = useLocation();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentModalClosed, setPaymentModalClosed] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [orderId, setOrderId] = useState(null);
  // const [selectedItem, setSelectedItem] = useState(() => {
  //   const selectedColor = location.state?.selectedColor?.colorName;
  //   const selectedSize = location.state?.selectedSize;
  //   return selectedItem ? (selectedSize, selectedColor) : null;
  // });
  const [stockData, setStockData] = useState({
    selectedItemStock: null,
    totalStock: null
  });
  const [selectedItem, setSelectedItem] = useState(() => {
    return location.state?.selectedColor && location.state?.selectedSize ? {
      size: location.state.selectedSize,
      color: location.state.selectedColor.colorName
    } : null;
  });
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserDetails = async () => {

      try {
        const authToken = localStorage.getItem('authToken');
        const productResponse = await fetchProductById(id);
        setProduct(productResponse.data);
        const userId = localStorage.getItem('userId');
        const response = await API.get(`/api/auth/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
        const addresses = response.data.deliveryAddresses || [];
        // Sort addresses by `createdAt` in descending order
        setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        // setStockCountId(productResponse.data.stockCount); // Set initial stock count
        // setIsStockFetched(true); // Mark stock data as fetched
        if (location.state?.selectedColor && location.state?.selectedSize) {
          setSelectedItem({ size: location.state.selectedSize, color: location.state.selectedColor.colorName });
        };
        setStockData({
          selectedItemStock: location.state.selectedSizeCount || null,
          totalStock: location.state.productStockCount || null,
        });


      } catch (err) {
        setError('Failed to fetch User details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };


    fetchUserDetails();
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [user, id, location.state.selectedColor, location.state.selectedSize, location.state.selectedSizeCount, location.state.productStockCount]);

  useEffect(() => {
    // Periodically fetch stock count
    const interval = setInterval(async () => {
      try {
        const response = await fetchProductStockCount(id, selectedItem?.size, selectedItem?.color);
        // setStockCountId(stockResponse.data.stockCount);
        setStockData({
          selectedItemStock: response.data.stockCount,
          totalStock: response.data.totalStock
        });
      } catch (err) {
        console.error("Error fetching product stock count:", err);
      }
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, [id, selectedItem ]);

  useEffect(() => {
    if (selectedItem) {
      if (stockData.selectedItemStock === 0) {
        setStockWarningMessage("Selected size/color is out of stock");
      } else if (stockData.selectedItemStock !== null && stockData.selectedItemStock > 0) {
        setStockWarningMessage("");
      }
    } else {
      if (stockData.totalStock === 0) {
        setStockWarningMessage("Product is out of stock");
      } else {
        setStockWarningMessage("");
      }
    }
  }, [selectedItem, stockData]);

  useEffect(() => {
    if (timer <= 60 && timer > 0) { // Last minute warning
      setAlert({
        open: true,
        message: `Hurry! Only ${timer} seconds left to complete your order.`,
        severity: "warning"
      });
    } else if (timer <= 0) {
      setAlert({
        open: true,
        message: "Time expired! Redirecting to product page.",
        severity: "error"
      });
      const redirectTimer = setTimeout(() => {
        navigate(`/product/${id}`);
      }, 300);
      return () => clearTimeout(redirectTimer);
    }
  }, [timer, id, navigate]);


  const handleAddAddress = async () => {
    try {
      const addressPayload = {
        name: newAddress.name,
        phone: newAddress.phone,
        email: newAddress.email,
        address: {
          street: newAddress.street,
          area: newAddress.area,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
        },
      };

      const response = await addDeliveryAddresses(addressPayload);
      const updatedAddresses = response.deliveryAddresses;
      // Sort addresses to ensure latest one is on top
      setDeliveryAddresses(updatedAddresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setNewAddress({   // Clear input fields and close the box
        name: "",
        phone: "",
        email: "",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      });
      setAddressAddedMessage('Address added successfully!');
      setIsAddAddressBoxOpen(false);
    } catch (error) {
      setAddressFailedMessage('Failed to add address. Please try again later.');
      console.error('Error adding address:', error);
    }
  };

  const handlePaymentComplete = async (paymentStatus, razorpay_order_id) => {
    setPaymentProcessing(true);
    if (paymentStatus === "success") {
      // console.log("Selected Address for Order:", selectedAddress);

      try {
        const userSelectedAddress = {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          email: selectedAddress.email,
          address: {
            street: selectedAddress.address.street,
            area: selectedAddress.address.area,
            city: selectedAddress.address.city,
            state: selectedAddress.address.state,
            pincode: selectedAddress.address.pincode,
          },
        };
  
        const orderData = {
          productId: product._id,
          // productTitle: product.title,
          // productPic: product.media[0], // Include the first product image
          // orderPrice: product.price,
          selectedItem: location.state?.selectedColor?.colorName ? {
            size: location.state?.selectedSize,
            colorName: location.state?.selectedColor?.colorName,
            colorCode: location.state?.selectedColor?.colorCode
          } : undefined,
          deliveryAddress: userSelectedAddress,
          paymentMode: 'Online Payment',
          paymentStatus: "Completed",
          sellerTitle: product.user.username,
          // sellerId: product.userId,
          razorpay_order_id,
        };
  
        const response = await saveOrder(orderData);
        // setActiveStep(2); // Move to order confirmation step

        if (response.status === 201) {
          setActiveStep(2); // Move to order confirmation step
          setOrderId(response.data._id);
          setPaymentProcessing(false);
          setPaymentInitiated(false);
          setPaymentModalClosed(false);

          try {
            const emailPayload = {
              email: selectedAddress.email,
              product: {
                title: product.title,
                price: product.price,
                media: product.media[0], // Send as Base64 string .toString("base64")
                selectedItem: {
                  size: location.state?.selectedSize,
                  colorName: location.state?.selectedColor?.colorName,
                  colorCode: location.state?.selectedColor?.colorCode
                },
              },
              deliverTo: selectedAddress.name,
              contactTo: selectedAddress.phone,
              deliveryAddress: userSelectedAddress,
              deliveryDate: product.deliveryDays,
              sellerTitle: product.user.username,
            };
  
            await sendOrderConfirmationEmail(emailPayload);
            // console.log("Order email sent successfully");
          } catch (emailError) {
            // console.error("Failed to send email:", emailError);
            // alert("Order placed, but email sending failed.");
            setAlert({
              open: true,
              message: "Order placed, but email sending failed.",
              severity: "error"
            });
          }
        } else {
          // console.error("Error saving the order");
          // alert("Failed to save the order. Please try again.");
          // setPaymentProcessing(false);
          setAlert({
            open: true,
            message: "Failed to save the order. Please contact us.",
            severity: "error"
          });
        }
      } catch (err) {
        console.error("Error completing the order:", err);
        // alert("Failed to place the order. Please try again.");
        setAlert({
          open: true,
          message: "Failed to place the order. Please try again.",
          severity: "error"
        });
      } finally {
        setPaymentProcessing(false);
      }
    } else if (paymentStatus === "Pending") {
      try {
        const userSelectedAddress = {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          email: selectedAddress.email,
          address: {
            street: selectedAddress.address.street,
            area: selectedAddress.address.area,
            city: selectedAddress.address.city,
            state: selectedAddress.address.state,
            pincode: selectedAddress.address.pincode,
          },
        };
  
        const orderData = {
          productId: product._id,
          // productTitle: product.title,
          // productPic: product.media[0], // Include the first product image
          // orderPrice: product.price,
          selectedItem: location.state?.selectedColor?.colorName ? {
            size: location.state?.selectedSize,
            colorName: location.state?.selectedColor?.colorName,
            colorCode: location.state?.selectedColor?.colorCode
          } : undefined,
          deliveryAddress: userSelectedAddress,
          paymentMode: "Cash on Delivery",
          paymentStatus: "Pending",
          sellerTitle: product.user.username,
          // sellerId: product.userId,
          razorpay_order_id,
        };
  
        const response = await saveOrder(orderData);
        // setActiveStep(2); // Move to order confirmation step

        if (response.status === 201) {
          setActiveStep(2); // Move to order confirmation step
          setOrderId(response.data._id);
          setPaymentProcessing(false);
          setPaymentInitiated(false);
          setPaymentModalClosed(false);

          try {
            const emailPayload = {
              email: selectedAddress.email,
              product: {
                title: product.title,
                price: product.price,
                media: product.media[0], // Send as Base64 string .toString("base64")
                selectedItem: {
                  size: location.state?.selectedSize,
                  colorName: location.state?.selectedColor?.colorName,
                  colorCode: location.state?.selectedColor?.colorCode
                },
              },
              deliverTo: selectedAddress.name,
              contactTo: selectedAddress.phone,
              deliveryAddress: userSelectedAddress,
              deliveryDate: product.deliveryDays,
              sellerTitle: product.user.username,
            };
  
            await sendOrderConfirmationEmail(emailPayload);
            // console.log("Order email sent successfully");
          } catch (emailError) {
            // console.error("Failed to send email:", emailError);
            // alert("Order placed, but email sending failed.");
            setAlert({
              open: true,
              message: "Order placed, but email sending failed.",
              severity: "error"
            });
          }
          setAlert({
            open: true,
            message: 'Order placed!, Payment Pending for Cash on Delivery.',
            severity: "success",
          });
        } else {
          // console.error("Error saving the order");
          // alert("Failed to save the order. Please try again.");
          // setPaymentProcessing(false);
          setAlert({
            open: true,
            message: "Failed to save the order. Please contact us.",
            severity: "error"
          });
        }
      } catch (err) {
        console.error("Error completing the order:", err);
        // alert("Failed to place the order. Please try again.");
        setAlert({
          open: true,
          message: "Failed to place the order. Please try again.",
          severity: "error"
        });
      } finally {
        setPaymentProcessing(false);
      }
    } else if (paymentStatus === "Declined") {
      setAlert({
        open: true,
        message: `Payment cancelled by User on Order ID: ${razorpay_order_id}`,
        severity: "warning",
      });
      setPaymentProcessing(false);
      setPaymentInitiated(false);
      setPaymentModalClosed(true);
    } else {
      // alert("Payment failed. Please try again.");
      setAlert({
        open: true,
        message: "Payment failed. Please try again.",
        severity: "error"
      });
      setPaymentProcessing(false);
      setPaymentInitiated(false);
      setPaymentModalClosed(false);
    }
  };
  
  const handlePaymentInitiated = () => {
    setPaymentInitiated(true);
    setPaymentModalClosed(false);
  };

  const handlePaymentModalClosed = () => {
    setPaymentModalClosed(true);
  };

  const handleRetryPayment = () => {
    setPaymentModalClosed(false);
    setPaymentInitiated(false);
  };

  const calculateDeliveryDate = (days) => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return deliveryDate.toLocaleDateString(undefined, options);
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      // alert("Please select a delivery address.");
      setAlert({
        open: true,
        message: 'Please select a delivery address.',
        severity: "warning"
      });
      return;
    }
    if (stockData?.selectedItemStock === 0 || stockData?.totalStock === 0) {
      setAlert({
        open: true,
        message: stockData.selectedItemStock ? 'Selected size/color is out of stock' : 'Product is out of stock',
        severity: "warning"
      });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  // if (loading || !userData) {
  //   return (
  //     <Layout>
  //       <Box sx={{m: isMobile ? '8px' : '12px', }}>
  //         <SkeletonProductDetail/>
  //       </Box>
  //     </Layout>
  //   );
  // };

  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      email: address.email,
      street: address.address.street,
      area: address.address.area,
      city: address.address.city,
      state: address.address.state,
      pincode: address.address.pincode
    });
    setEditAddressOpen(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateAddress = async () => {
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

      const response = await updateDeliveryAddress(currentAddress._id, addressData);
      
      // // Refresh user data
      // const authToken = localStorage.getItem('authToken');
      // const userId = localStorage.getItem('userId');
      // const response = await API.get(`/api/auth/${userId}`, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });
      
      const addresses = response.data.deliveryAddresses || [];
      setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Update selected address if it was the one edited
      if (selectedAddress && selectedAddress._id === currentAddress._id) {
        const updatedAddress = addresses.find(addr => addr._id === currentAddress._id);
        setSelectedAddress(updatedAddress);
      }
      
      setAlert({ 
        open: true, 
        message: 'Address updated successfully!', 
        severity: 'success' 
      });
      setEditAddressOpen(false);
    } catch (error) {
      console.error('Error updating address:', error);
      setAlert({ 
        open: true, 
        message: 'Error updating address', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await deleteDeliveryAddress(addressId);
      
      // // Refresh user data
      // const authToken = localStorage.getItem('authToken');
      // const userId = localStorage.getItem('userId');
      // const response = await API.get(`/api/auth/${userId}`, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });
      
      const addresses = response.data.deliveryAddresses || [];
      setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Clear selected address if it was the one deleted
      if (selectedAddress && selectedAddress._id === addressId) {
        setSelectedAddress(null);
      }
      
      setAlert({ 
        open: true, 
        message: 'Address deleted successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      setAlert({ 
        open: true, 
        message: 'Error deleting address', 
        severity: 'error' 
      });
    }
  };

  return (
    <Layout>
      <Box p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
          <Tooltip title="Back to Product" arrow placement="top">
            <IconButton >
              <ArrowBackRoundedIcon onClick={() => navigate(`/product/${id}`, { replace: true })} />
            </IconButton>
            </Tooltip>
            <Typography variant="h5" sx={{ ml: activeStep > 0 ? 1 : 1, float:'right'}}>
              Order Page
            </Typography>
          </Box>
          <Typography variant="body2" color="error">
            Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </Typography>
        </Box>
        {(loading || !userData) ? 
          <Box >
            <SkeletonProductDetail/>
          </Box> 
          :
          <>
            <Box display="flex" gap={1} flexDirection={isMobile ? "column" : "row"} margin={isMobile ? "-10px" : "0"} marginBottom="1rem" >
              <Box sx={{flex: 3, display: "flex", flexDirection: "column", gap: 1}}>
                {/* Product Details */}
                {product && (
                  <Card sx={{
                    display: "flex",
                    // flexDirection: "column",
                    // justifyContent: "space-between",
                    alignItems: "stretch",
                    borderRadius: "8px",
                    height: "100%",
                  }}>
                    {/* <Box sx={{ display: "flex", alignItems: "center", p: 2 }}> */}
                    <Avatar
                      src={`data:image/jpeg;base64,${location.state?.selectedColorImage ? location.state?.selectedColorImage : product.media[0]}`} // Assuming the first image is the primary one
                      alt={product.title}
                      sx={{ width: 80, height: 120, my: 2, ml: 2, borderRadius: '10px' }}
                    />
                    <CardContent sx={{width: '100%'}}>
                      <Typography variant="h6">{product.title}</Typography>
                      <Box sx={{my: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 1 }}>
                        {/* Display selected color and size if available */}
                        {location.state?.selectedColor && location.state?.selectedSize && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Box 
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: location.state.selectedColor.colorCode,
                                border: '1px solid #ddd'
                              }}
                            />
                            <Typography variant="body2">
                              {location.state.selectedColor.colorName} / {location.state.selectedSize}
                            </Typography>
                          </Box>
                        )}
                        {product?.discount > 0 ? (
                        <Box sx={{ display: 'inline-block', float: 'right', marginBottom: '0.5rem'}}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              variant="body1" color="textSecondary"
                              sx={{ 
                                fontWeight: 700, 
                                // color: 'primary.main' 
                              }}
                            >
                              ₹{product.price?.toLocaleString('en-IN')}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: 'line-through',
                                color: 'text.disabled',
                                fontWeight: 400
                              }}
                              component="span"
                              aria-label={`Original price ${product.originalPrice} rupees`}
                            >
                              ₹{product.originalPrice?.toLocaleString('en-IN')}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${product.discount}% OFF`} 
                            size="small" 
                            color="success"
                            sx={{ 
                              fontWeight: 600,
                              fontSize: '0.75rem', mr: '4px'
                            }}
                          />
                          <Tooltip title="You save" arrow>
                            <Chip 
                              label={`You save ₹${(product.originalPrice - product.price).toFixed(2)}`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.65rem',
                                height: '20px'
                              }}
                            />
                          </Tooltip>
                        </Box>
                        ) : (
                          <Typography 
                            variant="body2" color="textSecondary"
                            // sx={{ 
                            //   fontWeight: 700, 
                            //   color: 'text.primary' 
                            // }}
                          >
                            ₹{product.price}
                          </Typography>
                        )}
                      {/* <Typography sx={{ display: 'inline-block', float: 'right', marginBottom: '0.5rem' }}>Price: ₹{product.price}</Typography> */}
                      
                      </Box>
                      <Grid item xs={6} sm={4}>
                        {selectedItem ? (
                          <Typography variant="body2" color={stockData.selectedItemStock > 0 ? "green" : "red"}>
                            {stockData.selectedItemStock > 0 
                              ? `In Stock (${stockData.selectedItemStock} available) `  //  for ${selectedItem.size}/${selectedItem.color})
                              : `Out of Stock for ${selectedItem.size}/${selectedItem.color}`}
                            {stockData.totalStock > 0 && stockData.selectedItemStock === 0 && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                (Other sizes/colors may be available)
                              </Typography>
                            )}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color={stockData.totalStock > 0 ? "green" : "red"}>
                            {stockData.totalStock > 0 
                              ? `In Stock (${stockData.totalStock} available)` 
                              : "Out of Stock"}
                          </Typography>
                        )}
                      </Grid>
                      <Typography variant="body2" mt={2}>Delivery in {product.deliveryDays} days</Typography>
                      {product.deliveryDays && (
                        <Typography color="grey" variant="body2">
                          {`Product will be delivered by ${calculateDeliveryDate(product.deliveryDays)}`}
                        </Typography>
                      )}
                    </CardContent>
                    {/* </Box> */}
                  </Card>
                )}
              </Box>
              <Box sx={{flex: 2, display: "flex", flexDirection: "column", gap: 1}}>
                {selectedAddress && (
                  <Paper elevation={2} sx={{
                    p: 2,
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    // justifyContent: "space-between",
                    height: "100%",
                  }}>
                    <Typography>
                      <strong>Product will be delivered to:</strong>
                    </Typography>
                    <Typography>
                      {`${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.email}`}
                    </Typography>
                    <Typography>
                      {`${selectedAddress.address.street}, ${selectedAddress.address.area}, ${selectedAddress.address.city}, ${selectedAddress.address.state}, ${selectedAddress.address.pincode}`}
                    </Typography>
                  </Paper>
                )}
                {error && <Alert
                  sx={{borderRadius: '12px', color: 'text.primary', border: '1px solid rgba(244, 67, 54, 0.2)', boxShadow: '0 2px 8px rgba(244, 67, 54, 0.1)', }} 
                  severity="error">{error}
                </Alert>}
              </Box>
            </Box>
            <Card sx={{ borderRadius:'8px', margin: `${ isMobile ? '-10px' : '0'}`}}>
              <Box p={1} mt="1rem" >
                <Stepper activeStep={activeStep} alternativeLabel>
                  <Step>
                    <StepLabel>Select Delivery Address</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Payment</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Order Confirmation</StepLabel>
                  </Step>
                </Stepper>
                {activeStep === 0 && (
                  <Box mb={2} >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 1, my: 2 }}>
                      <Typography variant="h6" >Select Delivery Address</Typography>
                      <Button
                        variant="outlined" size="small"
                        onClick={() => setIsAddAddressBoxOpen((prev) => !prev)}
                        sx={{ borderRadius: '8px', textTransform: 'none'}}
                      >
                        Add New
                      </Button>
                    </Box>
                    {isAddAddressBoxOpen && (
                      <Card sx={{borderRadius:'16px', mb: 2}}>
                      <Box  p={2} >
                        <Typography variant="h6" marginInline={1} mb={2}>Add New Delivery Address</Typography>
                        <Grid container spacing={2}>
                          {["name", "phone", "email", "street", "area", "city", "state", "pincode"].map(
                            (field) => (
                              <Grid item xs={12} sm={6} key={field}>
                                <TextField
                                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                                  fullWidth
                                  value={newAddress[field] || ""}
                                  onChange={(e) =>
                                    setNewAddress({ ...newAddress, [field]: e.target.value })
                                  }
                                  size="small"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '8px',
                                    },
                                  }}
                                />
                              </Grid>
                            )
                          )}
                        </Grid>
                        
                        <Button
                          variant="contained"
                          onClick={handleAddAddress}
                          sx={{ mt: 2, mb: 2 , float: "right", minWidth:'150px', borderRadius: '12px' }}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => setIsAddAddressBoxOpen(false)}
                          sx={{ mt: 2, mb: 2, mr:1, float: "right", minWidth:'80px', borderRadius: '12px' }}
                        >
                          Cancel
                        </Button>
                      </Box>
                      </Card>
                    )}
                    {addressAddedMessage && <Snackbar open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={() => setAddressAddedMessage('')}>
                      <Alert severity="success">{addressAddedMessage}</Alert>
                    </Snackbar>}
                    {addressFailedMessage && <Snackbar open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={() => setAddressFailedMessage('')}>
                      <Alert severity="error">{addressFailedMessage}</Alert>
                    </Snackbar>}
                    <Box>
                      <Grid container spacing={1}>
                        {deliveryAddresses.length > 0 ? (
                          deliveryAddresses.map((deliveryAddress, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4} >
                              <List sx={{ height: "100%", width:"100%" }}>
                                <ListItem
                                  key={index}
                                  button="true"
                                  selected={selectedAddress === deliveryAddress}
                                  onClick={() => setSelectedAddress(deliveryAddress)}
                                  sx={{
                                    border: selectedAddress === deliveryAddress ? "2px solid blue" : "1px solid lightgray",
                                    borderRadius: 2,
                                    mb: 0,
                                    flexDirection: "column",
                                    height: "100%",
                                    position: 'relative',
                                    '&:hover': {
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }
                                  }}
                                >
                                  <Box sx={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8,
                                    display: 'flex',
                                    gap: 1
                                  }}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditAddress(deliveryAddress);
                                      }}
                                      sx={{
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(25, 118, 210, 0.15)'
                                        }
                                      }}
                                    >
                                      <EditIcon fontSize="small" color="primary" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setAddressToDelete(deliveryAddress);
                                        setDeleteDialogOpen(true);
                                      }}
                                      sx={{
                                        backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(244, 67, 54, 0.15)'
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                  </Box>
                                  <ListItemText
                                    primary={
                                      <>{`${deliveryAddress.name},`} <br/>
                                        {` ${deliveryAddress.phone}, ${deliveryAddress.email}`}
                                        <br />
                                        {`${deliveryAddress.address.street}, ${deliveryAddress.address.area}, ${deliveryAddress.address.city}, ${deliveryAddress.address.state}, ${deliveryAddress.address.pincode}`}
                                      </>}
                                    secondary={
                                      <>
                                        <br />
                                        <Typography sx={{ display: 'inline-block', float: 'right' }}>
                                          Added on: {new Date(deliveryAddress.createdAt).toLocaleString()}
                                        </Typography>
                                      </>
                                    }
                                  />
                                </ListItem>
                              </List>
                            </Grid>
                          ))
                        ) : (
                          <Typography align="center" padding="1rem" variant="body1" color="error">
                            You Don't have Delivery Addresses. Add new Delivery Address.
                          </Typography>
                        )}
                      </Grid>
                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', my: 2, py: 2}}>
                        {stockWarningMessage && <p style={{ color: 'red', marginRight: '10px' }}> {stockWarningMessage} </p>}
                        <Button
                          variant="contained" 
                          sx={{
                            borderRadius: '12px',
                            background: (theme) => theme.palette.mode === 'dark' 
                              ? 'linear-gradient(135deg, #3a56e8 0%, #2c3dd9 100%)' 
                              : 'linear-gradient(135deg,rgb(238, 201, 67) 0%,rgb(62, 55, 201) 100%)',
                              textTransform: 'none',
                            fontWeight: 'medium',
                            fontSize: '16px', 
                            maxWidth:  '250px',
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
                          disabled={!selectedAddress || stockData?.selectedItemStock === 0 || stockData?.totalStock === 0}
                          onClick={handleNext}
                          startIcon={<CurrencyRupeeRoundedIcon />}
                        >
                          Proceed to Payment
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
                {activeStep === 1 && (
                  <Box>
                    <Box display="flex" alignItems="center" mb={2} mt={2} justifyContent="space-between" >   {/* justifyContent="space-between" */}
                      <Box display="flex" alignItems="center">
                      {activeStep > 0 && (
                        <Tooltip title="Back to Delivery Address" arrow placement="top">
                        <IconButton onClick={handleBack} >
                          <ArrowBackRoundedIcon />
                        </IconButton>
                        </Tooltip>
                      )}
                      <Typography variant="body1" color="grey" sx={{float:'inline-end'}}>
                        Back
                      </Typography>
                      </Box>
                      {stockWarningMessage && <p style={{ color: 'red', float: 'right', marginRight: '10px' }}>{stockWarningMessage}</p>}
                    </Box>
                    {/* Payment Processing States */}
                    {paymentProcessing && (
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center" 
                        minHeight="40vh"
                        sx={{ textAlign: 'center', p: 3 }}
                      >
                        <Box 
                          sx={{
                            width: 80,
                            height: 80,
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            mb: 3,
                            '@keyframes spin': {
                              '0%': { transform: 'rotate(0deg)' },
                              '100%': { transform: 'rotate(360deg)' }
                            }
                          }}
                        />
                        <Typography variant="h6" sx={{ mb: 2, color: '#3498db' }}>
                          Processing Your Order...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Please don't close this page. We're confirming your payment and creating your order.
                        </Typography>
                      </Box>
                    )}

                    {/* Payment Initiated State */}
                    {paymentInitiated && !paymentModalClosed && !paymentProcessing && (
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center" 
                        minHeight="40vh"
                        sx={{ 
                          textAlign: 'center', 
                          p: 3,
                          border: '2px solid #4caf50',
                          borderRadius: '12px',
                          backgroundColor: '#f1f8e9'
                        }}
                      >
                        <Box 
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: '#4caf50',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            animation: 'pulse 2s infinite',
                            '@keyframes pulse': {
                              '0%': { transform: 'scale(1)' },
                              '50%': { transform: 'scale(1.05)' },
                              '100%': { transform: 'scale(1)' }
                            }
                          }}
                        >
                          <Typography variant="h4" sx={{ color: 'white' }}>💳</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
                          Payment in Progress
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                          Complete your payment in the popup window. Once done, you'll be redirected automatically.
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                          If the payment window didn't open, please check your popup blocker settings.
                        </Typography>
                      </Box>
                    )}

                    {/* Payment Modal Closed State */}
                    {paymentModalClosed && !paymentProcessing && (
                      <Box 
                        display="flex" 
                        flexDirection="column" 
                        alignItems="center" 
                        justifyContent="center" 
                        minHeight="40vh"
                        sx={{ 
                          textAlign: 'center', 
                          p: 3,
                          border: '2px dashed #ffa726',
                          borderRadius: '12px',
                          backgroundColor: '#fff3e0'
                        }}
                      >
                        <Box 
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: '#ffa726',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3
                          }}
                        >
                          <Typography variant="h4" sx={{ color: 'white' }}>⚠️</Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 2, color: '#f57c00' }}>
                          Payment Window Closed
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                          It looks like you closed the payment window. Don't worry, you can try again.
                        </Typography>
                        <Box display="flex" gap={2} flexDirection={isMobile ? 'column' : 'row'}>
                          <Button 
                            variant="contained" 
                            onClick={handleRetryPayment}
                            sx={{ 
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                              minWidth: '140px'
                            }}
                          >
                            Try Payment Again
                          </Button>
                          <Button 
                            variant="outlined" 
                            onClick={handleBack}
                            sx={{ 
                              borderRadius: '8px',
                              minWidth: '140px'
                            }}
                          >
                            Change Address
                          </Button>
                        </Box>
                      </Box>
                    )}
                    
                    {/* Normal Payment Form - Only show when not in any processing state */}
                    {!paymentProcessing && !paymentInitiated && !paymentModalClosed && (
                      <PaymentForm
                        amount={product.price}
                        discount={product.discount}
                        originalPrice={product.originalPrice}
                        // stockCountId={stockCountId}
                        stockData={stockData}
                        name={selectedAddress.name}
                        email={selectedAddress.email}
                        contact={selectedAddress.phone}
                        productDesc={product.title}
                        // selectedItem={(location.state?.selectedSize, location.state?.selectedColor?.colorName)}
                        sellerTitle={product.user.username}
                        sellerId={product.user.id} // Pass sellerId
                        productId={product._id} // Pass productId
                        onPaymentComplete={handlePaymentComplete} // Updated logic
                        onPaymentInitiated={handlePaymentInitiated}
                        onPaymentModalClosed={handlePaymentModalClosed}
                      />
                    )}
                  </Box>
                )}
                {activeStep === 2 && (
                  <Box 
                    sx={{ 
                      mt: 4,
                      px: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {/* Success Icon */}
                    <CheckCircleOutlineIcon 
                      color="success" 
                      sx={{ 
                        fontSize: 80, 
                        mb: 3,
                        animation: 'pulse 1.5s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.1)' },
                          '100%': { transform: 'scale(1)' }
                        }
                      }} 
                    />

                    {/* Main Heading */}
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 2,
                        fontWeight: 700,
                        color: 'primary.main',
                        lineHeight: 1.3
                      }}
                    >
                      Order Placed Successfully!
                    </Typography>

                    {/* Confirmation Message */}
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3,
                        maxWidth: 500,
                        color: 'text.secondary'
                      }}
                    >
                      Thank you for your purchase. Your order has been confirmed.
                    </Typography>

                    {/* Delivery Information Card */}
                    <Paper 
                      elevation={0}
                      sx={{
                        backgroundColor: 'background.paper',
                        p: 3,
                        borderRadius: 2,
                        width: '100%', maxWidth: isMobile ? '250px' : '350px',
                        // maxWidth: 500,
                        mb: 4,
                        textAlign: 'left',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {/* Delivery Date */}
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        sx={{ mb: 2 }}
                      >
                        <LocalShippingIcon 
                          color="primary" 
                          sx={{ 
                            mr: 1.5,
                            fontSize: 28 
                          }} 
                        />
                        <Typography variant="body1">
                          <Box component="span" fontWeight="500">
                            Estimated Delivery:
                          </Box> {calculateDeliveryDate(product.deliveryDays)}
                        </Typography>
                      </Box>

                      {/* Email Confirmation */}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          // pl: 4.5 // Align with the icon above
                        }}
                      >
                        We'll send a confirmation email to <Box component="span" fontWeight="500">{selectedAddress.email}</Box> with your order details.
                      </Typography>
                    </Paper>

                    {/* Action Button */}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate(`/order-details/${orderId}`, { replace: true })}
                      sx={{
                        borderRadius: '12px',
                        px: 5,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View Order Details
                    </Button>

                    {/* Helper Text */}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mt: 2,
                        color: 'text.disabled'
                      }}
                    >
                      You can check your order status anytime in My Orders
                    </Typography>
                  </Box>
                )}
              </Box>
            </Card>
          </>
        }

        {/* edit address dialog */}
        <Dialog
          open={editAddressOpen}
          onClose={() => setEditAddressOpen(false)}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiPaper-root': {
              borderRadius: '16px',
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: '16px 16px 0 0',
            padding: '16px 24px',
          }}>
            Edit Delivery Address
          </DialogTitle>

          <DialogContent sx={{ padding: '24px' , mt: 3, scrollbarWidth: 'thin' }}>
            <Box sx={{ marginTop: 1 }}>
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
              onClick={() => setEditAddressOpen(false)}
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
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleUpdateAddress}
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
            >
              Update Address
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '12px',
              overflow: 'visible'
            }
          }}
        >
          <DialogTitle sx={{
            bgcolor: 'error.light',
            color: 'error.contrastText',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: '12px 12px 0 0'
          }}>
            <DeleteIcon />
            Confirm Address Deletion
          </DialogTitle>
          
          <DialogContent sx={{ py: 3, mt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to delete this address?
            </Typography>
            {addressToDelete && (
              <Box sx={{ 
                p: 2, 
                mt: 2, 
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderRadius: '8px'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {addressToDelete.name}, {addressToDelete.phone}
                </Typography>
                <Typography variant="body2">
                  {addressToDelete.address.street}, {addressToDelete.address.area}
                </Typography>
                <Typography variant="body2">
                  {addressToDelete.address.city}, {addressToDelete.address.state} - {addressToDelete.address.pincode}
                </Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ 
            p: 2, 
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              variant="outlined"
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                color: 'text.primary'
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteAddress(addressToDelete._id);
                setDeleteDialogOpen(false);
              }}
              variant="contained"
              color="error"
              sx={{ 
                borderRadius: '8px',
                textTransform: 'none',
                px: 3,
                '&:hover': {
                  backgroundColor: 'error.dark'
                }
              }}
              startIcon={<DeleteIcon />}
            >
              Delete Address
            </Button>
          </DialogActions>
        </Dialog>

        {/* Global Alert Snackbar */}
        <Snackbar
          open={alert.open}
          autoHideDuration={timer <= 60 ? 5000 : 3000} // Longer display for last minute warnings
          onClose={() => setAlert({...alert, open: false})}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            '& .MuiAlert-root': {
              backgroundColor: alert.severity === 'warning' ? '#ff9800' : undefined,
              color: alert.severity === 'warning' ? '#fff' : undefined,
            }
          }}
        >
          <Alert 
            severity={alert.severity} 
            sx={{ width: '100%', borderRadius: '12px' }}
            onClose={() => setAlert({...alert, open: false})}
          >
            {alert.message}
            {timer <= 60 && timer > 0 && (
              <Box sx={{ 
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.5)',
                mt: 1,
                borderRadius: '2px'
              }}>
                <Box sx={{ 
                  width: `${(timer / 60) * 100}%`,
                  height: '100%',
                  backgroundColor: '#fff',
                  borderRadius: '2px',
                  transition: 'width 1s linear'
                }} />
              </Box>
            )}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default OrderPage;

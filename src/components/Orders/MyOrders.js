// src/components/orders/MyOrders.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Tooltip, Avatar, Chip, alpha, useTheme, useMediaQuery } from "@mui/material";
// import { fetchUserOrders } from "../../api/api";
// import Header from "../Header";
// import Footer from "../Footer";
// import SkeletonCards from "./SkeletonCards";
import { useNavigate } from "react-router-dom";
// import ProductDetail from "./ProductDetail";
import { fetchUserOrders } from "../Apis/UserApis";
import Layout from "../Layout/Layout";
import SkeletonCards from "../Layout/SkeletonCards";
// import LazyImage from "./LazyImage";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadOrders = async () => {
      setLoading(true);
      try {
        const userOrders = await fetchUserOrders();
        setOrders(userOrders.data.reverse() || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const openProductDetail = (order) => {
    // setSelectedProduct(product);
    navigate(`/order-details/${order._id}`);
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

  return (
    <Layout>
    {/* <Header/> */}
    <Box p={'4px'} sx={{ margin: '0rem' }}>
      <Typography variant={isMobile ? 'h6' : 'h5'} align="left" margin="8px" gutterBottom>
        Orders History
      </Typography>
      <div style={{
          backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ bgcolor: '#f5f5f5', paddingTop: '1rem', paddingBottom: '1rem', paddingInline: '8px', borderRadius: '10px' }} > {/* sx={{ p: 2 }} */}
            {loading ? (
              <SkeletonCards />
            ) : (
              <Grid container spacing={2}>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card sx={{
                        display: "flex",
                        alignItems: "stretch", '& .MuiCardContent-root': { padding: '10px' },
                        margin: '0rem 0',  // spacing between up and down cards
                        cursor: 'pointer',
                        backdropFilter: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
                        transition: 'transform 0.1s ease, box-shadow 0.1s ease', // Smooth transition for hover
                      }}
                        onClick={() => openProductDetail(order)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                          e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                        }} >
                        {/* <CardMedia sx={{ position: 'relative', margin: '0rem 0', borderRadius: '8px', overflow: 'hidden', height: '160px',  display: 'flex', flexDirection: 'row', gap: 1 , p: 1}} >
                          <div style={{
                            // display: 'flex',
                            // overflowX: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#888 transparent',
                            borderRadius: '8px',
                            gap: '0.1rem',
                            // marginBottom: '1rem'
                            height: 'auto', width: '100vh',
                          }} >
                            
                            {order.productPic ? (
                              <Avatar
                                src={`data:image/jpeg;base64,${order.productPic}`} // Render the image
                                alt={order.productTitle}
                                sx={{ width: 120, height: 160,  borderRadius: '10px' }}
                              />
                            ) : (
                              <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                                No Product Image available
                              </Typography>
                            )}
                          </div>

                        </CardMedia> */}
                        <Box sx={{ my: 1, ml: 1, borderRadius: '12px' }}>
                          {order?.productPic ? (<Avatar
                            src={`data:image/jpeg;base64,${order?.productPic}`} // Assuming the first image is the primary one
                            alt={order?.title}
                            sx={{ width: 80, height: 120, borderRadius: '12px' }}
                          />) : (
                            <Typography variant="caption" color="grey" align="center" >
                              No Image
                            </Typography>
                          )}
                        </Box>
                        <CardContent >
                          <Tooltip title={order?.productTitle} arrow>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1, mb: 1
                              }}
                            >
                              {order?.productTitle}
                            </Typography>
                          </Tooltip>
                          {/* <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                            Price: ₹{order.product.price}
                          </Typography> */}
                          {/* <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                            Price: ₹{order?.orderPrice}
                          </Typography> */}
                          <Box display="flex" gap={1} flexWrap="wrap" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex' }}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: order.selectedItem[0]?.colorCode,
                                  border: '1px solid #ddd'
                                }}
                              />
                              <Chip
                                // icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                label={`${order?.selectedItem[0]?.colorName} (${order?.selectedItem[0]?.size || order?.categoriesMale})`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem', color: 'text.secondary', borderColor: 'transparent' }}
                              />
                            </Box>
                            <Chip
                              className="price-chip"
                              // icon={<PriceChangeIcon sx={{ fontSize: 16, pl: 1 }} />}
                              label={`₹${order?.orderPrice}`}
                              variant="filled"
                              sx={{
                                backgroundColor: alpha(theme.palette.success.main, 0.1),
                                color: 'success.main',
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                // p: '1px 6px', 
                                transition: 'transform 0.2s ease'
                              }}
                            />

                          </Box>



                          <Typography variant="body2" color="textSecondary" sx={{ my: '0.5rem' }}>
                            Order Status:
                            <Chip
                              label={order?.orderStatus}
                              color={getStatusColor(order?.orderStatus)}
                              size="small"
                              sx={{ fontWeight: 600, ml: 1 }}
                            />
                          </Typography>
                          <Typography variant="caption" color="textSecondary" >
                            Ordered on: {new Date(order?.createdAt).toLocaleString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography align="center" padding="1rem" variant="body1">
                    You don't have orders.
                  </Typography>
                )}
              </Grid>
            )}
          </Box>
      </div>
      {/* {selectedProduct && (
          <ProductDetail order={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )} */}

      {/* <Typography variant="h4">My Orders</Typography> */}
      {/* <List>
        {orders.map((order, index) => (
          <ListItem key={index}>
            <Typography>
              {`Product: ${order.product.title} | Price: ₹${order.product.price} | Status: ${order.paymentStatus}`}
            </Typography>
          </ListItem>
        ))}
      </List> */}
    </Box>
    {/* <Footer/> */}
    </Layout>
  );
};

export default MyOrders;

// src/components/Products/PostDetailsById.js
import React, { useEffect, useState } from 'react';
import { Typography, CardMedia, IconButton, Grid, Tooltip, Box, useMediaQuery, Snackbar, Alert, Toolbar, CircularProgress, Button, styled, Avatar, Rating } from '@mui/material';
// import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
// import { addToWishlist, checkIfLiked, checkProductInWishlist, fetchLikesCount, fetchProductById, fetchProductStockCount, likeProduct, removeFromWishlist } from '../../api/api';
// import CommentPopup from './CommentPopup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import Layout from '../Layout';
import { useTheme } from '@emotion/react';
// import SkeletonProductDetail from './SkeletonProductDetail';
// import ImageZoomDialog from './ImageZoomDialog';
import ShareIcon from '@mui/icons-material/Share'; // Import the share icon
// import { addToWishlist, checkIfLiked, checkPostInWishlist, fetchLikesCount, fetchPostById, likePost, removeFromWishlist } from '../api/api';
// import Layout from '../Layout';
// import SkeletonProductDetail from '../SkeletonProductDetail';
// import ImageZoomDialog from './ImageZoomDialog';
// import CommentPopup from './CommentPopup';
// import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
// import RouteMapDialog from './RouteMapDialog';
// import ChatDialog from '../Chat/ChatDialog';
// import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
// import RateUserDialog from './RateUserDialog';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import axios from 'axios';
import { addToWishlist, checkIfLiked, checkProductInWishlist, fetchLikesCount, fetchProductById, fetchRatingsofProduct, likeProduct, removeFromWishlist } from '../Apis/UserApis';
import ImageZoomDialog from './ImageZoomDialog';
import SkeletonProductDetail from '../Layout/SkeletonProductDetail';
import Layout from '../Layout/Layout';
import CommentPopup from './CommentPopup';
import { Chip, Paper, Stack, Badge } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: "#2e3b55", // Custom background color
      color: "#ffffff", // Custom text color
      fontSize: "14px",
      padding: "10px",
      borderRadius: "12px",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    },
    [`& .MuiTooltip-arrow`]: {
      color: "#2e3b55", // Arrow color matching the tooltip background
    },
}));

const getGlassmorphismStyle = (theme, darkMode) => ({
  background: darkMode 
    ? 'rgba(30, 30, 30, 0.85)' 
    : 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  // border: darkMode 
  //   ? '1px solid rgba(255, 255, 255, 0.1)' 
  //   : '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: darkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
});

// Add this component inside ProductDetailsById.js (before the main component)
const ColorVariantDisplay = ({ variants, selectedColorIndex, setSelectedColorIndex, selectedSize, setSelectedSize, setSelectedSizeCount }) => {
  // const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  // const [selectedSize, setSelectedSize] = useState(null);

  if (!variants || variants.length === 0) {
    return null;
  }

  const currentVariant = variants[selectedColorIndex];

  return (
    <Paper elevation={0} sx={{ 
      // p: 2, 
      my: 2, 
      // border: '1px solid #eee', 
      // borderRadius: 2,
      backgroundColor: 'transparent'
    }}>
      {/* <Typography variant="body1" sx={{ mb: 0 }}>Available Colors & Sizes</Typography> */}
      
      {/* Color Selection */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }} >Select Color:</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {variants.map((variant, index) => (
            <Chip
              key={index}
              label={variant.colorName}
              avatar={
                <Avatar sx={{ 
                  bgcolor: variant.colorCode, 
                  width: 24, 
                  height: 24,
                  // border: selectedColorIndex === index ? '2px solid #3f51b5' : 'none'
                }}>
                  <CircleIcon sx={{ color: variant.colorCode }} />
                </Avatar>
              }
              onClick={() => {
                setSelectedColorIndex(index);
                setSelectedSize(null); // Reset size when color changes
                setSelectedSizeCount(0);
              }}
              variant={selectedColorIndex === index ? 'filled' : 'outlined'}
              sx={{
                // border: selectedColorIndex === index ? '1.5px solid #3f51b5' : 'none',
                borderColor: selectedColorIndex === index ? '#3f51b5' : 'transparent',
                '&:hover': {
                  borderColor: '#3f51b5'
                }
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Size Selection */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>Available Sizes:</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {currentVariant.sizes
          .filter(size => size.count > 0)  // Only show sizes with stock > 0
          .map((sizeItem, sizeIndex) => (
            <Badge 
              key={sizeIndex}
              badgeContent={sizeItem.count > 0 ? sizeItem.count : null} // '0'
              color={sizeItem.count > 0 ? 'primary' : 'error'}
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Chip
                label={sizeItem.size}
                onClick={() => {setSelectedSize(sizeItem.size); setSelectedSizeCount(sizeItem.count); }}
                variant={selectedSize === sizeItem.size ? 'filled' : 'outlined'}
                disabled={sizeItem.count <= 0}
                sx={{
                  // border: selectedSize === sizeItem.size ? '1.5px solid #3f51b5' : 'none',
                  borderColor: selectedSize === sizeItem.size ? '#3f51b5' : 'transparent',
                  minWidth: '60px',
                  opacity: sizeItem.count > 0 ? 1 : 0.6,
                  '&:hover': {
                    borderColor: sizeItem.count > 0 ? '#3f51b5' : 'transparent'
                  }
                }}
              />
            </Badge>
          ))}
        </Stack>
      </Box>

      {selectedSize && (
        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
          Selected: {currentVariant.colorName} / {selectedSize}
        </Typography>
      )}
    </Paper>
  );
};

function ProductDetailsById({ onClose, user, darkMode, toggleDarkMode, unreadCount, shouldAnimate }) {
  const [selectedImage, setSelectedImage] = useState(null);
  // const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile1 = useMediaQuery(theme.breakpoints.down("md"));
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication
  const [likeLoading, setLikeLoading] = useState(false); // For like progress
  const [wishStatusLoading, setWishStatusLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false); // For like progress
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [successMessage, setSuccessMessage] = useState('');
  // const [routeMapDialogOpen, setRouteMapDialogOpen] = useState(false);
  // const [chatDialogOpen, setChatDialogOpen] = useState(false);
  // const userId = localStorage.getItem('userId');
  const [loginMessage, setLoginMessage] = useState({ open: false, message: "", severity: "info" });
  // const [isRateDialogOpen, setRateDialogOpen] = useState(false);

  // const handleOpenRateDialog = () => setRateDialogOpen(true);
  // const handleCloseRateDialog = () => setRateDialogOpen(false);
  const tokenUsername = localStorage.getItem('tokenUsername');
  // const authToken = localStorage.getItem('authToken');
  // const [chatData, setChatData] = useState({});
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSizeCount, setSelectedSizeCount] = useState(0);
  const [productStockCount, setProductStockCount] = useState(0);
  // const [sizeError, setSizeError] = useState('');
  const [showAllRatings, setShowAllRatings] = useState(false);
  const [productRatings, setProductRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  


  
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const likesCount = await fetchLikesCount(id);
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken); // Check if user is authenticated
  
        // Fetch post details
        const response = await fetchProductById(id);
  
        let likedByUser = false; // Default to false for unauthenticated users
        if (authToken) {
          // Only check if the post is liked by the user if the user is authenticated
          likedByUser = await checkIfLiked(id);
        }
  
        setProduct({
          ...response.data,
          likedByUser, // Set the liked status
          likes: likesCount,
        });
        // setStockCountId(response.data.stockCount); // Set initial stock count
        setProductStockCount(response.data.totalStock);

      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Product Unavailable.', error);
          setSnackbar({ open: true, message: "Product Unavailable.", severity: "warning" });
        } else if (error.response && error.response.status === 401) {
          console.error('Error fetching product details:', error);
        } else {
          console.error('Error fetching product details:', error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductDetails();
  }, [id]);
  

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (isAuthenticated && product) {
        setWishStatusLoading(true);
        try {
          const isInWishlist = await checkProductInWishlist(product._id);
          setWishlist(new Set(isInWishlist ? [product._id] : []));
          setWishStatusLoading(false);
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        } finally {
          setWishStatusLoading(false);
        }
      }
    };
  
    checkWishlistStatus();
  }, [product, isAuthenticated]);

//   useEffect(() => {
//     // Periodically fetch stock count
//     const interval = setInterval(async () => {
//       try {
//         const stockResponse = await fetchProductStockCount(id);
//         setStockCountId(stockResponse.data.stockCount);
//       } catch (err) {
//         console.error("Error fetching product stock count:", err);
//       }
//     }, 5000); // Fetch every 5 seconds

//     return () => clearInterval(interval);
//   }, [id]);

//   const calculateDeliveryDate = (days) => {
//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + days);
//     const options = { weekday: "long", month: "long", day: "numeric" };
//     return deliveryDate.toLocaleDateString(undefined, options);
//   };
  
  const handleLike = async () => {
    if (likeLoading) return; // Prevent unauthenticated actions
    if (!isAuthenticated) { // Prevent unauthenticated actions
      setLoginMessage({
        open: true,
        message: 'Please log in first. Click here to login.',
        severity: 'warning',
      });
      return;
    } 
    setLikeLoading(true); // Start the progress indicator
    try {
      const newLikedByUser = !product.likedByUser;
      setProduct((prevProduct) => ({
        ...prevProduct,
        likedByUser: newLikedByUser,
        likes: newLikedByUser ? prevProduct.likes + 1 : prevProduct.likes - 1,
      }));
      await likeProduct(id);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error toggling like.');
    } finally {
      setLikeLoading(false); // End the progress indicator
    }
  };
  const openComments = (product) => {
    // setSelectedProduct(product);
    setCommentPopupOpen(true);
    // setSelectedProduct(product); // Pass the product to ensure it gets updated in the popup
  };

  const onCommentAdded = async () => {
    try {
      // const updatedPosts = await fetchPosts(); // This fetches all products after a comment is added
      // setPost(updatedPosts.data); // Update the product list in the state
      // setCommentPopupOpen(false); // Close the CommentPopup
      
      // Fetch the updated likes count after a comment is added
      const updatedLikesCount = await fetchLikesCount(id);
      
      // Update the post state with the new likes count
      // setPost((prevPost) => ({
      //   ...prevPost,
      //   likes: updatedLikesCount,
      // }));

      // Optionally, you can also fetch the updated post details if needed
      const updatedProduct = await fetchProductById(id);
      setProduct((prevProduct) => ({
        ...prevProduct,
        comments: updatedProduct.data.comments,
        likes: updatedLikesCount,
      }));
    } catch (error) {
      console.error("Error fetching likes count or product details after comment added.", error);
    // } finally {
      // setCommentPopupOpen(false); // Close the comment popup
    }
  };

  // const openRouteMapDialog = (post) => {
  //   // setSelectedProduct(product);
  //   setRouteMapDialogOpen(true);
  //   // setSelectedProduct(product); // Pass the product to ensure it gets updated in the popup
  // };

  // Function to open the zoomed image modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to close the zoomed image modal
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleWishlistToggle = async (productId) => {
    // if (!isAuthenticated) return;
    if (!isAuthenticated) { // Prevent unauthenticated actions
      setLoginMessage({
        open: true,
        message: 'Please log in first. Click here to login.',
        severity: 'warning',
      });
      return;
    } 
    setWishLoading(true); // Start the progress indicator
    try {
      if (wishlist.has(productId)) {
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.delete(productId);
          return newWishlist;
        }); // Optimistically update the UI
        await removeFromWishlist(productId);
      } else {
        setWishlist((prevWishlist) => new Set([...prevWishlist, productId])); // Optimistically update the UI
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Failed to update wishlist status!');
    } finally {
      setWishLoading(false); // End the progress indicator
    }
  };
  

  const handleShare = async (productId, productTitle) => {
    const shareUrl = `${window.location.origin}/product/${productId}`;
    const shareData = {
      title: productTitle,
      text: `Check out this amazing product: ${productTitle}`,
      url: shareUrl,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error using Web Share API:', err);
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      // Fallback: Copy to clipboard if supported
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert(`The link has been copied to your clipboard: ${shareUrl}`);
      } catch (err) {
        console.error('Error copying text to clipboard:', err);
        alert(`Unable to copy the link. Please manually share this URL: ${shareUrl}`);
      }
    } else {
      // Fallback for browsers without clipboard API
      const tempInput = document.createElement('textarea');
      tempInput.value = shareUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        alert(`The link has been copied to your clipboard: ${shareUrl}`);
      } catch (err) {
        console.error('Error using execCommand to copy:', err);
        alert(`Unable to copy the link. Please manually share this URL: ${shareUrl}`);
      }
      document.body.removeChild(tempInput);
    }
  };

  const handleBuyNow = () => {
    if (likeLoading ) return; // Prevent unauthenticated actions
    if (!isAuthenticated) { // Prevent unauthenticated actions
      setLoginMessage({
        open: true,
        message: 'Please log in first. Click here to login.',
        severity: 'warning',
      });
      return;
    } 
    // Check if product has variants
    if (product.variants && product.variants.length > 0) {
      // Validate size selection
      if (!selectedSize) {
        setSnackbar({ open: true, message: "Please select a size.", severity: "warning" });
        return;
      }

      // Check stock for selected size
      const currentVariant = product.variants[selectedColorIndex];
      const selectedSizeItem = currentVariant.sizes.find(s => s.size === selectedSize);
      
      if (selectedSizeItem.count <= 0) {
        setSnackbar({ 
          open: true, 
          message: `Selected size (${selectedSize}) is out of stock.`, 
          severity: "warning" 
        });
        return;
      }
    } else if (product.totalStock <= 0) {
      setSnackbar({ open: true, message: "Product is out of stock.", severity: "warning" });
      return;
    }

    // Navigate to order page with selected options
    navigate(`/order/${id}`, { 
      state: { 
        product,
        selectedColor: product.variants?.[selectedColorIndex],
        selectedSize,
        selectedSizeCount,
        productStockCount
      } 
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // const openPostLocation = () => {
  //   const { latitude, longitude } = post.location;
  //   const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  //   // Try to open in external map apps
  //   const appleMapsUrl = `maps://maps.apple.com/?q=${latitude},${longitude}`;
  //   const googleMapsUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
  //   // const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  
  //   if (isMobile) {
  //     // Check if navigator is available (for detecting platform)
  //     // const mapLink = navigator.userAgent.includes("iPhone") ? iosMapsUrl : androidMapsUrl;
  //     if (navigator.userAgent) {
  //       const isApple = /iPhone|iPad|Macintosh/.test(navigator.userAgent);
  //       const isAndroid = /Android/.test(navigator.userAgent);
    
  //       if (isApple) {
  //         window.open(appleMapsUrl, '_blank'); // Open in Apple Maps on iOS/macOS
  //       } else if (isAndroid) {
  //         window.open(googleMapsUrl, '_blank'); // Open in Google Maps on Android
  //       } else {
  //         // If it's a desktop/laptop or no maps app is found, copy the link
  //         navigator.clipboard.writeText(locationUrl).then(() => {
  //           setSuccessMessage('Post location link copied. Paste it in Google to search.');
  //         });
  //       }
  //     }
  //   } else {
  //     // Open Google Maps on desktop
  //     window.open(locationUrl, "_blank");
  //     // Fallback if no userAgent detection is possible
  //     navigator.clipboard.writeText(locationUrl).then(() => {
  //       setSuccessMessage('Post location link copied. Paste it in Google to search.');
  //     });
  //   }
  // };

  // const handleOpenChatDialog = async () => {
  //   setChatDialogOpen(true);
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_API_URL}/api/chats/chat-details`,
  //       { productId: post._id },
  //       { headers: { Authorization: `Bearer ${authToken}` } }
  //     );
      
  //     if (response.data.success) {
  //       setChatData({chatId: response.data.chatID, helperCodeVerified: response.data.helperCodeVerified})
  //     }
  //   } catch (error) {
  //     console.log('error data', error);
  //   }
  // };


  // if (loading || !post) {
  //   return (
  //     <Layout>
  //       {/* <SkeletonCards /> */}
  //       <Box sx={{margin: '8px' }}>
  //         <SkeletonProductDetail />
  //       </Box>
  //     </Layout>
  //   );
  // }

  const calculateDeliveryDate = (days) => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return deliveryDate.toLocaleDateString(undefined, options);
  };

  const fetchProductRatings = async () => {
    try {
      setRatingsLoading(true);
      const response = await fetchRatingsofProduct(product._id);
      setProductRatings(response.data);
      // console.log('ratings fetched');
    } catch (error) {
      console.error('Error fetching product ratings:', error);
      setSnackbar({ open: true, message: 'Error loading ratings', severity: 'error' });
    } finally {
      setRatingsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (product && product._id) {
  //     fetchProductRatings();
  //   }
  // }, [product]);

  return (
    <Layout username={tokenUsername} darkMode={darkMode} toggleDarkMode={toggleDarkMode} unreadCount={unreadCount} shouldAnimate={shouldAnimate}>
      <Box>
        {loading || !product ?
          <Box sx={{m: isMobile ? '8px' : '12px', }}>
            <SkeletonProductDetail/>
          </Box> : 
          <>
          <Box sx={{
            m: isMobile ? '8px' : '12px',
            // position: 'relative',
            // backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px', scrollbarWidth: 'thin', mb: 4
          }}>
            <Box
              display="flex"
              flexDirection={isMobile1 ? "column" : "row"}
              gap={1} sx={{ borderRadius: '10px',  }} // bgcolor: '#f5f5f5',
            >
                <Box sx={{
                  flex: 2,
                  // height: '73vh', // Fixed height relative to viewport
                  overflowY: 'auto',
                  // bgcolor: 'transparent', // Card background color (customizable)
                  borderRadius: isMobile ? '10px' : '12px', // Card border radius (customizable)
                  // boxShadow: 3, // Shadow for a modern look
                  scrollbarWidth: 'thin'
                }}>
                  <Box
                    flex={isMobile ? "1" : "0 0 30%"}
                    style={{ paddingRight: isMobile ? "0" : "0rem" }}
                  >

                    {/* Media section */}
                    {/* Media section with click to zoom */}
                    <CardMedia>
                      <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        scrollbarColor: '#888 transparent',
                        // borderRadius: '8px',
                        gap: isMobile ? '3px' : '4px', height: isMobile1 ? '250px' : '330px',
                      }}>
                        {product.media && product.media.length > 0 ? (
                          product.media.map((base64Image, index) => (
                            <img
                              key={index}
                              src={`data:image/jpeg;base64,${base64Image}`}
                              alt={`Product ${index}`}
                              style={{
                                // height: '200px',
                                borderRadius: '6px',
                                objectFit: 'cover',
                                flexShrink: 0,
                                cursor: 'pointer' // Make the image look clickable
                              }}
                              onClick={() => handleImageClick(base64Image)} // Open image in modal on click
                            />
                          ))
                        ) : (
                          // Show a placeholder image if no media is available
                          <img
                            // src="../assets/null-product-image.webp" // Replace with the path to your placeholder image
                            src='https://placehold.co/56x56?text=No+Imag'
                            alt="No media available"
                            style={{
                              // height: '200px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                    </CardMedia>
                  </Box>
                </Box>

                <Box sx={{
                  flex: 3,
                  // height: '73vh', // Fixed height relative to viewport
                  overflowY: 'auto', ...getGlassmorphismStyle(theme, darkMode),
                  // bgcolor: 'white', // Card background color (customizable)
                  borderRadius: 3, // Card border radius (customizable)
                  // boxShadow: 3, // Shadow for a modern look
                  scrollbarWidth: 'thin', padding: '1rem',
                  position: 'relative', // To enable absolute positioning of the button
                }}>
                  <Box flex={isMobile ? "1" : "0 0 70%"} mb={8}>

                    {/* Product Details */}
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <IconButton
                          style={{
                            // display: 'inline-block',
                            float: 'right',
                            fontWeight: '500',
                            // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginLeft: '10px'
                          }}
                          onClick={() => handleShare(product._id, product.title)}
                          aria-label="Share Post"
                          title="Share Post"
                        >
                          <CustomTooltip title="Share this post" arrow placement="right">
                            <ShareIcon />
                          </CustomTooltip >
                        </IconButton>
                        <IconButton
                          onClick={() => handleWishlistToggle(product._id)}
                          sx={{ display: 'inline-block', float: 'right', fontWeight: '500', /* backgroundColor: 'rgba(255, 255, 255, 0.8)', */
                            // ...getGlassmorphismStyle(theme, darkMode),
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            color: wishlist.has(product._id) ? 'red' : 'gray',
                          }} disabled={wishLoading || wishStatusLoading} // Disable button while loading
                        >
                          <Tooltip
                            title={wishlist.has(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            arrow
                            placement="right"
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                position: 'relative',
                                transition: 'transform 0.3s ease',
                              }}
                            >{wishLoading ? (
                              <CircularProgress size={24} color="inherit" /> // Show spinner while loading
                            ) : wishlist.has(product._id) ? (
                              <FavoriteIcon />
                            ) : (
                              <FavoriteBorderIcon />
                            )}
                            </span>
                          </Tooltip>
                        </IconButton>
                        {/* {post.isFullTime && 
                          <Typography sx={{ px: 2, py: 0.5, mx: 1, bgcolor: '#e0f7fa', color: '#006064', borderRadius: '999px', display: 'inline-block', float: 'right', fontWeight: '600', fontSize: '0.875rem' }}>
                            Full Time
                          </Typography>
                        } */}
                        <Typography variant="h5" style={{
                          fontWeight: 'bold',
                          marginBottom: '0.5rem',
                          // color: '#333'
                        }}>
                          {product.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                          {product.gender}
                        </Typography>
                        <Typography variant="body2" color={ 'textSecondary'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                          {product?.categoriesFemale || product?.categoriesMale }
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                          Price:
                        </Typography>
                        {/* <Typography variant="body2" color="textSecondary" >
                          ₹{product.price}
                        </Typography>
                        {product?.discount && <Typography variant="body2" color="textSecondary" >
                          Original price :  ₹{product.originalPrice} (discount: {product.discount}%)
                        </Typography>} */}
                        {product?.discount > 0 ? (
                        <>
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
                        </>
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

                      </Grid>
                      {/* <Grid item xs={12} sm={12}> */}
                        {/* <Typography variant="body1" style={{ fontWeight: 500 }}>
                          {post.postType === 'HelpRequest' ? 'Post Status' : 'Service Status'}
                        </Typography> */}
                        {/* <Typography variant="body2" color="textSecondary">
                        {post.gender}
                      </Typography> */}
                        {/* <Typography variant="body2" color={product.stockStatus === 'In Stock' ? 'green' : 'rgba(194, 28, 28, 0.89)'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                          {product.stockStatus} ({product?.totalStock || 0})
                        </Typography> */}
                        {/* <Typography variant="body2">Delivery in {product.deliveryDays} days</Typography>
                        {product.deliveryDays && (
                          <Typography color='grey' variant="body2">
                            {`Product will be delivered by ${calculateDeliveryDate(product.deliveryDays)}`}
                          </Typography>
                        )} */}
                      {/* </Grid> */}
                      
                      {/* <Grid item xs={6} sm={4}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        Post Status: 
                      </Typography>
                      <Typography variant="body2" color={post.postStatus === 'Active' ? 'green' : 'rgba(194, 28, 28, 0.89)'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                        {post.postStatus}
                      </Typography>
                    </Grid> */}
                      {/* <Grid item xs={12} sm={6}>
                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                          Product added on:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Date: {new Date(product.createdAt).toLocaleDateString()} (delivery in {product.deliveryDays} day's)
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Time: {new Date(post.timeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(post.timeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Grid> */}
                      {/* <Grid item xs={6} sm={4}>
                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                          People Required:
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {post.peopleCount} ({post.gender})
                        </Typography>
                      </Grid> */}
                      {/* <Grid item xs={12} sm={6}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        Service required on time: 
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(post.timeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(post.timeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Grid> */}
                      {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Date : {new Date(post.serviceDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Time from - To : {new Date(post.timeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(post.timeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography> */}
                      {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Posted on : {new Date(post.createdAt).toLocaleString() || 'Invalid date'}
                    </Typography> */}
                      {/* {!(post.createdAt === post.updatedAt) && ( */}
                      {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Updated on : {new Date(post.updatedAt).toLocaleString() || 'Invalid date'}
                    </Typography> */}
                      {/* )} */}
                      {/* <Grid item xs={12} sm={12}>
                        <Typography variant="body2">Service required for {post.serviceDays} days</Typography>
                        {post.serviceDays && (
                          <Typography color='grey' variant="body2">
                          </Typography>
                        )}
                      </Grid> */}

                      {/* <Grid item xs={6} sm={4}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        IP address: 
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {post.ip}
                      </Typography>
                    </Grid> */}
                    </Grid>
                    <Box sx={{ borderRadius: '8px', my: 1,
                      //  ...getGlassmorphismStyle(theme, darkMode) 
                       }}>
                      <ColorVariantDisplay 
                        variants={product.variants}
                        selectedColorIndex={selectedColorIndex}
                        setSelectedColorIndex={setSelectedColorIndex}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        setSelectedSizeCount={setSelectedSizeCount}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Delivery in {product.deliveryDays} days</Typography>
                      {product.deliveryDays && (
                        <Typography color='grey' variant="body2">
                          {`Product will be delivered by ${calculateDeliveryDate(product.deliveryDays)}`}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Toolbar sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    // bgcolor: 'white', borderRadius:'16px',
                    // boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0rem',
                  }}>
                    {/* <Box style={{ display: 'flex', flexGrow: 1, }}> */}
                    {/* <Typography variant="body2" color={stockCountId > 0 ? "green" : "red"}>
                      {stockCountId > 0 ? `In Stock (${stockCountId} available)` : "Out of Stock"}
                    </Typography> */}
                    {/* </Box> */}
                    <Box >
                      {/* <Button
                        variant="text"
                        color="secondary"
                        // onClick={() => openRouteMapDialog(product)}
                        // disabled={stockCountId === 0}
                        style={{ margin: "0rem", borderRadius: '10px' }}
                        startIcon={<RouteRoundedIcon />}
                      >
                        Route Map
                      </Button> */}
                      {/* <Typography variant="body2" color="textSecondary">
                        (delivery in {product.deliveryDays} day's)
                      </Typography> */}
                      <Typography variant="body2" color={product.stockStatus === 'In Stock' ? 'green' : 'rgba(194, 28, 28, 0.89)'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                          {product.stockStatus} ({product?.totalStock || 0})
                        </Typography>
                    </Box>
                    {/* {!(product.user.id === userId) && */}
                      <Box >
                        <Button
                          variant="contained"
                          // color="primary"
                          // onClick={() => openRouteMapDialog(post)}
                          // disabled={stockCountId === 0}
                          onClick={handleBuyNow}
                          // disabled={product.totalStock === 0}
                          // sx={{ margin: "0rem", borderRadius: '8px', background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)', }}
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
                          startIcon={<LocalMallRoundedIcon />}
                          // onClick={handleOpenChatDialog}
                        >
                          Buy Now
                        </Button>
                      </Box>
                    {/* } */}
                  </Toolbar>

                </Box>
            </Box>

            <Grid item xs={12} sx={{ mt: '1rem' }}>
              <Grid sx={{
                bottom: '8px',
                right: '0px', position: 'relative', display: 'inline-block', float: 'right',
              }}>
                <IconButton
                  onClick={handleLike} sx={{gap:'2px'}}
                  disabled={likeLoading} // Disable button while loading, sx={{ color: product.likedByUser ? 'blue' : 'gray' }} 
                >
                  {likeLoading ? (
                    <CircularProgress size={24} color="inherit" /> // Show spinner while loading
                  ) : product.likedByUser ? (
                    <ThumbUpRoundedIcon />
                  ) : (
                    <ThumbUpOutlinedIcon />
                  )}
                  {product.likes}
                </IconButton>
                <IconButton sx={{gap:'2px'}}
                  onClick={() => openComments(product)}
                >
                  <ChatRoundedIcon /> {product.comments?.length || 0}
                </IconButton>
              </Grid>
              <Typography variant="body1" style={{ paddingLeft: '6px', fontWeight: 500 }}>
                Product Description
              </Typography>
              <Box sx={{borderRadius:'8px', ...getGlassmorphismStyle(theme, darkMode), mt: '4px'}}> {/* bgcolor: '#f5f5f5', */}
                <Typography variant="body1" color="textSecondary" style={{
                  // marginTop: '0.5rem',
                  lineHeight: '1.5',
                  // textAlign: 'justify',
                  whiteSpace: "pre-wrap", // Retain line breaks and tabs
                  wordWrap: "break-word", // Handle long words gracefully
                  // backgroundColor: "#f5f5f5",
                  padding: "1rem",
                  borderRadius: "8px",
                  // border: "1px solid #ddd",
                }}>
                  {product.description}
                </Typography>
                
              </Box>
            </Grid>
            {/* Ratings Section */}
              <Box sx={{
                borderRadius: '8px',
                my: 1,
                p: 2,
                ...getGlassmorphismStyle(theme, darkMode)
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Product Ratings
                </Typography>
                <Box sx={{
                  display: 'flex', gap: 1,
                  flexDirection: isMobile ? 'column' : 'row',
                  // justifyContent: 'space-between',
                  // alignItems: 'flex-start',
                  // mb: 2
                }}>
                  <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: 2,
                    alignItems: 'center', justifyContent: 'center',
                    p: 3, bgcolor: '#f8f9fa',
                    // minWidth: isMobile ? '100%' : 180,
                    // width: isMobile ? '100%' : 180,
                    borderRadius: '8px',
                    // bgcolor: darkMode ? 'rgba(30,30,30,0.3)' : 'rgba(255,255,255,0.3)',
                    // position: 'sticky',
                    top: 16,
                    // alignSelf: 'flex-start'
                  }}>
                    <Rating
                      value={product.ratings?.average || 0}
                      precision={0.1}
                      readOnly
                      size="large"
                    />
                    <Typography variant="body1" sx={{ ml: 0 }}>
                      {product.ratings?.average?.toFixed(1) || '0.0'} ({product.ratings?.count || 0} ratings)
                    </Typography>
                    {showAllRatings && <Button
                      variant="outlined"
                      onClick={() => {
                        setShowAllRatings(!showAllRatings);
                        if (!showAllRatings && productRatings.length === 0) {
                          fetchProductRatings();
                        }
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      Hide Ratings
                    </Button>}
                  </Box>

                  {showAllRatings ? (
                    <Box sx={{
                      flex: 1,
                      width: isMobile ? '100%' : '60%',
                      position: 'relative', alignSelf: 'center'
                      // minHeight: 200
                    }}>
                      {ratingsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      ) : productRatings.length > 0 ? (
                        <Box sx={{
                          display: 'flex',
                          overflowX: 'auto',
                          // scrollbarWidth: 'thin',
                          // py: 1, px: 1,
                          gap: 1,
                          // '&::-webkit-scrollbar': {
                          //   height: '6px',
                          // },
                          // '&::-webkit-scrollbar-thumb': {
                          //   backgroundColor: darkMode ? '#555' : '#ccc',
                          //   borderRadius: '3px',
                          // },
                          scrollbarWidth: 'none', // Firefox
                          // scrollbarColor: '#aaa transparent',
                          //                 "&::-webkit-scrollbar-button": {
                          //   display: 'none', // Remove scrollbar arrows
                          // },
                        }}>
                          {
                            productRatings.map((rating, index) => (
                              <Box key={index} sx={{
                                p: 2,
                                minWidth: 240,
                                maxWidth: 240,
                                borderRadius: '12px',
                                flexShrink: 0, bgcolor: '#f8f9fa',
                                // bgcolor: darkMode ? 'rgba(30,30,30,0.5)' : 'rgba(255,255,255,0.7)',
                                display: 'flex',
                                flexDirection: 'column', justifyContent: 'space-between',
                                height: 180, // height: '100%'
                              }}>
                                <Box>
                                <Box item xs={12} sm={4} my={1} display="flex" alignItems="center" >
                                  <Avatar
                                    src={`data:image/png;base64,${rating?.userId?.profilePic}`}
                                    alt={rating?.userId?.username[0]}
                                    sx={{ width: 24, height: 24, borderRadius: '50%', marginRight: 1 }}
                                  />
                                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                                    {rating?.userId?.username}
                                  </Typography>

                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <Rating
                                    value={rating.rating}
                                    precision={0.5}
                                    readOnly
                                    size="small"
                                  />
                                  <Typography variant="body2" sx={{ ml: 1 }}>
                                    {rating.rating.toFixed(1)}
                                  </Typography>
                                </Box>
                                {rating.review && (
                                  <Typography variant="body2" sx={{
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 4, // no of lines of description
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.4,
                                    mb: 1
                                  }}>
                                    {rating.review}
                                  </Typography>
                                )}
                                </Box>
                                <Typography variant="caption" color="textSecondary" >
                                  {rating.updatedAt ? `Updated on: ${new Date(rating.updatedAt).toLocaleString()}` : `Rated on: ${new Date(rating.createdAt).toLocaleString()}`}
                                </Typography>
                              </Box >
                            ))
                          }</Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', p: 2 }}>
                          No ratings yet for this product
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{
                      flex: 1,
                      width: isMobile ? '100%' : '60%',
                      position: 'relative', alignItems: 'center', display: 'flex', justifyContent: 'center',
                      // minHeight: 200
                    }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setShowAllRatings(!showAllRatings);
                        if (!showAllRatings && productRatings.length === 0) {
                          fetchProductRatings();
                        }
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 'medium', 
                      }}
                    >
                      {showAllRatings ? 'Hide Ratings' : 'Show All Ratings'}
                    </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              
            {/* </Box> */}
            <Box sx={{ borderRadius:'8px', my:1, padding:'1rem', ...getGlassmorphismStyle(theme, darkMode), }}> {/* bgcolor: '#f5f5f5', */}
            <Grid item xs={6} sm={4} >
              <Typography variant="body1" style={{ fontWeight: 500 }}>
                Seller Details
              </Typography>
              {/* <Typography variant="body2" color="textSecondary">
                {post.user.id}
              </Typography>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  User Code:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {post.userCode}
                </Typography>
              </Grid> */}
                <Box display="flex" alignItems="center" spacing={1} justifyContent="flex-end" sx={{display: 'inline-block', float: 'right',}}>
                  {/* Trust Level */}
                  {/* <Grid item>
                    <Box display="flex" >
                      <Typography variant="body2" color="textSecondary" mr={1}>
                        Trust Level
                      </Typography>
                      <StarRoundedIcon sx={{ color: 'gold', fontSize: 18, marginRight: 0.5 }} />
                      <Typography variant="body2" color="textSecondary">
                        {post.user.trustLevel || "N/A"}
                      </Typography>
                    </Box>
                  </Grid> */}
                  {/* Rate User Button */}
                  {/* <Grid item justifyContent="flex-end" mt={1}>
                    <Button variant="outlined" size="small" sx={{borderRadius:'12px', padding: '4px 12px'}} onClick={handleOpenRateDialog}>
                      User Ratings
                    </Button>
                  </Grid> */}
                </Box>
              <Grid item xs={12} sm={4} my={1} display="flex" alignItems="center" >
                {/* {post.user?.profilePic && ( */}
                  <Avatar
                    src={`data:image/png;base64,${product.user.profilePic}`}
                    alt={product.user.username[0]}
                    sx={{ width: 40, height: 40, borderRadius: '50%', marginRight: 1 }}
                  />
                {/* )} */}
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {product.user?.username}
                </Typography>
              
              </Grid>
              
            </Grid>
            <Grid item xs={12} sm={12} pt={1}>
              <Typography variant="body2" color="textSecondary" >
                Added on : {new Date(product.createdAt).toLocaleString() || 'Invalid date'}
              </Typography>
              {product.updatedAt&& (
              <Typography variant="body2" color="textSecondary" style={{ fontWeight: 500 }}>
                Updated on : {new Date(product.updatedAt).toLocaleString() || 'Invalid date'}
              </Typography>
              )}
            </Grid>


            </Box>

            


            

          </Box>
        
          {/* Large Image Dialog with Zoom */}
          <ImageZoomDialog
            selectedImage={selectedImage}
            handleCloseImageModal={handleCloseImageModal}
            images={product.media} // Pass the full media array
          />
          <CommentPopup
            open={commentPopupOpen}
            onClose={() => setCommentPopupOpen(false)}
            post={product} // Pass the current product
            onCommentAdded={onCommentAdded}  // Passing the comment added handler
            setLoginMessage={setLoginMessage} darkMode={darkMode} getGlassmorphismStyle={getGlassmorphismStyle}
          />
          
          
          
          </>
        }
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius:'1rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={9000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ width: '100%', borderRadius:'1rem' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={loginMessage.open}
        autoHideDuration={9000}
        onClose={() => setLoginMessage({ ...loginMessage, open: false })}
        message={
          <span>
            Please log in first.{" "}
            <Link
              to="/login"
              style={{ color: "yellow", textDecoration: "underline", cursor: "pointer" }}
            >
              Click here to login
            </Link>
          </span>
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert
          severity="warning"
          variant="filled"
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            // padding: "12px 20px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          }}
          action={
            <Button
              component={Link}
              to="/login"
              size="small"
              sx={{
                color: "#ffd700",
                fontWeight: "bold",
                textTransform: "none",
                border: "1px solid rgba(255, 215, 0, 0.5)",
                borderRadius: "5px",
                // padding: "3px 8px",
                marginLeft: "10px",
                "&:hover": {
                  backgroundColor: "rgba(255, 215, 0, 0.2)",
                },
              }}
            >
              Login
            </Button>
          }
        >
          Please log in first.
        </Alert>
      </Snackbar>

      </Box>
    </Layout>
  );
}

export default ProductDetailsById;

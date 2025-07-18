import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layout/Layout";
import { Alert, alpha, Box, Button, Card, CardActions, CardContent, CardMedia, Grid, Snackbar, Tooltip, useMediaQuery, useTheme, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";
import PostProduct from "./PostProduct";
import { deleteProduct, filterProductsByGender, getProductCounts, searchProducts } from "../Apis/SellerApis";
import {
  Typography,
  TextField,
  //   Button, 
  // Paper, 
  // Table, 
  // TableBody, 
  // TableCell, 
  // TableContainer, 
  // TableHead, 
  // TableRow, 
  MenuItem,
  Select,
  //   Box,
  // CircularProgress,
  //   useMediaQuery,
  Tabs,
  Tab,
  Badge,
  Pagination,
  Stack,
  InputAdornment,
  IconButton
} from "@mui/material";
// import { Chip, Skeleton } from '@mui/material';
// import Layout from "../Layout";
// import { filterUsersByStatus, getproductCounts, searchUsers, updateAccountStatus } from "../api/adminApi";
// import { useTheme } from "@emotion/react";
import ClearIcon from '@mui/icons-material/Clear';
import LazyImage from "../Products/LazyImage";
// import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
import SkeletonCards from "../Layout/SkeletonCards";

const SellerProducts = ({ darkMode, toggleDarkMode, unreadCount, shouldAnimate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  // const [statusUpdates, setStatusUpdates] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState('all');
  // const [filterStatus, setFilterStatus] = useState('');
  const [productCounts, setProductCounts] = useState({
    all: 0,
    Female: 0,
    Male: 0,
    Kids: 0,
    // deleted: 0
  });
  const inputRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [searchMode, setSearchMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [mediaError, setMediaError] = useState('');
  const [loading, setLoading] = useState(false); // to show loading state
  const [submitError, setSubmitError] = useState(''); // Error for failed product submission
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProductDeletion, setLoadingProductDeletion] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Fetch user counts on component mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getProductCounts();
        setProductCounts(response.data);
      } catch (error) {
        console.error("Error fetching product counts:", error);
      }
    };
    fetchCounts();
  }, []);

  // Load products based on active tab
  useEffect(() => {
    const loadProducts = async () => {
      // if (activeTab === 'search') return;

      setLoadingData(true);
      try {
        let response;
        if (searchQuery.trim() && activeTab === 'all') {
          setSearchMode(true);
          response = await searchProducts(searchQuery, pagination.page, pagination.limit);
        } else {
          setSearchMode(false);
          response = await filterProductsByGender(
            activeTab === 'all' ? '' : activeTab,
            pagination.page,
            pagination.limit,
            searchQuery
          );
        }
        setProducts(response.data.products);
        setPagination({
          page: response.data.currentPage,
          limit: pagination.limit,
          total: response.data.total,
          pages: response.data.pages,
          hasNext: response.data.hasNextPage,
          hasPrev: response.data.hasPrevPage
        });
        // Initialize status updates
        // const updates = {};
        // response.data.products.forEach(product => {
        // updates[product._id] = product.gender;
        // });
        // setStatusUpdates(updates);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadProducts();
  }, [activeTab, pagination.page, pagination.limit, searchQuery, refreshTrigger]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearClick = () => {
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
    inputRef.current?.focus();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on tab change
  };

  // const handleStatusChange = (userId, newStatus) => {
  //     setStatusUpdates(prev => ({
  //     ...prev,
  //     [userId]: newStatus
  //     }));
  // };

  // const handleSaveStatus = async (userId) => {
  //     try {
  //     const newStatus = statusUpdates[userId];
  //     const currentStatus = users.find(u => u._id === userId)?.accountStatus;

  //     if (!newStatus || newStatus === currentStatus) return;
  //     await updateAccountStatus(userId, newStatus);
  //     // Update the user in local state
  //     setUsers(prev => prev.map(user => 
  //         user._id === userId ? { ...user, accountStatus: newStatus } : user
  //     ));

  //     // Update counts if status changed
  //     // if (users.find(u => u._id === userId)?.accountStatus !== newStatus) {
  //         const response = await getproductCounts();
  //         setproductCounts(response.data);
  //     // }
  //     } catch (error) {
  //     console.error("Error updating status:", error);
  //     // Revert the status change in UI
  //     setStatusUpdates(prev => ({
  //         ...prev,
  //         [userId]: users.find(u => u._id === userId)?.accountStatus
  //     }));
  //     }
  // };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination(prev => ({
      ...prev,
      limit: newLimit,
      page: 1 // Always reset to page 1 when changing limit
    }));
  };

  // const [selectedProduct, setSelectedProduct] = useState(null);
  // const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' }); // For notifications
  // const theme = useTheme();
  // const navigate = useNavigate();
  //   const navigate = useNavigate();
  // const [mapMode, setMapMode] = useState('normal');
  // const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
  // const [locationDetails, setLocationDetails] = useState(null);
  // const { id } = useParams(); // Extract sellerId from URL
  // const [error, setError] = useState('');
  // const [successMessage, setSuccessMessage] = useState('');
  // const theme = useTheme();
  //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });



  const handleOpenDialog = () => {
    // Reset form data to empty
    // setFormData({
    //     title: '',
    //     price: '',
    //     categories: '',
    //     gender: '',
    //     postStatus: '',
    //     peopleCount: '',
    //     serviceDays: '',
    //     description: '',
    //     isFullTime: false,
    //     media: null,
    // });
    setEditingProduct(null); // Ensure it's not in editing mode
    // setExistingMedia([]); // Clear any existing media
    // setNewMedia([]); // Clear new media files
    // setGeneratedImages([]);
    // setNoImagesFound(false); // Reset no images found state
    setOpenDialog(true);
    // setActiveStep(0);
    // setValidationErrors({});
  };

  const handleCloseDialog = () => {
    setEditingProduct(null);
    // setExistingMedia([]);
    // setNewMedia([]);
    setOpenDialog(false);
    // setMediaError('');
    // setSubmitError(''); // Clear submission error when dialog is closed
    // setFormData({ title: '', price: '', categories: '', gender: '', postStatus: '', peopleCount: '', serviceDays: '', description: '', isFullTime: false, media: null });
    // setSelectedDate(null);
    // setTimeFrom(null);
    // setTimeTo(null);
    // setGeneratedImages([]);
    // setNoImagesFound(false); // Reset no images found state
    // setProtectLocation(false);
    // setFakeAddress('');
    // setActiveStep(0);
    // setValidationErrors({});
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleEdit = (product) => {
    // fetchPostMedia(post._id); // to fetch the post's entire media
    setEditingProduct(product);
    // setFormData({
    //   title: post.title,
    //   price: post.price,
    //   categories: post.categories,
    //   gender: post.gender,
    //   postStatus: post.postStatus,
    //   peopleCount: post.peopleCount,
    //   serviceDays: post.serviceDays,
    //   description: post.description,
    //   isFullTime: post.isFullTime,
    //   latitude: post.location.latitude,
    //   longitude: post.location.longitude,
    //   coordinates: [post.location.longitude, post.location.latitude],
    //   type: 'Point',
    //   address: post.location.address,
    //   // media: null, // Reset images to avoid re-uploading
    // });
    // // Set the date and time fields if they exist in the post
    // if (post.serviceDate) {
    //   setSelectedDate(new Date(post.serviceDate));
    // }
    // if (post.timeFrom) {
    //   setTimeFrom(new Date(post.timeFrom));
    // }
    // if (post.timeTo) {
    //   setTimeTo(new Date(post.timeTo));
    // }
    setExistingMedia(product.media.map((media, index) => ({ data: media.toString('base64'), _id: index.toString(), remove: false })));
    setOpenDialog(true);
  };

  const handleDeleteClick = (product, event) => {
    if (event) event.stopPropagation();
    setSelectedProduct(product);  // Store selected post details
    setDeleteDialogOpen(true);  // Open confirmation dialog
  };

  const handleConfirmDelete  = async () => {
    if (!selectedProduct) return;
    // const post = posts.find((p) => p._id === postId); // Find the product to get its title
  
    // if (!post) {
    //   // showNotification("Post not found for deletion.", "error");
    //   setSnackbar({ open: true, message: 'Post not found for deletion.', severity: 'error' });
    //   return;
    // }
    setLoadingProductDeletion(true);
    try {
      await deleteProduct(selectedProduct._id);
      // Update local state instead of refetching
      setProducts(prevProducts => prevProducts.filter(product => product._id !== selectedProduct._id));
      setProductCounts(prevCounts => ({
        ...prevCounts,
        all: prevCounts.all - 1,
        [selectedProduct.gender]: prevCounts[selectedProduct.gender] - 1
      }));
      setPagination(prev => ({
        ...prev,
        total: prev.total - 1
      }));
      // showNotification(`Post "${post.title}" deleted successfully.`, "success");
      setSnackbar({ open: true, message: `Product "${selectedProduct.title}" deleted successfully.`, severity: 'success' });
      // await fetchPostsData(); // Refresh posts list
    } catch (error) {
      console.error("Error deleting post:", error);
      // showNotification(`Failed to delete "${post.title}". Please try again later.`, "error");
      setSnackbar({ open: true, message: `Failed to delete "${selectedProduct.title}". Please try again later.`, severity: 'error' });
    } finally {
      setDeleteDialogOpen(false); // Close dialog after action
      setLoadingProductDeletion(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ m: isMobile ? '12px' : '18px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} >
            Seller Products
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            size="small"
            sx={{
              // backgroundColor: '#1976d2', // Primary blue
              background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
              color: '#fff',
              // padding: '4px 12px',
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                // backgroundColor: '#1565c0', // Darker shade on hover
                boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
                transform: 'translateY(-2px)',
              },
              display: 'flex',
              alignItems: 'center',
              gap: '8px', marginRight: '0px',
              textTransform: 'none',
              fontWeight: 600,
            }}
            aria-label="Add New Post"
            title="Add New Post"
          >
            <PostAddRoundedIcon sx={{ fontSize: '20px' }} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Product</span>
          </Button>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }} variant={isMobile ? "scrollable" : "standard"}
        // scrollButtons={isMobile ? "auto" : false}
        // allowScrollButtonsMobile
        >
          <Tab
            label={<Badge badgeContent={productCounts.all} color="primary">All Products</Badge>}
            value="all"
          />
          <Tab
            label={<Badge badgeContent={productCounts.Female} color="success">Female</Badge>}
            value="Female"
          />
          <Tab
            label={<Badge badgeContent={productCounts.Male} color="warning">Male</Badge>}
            value="Male"
          />
          <Tab
            label={<Badge badgeContent={productCounts.Kids} color="error">Kids</Badge>}
            value="Kids"
          />
          {/* <Tab 
            label={<Badge badgeContent={productCounts.deleted} color="secondary">Deleted</Badge>} 
            value="deleted" 
          /> */}
          {/* <Tab label="Search" value="search" /> */}
        </Tabs>

        {activeTab === 'all' && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search Products"
              value={searchQuery} size="small"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Title"
              // , email, user code, or ID"
              sx={{
                width: '400px', m: '6px',
                '& .MuiInputBase-root': {
                  borderRadius: '20px',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#4361ee',
                    borderWidth: '1px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4361ee',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  '&.Mui-focused': {
                    color: '#4361ee',
                  },
                },
              }}
              InputProps={{
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearClick}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <ClearIcon color="action" fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={searchQuery.trim() === '' || loadingData}
              sx={{ borderRadius: '12px', m: '6px', backgroundColor: '#4f46e5', width: '100px' }}
            >
              {/* {loading ? <CircularProgress size={24} /> : " */}
              Search
              {/* "} */}
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1">
            Showing {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
            {searchMode && searchQuery.trim() && ` (search results)`}
          </Typography>
          <Select
            value={pagination.limit}
            onChange={handleLimitChange}
            size="small"
            sx={{ width: 100 }}
          >
            <MenuItem value={10}>10 per page</MenuItem>
            <MenuItem value={20}>20 per page</MenuItem>
            <MenuItem value={50}>50 per page</MenuItem>
            <MenuItem value={100}>100 per page</MenuItem>
          </Select>
        </Box>

        {loadingData ? (
          <SkeletonCards />
        ) : products.length > 0 ? (
          <>
            <Grid container spacing={isMobile ? 1.5 : 2}>
              {products.map((post) => (
                <Grid item xs={12} sm={6} md={4} key={post._id}>
                  {/* <ProductCard product={product} /> */}
                  <Card sx={{
                    margin: '0rem 0', borderRadius: 3, overflow: 'hidden',
                    // backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    // border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                      '& .card-actions': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      },
                      '& .price-chip': {
                        transform: 'scale(1.05)'
                      }
                    },
                    cursor: 'pointer',
                    position: 'relative',
                    height: isMobile ? '380px' : '360px', display: 'flex',
                    flexDirection: 'column',
                  }}
                  // onClick={() => openPostDetail(post)}
                  // onMouseEnter={(e) => {
                  //   e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                  //   e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                  //   e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                  // }}
                  // onTouchStart={(e) => {
                  //   if (e.currentTarget) {
                  //     e.currentTarget.style.transform = 'scale(1.03)';
                  //     e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.2)'; // More subtle effect
                  //     e.currentTarget.style.borderRadius = '14px'; // Ensure smooth edges
                  //   }
                  // }}
                  // onTouchEnd={(e) => {
                  //   if (e.currentTarget) {
                  //     setTimeout(() => {
                  //       if (e.currentTarget) {
                  //         e.currentTarget.style.transform = 'scale(1)';
                  //         e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  //       }
                  //     }, 150);
                  //   }
                  // }}
                  >
                    {/* CardMedia for Images with Scroll */}
                    <CardMedia style={{ margin: '0rem 0', borderRadius: '8px', overflow: 'hidden', height: '160px', backgroundColor: '#f5f5f5' }}>
                      <div style={{
                        display: 'flex',
                        overflowX: 'auto', overflowY: 'hidden',
                        scrollbarWidth: 'none',
                        scrollbarColor: '#888 transparent',
                        borderRadius: '8px',
                        gap: '0.1rem',
                        // marginBottom: '1rem'
                        height: '170px'
                      }}
                      // onClick={() => openPostDetail(post)}
                      >
                        {post.media && post.media.length > 0 ? (
                          post.media && post.media.slice(0, 5).map((base64Image, index) => (
                            <LazyImage key={index} base64Image={base64Image} alt={`Post ${index}`} style={{
                              height: '160px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              flexShrink: 0,
                              cursor: 'pointer' // Make the image look clickable
                            }} />
                          ))
                        ) : (
                          // Show a placeholder image if no media is available
                          <img
                            src="https://placehold.co/56x56?text=No+Imag" // Replace with the path to your placeholder image
                            alt="No media available"
                            style={{
                              height: '160px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                      {post.media && post.media.length > 5 && (
                        <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                          Media exceeds its maximum count
                        </Typography>
                      )}
                    </CardMedia>
                    <CardContent sx={{
                      position: 'absolute',
                      bottom: 40,
                      left: 0,
                      right: 0,
                      padding: '16px',
                    }}>
                      {/* {post.isFullTime &&  */}
                      <Typography sx={{ px: 2, py: 0.5, bgcolor: '#e0f7fa', color: '#006064', borderRadius: '999px', display: 'inline-block', float: 'right', fontWeight: '600', fontSize: '0.875rem' }}>
                        ₹ {post.price}
                      </Typography>
                      {/* } */}
                      <Tooltip title={post.title} placement="top" arrow>
                        <Typography variant="h6" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#333', }}>
                          {post.title.split(" ").length > 5 ? `${post.title.split(" ").slice(0, 5).join(" ")}...` : post.title}
                        </Typography>
                      </Tooltip>
                      <Typography variant="body1" style={{ display: 'inline-block', float: 'right', fontWeight: '500', color: '#333', }}>
                        {post.stockStatus} ({post?.totalStock || 0})
                      </Typography>
                      {/* <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={post.gender}
                      size="small"
                      sx={{
                        backgroundColor: post.gender === 'Male' ? '#e3f2fd' : '#fce4ec',
                        color: post.gender === 'Male' ? '#1976d2' : '#c2185b',
                        fontWeight: 'medium',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box> */}
                      <Typography variant="body2" sx={{ marginBottom: '0.5rem', color: '#333', }}>
                        {post.gender} ({post?.categoriesFemale || post?.categoriesMale || post?.categoriesKids})
                      </Typography>
                      {/* <Typography variant="body2" style={{ display: 'inline-block', float: 'right', marginBottom: '0.5rem', color: '#333' }}>
                        {post.stockStatus} ({post?.totalStock || 0})
                      </Typography> */}
                      {/* {post.stockStatus === 'In Stock' && ( */}
                      {/* <Typography variant="body2" style={{ display: 'inline-block', marginBottom: '0.5rem', color: '#333' }}>
                        Category: {post?.categoriesFemale || post?.categoriesMale || post?.categoriesKids}
                      </Typography> */}
                      {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                    Date : {new Date(post.serviceDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                    Time from - To : {new Date(post.timeFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(post.timeTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography> */}
                      <Typography variant="body2" style={{ marginBottom: '0.5rem', color: '#333' }}>
                        Added on : {new Date(post.createdAt).toLocaleString() || 'Invalid date'}
                      </Typography>
                      {/* {!(post.createdAt === post.updatedAt) && ( */}
                      {post.updatedAt && (
                        <Typography variant="body2" style={{ marginBottom: '0.5rem', color: '#333' }}>
                          Updated on : {new Date(post.updatedAt).toLocaleString() || 'Invalid date'}
                        </Typography>
                      )}
                      {/* )} */}
                      {/* )} */}
                      {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
      Service Days: {post.serviceDays}
    </Typography>
    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
      UserCode : {post.userCode}
    </Typography> */}
                      {/* <Typography
                    variant="body2"
                    // color="textSecondary"
                    style={{
                      marginBottom: '0rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                      maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                      lineHeight: '1.5rem',  // Adjust to control exact line spacing.
                      color: '#333'
                    }}>
                    Description: {post.description}
                  </Typography> */}
                    </CardContent>
                    <CardActions sx={{
                      justifyContent: 'space-between', padding: '12px 1rem', position: 'absolute', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', mt: 2, backdropFilter: 'blur(10px)',
                      left: 0,
                      right: 0,
                      // padding: '16px',
                      color: 'white'
                    }}>
                      {/* <Box> */}

                      <Button color="error" size="small" variant="outlined" startIcon={<DeleteSweepRoundedIcon />} key={post._id}
                        sx={{
                          borderRadius: '8px', textTransform: 'none', fontWeight: 'medium',
                          '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.1)',
                            transform: 'translateY(-2px)',
                          }
                        }} onClick={(event) => handleDeleteClick(post, event)}>Delete</Button>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button color="primary" size="small" variant="outlined" startIcon={<EditNoteRoundedIcon />}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 'medium', mx: 1,
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              transform: 'translateY(-2px)',
                            }
                          }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent triggering the parent onClick
                            handleEdit(post);
                          }}>Edit</Button>
                        <Button
                          variant="contained"
                          size="small"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle view
                          }}
                        >
                          View
                        </Button>
                      </Box>
                      {/* </Box> */}
                      {/* <Badge
                    badgeContent={post.unreadMessages || 0} 
                    color="error" 
                    overlap="circular"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: 3,
                        top: 3,
                        border: `2px solid rgba(255, 255, 255, 0.8)`,
                        padding: '0 4px', 
                      }
                    }}
                  >
                    <Button  variant="contained" size="small" startIcon={<ForumRoundedIcon />} sx={{ borderRadius: '8px', background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)', '&:hover': {
                      background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)', 
                      transform: 'translateY(-2px)' }, transition: 'all 0.3s ease', }} onClick={(e) => { e.stopPropagation(); handleChatsOpen(post);}}
                    >Chats</Button>
                  </Badge> */}
                    </CardActions>
                  </Card>
                </Grid>
                // <Grid item xs={12} sm={6} md={4} key={product._id}>
                // <Card style={{
                //     margin: '0rem 0',  // spacing between up and down cards
                //     cursor: 'pointer',
                //     backdropFilter: 'none',
                //     backgroundColor: 'rgba(255, 255, 255, 0.8)',
                //     borderRadius: '8px',
                //     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
                //     transition: 'transform 0.1s ease, box-shadow 0.1s ease', // Smooth transition for hover
                // }}
                //     // onClick={() => openProductDetail(product)}
                //     onClick={(event) => {event.stopPropagation(); // Prevent triggering the parent onClick
                //       handleEdit(product);}}
                //     onMouseEnter={(e) => {
                //     e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                //     e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                //     }}
                //     onMouseLeave={(e) => {
                //     e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                //     e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                //     }} >
                //     {/* CardMedia for Images with Scroll */}
                //     <CardMedia marginInline={isMobile ? "-12px" : "-2px"} sx={{ margin: '0rem 0', borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#f5f5f5' }}>
                //     <div style={{
                //         display: 'flex',
                //         overflowX: 'auto',
                //         scrollbarWidth: 'thin',
                //         scrollbarColor: '#888 transparent',
                //         borderRadius: '8px',
                //         gap: '0.1rem',
                //         // marginBottom: '1rem'
                //         height: '210px'
                //     }} >
                //         {product.media && product.media.slice(0, 5).map((base64Image, index) => (
                //         <LazyImage key={index} base64Image={base64Image} alt={`Product ${index}`} style={{
                //             height: '200px',
                //             borderRadius: '8px',
                //             objectFit: 'cover',
                //             flexShrink: 0,
                //             cursor: 'pointer' // Make the image look clickable
                //         }} />
                //         ))}
                //     </div>
                //     {product.media && product.media.length > 5 && (
                //         <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                //         Media exceeds its maximum count
                //         </Typography>
                //     )}
                //     </CardMedia>
                //     <CardContent style={{ padding: '1rem' }}>
                //     <Tooltip title={product.title} placement="top" arrow>
                //         <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                //         {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                //         </Typography>
                //     </Tooltip>
                //     <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                //         Price: ₹{product.price}
                //     </Typography>
                //     <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                //         Gender: {product.gender}
                //     </Typography>
                //     {/* <Typography variant="body2" color={product.stockStatus === 'In Stock' ? 'green' : 'red'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                //         Stock Status: {product.stockStatus}
                //     </Typography> */}
                //     {/* <Typography variant="body2" color={product.stockCount > 0 ? "green" : "red"} style={{ marginBottom: '0.5rem' }}>
                //         {product.stockCount > 0 ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
                //     </Typography> */}
                //     {/* {product.stockStatus === 'In Stock' && (
                //         <Typography variant="body2" color="textSecondary" style={{ display: 'inline-block', float: 'right', marginBottom: '0.5rem' }}>
                //         Stock Count: {product.stockCount}
                //         </Typography>
                //     )} */}
                //     <Typography
                //         variant="body2"
                //         color="textSecondary"
                //         style={{
                //         marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                //         maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                //         lineHeight: '1.5rem'  // Adjust to control exact line spacing.
                //         }}>
                //         Description: {product.description}
                //     </Typography>
                //     {/* <Grid item xs={6} sm={4}>
                //         <Typography variant="body1" style={{ fontWeight: 500 }}>
                //         Seller Details:
                //         </Typography>
                //         <Typography variant="body2" color="textSecondary">
                //         {product.sellerTitle}
                //         </Typography>
                //     </Grid> */}
                //     </CardContent>
                // </Card>

                // </Grid>
              ))}

            </Grid>
            {/* <TableContainer component={Paper}>
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>User Code</TableCell>
                  <TableCell>Current Status</TableCell>
                  <TableCell>New Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userCode}</TableCell>
                    <TableCell>{user.accountStatus}</TableCell>
                    <TableCell>
                      <Select
                        value={statusUpdates[user._id] || user.accountStatus}
                        // onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        size="small"
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                        <MenuItem value="suspended">Suspended</MenuItem>
                        <MenuItem value="deleted">Deleted</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        // onClick={() => handleSaveStatus(user._id)}
                        disabled={statusUpdates[user._id] === user.accountStatus}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> */}

            <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
              <Pagination
                count={pagination.pages}
                page={pagination.page}
                onChange={handlePageChange}
                shape="rounded"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Stack>
          </>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50vh',
            textAlign: 'center',
          }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt="No posts found"
              style={{ width: '100px', opacity: 0.7, marginBottom: '16px' }}
            />
            <Typography variant="body1" color="text.secondary">
              No Products found!
            </Typography>
          </Box>
        )}
      </Box>
      <PostProduct openDialog={openDialog} onCloseDialog={handleCloseDialog}
        setSnackbar={setSnackbar}
        submitError={submitError} setSubmitError={setSubmitError} theme={theme}
        isMobile={isMobile}
        // fetchPostsData={fetchPostsData} 
        loading={loading} setLoading={setLoading}
        newMedia={newMedia} setNewMedia={setNewMedia}
        mediaError={mediaError} setMediaError={setMediaError}
        editingProduct={editingProduct} existingMedia={existingMedia} setExistingMedia={setExistingMedia}
      //  /* formData={formData} setFormData={setFormData} */ /* generatedImages={generatedImages} loadingGeneration={loadingGeneration} */ loadingMedia={loadingMedia}
      //  selectedDate={selectedDate} setSelectedDate={setSelectedDate} timeFrom={timeFrom} setTimeFrom={setTimeFrom} timeTo={timeTo} setTimeTo={setTimeTo}
      //  protectLocation={protectLocation} setProtectLocation={setProtectLocation} fakeAddress={fakeAddress} setFakeAddress={setFakeAddress}
      //  activeStep={activeStep} setActiveStep={setActiveStep} darkMode={darkMode} setValidationErrors={setValidationErrors} validationErrors={validationErrors}
        onProductSuccess={() => {
          setRefreshTrigger(prev => !prev); // Toggle refresh trigger
          if (editingProduct) {
            // For edits, we might want to stay on the same page
            setPagination(prev => ({...prev}));
          } else {
            // For new products, go to first page
            setPagination(prev => ({...prev, page: 1}));
          }
        }}
      />

      {/* existed product Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title" 
        sx={{ '& .MuiPaper-root': { borderRadius: '14px', backdropFilter: 'blur(12px)', }, }}
      >
        <DialogTitle id="delete-dialog-title" >
          Are you sure you want to delete this product?
        </DialogTitle>
        <DialogContent style={{ padding: '2rem' }}>
          <Typography color='error'>
            If you proceed, the product <strong>{selectedProduct?.title}</strong> will be removed permanently...
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '1rem' , gap: 1}}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='outlined' color="primary" sx={{borderRadius:'8px'}}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' color="error" sx={{ marginRight: '10px', borderRadius:'8px' }}>
            {loadingProductDeletion ? <> <CircularProgress size={20} sx={{marginRight:'8px'}}/> Deleting... </> : "Delete Product"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={snackbar.action}
      >
        <Alert onClose={handleCloseSnackbar} action={snackbar.action} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '1rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default SellerProducts;
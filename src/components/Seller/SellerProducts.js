// components/Seller/SellerProducts.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, alpha, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, InputAdornment, Snackbar, styled, TextField, Toolbar, Tooltip, Typography, useMediaQuery, Stack, Chip, Avatar, CardActions, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import Layout from '../Layout';
// import SkeletonCards from './SkeletonCards';
// import LazyImage from './LazyImage';
import { useTheme } from '@emotion/react';
// import API, { fetchPosts } from '../api/api';
import { useNavigate } from 'react-router-dom';
// import FilterPosts from './FilterPosts';
import CloseIcon from '@mui/icons-material/Close';
// import PersonIcon from '@mui/icons-material/Person';
// import PriceChangeIcon from '@mui/icons-material/PriceChange';
// import CategoryIcon from '@mui/icons-material/Category';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
// import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import SatelliteAltRoundedIcon from '@mui/icons-material/SatelliteAltRounded';
// import MapRoundedIcon from '@mui/icons-material/MapRounded';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import DistanceSlider from './DistanceSlider';
// import LazyBackgroundImage from './LazyBackgroundImage';
// import ShareLocationRoundedIcon from '@mui/icons-material/ShareLocationRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
// import DemoPosts from '../Banners/DemoPosts';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded';
import PostAddRoundedIcon from '@mui/icons-material/PostAddRounded';
// import CategoryBar from './CategoryBar';
// import { fetchProducts } from '../Apis/UserApis';
// import Layout from '../Layout/Layout';
// import SkeletonCards from '../Layout/SkeletonCards';
// import LazyImage from './LazyImage';
import { deleteProduct, fetchSellerProducts } from '../Apis/SellerApis';
import Layout from '../Layout/Layout';
import SkeletonCards from '../Layout/SkeletonCards';
import OrderData from './OrderData';
// import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import LazyImage from '../Products/LazyImage';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PostProduct from './PostProduct';
// import LazyImage from '../Products/LazyImage';

// Gender selection images
// import WomenSareeImage from '/category/cleaning.png';
// import MenSportsImage from '/category/cooking.png';

// Create a cache outside the component to persist between mounts
const globalCache = {
  data: {},
  lastCacheKey: null,
  lastScrollPosition: 0,
  lastViewedPostId: null,
  lastFilters: null,
  totalPostsCount: 0
};

// Default filter values
const DEFAULT_FILTERS = {
  categoriesFemale: '',
  categoriesMale: '',
  //   categoriesKids: '',
  gender: 'Female',
  stockStatus: 'In Stock',
  priceRange: [0, 100000],
  //   postType: 'HelpRequest' // added this line for only shows the Helper posts on ALL section
  // dateRange: {
  //   startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], // Last 7 days
  //   endDate: new Date().toISOString().split('T')[0] // Today
  // }
};

// const getGlassmorphismStyle = (theme, darkMode) => ({
//   background: darkMode 
//     ? 'rgba(30, 30, 30, 0.85)' 
//     : 'rgba(255, 255, 255, 0.15)',
//   backdropFilter: 'blur(20px)',
//   border: darkMode 
//     ? '1px solid rgba(255, 255, 255, 0.1)' 
//     : '1px solid rgba(255, 255, 255, 0.2)',
//   boxShadow: darkMode 
//     ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
//     : '0 8px 32px rgba(0, 0, 0, 0.1)',
// });

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  transition: 'all 0.3s ease',
}));

const SearchTextField = styled(TextField)(({ theme, expanded, darkMode }) => ({
  transition: 'all 0.3s ease',
  width: expanded ? '100%' : '40px',
  overflow: 'hidden',
  // ...getGlassmorphismStyle(),
  // background:'rgba(0,0,0,0)',
  '& .MuiInputBase-root': {
    height: '40px',
    borderRadius: '20px',
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '&.Mui-focused': {
      // ...getGlassmorphismStyle(0.25, 20),
      // background:'rgba(0,0,0,0)',
      background: darkMode
        ? 'rgba(205, 201, 201, 0.15)'
        : 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: darkMode
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '2px solid rgba(206, 206, 206, 0.2)',
    },
  },
  '& .MuiInputBase-input': {
    opacity: expanded ? 1 : 0,
    transition: 'opacity 0.2s ease',
    padding: expanded ? '6px 12px 6px 12px' : '6px 0',
    cursor: expanded ? 'text' : 'pointer',
    // ...getGlassmorphismStyle(),
  },
}));

// Enhanced glassmorphism styles
// const getGlassmorphismStyle = (opacity = 0.15, blur = 20) => ({
//   background: `rgba(255, 255, 255, ${opacity})`,
//   backdropFilter: `blur(${blur}px)`,
//   border: '1px solid rgba(255, 255, 255, 0.2)',
//   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
// });

const GenderSelectionCard = styled(Card)(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

const SellerProducts = ({ darkMode, toggleDarkMode, unreadCount, shouldAnimate }) => {
  const tokenUsername = localStorage.getItem('tokenUsername');
  // const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  //   const [userLocation, setUserLocation] = useState(null);
  //   const [currentAddress, setCurrentAddress] = useState('');
  //   const [distanceRange, setDistanceRange] = useState(10); // Default distance range in km
  // const [anchorEl, setAnchorEl] = useState(null);
  //   const [loadingLocation, setLoadingLocation] = useState(false);
  //   const [showMap, setShowMap] = useState(false);
  //   const mapRef = useRef(null);
  //   const [mapMode, setMapMode] = useState('normal');
  //   const [locationDetails, setLocationDetails] = useState(null);
  // const distanceOptions = [2, 5, 10, 20, 30, 50, 70, 100, 120, 150, 200];
  //   const [products, setProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [mediaError, setMediaError] = useState('');
  const [submitError, setSubmitError] = useState(''); // Error for failed product submission
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProductDeletion, setLoadingProductDeletion] = useState(false);
  // const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' }); // Snackbar state
  const [showDistanceRanges, setShowDistanceRanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const observer = useRef();
  const lastPostRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, loadingMore]);
  //   const userId = localStorage.getItem('userId');
  const [totalPosts, setTotalPosts] = useState(0);
  // const [isExtraFiltersOpen, setIsExtraFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('helperFilters');
    return savedFilters ? JSON.parse(savedFilters) : DEFAULT_FILTERS;
  });

  // State for temporary filters before applying
  const [localFilters, setLocalFilters] = useState(filters);
  const isDefaultFilters = useMemo(() => {
    return JSON.stringify(localFilters) === JSON.stringify(DEFAULT_FILTERS);
  }, [localFilters]);
  // Add a ref to track if we've restored scroll position
  const hasRestoredScroll = useRef(false);
  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('helperFilters', JSON.stringify(filters));
    globalCache.lastFilters = filters;
  }, [filters]);

  // Handle gender selection
  const handleGenderSelect = (gender) => {
    const newFilters = {
      ...DEFAULT_FILTERS, // Reset to default when changing gender
      gender: gender,
    };

    setFilters(newFilters);
    setLocalFilters(newFilters);
    setSelectedCategory(''); // Reset category when changing gender
    setSkip(0);
    globalCache.lastCacheKey = null;
    localStorage.setItem('helperFilters', JSON.stringify(newFilters));
  };

  //   Handle filter changes
  //   const handleFilterChange = (e) => {
  //     const { name, value } = e.target;
  //     setLocalFilters(prev => ({ ...prev, [name]: value }));
  //   };

  // Handle price range changes
  const handlePriceChange = (e, type) => {
    const value = Number(e.target.value);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: type === 'min'
        ? [value, prev.priceRange[1]]
        : [prev.priceRange[0], value]
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    if (localFilters.priceRange[0] > localFilters.priceRange[1]) {
      // alert("Min price cannot be greater than max price");
      setSnackbar({ open: true, message: 'Min price cannot be greater than max price', severity: 'warning' });
      return;
    }
    // Only update if filters actually changed
    if (JSON.stringify(localFilters) !== JSON.stringify(filters)) {
      setFilters(localFilters);
      setSkip(0); // Reset pagination when filters change
      // setPosts([]); // Clear existing posts
      // Clear cache for the old filter combination
      globalCache.lastCacheKey = null;
    }
    setShowDistanceRanges(false);
  };

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedFilters = localStorage.getItem('helperFilters');
    return savedFilters
      ? JSON.parse(savedFilters).categoriesFemale || JSON.parse(savedFilters).categoriesMale || ''
      : '';
  });
  //   useEffect to sync selectedCategory with filters
  useEffect(() => {
    setSelectedCategory(filters.categories || filters.serviceType || '');
  }, [filters.categories, filters.serviceType]);

  //   function to handle category selection
  const handleCategorySelect = (value) => {
    setSelectedCategory(value);

    const newFilters = {
      ...filters,
      categoriesFemale: filters.gender === 'Female' ? value : '',
      categoriesMale: filters.gender === 'Male' ? value : '',
    };

    setFilters(newFilters);
    setLocalFilters(newFilters);
    setSkip(0);
    globalCache.lastCacheKey = null;
    localStorage.setItem('helperFilters', JSON.stringify(newFilters));
  };

  // Reset filters
  const handleResetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSelectedCategory(''); // for category bar 'ALL' selection 
    setSkip(0);
    setPosts([]);
    // Clear cache for the old filter combination
    globalCache.lastCacheKey = null;
    localStorage.removeItem('helperFilters');
    setShowDistanceRanges(false);
  };

  // Date handling functions
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (date, type) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [type]: date ? formatDate(new Date(date)) : ''
      }
    }));
  };

  // Add search state at the top with other state declarations
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedSearch = localStorage.getItem('helperSearchQuery');
    return savedSearch || '';
  });
  const [isSearching, setIsSearching] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);

  const handleSearchClick = () => {
    setExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100); // Small delay for smooth expansion
  };

  const handleClearClick = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setExpanded(false);
    }
  };

  // Generate a cache key based on current filters/location/searchQuery
  const generateCacheKey = useCallback(() => {
    return JSON.stringify({
      //   lat: userLocation?.latitude,
      //   lng: userLocation?.longitude,
      //   distance: distanceRange,
      search: searchQuery, // Add search query to cache key
      ...filters,
      startDate: filters?.dateRange?.startDate,
      endDate: filters?.dateRange?.endDate
    });
  }, [filters, searchQuery]);

  // Add this effect to save search query to localStorage
  useEffect(() => {
    localStorage.setItem('helperSearchQuery', searchQuery);
  }, [searchQuery]);

  // Add search handler function
  //   const handleSearch = (e) => {
  //     const query = e.target.value;
  //     setSearchQuery(query);
  //     setSkip(0); // Reset pagination when searching
  //     // Clear cache for the old search query
  //     globalCache.lastCacheKey = null;
  //   };

  // Add clear search handler
  const handleClearSearch = () => {
    setSearchQuery('');
    setSkip(0);
    globalCache.lastCacheKey = null;
  };

  // product status categories
  const stockStatusCategories = ['All', 'In Stock', 'Out-of-stock', 'Getting Ready'
    // 'All',
    // 'Created',
    // 'Packing',
    // 'Ready to Deliver',
    // 'On Delivery',
    // 'Delivered',
    // 'Cancelled',
    // 'Returned',
    // 'Refunded'
  ];

  // Function to handle status selection
  const handleStatusSelect = (status) => {
    const newFilters = {
      ...filters,
      stockStatus: status === 'All' ? '' : status
    };

    setFilters(newFilters);
    setLocalFilters(newFilters);
    setSkip(0);
    globalCache.lastCacheKey = null;
    localStorage.setItem('helperFilters', JSON.stringify(newFilters));
  };

  // Fetch posts data
  useEffect(() => {
    // if (!distanceRange || !userLocation) {
    //   setPosts([]);
    //   return;
    // }
    const currentCacheKey = generateCacheKey();
    const fetchData = async () => {
      // setLoading(true);
      // localStorage.setItem('currentPage', currentPage); // Persist current page to localStorage
      try {
        setLoading(true);
        setIsSearching(!!searchQuery); // Set searching state based on query
        // if (globalCache.lastSearchQuery) {
        //   setSearchQuery(globalCache.lastSearchQuery);
        //   // // Trigger a search if we have a cached query
        //   // const timer = setTimeout(() => {
        //   //   handleSearch();
        //   // }, 100);

        //   // return () => clearTimeout(timer);
        // }
        // Check if we have valid cached data
        if (globalCache.data[currentCacheKey] &&
          globalCache.lastCacheKey === currentCacheKey &&
          JSON.stringify(globalCache.lastFilters) === JSON.stringify(filters)) {
          const { posts: cachedPosts, skip: cachedSkip, hasMore: cachedHasMore } = globalCache.data[currentCacheKey];

          setPosts(cachedPosts);
          setSkip(cachedSkip);
          setHasMore(cachedHasMore);
          setTotalPosts(globalCache.totalPostsCount);
          setLoading(false);
          setIsSearching(false);

          // Reset scroll restoration flag
          hasRestoredScroll.current = false;

          return;
        }
        // No valid cache - fetch fresh data
        const response = await fetchSellerProducts(0, 12, filters, searchQuery);
        const newPosts = response.data.posts || [];
        setTotalPosts(response.data.totalCount);
        globalCache.totalPostsCount = (response.data.totalCount);
        // Update global cache
        globalCache.data[currentCacheKey] = {
          posts: newPosts,
          skip: 12,
          hasMore: newPosts.length > 0 && response.data.totalCount > 12,
          timestamp: Date.now()
        };
        globalCache.lastCacheKey = currentCacheKey;
        globalCache.lastFilters = { ...filters };

        // Clean up old cache entries (older than 1 hour)
        Object.keys(globalCache.data).forEach(key => {
          if (Date.now() - globalCache.data[key].timestamp > 3600000) {
            delete globalCache.data[key];
          }
        });
        setPosts(newPosts);
        // setTotalPosts(response.data.totalCount || 0);
        setSkip(12); // Set skip to 24 after initial load
        // Check if there are more posts to load
        setHasMore(newPosts.length > 0 && response.data.totalCount > 12); // If we got 24, there might be more
        console.log(`products fetched with search "${searchQuery}" and initial count ${response.data.posts.length} and total count ${response.data.totalCount}`);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setSnackbar({ open: true, message: 'Failed to fetch the posts within your distance radius.', severity: 'error' });
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };
    // if (userLocation && distanceRange) {
    fetchData();
    // }
  }, [filters, generateCacheKey, searchQuery]); // Add distanceRange as dependency

  // Load more posts function
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const response = await fetchSellerProducts(skip, 12, filters, searchQuery);
      const newPosts = response.data.posts || [];

      if (newPosts.length > 0) {
        const updatedPosts = [...posts, ...newPosts];
        const currentCacheKey = generateCacheKey();

        // Update global cache
        if (globalCache.data[currentCacheKey]) {
          globalCache.data[currentCacheKey] = {
            ...globalCache.data[currentCacheKey],
            posts: updatedPosts,
            skip: skip + newPosts.length,
            hasMore: updatedPosts.length < response.data.totalCount
          };
        }
        setPosts(updatedPosts);
        setSkip(prevSkip => prevSkip + newPosts.length);
        // Update hasMore based on whether we've reached the total count
        setHasMore(updatedPosts.length < response.data.totalCount);
        console.log(`Fetched ${newPosts.length} new posts with search "${searchQuery}"  (skip: ${skip}, total: ${response.data.totalCount})`);
      } else {
        setHasMore(false);
      }

      // setHasMore(newPosts.length === 12); // If we got less than 24, we've reached the end
    } catch (error) {
      console.error("Error fetching more posts:", error);
      // setSnackbar({ open: true, message: 'Failed to fetch more posts.', severity: 'error' });
    } finally {
      setLoadingMore(false);
    }
  };

  // Add this function to clear search query on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only clear on actual page refresh, not navigation
      localStorage.removeItem('helperSearchQuery');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);







  // Effect to handle scroll restoration and post focus
  useEffect(() => {
    if (posts.length > 0 && globalCache.lastViewedPostId && !hasRestoredScroll.current) {
      const timer = setTimeout(() => {
        // First restore scroll position
        window.scrollTo(0, globalCache.lastScrollPosition);

        // Then try to find and focus the post
        const postElement = document.getElementById(`post-${globalCache.lastViewedPostId}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: 'auto', block: 'center' }); // smooth

          // // Add temporary highlight
          // postElement.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.5)';
          // setTimeout(() => {
          //   postElement.style.boxShadow = '';
          // }, 2000);
        }

        hasRestoredScroll.current = true;
        globalCache.lastViewedPostId = null; // Clear after handling
      }, 100); // Slight delay to ensure posts are rendered

      return () => clearTimeout(timer);
    }
  }, [posts]); // Run when posts change


  // Store navigation info before leaving
  //   const openPostDetail = (post) => {
  //     // Save both to global cache and localStorage as backup
  //     globalCache.lastViewedPostId = post._id;
  //     globalCache.lastScrollPosition = window.scrollY;
  //     localStorage.setItem('lastHelperScroll', window.scrollY);
  //     localStorage.setItem('lastViewedPostId', post._id);
  //     navigate(`/product/${post._id}`);
  //   };

  const openProductDetail = (post) => {
    // Save both to global cache and localStorage as backup
    globalCache.lastViewedPostId = post._id;
    globalCache.lastScrollPosition = window.scrollY;
    localStorage.setItem('lastHelperScroll', window.scrollY);
    localStorage.setItem('lastViewedPostId', post._id);
    navigate(`/product/${post._id}`);
  };

  // const openOrderDetail = (post) => {
  //   // Save both to global cache and localStorage as backup
  //   globalCache.lastViewedPostId = post._id;
  //   globalCache.lastScrollPosition = window.scrollY;
  //   localStorage.setItem('lastHelperScroll', window.scrollY);
  //   localStorage.setItem('lastViewedPostId', post._id);
  //   navigate(`/order-details/${post._id}`);
  // };

  // Initialize scroll position and post ID from localStorage if needed
  useEffect(() => {
    const savedScroll = localStorage.getItem('lastHelperScroll');
    const savedPostId = localStorage.getItem('lastViewedPostId');

    if (savedScroll && savedPostId && !globalCache.lastScrollPosition) {
      globalCache.lastScrollPosition = Number(savedScroll);
      globalCache.lastViewedPostId = savedPostId;
    }

    // Cleanup localStorage on unmount
    return () => {
      localStorage.removeItem('lastHelperScroll');
      localStorage.removeItem('lastViewedPostId');
    };
  }, []);

  const handleOpenFilters = () => {
    setShowDistanceRanges(true);
  };




  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Define the bounds of the world
  //   const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

  // Gender categories
  //   const femaleCategories = ['All', 'Saari', 'Dress', 'Accessories'];
  const femaleCategories = [
    'All',
    'Uppada Pattu',
    'Kuppadam Sarees',
    'Kanchi Pattu',
    'Mangalagiri Pattu',
    'Silk Sarees',
    'Wedding Sarees',
    'Banarasi Sarees',
    'Chanderi Sarees',
    // 'Maheshwari Sarees',
    // 'Tussar Silk',
    // 'Organza Sarees',
    // 'Linen Sarees',
    'Cotton Sarees',
    'Printed Sarees',
    // 'Designer Sarees',
    // 'Bollywood Sarees',
    'Party Wear Sarees',
    // 'Traditional Sarees',
    // 'Modern Sarees',
    // 'Handloom Sarees',
    'Other'
  ];
  // const maleCategories = ['All', 'Sports', 'Top', 'Bottom'];
  const maleCategories = [
    'All',
    // Tops
    'Round Neck T-Shirt (Half Sleeves)',
    'Round Neck T-Shirt (Full Sleeves)',
    'Collar T-Shirt (Half Sleeves)',
    'Collar T-Shirt (Full Sleeves)',
    // 'Polo T-Shirt',
    // 'Sleeveless Shirt',
    // 'Tank Top',
    'Sports Jacket',
    // 'Hoodie',
    // 'Sweatshirt',

    // Bottoms
    'Track Pants',
    'Shorts',
    // 'Joggers',
    // 'Sports Tights',
    // 'Three-Fourths',
    // 'Cargo Pants',

    // // Sets
    // 'Sports Set (Top+Bottom)',
    // 'Track Suit',

    // // Specialized
    // 'Compression Wear',
    // 'Swimwear',
    // 'Cycling Shorts',
    // 'Gym Wear'

    'Other',
  ];

  //   const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  //   const openOrderData = (post) => {
  //     setSelectedOrder(post);
  //     setOrderDialogOpen(true);
  //   };
  const handleStatusUpdate = (orderId, newStatus) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === orderId ? { ...post, orderStatus: newStatus } : post
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock':
        return 'success';
      case 'Out-of-stock':
      case 'Failed':
      case 'Declined':
        return 'error';
      case 'Getting Ready':
      case 'Ready to Deliver':
      case 'On Delivery':
        return 'warning';
      case 'Created':
        return 'info';
      default:
        return 'primary';
    }
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

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
    setExistingMedia(product?.media?.map((media, index) => ({ data: media.toString('base64'), _id: index.toString(), remove: false })));
    setOpenDialog(true);
  };

  const handleDeleteClick = (product, event) => {
    if (event) event.stopPropagation();
    setSelectedProduct(product);  // Store selected post details
    setDeleteDialogOpen(true);  // Open confirmation dialog
  };

  const handleConfirmDelete = async () => {
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
      // Update local state and cache
      setPosts(prevProducts => {
        const updatedProducts = prevProducts.filter(product => product._id !== selectedProduct._id);

        // Update global cache for all cache keys
        Object.keys(globalCache.data).forEach(cacheKey => {
          if (globalCache.data[cacheKey]?.posts) {
            globalCache.data[cacheKey].posts = globalCache.data[cacheKey].posts.filter(
              p => p._id !== selectedProduct._id
            );
            globalCache.data[cacheKey].hasMore =
              globalCache.data[cacheKey].posts.length < globalCache.totalPostsCount - 1;
          }
        });

        return updatedProducts;
      });

      // // Update global cache
      // const currentCacheKey = generateCacheKey();
      // if (globalCache.data[currentCacheKey]) {
      //   globalCache.data[currentCacheKey] = {
      //     ...globalCache.data[currentCacheKey],
      //     posts: globalCache.data[currentCacheKey].posts.filter(
      //       product => product._id !== selectedProduct._id
      //     ),
      //     hasMore: globalCache.data[currentCacheKey].posts.length > 1 // Check if more posts exist
      //   };
      // }

      // // Update local state
      // setPosts(prevProducts => prevProducts.filter(product => product._id !== selectedProduct._id));

      setTotalPosts(totalPosts - 1);
      globalCache.totalPostsCount -= 1;

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

  // const refreshCache = (updatedProduct, isNew = false) => {
  //   Object.keys(globalCache.data).forEach(cacheKey => {
  //     if (globalCache.data[cacheKey]?.posts) {
  //       if (isNew) {
  //         // Add new product at beginning
  //         globalCache.data[cacheKey].posts.unshift(updatedProduct);
  //         globalCache.totalPostsCount += 1;
  //       } else {
  //         // Update existing product
  //         globalCache.data[cacheKey].posts = globalCache.data[cacheKey].posts.map(p => 
  //           p._id === updatedProduct._id ? updatedProduct : p
  //         );
  //       }
  //     }
  //   });
  // };

  const handleProductSuccess = (newOrUpdatedProduct, isEdit) => {
    const currentCacheKey = generateCacheKey();

    if (isEdit) {
      // Update existing product in cache and local state
      if (globalCache.data[currentCacheKey]) {
        globalCache.data[currentCacheKey] = {
          ...globalCache.data[currentCacheKey],
          posts: globalCache.data[currentCacheKey].posts.map(product =>
            product._id === newOrUpdatedProduct._id ? newOrUpdatedProduct : product
          )
        };
      }

      setPosts(prevProducts =>
        prevProducts.map(product =>
          product._id === newOrUpdatedProduct._id ? newOrUpdatedProduct : product
        )
      );
    } else {
      // Add new product to cache and local state
      if (globalCache.data[currentCacheKey]) {
        globalCache.data[currentCacheKey] = {
          ...globalCache.data[currentCacheKey],
          posts: [newOrUpdatedProduct, ...globalCache.data[currentCacheKey].posts],
          skip: globalCache.data[currentCacheKey].skip + 1
        };
      }

      setPosts(prevProducts => [newOrUpdatedProduct, ...prevProducts]);
      setTotalPosts(totalPosts + 1);
      globalCache.totalPostsCount = globalCache.totalPostsCount + 1;
    }
  };


  return (
    <Layout username={tokenUsername} darkMode={darkMode} toggleDarkMode={toggleDarkMode} unreadCount={unreadCount} shouldAnimate={shouldAnimate}>
      {/* Header Section */}
      <Box sx={{ mb: 4, mt: 2, textAlign: 'center' }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar sx={{
            bgcolor: 'primary.main',
            width: isMobile ? 40 : 56,
            height: isMobile ? 40 : 56
          }}>
            <ShoppingCartRoundedIcon sx={{ fontSize: isMobile ? 24 : 32 }} />
          </Avatar>
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ m: 0 }}>
            Products Page
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Add and Manage Products.
        </Typography>
      </Box>
      {/* Gender Selection Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: isMobile ? 2 : 4,
        my: 4, mx: 1,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <GenderSelectionCard
          selected={filters.gender === 'Female'}
          onClick={() => handleGenderSelect('Female')}
          sx={{ width: isMobile ? '100%' : 300, textAlign: 'center' }} // width: isMobile ? '100%' : 300,
        >
          {/* <CardMedia
            component="img"
            height={isMobile ? '150px' : '200px'}
            image={'/category/Women.png'}
            alt="Women in traditional saree"
            sx={{ objectFit: 'cover' }}
          /> */}
          <CardContent>
            <Typography variant="h5" component="div">
              Women
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Traditional & Modern Wear
            </Typography>
          </CardContent>
        </GenderSelectionCard>

        <GenderSelectionCard
          selected={filters.gender === 'Male'}
          onClick={() => handleGenderSelect('Male')}
          sx={{ width: isMobile ? '100%' : 300, textAlign: 'center' }}
        >
          {/* <CardMedia
            component="img"
            height={isMobile ? '150px' : '200px'}
            image={'/category/Men.png'}
            alt="Men in sports wear"
            sx={{ objectFit: 'cover' }}
          /> */}
          <CardContent>
            <Typography variant="h5" component="div">
              Men
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sports & Casual Wear
            </Typography>
          </CardContent>
        </GenderSelectionCard>
      </Box>


      {/* Order Status Bar */}
      <Box sx={{
        display: 'flex', justifyContent: 'center',
        overflowX: 'auto',
        m: 1,
        borderRadius: '12px',
        gap: 1,
        px: 2,
        py: 1,
        mb: 2,
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
        {stockStatusCategories.map((status) => (
          <Chip
            key={status}
            label={status}
            onClick={() => handleStatusSelect(status)}
            variant={filters.stockStatus === (status === 'All' ? '' : status) ? 'filled' : 'outlined'}
            color={status === 'All' ? 'primary' : getStatusColor(status)}
            sx={{
              fontWeight: filters.stockStatus === (status === 'All' ? '' : status) ? 600 : 400,
            }}
          />
        ))}
      </Box>

      {/* Category Bar */}
      {filters.gender && (
        <Box sx={{
          display: 'flex',
          overflowX: 'auto',
          // ...getGlassmorphismStyle(), 
          m: 1, borderRadius: '12px',
          gap: 1,
          px: 2,
          py: 1,
          mb: 2,
          '&::-webkit-scrollbar': { display: 'none' }
        }}>
          {(filters.gender === 'Female' ? femaleCategories : maleCategories).map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategorySelect(category === 'All' ? '' : category)}
              variant={selectedCategory === (category === 'All' ? '' : category) ? 'filled' : 'outlined'}
              color="primary"
              sx={{
                // minWidth: 80,
                fontWeight: selectedCategory === (category === 'All' ? '' : category) ? 600 : 400,
                // color: '#f59e0b', 
                // backgroundColor: 'rgba(245, 158, 11, 0.1)',
              }}
            />
          ))}
        </Box>
      )}
      {/* <CategoryBar selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} darkMode={darkMode} isMobile={isMobile}/> */}
      <Box>
        <Toolbar sx={{
          display: 'flex', justifyContent: 'space-between',
          //  background: 'rgba(255,255,255,0.8)',  backdropFilter: 'blur(10px)',
          // boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
          borderRadius: '12px',
          padding: isMobile ? '2px 12px' : '2px 16px', margin: '4px',
          position: 'relative', //sticky
          top: 0,
          zIndex: 1000,
          // ...getGlassmorphismStyle(0.1, 10),
        }}>
          {/* <Typography variant="h6" style={{ flexGrow: 1, marginRight: '2rem' }}>
            Posts
          </Typography> */}
          <Box display="flex" justifyContent="flex-start" sx={{ flexGrow: 1, marginRight: '6px' }}>
            <Chip
              // label={`orders: ${totalPosts}`}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ShoppingCartRoundedIcon fontSize="small" />
                  <Typography variant="body2" component="span">
                    {totalPosts}
                  </Typography>
                </Box>
              }
              color="secondary"
              // color={filters?.orderStatus === 'All' ? 'primary' : getStatusColor(filters?.orderStatus)}
              // size="small"
              variant="outlined"
            // sx={{ fontWeight: 600 }}
            />
          </Box>
          {/* <Box>
            
          </Box> */}
          {/* Search Bar */}
          {!isMobile && <SearchContainer>
            <Box>
              <SearchTextField
                variant="outlined"
                placeholder={expanded ? "Search products..." : ""}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setExpanded(true)}
                onBlur={handleBlur}
                inputRef={inputRef}
                expanded={expanded} darkMode={darkMode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={!expanded ? handleSearchClick : undefined}
                        sx={{
                          minWidth: '40px',
                          minHeight: '40px',
                          // marginLeft: expanded ? '8px' : '0px',
                        }}
                      >
                        {isSearching ? (
                          <CircularProgress size={16} />
                        ) : (
                          <SearchIcon color="action" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment:

                    <>
                      {expanded && searchQuery && (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClearClick}
                            size="small"
                            sx={{ mr: '6px' }}
                          >
                            <ClearIcon color="action" fontSize="small" />
                          </IconButton>
                        </InputAdornment>)}
                      {!expanded && <InputAdornment position="center">
                        <IconButton
                          onClick={!expanded ? handleSearchClick : undefined}
                          sx={{
                            minWidth: '40px',
                            minHeight: '40px',
                            // marginLeft: expanded ? '8px' : '0px',
                          }}
                        >
                          {isSearching ? (
                            <CircularProgress size={16} />
                          ) : (
                            <SearchIcon color="action" />
                          )}
                        </IconButton>
                      </InputAdornment>}
                    </>
                  ,
                  sx: {
                    padding: 0,
                  }
                }}
              />

            </Box>
          </SearchContainer>}
          {isMobile && !expanded && <IconButton
            onClick={!expanded ? handleSearchClick : undefined}
            sx={{
              minWidth: '40px',
              minHeight: '40px',
              marginLeft: expanded ? '8px' : '0px',
            }}
          >
            {isSearching ? (
              <CircularProgress size={16} />
            ) : (
              <SearchIcon color="action" />
            )}
          </IconButton>}
          <Box sx={{ display: 'flex', marginLeft: '0px' }}>
            {/* Button to Open Distance Menu */}
            <Box sx={{ position: 'relative' }}>
              {/* <Tooltip title="Filter orders by date range" arrow> */}
              <Button
                onClick={handleOpenFilters}
                // variant="outlined"
                // size="small"
                sx={{
                  //   minWidth: 'auto',
                  height: '40px',
                  // marginLeft: expanded ? '8px' : '0px',
                  borderRadius: '20px',
                  // padding: '0 12px',
                  // borderColor: theme.palette.mode === 'dark' ? 
                  //   alpha(theme.palette.divider, 0.3) : 
                  //   alpha(theme.palette.divider, 0.5),
                  backgroundColor: theme.palette.mode === 'dark' ?
                    alpha(theme.palette.background.paper, 0.7) :
                    alpha(theme.palette.background.paper, 0.9),
                  '&:hover': {
                    // backgroundColor: theme.palette.mode === 'dark' ? 
                    //   alpha(theme.palette.primary.main, 0.1) : 
                    //   alpha(theme.palette.primary.light, 0.2),
                    // borderColor: theme.palette.primary.main,
                    // boxShadow: `0 0 0 1px ${theme.palette.primary.main}`
                  },
                  transition: 'all 0.2s ease',
                }}
                startIcon={!filters?.dateRange &&
                  <FilterListRoundedIcon
                    // fontSize="small" 
                    color={filters?.dateRange?.startDate !== filters?.dateRange?.endDate ?
                      'primary' : 'action'}
                  />
                }
                endIcon={filters?.dateRange &&
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mr: 1,
                    px: 1,
                    py: 0.5,
                    borderRadius: '12px',
                    backgroundColor: theme.palette.mode === 'dark' ?
                      alpha(theme.palette.primary.main, 0.2) :
                      alpha(theme.palette.primary.light, 0.3),
                  }}>
                    <Typography variant="caption" sx={{
                      fontWeight: 600,
                      color: filters?.dateRange?.startDate !== filters?.dateRange?.endDate ?
                        theme.palette.primary.main :
                        theme.palette.text.secondary
                    }}>
                      {formatDisplayDate(filters?.dateRange?.startDate)} - {formatDisplayDate(filters?.dateRange?.endDate)}
                    </Typography>
                  </Box>
                }
              >
              </Button>
              {/* </Tooltip> */}

              {/* Date range indicator badge */}
              {filters?.dateRange?.startDate !== filters?.dateRange?.endDate && (
                <Box sx={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  width: 'auto', p: '2px 6px',
                  height: 16,
                  borderRadius: '12px',
                  backgroundColor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
                }}>
                  <Typography variant="caption" sx={{
                    color: theme.palette.primary.contrastText,
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    lineHeight: 1
                  }}>
                    {Math.ceil(
                      (new Date(filters.dateRange.endDate) - new Date(filters.dateRange.startDate)) /
                      (1000 * 60 * 60 * 24)
                    )}d
                  </Typography>
                </Box>
              )}
            </Box>
            <IconButton
              variant="contained"
              onClick={() => handleOpenDialog()}
              // size="small"
              sx={{
                // backgroundColor: '#1976d2', // Primary blue
                background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                color: '#fff',
                padding: '0px 16px',
                borderRadius: '18px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  // backgroundColor: '#1565c0', // Darker shade on hover
                  boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
                  transform: 'translateY(-2px)',
                },
                //   display: 'flex',
                //   alignItems: 'center',
                //   gap: '8px',
                ml: '8px',
                textTransform: 'none',
                fontWeight: 600,
              }}
              aria-label="Add New Product"
              title="Add New Product"
            >
              <PostAddRoundedIcon sx={{ fontSize: '20px' }} />
              {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Product</span> */}
            </IconButton>
            {/* Distance Button */}
            {/* <Button
            variant="contained"
            // onClick={handleDistanceMenuOpen}
            onClick={() => setShowDistanceRanges(true)}
            startIcon={<FilterListRoundedIcon />}
            sx={{
              // backgroundColor: "#1976d2",
              // color: "#fff",
              // padding: "8px 12px",
              borderRadius: "12px",
              // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              // "&:hover": { backgroundColor: "#1565c0" },
              // display: "flex",
              // alignItems: "center",
              // gap: "8px",
              // marginRight: "6px",
              boxShadow: '0 2px 8px rgba(67, 97, 238, 0.2)',
              '&:hover': { 
                boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
                transform: 'translateY(-2px)',
              },
              background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Filters
          </Button> */}

            {/* Distance Range Menu */}
            {showDistanceRanges && (
              <Card
                // anchorEl={anchorEl}
                // open={Boolean(anchorEl)}
                // onClose={handleDistanceMenuClose}
                sx={{
                  position: 'absolute',
                  top: isMobile ? '62px' : '72px',
                  right: '1px', ml: '4px',
                  // width: '90%',
                  // maxWidth: '400px',
                  zIndex: 1000, '& .MuiPaper-root': { borderRadius: '12px' }, borderRadius: '10px', backdropFilter: 'blur(10px)',
              /* boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', */  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  // background: 'rgba(255, 255, 255, 0.9)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  '& .MuiCardContent-root': { padding: '10px' },
                }}
              >
                <Box sx={{ m: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'column', gap: 1 }}>
                  {/* <Box sx={{ m: 0, borderRadius:'8px'}}> */}
                  <Box
                    sx={{
                      px: isMobile ? '8px' : '10px', py: '12px',
                      display: "flex",
                      flexDirection: isMobile ? "column" : "column",
                      alignItems: 'flex-start',
                      // minWidth: isMobile ? "60px" : "250px", borderRadius:'10px'
                    }}
                  >
                    {/* Selected Distance Label */}
                    <Box sx={{ mb: 1, display: isMobile ? 'inline' : 'flex', justifyContent: isMobile ? 'normal' : 'unset' }}>
                      {/* <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      // marginBottom: isMobile ? "20px" : "10px",
                      textAlign: "center",
                    }}
                  >
                    Distance Range: km
                  </Typography> */}
                      <Typography variant="h6"  >
                        Filters
                      </Typography>
                      <Box sx={{ position: 'absolute', top: '10px', right: '10px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>

                        <IconButton
                          onClick={() => setShowDistanceRanges(false)}
                          variant="text"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      {/* )} */}
                    </Box>
                    {/* Distance Slider */}
                    {/* <DistanceSlider distanceRange={distanceRange} setDistanceRange={setDistanceRange} userLocation={userLocation} mapRef={mapRef} isMobile={isMobile} getZoomLevel={getZoomLevel} distanceValues={distanceValues} /> */}


                  </Box>
                  {/* {isMobile && ( */}
                  {/* <Box sx={{ padding: '4px 8px', mt: isMobile ? 2 : 1, display:'flex', justifyContent:'space-between', alignItems:'center'}}> */}
                  {/* <Typography 
                    variant="body2" 
                    sx={{ 
                      margin: '4px 10px', 
                      color: 'grey', 
                      // whiteSpace: isMobile ? 'pre-line' : 'nowrap', 
                      textAlign: isMobile ? 'center' : 'inherit'
                    }}
                  >
                    *Custom range (1-1000km)
                  </Typography> */}
                  {/* <TextField
                    // label="custom range (km)"
                    type="number"
                    value={distanceRange}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numeric values
                  
                      if (value === '') {
                        setDistanceRange('');
                        // localStorage.removeItem("distanceRange"); // Clear storage when empty
                        return;
                      }
                  
                      const numericValue = Number(value);
                      
                      if (numericValue >= 1 && numericValue <= 1000) {
                        setDistanceRange(numericValue);
                        localStorage.setItem("distanceRange", numericValue);
                        
                        if (mapRef.current && userLocation) {
                          mapRef.current.setView([userLocation.latitude, userLocation.longitude], getZoomLevel(numericValue));
                        }
                      }
                    }}
                    sx={{
                      width: "100px",
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" }, '& .MuiInputBase-input': { padding: '6px 14px', },
                    }}
                    inputProps={{ min: 1, max: 1000 }} // Restrict values in number input UI
                    InputLabelProps={{
                      sx: {
                        // fontSize: "14px", // Custom label font size
                        // fontWeight: "bold", // Make label bold
                        color: "primary.main", // Apply theme color
                      },
                      shrink: true, // Keep label always visible
                    }}
                  /> */}
                  {/* </Box> */}
                  {/* </Box> */}
                  {/* <Divider/> */}
                  <Box sx={{ maxWidth: '450px' }}>
                    {/* Filter Card */}
                    <Box sx={{
                      m: 0,
                      // bgcolor: '#f5f5f5',
                      borderRadius: '8px',
                      // boxShadow: 3,
                    }}>
                      {/* <Box sx={{ display: 'flex', flexGrow: 1, float: 'inline-end', margin:1 }}>
                    <Button
                      variant="outlined" size="small" sx={{borderRadius: '8px'}}
                      onClick={() => setIsExtraFiltersOpen((prev) => !prev)}
                    >
                      {isExtraFiltersOpen ? 'Close Extra Filters' : 'Show Extra Filters'}
                    </Button>
                  </Box> */}
                      {/* {isExtraFiltersOpen &&  */}
                      <CardContent>


                        <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 2 }}>
                          {/* Gender Filter */}
                          {/* <FormControl size='small' sx={{ flex: '1 1 140px', '& .MuiOutlinedInput-root': { borderRadius: '12px',} }}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            name="gender"
                            value={localFilters.gender}
                            onChange={handleFilterChange}
                            label="Gender"
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Kids">Kids</MenuItem>
                            <MenuItem value="Everyone">Everyone</MenuItem>
                          </Select>
                        </FormControl> */}
                          {/* Category Filter */}
                          {/* {localFilters.gender === 'Female' && (
                            <FormControl size='small' sx={{ flex: '1 1 140px', '& .MuiOutlinedInput-root': { borderRadius: '12px', } }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="categoriesFemale"
                                value={localFilters.categoriesFemale}
                                onChange={handleFilterChange}
                                label="CategoryFemale"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Saari">Saari</MenuItem>
                                <MenuItem value="Dress">Dress</MenuItem>
                                <MenuItem value="Accessories">Accessories</MenuItem>
                                <MenuItem value="Friends">Friends</MenuItem>
                            </Select>
                            </FormControl>
                        )} 
                        {localFilters.gender === 'Male' && (
                            <FormControl size='small' sx={{ flex: '1 1 140px', '& .MuiOutlinedInput-root': { borderRadius: '12px', } }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="categoriesMale"
                                value={localFilters.categoriesMale}
                                onChange={handleFilterChange}
                                label="CategoryMale"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Sports">Sports</MenuItem>
                                <MenuItem value="Top">Top</MenuItem>
                                <MenuItem value="Bottom">Bottom</MenuItem>
                                <MenuItem value="Friends">Friends</MenuItem>
                            </Select>
                            </FormControl>
                        )} */}

                          {/* Service Filters */}
                          {/* <FormControl size='small' sx={{ flex: '1 1 140px', '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                          <InputLabel>Service Type</InputLabel>
                          <Select
                            name="serviceType"
                            value={localFilters.serviceType || ''}
                            onChange={handleFilterChange}
                            label="Service Type"
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="ParkingSpace">Parking Space</MenuItem>
                            <MenuItem value="VehicleRental">Vehicle Rental</MenuItem>
                            <MenuItem value="FurnitureRental">Furniture Rental</MenuItem>
                            <MenuItem value="Laundry">Laundry</MenuItem>
                            <MenuItem value="Events">Events</MenuItem>
                            <MenuItem value="Playgrounds">Playgrounds</MenuItem>
                            <MenuItem value="Cleaning">Cleaning</MenuItem>
                            <MenuItem value="Cooking">Cooking</MenuItem>
                            <MenuItem value="Tutoring">Tutoring</MenuItem>
                            <MenuItem value="PetCare">Pet Care</MenuItem>
                            <MenuItem value="Delivery">Delivery</MenuItem>
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                            <MenuItem value="HouseSaleLease">House Sale/Lease</MenuItem>
                            <MenuItem value="LandSaleLease">Land Sale/Lease</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl> */}



                          {/* Status Filter */}
                          {/* <FormControl size='small' sx={{ flex: '1 1 180px', '& .MuiOutlinedInput-root': { borderRadius: '12px',} }}>
                          <InputLabel>Order Status</InputLabel>
                          <Select
                            name="orderStatus"
                            value={localFilters.orderStatus}
                            onChange={handleFilterChange}
                            label="Order Status"
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Created">Created</MenuItem>
                            <MenuItem value="Packing">Packing</MenuItem>
                            <MenuItem value="Ready to Deliver">Ready to Deliver</MenuItem>
                            <MenuItem value="On Delivery">On Delivery</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem value="Returned">Returned</MenuItem>
                            <MenuItem value="Refunded">Refunded</MenuItem>
                          </Select>
                        </FormControl> */}

                          {/* Date Range */}
                          <Box display="flex" gap={2} flexWrap="wrap" sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                              <TextField
                                label="Start Date"
                                type="date"
                                size="small"
                                value={localFilters?.dateRange?.startDate}
                                onChange={(e) => handleDateChange(e.target.value, 'startDate')}
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  const today = formatDate(new Date());
                                  const last7Days = formatDate(new Date(new Date().setDate(new Date().getDate() - 7)));
                                  setLocalFilters(prev => ({
                                    ...prev,
                                    dateRange: {
                                      startDate: last7Days,
                                      endDate: today
                                    }
                                  }));
                                }}
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                              >
                                7
                              </Button>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                              <TextField
                                label="End Date"
                                type="date"
                                size="small"
                                value={localFilters?.dateRange?.endDate}
                                onChange={(e) => handleDateChange(e.target.value, 'endDate')}
                                fullWidth
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  const today = formatDate(new Date());
                                  setLocalFilters(prev => ({
                                    ...prev,
                                    dateRange: {
                                      startDate: today,
                                      endDate: today
                                    }
                                  }));
                                }}
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                              >
                                Today
                              </Button>
                            </Box>
                          </Box>

                          {/* Price Range */}
                          <Box display="flex" gap={2} flex="1 1 auto">
                            <TextField
                              label="Min Price"
                              type="number" size='small'
                              value={localFilters.priceRange[0]}
                              onChange={(e) => handlePriceChange(e, 'min')}
                              fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', } }}
                            />
                            <TextField
                              label="Max Price"
                              type="number" size='small'
                              value={localFilters.priceRange[1]}
                              onChange={(e) => handlePriceChange(e, 'max')}
                              fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', } }}
                            />
                          </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box gap={2} mt={3} sx={{ display: 'flex' }}>
                          <Button
                            variant="outlined"
                            onClick={handleResetFilters}
                            disabled={isDefaultFilters}
                            fullWidth sx={{ borderRadius: '8px' }}
                          >
                            Reset
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleApplyFilters}
                            disabled={isDefaultFilters}
                            fullWidth sx={{ borderRadius: '8px' }}
                          >
                            Apply
                          </Button>
                        </Box>
                      </CardContent>
                      {/* } */}
                    </Box>
                  </Box>
                </Box>
              </Card>
            )}
          </Box>

        </Toolbar>
        {/* Search Bar */}
        {isMobile && expanded && <SearchContainer sx={{ mx: 2, mb: 2 }}>
          <Box>
            <SearchTextField
              variant="outlined"
              placeholder={expanded ? "Search products..." : ""}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setExpanded(true)}
              onBlur={handleBlur}
              inputRef={inputRef}
              expanded={expanded} darkMode={darkMode}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={!expanded ? handleSearchClick : undefined}
                      sx={{
                        minWidth: '40px',
                        minHeight: '40px',
                        // marginLeft: expanded ? '8px' : '0px',
                      }}
                    >
                      {isSearching ? (
                        <CircularProgress size={16} />
                      ) : (
                        <SearchIcon color="action" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: expanded && searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClearClick}
                      size="small"
                      sx={{ mr: '6px' }}
                    >
                      <ClearIcon color="action" fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  p: 0,
                }
              }}
            />

          </Box>
        </SearchContainer>}


        <Box mb={1} sx={{ background: '#f5f5f5', paddingTop: '1rem', paddingBottom: '1rem', mx: isMobile ? '6px' : '8px', paddingInline: isMobile ? '8px' : '10px', borderRadius: '10px' }} > {/* sx={{ p: 2 }} */}
          {loading ? (
            <SkeletonCards />
          ) :
            (posts.length > 0 ? (
              <Grid container spacing={isMobile ? 1.5 : 1.5}>
                {posts.map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${post._id}-${index}`} ref={index === posts.length - 3 ? lastPostRef : null} id={`post-${post._id}`}>
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
                    //   onClick={() => openOrderData(post)}
                    //   onMouseEnter={(e) => {
                    //     e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                    //     e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                    //   }}
                    //   onMouseLeave={(e) => {
                    //     e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                    //     e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                    //   }} 
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
                          // gap: '0.1rem',
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
                        {/* {post.media && post.media.length > 5 && (
                            <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            Media exceeds its maximum count
                            </Typography>
                        )} */}
                        {/* Discount Badge */}
                        {post.discount > 0 && (
                          <Chip
                            // icon={<WorkIcon sx={{ fontSize: 16 }} />}
                            label={`${post.discount}% OFF`}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              backgroundColor: '#006064',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </CardMedia>

                      <CardContent sx={{
                        position: 'absolute',
                        bottom: post.updatedAt ? 100 : 80,
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
                            {post?.title?.split(" ").length > 5 ? `${post?.title?.split(" ").slice(0, 5).join(" ")}...` : post?.title}
                          </Typography>
                        </Tooltip>
                        {/* <Typography variant="body1" style={{ display: 'inline-block', float: 'right', fontWeight: '500', color: post.stockStatus !== 'In Stock' ? 'red' : 'green', }}>
                                              {post.stockStatus} ({post?.totalStock || 0})
                                            </Typography> */}
                        <Chip
                          label={`${post.stockStatus} ${post?.totalStock ? ` (${post.totalStock})` : ''}`}
                          color={post.stockStatus !== 'In Stock' ? 'error' : 'success'}
                          size="small"
                          sx={{ fontWeight: 600, ml: 1, float: 'right', alignItems: 'center' }}
                        />
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
                        <Typography variant="body2" sx={{ color: '#333', }}>
                          {post?.categoriesFemale || post?.categoriesMale || post?.categoriesKids}
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
                        display: 'flow', padding: '12px 1rem', position: 'absolute', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', mt: 2, backdropFilter: 'blur(10px)',
                        left: 0,
                        right: 0,
                        // padding: '16px',
                        color: 'white'
                      }}>
                        {/* <Box> */}
                        <Box>
                          <Typography variant="body2" style={{ marginBottom: '0.5rem', color: '#333' }}>
                            Added on : {new Date(post.createdAt).toLocaleString() || 'Invalid date'}
                          </Typography>
                          {/* {!(post.createdAt === post.updatedAt) && ( */}
                          {post.updatedAt && (
                            <Typography variant="body2" style={{ marginBottom: '0.5rem', color: '#333' }}>
                              Updated on : {new Date(post.updatedAt).toLocaleString() || 'Invalid date'}
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 1 }}>
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
                                e.stopPropagation(); openProductDetail(post);
                                // Handle view
                              }}
                            >
                              View
                            </Button>
                          </Box>
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
                      {/* <CardActions sx={{
                            justifyContent: 'space-between', padding: '12px 1rem', position: 'absolute', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.95)', mt: 2, backdropFilter: 'blur(10px)',
                            left: 0,
                            right: 0,
                            // padding: '16px',
                            color: 'white'
                        }}>
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
                                e.stopPropagation(); openProductDetail(post);
                                // Handle view
                            }}
                            >
                                View Product
                            </Button>
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
                                e.stopPropagation(); openOrderDetail(post);
                                // Handle view
                            }}
                            >
                                View Order
                            </Button>
                        </CardActions> */}
                    </Card>

                  </Grid>
                ))}

              </Grid>
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
                  alt="No orders found"
                  style={{ width: '100px', opacity: 0.7, marginBottom: '16px' }}
                />
                <Typography variant="body1" color="text.secondary">
                  {searchQuery
                    ? `No Orders found for "${searchQuery}"`
                    : `No orders found`
                  }
                </Typography>
                {searchQuery && (
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, borderRadius: '12px' }}
                    onClick={handleClearSearch}
                  >
                    Clear Search
                  </Button>
                )}
              </Box>
            )
            )}

          {loadingMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, gap: '1rem' }}>
              <CircularProgress size={24} />
              {/* <LinearProgress sx={{ width: 84, height: 4, borderRadius: 2, mt: 0 }}/> */}
              <Typography color='grey' variant='body2'>Loading orders...</Typography>
            </Box>
          )}
          {!hasMore && posts.length > 0 && (
            <Box sx={{
              textAlign: 'center',
              p: 3,
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              borderRadius: '12px',
              mt: 2
            }}>
              <Typography color="text.secondary">
                You've reached the end of <strong>{totalPosts} Products</strong>
              </Typography>
              {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Current search range:  km
                </Typography> */}
            </Box>
          )}
        </Box>


      </Box>

      <OrderData
        // order={selectedOrder}
        open={orderDialogOpen}
        onClose={() => setOrderDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        openProductDetail={openProductDetail}
      />

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
        // onProductSuccess={(productId, data) => {
        //   // setRefreshTrigger(prev => !prev); // Toggle refresh trigger
        //   if (editingProduct) {
        //     // // For edits, we might want to stay on the same page
        //     // // setPagination(prev => ({...prev}));
        //     // // Update cache for edited product
        //     // const currentCacheKey = generateCacheKey();
        //     // if (globalCache.data[currentCacheKey]) {
        //     //   globalCache.data[currentCacheKey].posts = globalCache.data[currentCacheKey].posts.map(p => 
        //     //     p._id === editingProduct._id ? data : p
        //     //   );
        //     // }
        //     // setPosts(prev => prev.map(p => p._id === productId ? data : p));

        //     // refreshCache(response.data.updatedProduct, false);
        //   } else {
        //     // // For new products, go to first page
        //     // // setPagination(prev => ({...prev, page: 1}));
        //     // // Add new product to cache
        //     // const currentCacheKey = generateCacheKey();
        //     // if (globalCache.data[currentCacheKey]) {
        //     //   globalCache.data[currentCacheKey].posts.unshift(data);
        //     //   globalCache.totalPostsCount += 1;
        //     // }
        //     // // setPosts(prev => [data, ...prev]);
        //     // setTotalPosts(prev => prev + 1);
        //     // // refreshCache(response.data.newProduct, true);
        //   }
        // }}
        onProductSuccess={(product, isEdit) => handleProductSuccess(product, isEdit)}
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
        <DialogActions style={{ padding: '1rem', gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant='outlined' color="primary" sx={{ borderRadius: '8px' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant='contained' color="error" sx={{ marginRight: '10px', borderRadius: '8px' }}>
            {loadingProductDeletion ? <> <CircularProgress size={20} sx={{ marginRight: '8px' }} /> Deleting... </> : "Delete Product"}
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

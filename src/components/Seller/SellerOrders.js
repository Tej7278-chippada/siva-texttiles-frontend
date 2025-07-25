// components/Products/ProductsPage.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {Alert, alpha, Box, Button, Card, CardContent, CardActions, CardMedia, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel,  MenuItem,  Select, Snackbar, styled,  TextField, Toolbar, Tooltip, Typography, useMediaQuery, Stack, Chip, Avatar} from '@mui/material';
// import Layout from '../Layout';
// import SkeletonCards from './SkeletonCards';
// import LazyImage from './LazyImage';
import { useTheme } from '@emotion/react';
// import API, { fetchPosts } from '../api/api';
import { useNavigate } from 'react-router-dom';
// import FilterPosts from './FilterPosts';
import CloseIcon from '@mui/icons-material/Close';
// import PersonIcon from '@mui/icons-material/Person';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import CategoryIcon from '@mui/icons-material/Category';
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
// import CategoryBar from './CategoryBar';
// import { fetchProducts } from '../Apis/UserApis';
// import Layout from '../Layout/Layout';
// import SkeletonCards from '../Layout/SkeletonCards';
// import LazyImage from './LazyImage';
import { fetchSellerorders } from '../Apis/SellerApis';
import Layout from '../Layout/Layout';
import SkeletonCards from '../Layout/SkeletonCards';
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
  orderStatus: '',
  priceRange: [0, 100000],
//   postType: 'HelpRequest' // added this line for only shows the Helper posts on ALL section
};

const getGlassmorphismStyle = (theme, darkMode) => ({
  background: darkMode 
    ? 'rgba(30, 30, 30, 0.85)' 
    : 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(20px)',
  border: darkMode 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: darkMode 
    ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
});

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

const SellerOrders = ({ darkMode, toggleDarkMode, unreadCount, shouldAnimate})=> {
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

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

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
    // setShowDistanceRanges(false);
  };

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedFilters = localStorage.getItem('helperFilters');
    return savedFilters 
      ? JSON.parse(savedFilters).categoriesFemale || JSON.parse(savedFilters).categoriesMale || '' 
      : '';
  });
  // useEffect to sync selectedCategory with filters
  // useEffect(() => {
  //   setSelectedCategory(filters.categories || filters.serviceType  || '');
  // }, [filters.categories, filters.serviceType]);

  // function to handle category selection
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
      ...filters
    });
  }, [ filters, searchQuery]);

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
          const response = await fetchSellerorders(0, 12,  filters, searchQuery);
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
          globalCache.lastFilters = {...filters};
          
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
  }, [ filters, generateCacheKey, searchQuery]); // Add distanceRange as dependency

  // Load more posts function
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const response = await fetchSellerorders(skip, 12,  filters, searchQuery);
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
    navigate(`/product/${post.product}`);
  };

  const openOrderDetail = (post) => {
    // Save both to global cache and localStorage as backup
    globalCache.lastViewedPostId = post._id;
    globalCache.lastScrollPosition = window.scrollY;
    localStorage.setItem('lastHelperScroll', window.scrollY);
    localStorage.setItem('lastViewedPostId', post._id);
    navigate(`/order-details/${post._id}`);
  };

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


  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Define the bounds of the world
//   const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));

  // Gender categories
  // const femaleCategories = ['All', 'Saari', 'Dress', 'Accessories'];
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


  return (
    <Layout username={tokenUsername} darkMode={darkMode} toggleDarkMode={toggleDarkMode} unreadCount={unreadCount} shouldAnimate={shouldAnimate}>
       
      {/* Gender Selection Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: isMobile ? 2 : 4, 
        my: 4, mx: 1,
        flexDirection:  'row',
        alignItems: 'center'
      }}>
        <GenderSelectionCard 
          selected={filters.gender === 'Female'}
          onClick={() => handleGenderSelect('Female')}
          sx={{ width: isMobile ? '100%' : 300, textAlign: 'center' }} // width: isMobile ? '100%' : 300,
        >
          <CardMedia
            component="img"
            height={isMobile ? '150px' : '200px'}
            image={'/category/Women.png'}
            alt="Women in traditional saree"
            sx={{ objectFit: 'cover' }}
          />
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
          <CardMedia
            component="img"
            height={isMobile ? '150px' : '200px'}
            image={'/category/Men.png'}
            alt="Men in sports wear"
            sx={{ objectFit: 'cover' }}
          />
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

      {/* Category Bar */}
      {filters.gender && (
        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', ...getGlassmorphismStyle(), m: 1, borderRadius: '12px',
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
                fontWeight: selectedCategory === (category === 'All' ? '' : category) ? 600 : 400 ,
                // color: '#f59e0b', 
                // backgroundColor: 'rgba(245, 158, 11, 0.1)',
              }}
            />
          ))}
        </Box>
      )}
      {/* <CategoryBar selectedCategory={selectedCategory} onCategorySelect={handleCategorySelect} darkMode={darkMode} isMobile={isMobile}/> */}
      <Box>
      <Toolbar sx={{display:'flex', justifyContent:'space-between',
      //  background: 'rgba(255,255,255,0.8)',  backdropFilter: 'blur(10px)',
          // boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
          borderRadius: '12px', 
          padding: isMobile ? '2px 12px' : '2px 16px',  margin: '4px',
          position: 'relative', //sticky
          top: 0,
          zIndex: 1000, 
          // ...getGlassmorphismStyle(0.1, 10),
          }}> 
          {/* <Typography variant="h6" style={{ flexGrow: 1, marginRight: '2rem' }}>
            Posts
          </Typography> */}
          <Box display="flex" justifyContent="flex-start" sx={{flexGrow: 1, marginRight: '6px', marginLeft: isMobile ? '-12px' : '-14px'}}>
          
          </Box>
          <Box>
          
          
          </Box>
          {/* Search Bar */}
          <SearchContainer>
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
                // startAdornment: (
                //   <InputAdornment position="start">
                //     <IconButton 
                //       onClick={!expanded ? handleSearchClick : undefined}
                //       sx={{
                //         minWidth: '40px',
                //         minHeight: '40px',
                //         // marginLeft: expanded ? '8px' : '0px',
                //       }}
                //     >
                //       {isSearching ? (
                //         <CircularProgress size={16} />
                //       ) : (
                //         <SearchIcon color="action" />
                //       )}
                //     </IconButton>
                //   </InputAdornment>
                // ),
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
                  <InputAdornment position="center">
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
                  </>
                ,
                sx: {
                  padding: 0,
                }
              }}
            />
            
            </Box>
          </SearchContainer>
          {/* {isMobile && !expanded && <IconButton 
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
          </IconButton>} */}
          <Box sx={{display:'flex', justifyContent:'space-between', marginRight:'-6px', marginLeft:'8px'}}>
          {/* Button to Open Distance Menu */}
          <IconButton 
           onClick={() => setShowDistanceRanges(true)}
            sx={{
              minWidth: '40px',
              minHeight: '40px',
              marginLeft: expanded ? '8px' : '0px',
            }}
          >
            <FilterListRoundedIcon color="action" />
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
            sx={{ position: 'absolute',
              top: isMobile ? '62px' : '72px',
              right: '1px', ml: '4px',
              // width: '90%',
              // maxWidth: '400px',
              zIndex: 1000,  '& .MuiPaper-root': { borderRadius:'12px'}, borderRadius: '10px', backdropFilter: 'blur(10px)',
              /* boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', */  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              // background: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.95)',
              '& .MuiCardContent-root': {padding: '10px' },  }}
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
                  <Box sx={{mb: 1, display: isMobile ? 'inline': 'flex', justifyContent: isMobile ? 'normal' : 'unset'}}>
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
                    <Box sx={{ position: 'absolute', top: '10px', right: '10px', marginLeft: 'auto', display:'flex', alignItems:'center' }}>
                     
                      <IconButton
                        onClick={() => setShowDistanceRanges(false)}
                        variant="text"
                      >
                        <CloseIcon/>
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
              <Box sx={{maxWidth: '450px'}}>
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
                      
                      
                      <Box display="flex" gap={2} flexWrap="wrap" sx={{mt: 2}}>
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
                        <FormControl size='small' sx={{ flex: '1 1 180px', '& .MuiOutlinedInput-root': { borderRadius: '12px',} }}>
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
                        </FormControl>

                        {/* Price Range */}
                        <Box display="flex" gap={2} flex="1 1 auto">
                          <TextField
                            label="Min Price"
                            type="number" size='small'
                            value={localFilters.priceRange[0]}
                            onChange={(e) => handlePriceChange(e, 'min')}
                            fullWidth sx={{'& .MuiOutlinedInput-root': { borderRadius: '12px',}}}
                          />
                          <TextField
                            label="Max Price"
                            type="number" size='small'
                            value={localFilters.priceRange[1]}
                            onChange={(e) => handlePriceChange(e, 'max')}
                            fullWidth sx={{'& .MuiOutlinedInput-root': { borderRadius: '12px',}}}
                          />
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Box gap={2} mt={3} sx={{display:'flex'}}>
                        <Button
                          variant="outlined"
                          onClick={handleResetFilters}
                          disabled={isDefaultFilters}
                          fullWidth sx={{ borderRadius:'8px' }}
                        >
                          Reset
                        </Button>
                        <Button
                          variant="contained" 
                          onClick={handleApplyFilters}
                          disabled={isDefaultFilters}
                          fullWidth sx={{ borderRadius:'8px'}}
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
         {/* {isMobile && expanded &&  <SearchContainer sx={{mx : 2}}>
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
          </SearchContainer> } */}


        <Box mb={1} sx={{ background: 'rgba(255, 255, 255, 0)',  backdropFilter: 'blur(10px)', paddingTop: '1rem', paddingBottom: '1rem', mx: isMobile ? '6px' : '8px', paddingInline: isMobile ? '8px' : '10px', borderRadius: '10px' }} > {/* sx={{ p: 2 }} */}
          {loading ? (
              <SkeletonCards/>
            ) : 
            ( posts.length > 0 ? (
              <Grid container spacing={isMobile ? 1.5 : 1.5}>
                {posts.map((post, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${post._id}-${index}`} ref={index === posts.length - 3 ? lastPostRef : null} id={`post-${post._id}`}>
                    <Card sx={{
                      margin: '0rem 0',  // spacing between up and down cards
                      cursor: 'pointer',
                      // backdropFilter: 'blur(5px)',
                      // background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 3,
                      backgroundColor: 'background.paper',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.15)}`,
                        // '& .card-actions': {
                        //   opacity: 1,
                        //   transform: 'translateY(0)'
                        // },
                        // '& .price-chip': {
                        //   transform: 'scale(1.05)'
                        // }
                      },
                      // border: '1px solid rgba(255,255,255,0.2)',
                      // boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      // transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      // '&:hover': {
                      //   transform: 'translateY(-4px)',
                      //   boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      // },
                      // transition: 'transform 0.1s ease, box-shadow 0.1s ease', // Smooth transition for hover
                      position: 'relative',
                      height: isMobile ? '280px' : '340px', // Fixed height for consistency
                      overflow: 'hidden',
                    }}
                    //   onClick={() => openPostDetail(post)}
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
                      <CardMedia mx={isMobile ? "-12px" : "-2px"} sx={{ margin: '0rem 0', borderRadius: '8px', overflow: 'hidden', height: '160px', backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Box sx={{
                        //   display: 'flex',
                        //   overflowX: 'auto',
                           overflowY: 'hidden',
                          scrollbarWidth: 'none',
                          scrollbarColor: '#888 transparent',
                          borderRadius: '8px',
                          gap: '0.1rem',
                          // marginBottom: '1rem'
                          height: 'auto', width: '100vh',
                        }} 
                        // onClick={() => openProductDetail(product)}
                        >
                          {/* {(post.media).length > 0 ? (
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
                            <img
                              // src="../assets/null-product-image.webp" // Replace with the path to your placeholder image
                              src='https://placehold.co/56x56?text=No+Imag'
                              alt="No media available"
                              style={{
                                height: '160px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                flexShrink: 0,
                              }}
                            />
                          )} */}
                        {post.productPic ? (
                            <Avatar
                                src={`data:image/jpeg;base64,${post.productPic}`} // Render the image
                                alt={post.productTitle}
                                sx={{ width: 140, height: 160,  borderRadius: '10px' }}
                            />
                            ) : (
                            <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                                No Product Image available
                            </Typography>
                        )}
                        </Box>
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
                        <Box>
                            <Typography variant="body1" style={{ fontWeight: 500 }}>
                                Delivery Address Details:
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                                Name: {post.userDeliveryAddresses[0]?.name || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                                Phone: {post.userDeliveryAddresses[0]?.phone || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                                Email: {post.userDeliveryAddresses[0]?.email || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                                Address: {`${post.userDeliveryAddresses[0]?.address.street || "N/A"}, ${post.userDeliveryAddresses[0]?.address.area || "N/A"}, ${post.userDeliveryAddresses[0]?.address.city || "N/A"}`},
                                <br /> {`${post.userDeliveryAddresses[0]?.address.state || "N/A"} - ${post.userDeliveryAddresses[0]?.address.pincode || "N/A"}`}
                            </Typography>
                        </Box>
                      </CardMedia>
                      
                      <CardContent style={{ padding: '10px' }}>
                            <Stack spacing={1.5}>
                            {/* Title and Price Row */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                <Tooltip title={post.productTitle} placement="top">
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    flex: 1,
                                    mr: 1,
                                    color: 'text.primary'
                                    }}
                                >
                                    {post.productTitle}
                                </Typography>
                                </Tooltip>
                                
                                <Chip
                                className="price-chip"
                                icon={<PriceChangeIcon sx={{ fontSize: 16, pl: 1 }} />}
                                label={`₹${post.orderPrice}`}
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

                            {/* Category and People Count */}
                            <Box display="flex" gap={1} flexWrap="wrap" sx={{justifyContent: 'space-between'}}>
                                <Box sx={{display: 'flex'}}>
                                    <Box 
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            backgroundColor: post.selectedItem[0]?.colorCode,
                                            border: '1px solid #ddd'
                                        }}
                                    />
                                    <Chip
                                    // icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                    label={`${post?.selectedItem[0]?.colorName} (${post?.selectedItem[0]?.size || post.categoriesMale})`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
                                    />
                                </Box>
                                {/* <Typography variant="body2" color={post.paymentStatus === 'Completed' ? 'green' : 'rgba(194, 28, 28, 0.89)'}>
                                  {post.paymentId.status}
                                </Typography> */}

                                <Chip
                                icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                                label={post.orderStatus}
                                size="small"
                                variant="outlined"
                                sx={{
                                    borderColor: post.orderStatus === 'Created' ? 'error.main' : 'divider',
                                    color: post.orderStatus === 'Created' ? 'text.primary' ? (post.orderStatus === 'Delivered') ? 'success.main' : 'text.secondary'  : 'error.main' : '',
                                    fontSize: '0.75rem'
                                }}
                                />
                                
                            </Box>

                            {/* Description */}
                            {/* <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 1, // no of lines of description
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.4
                                }}
                            >
                                {post.description}
                            </Typography> */}
                            <Typography variant="body2" color="textSecondary" >
                                Ordered on : {new Date(post.createdAt).toLocaleString() || 'Invalid date'}
                            </Typography>
                            </Stack>
                        {/* {post.isFullTime && 
                            <Typography sx={{ px: 2, py: 0.5, bgcolor: '#e0f7fa', color: '#006064', borderRadius: '999px', display: 'inline-block', float: 'right', fontWeight: '600', fontSize: '0.875rem' }}>
                            Full Time
                            </Typography>
                        }
                        <Tooltip title={post.title} placement="top" arrow>
                            <Typography variant="h6" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.title.split(" ").length > 5 ? `${post.title.split(" ").slice(0, 5).join(" ")}...` : post.title}
                            </Typography>
                        </Tooltip>
                        <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                            Price: ₹{post.price}
                        </Typography>
                        <Typography variant="body2" color={post.categories === 'Emergency' ? 'rgba(194, 28, 28, 0.89)' : 'textSecondary'} style={{ marginBottom: '0.5rem' }}>
                            Category: {post.categories}
                        </Typography>
                        <Typography variant="body2" color={post.postStatus === 'Active' ? 'green' : 'rgba(194, 28, 28, 0.89)'} style={{ display: 'inline-block',float: 'right', marginBottom: '0.5rem' }}>
                            Status: {post.postStatus}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" style={{  marginBottom: '0.5rem' }}>
                            People Required: {post.peopleCount} ({post.gender})
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{
                            marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                            maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                            lineHeight: '1.5rem'  // Adjust to control exact line spacing.
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
                        </CardActions>
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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems:'center', p: 4, gap:'1rem' }}>
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
                  You've reached the end of <strong>{totalPosts} Orders</strong>
                </Typography>
                {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Current search range:  km
                </Typography> */}
              </Box>
            )}
          </Box>


      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={snackbar.action}
      >
        <Alert onClose={handleCloseSnackbar} action={snackbar.action} severity={snackbar.severity} sx={{ width: '100%', borderRadius:'1rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    
    </Layout>
  );


};

export default SellerOrders;

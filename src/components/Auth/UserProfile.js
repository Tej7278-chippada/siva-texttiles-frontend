// components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Alert, useMediaQuery, Grid,  Snackbar, 
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  TextField,
} from '@mui/material';
import { useTheme } from '@emotion/react';
// import API from './api/api';
// import Layout from './Layout';
// import SkeletonProductDetail from './SkeletonProductDetail';
// import { Marker, TileLayer } from 'leaflet';
// import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import SatelliteAltRoundedIcon from '@mui/icons-material/SatelliteAltRounded';
// import MapRoundedIcon from '@mui/icons-material/MapRounded';
// Fix for Leaflet marker icon issue
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded';
// import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import CloseIcon from '@mui/icons-material/Close';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import SkeletonProductDetail from '../Layout/SkeletonProductDetail';
import API, { addDeliveryAddresses } from '../Apis/UserApis';
import Layout from '../Layout/Layout';
// import RateUserDialog from './Helper/RateUserDialog';


// Set default icon manually
// const customIcon = new L.Icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41], // Default size
//   iconAnchor: [12, 41], // Position relative to the point
//   popupAnchor: [1, -34],
// });

// // Move map when user location is updated
// const ChangeView = ({ center }) => {
//   const map = useMap();
//   useEffect(() => {
//     if (center) {
//       map.setView(center, 13);
//     }
//   }, [center, map]);
//   return null;
// };

// Fix for default marker icon in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

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


const UserProfile = ({darkMode, toggleDarkMode, unreadCount, shouldAnimate}) => {
  const { id } = useParams(); // Extract sellerId from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [successMessage, setSuccessMessage] = useState('');
  // const [mapMode, setMapMode] = useState('normal');
  // const [currentLocation, setCurrentLocation] = useState(null);
  // const [locationDetails, setLocationDetails] = useState(null);
  // const [loadingLocation, setLoadingLocation] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  // const [savingLocation, setSavingLocation] = useState(false);
  // const [showRatings, setShowRatings] = useState(false);
  const tokenUsername = localStorage.getItem('tokenUsername');
  // const [currentAddress, setCurrentAddress] = useState('');
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
  const [addressAddedMessage, setAddressAddedMessage] = useState('');
  const [addressFailedMessage, setAddressFailedMessage] = useState('');
  const [isAddAddressBoxOpen, setIsAddAddressBoxOpen] = useState(false); // to toggle the Add Address button
  const [isDeliveryAddressBoxOpen, setIsDeliveryAddressBoxOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem('authToken');
        const response = await API.get(`/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
        // fetchAddress(response.data.location.latitude, response.data.location.longitude);
        const addresses = response.data.deliveryAddresses || [];
        // Sort addresses by `createdAt` in descending order
        setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        
      } catch (err) {
        // setError('Failed to fetch User details. Please try again later.');
        setSnackbar({ open: true, message: 'Failed to fetch User details. Please try again later.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

 

  

  

  // Fetch address from latitude and longitude
  // const fetchAddress = async (latitude, longitude) => {
  //   try {
  //     const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
  //     const data = await response.json();
  //     setCurrentAddress(data.display_name);
  //     console.log("address fetched");
  //   } catch (error) {
  //     console.error("Error fetching address:", error);
  //   }
  // };
  
  // if (loading || !userData) {
  //   return (
  //     <Layout>
  //       <Box sx={{margin: '8px' }}>
        // {/* <SkeletonCards /> */}
  //       <SkeletonProductDetail />
  //       </Box>
  //     </Layout>
  //   );
  // };
  // if (error) return <Alert severity="error">{error}</Alert>;

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // const [loginMessage, setLoginMessage] = useState({ open: false, message: "", severity: "info" });
  // const [isRateDialogOpen, setRateDialogOpen] = useState(false);
  // const handleOpenRateDialog = () => setRateDialogOpen(true);
  // const handleCloseRateDialog = () => setRateDialogOpen(false);

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

  return (
    <Layout username={tokenUsername} darkMode={darkMode} toggleDarkMode={toggleDarkMode} unreadCount={unreadCount} shouldAnimate={shouldAnimate}>
      {/* <Snackbar
        open={!!successMessage}
        autoHideDuration={9000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar> */}
      
      <Typography variant="h6" sx={{ flexGrow: 1, mx: isMobile ? '10px' : '16px', mt: 1 }} >
        User Profile
      </Typography>
      {(loading || !userData) ?
        <Box sx={{ padding: '8px' }}>
          <SkeletonProductDetail />
        </Box>
        :
        <Box sx={{
          padding: isMobile ? '8px' : '12px',
          // position: 'relative',
          // backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px', scrollbarWidth: 'thin'
        }}>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2} sx={{  borderRadius: '10px', padding: '6px', paddingBottom: '10px', paddingTop: '10px', ...getGlassmorphismStyle(theme, darkMode) }} // bgcolor: '#f5f5f5',
          >
            <Box sx={{
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
                style={{
                  paddingRight: isMobile ? "0" : "0rem",
                  display: isMobile ? "flex" : "block",
                  justifyContent: isMobile ? "center" : "flex-start",
                  alignItems: isMobile ? "center" : "flex-start",
                }}
              >
                <Avatar
                  alt={userData.username}
                  src={
                    userData.profilePic
                      ? `data:image/jpeg;base64,${userData.profilePic}`
                      : 'https://placehold.co/56x56?text=No+Image'
                  }
                  sx={{ width: isMobile ? '160px' : 'auto', height: isMobile ? '160px' : 'auto', borderRadius: isMobile ? '50%' : '50%' }} // fit-content
                />
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
              // height: 'calc(100vh - 16px)', // Adjust height as needed
            }}>
              <Box flex={isMobile ? "1" : "0 0 70%"} mb={6}>
                <Grid container spacing={2}>

                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      User Name:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData.username}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      User Code:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData.userCode}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      User Phone:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData?.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      User Email:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData?.email}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Account Status:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData?.accountStatus}
                    </Typography>
                  </Grid> */}
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Email Verified:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData?.emailVerified === true ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                     Account created at:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(userData?.accountCreatedAt).toLocaleString() || 'Invalid date'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                     Last login at:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(userData?.lastLoginAt).toLocaleString() || 'Invalid date'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                     lastProfilePicUpdate:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(userData?.lastProfilePicUpdate).toLocaleString() || 'Invalid date'}
                    </Typography>
                  </Grid> */}
                  {/* <Grid item xs={12} sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Address:
                    </Typography>
                    {userData.address && (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                    {`${userData.address.street}, ${userData.address.area}, ${userData.address.city}, ${userData.address.state} - ${userData.address.pincode}`}
                    </Typography>
                    )}
                  </Grid> */}
                </Grid>
              </Box>

              <Button
                variant="outlined" size="small"
                onClick={() => setIsDeliveryAddressBoxOpen((prev) => !prev)}
                sx={{borderRadius: '12px'}}
              >
                {isDeliveryAddressBoxOpen ? 'Close Delivery Addresses' : 'Show Delivery Addresses'}
              </Button>
              
            </Box>
            {/* {showRatings && (
              <Card
                sx={{
                  position: 'absolute',
                  top: isMobile ? '150px' : '10px',
                  left: isMobile ? '2%' : null,
                  right: isMobile ? null : '2%',
                  width: '95%',
                  maxWidth: '400px',
                  zIndex: 1000,
                  borderRadius: '10px', backdropFilter: 'blur(12px)',
                  // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  // backgroundColor: '#fff',
                   '& .MuiCardContent-root': { padding: '10px' },
                }}
              >
                <CardContent>
                  Close Button
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Your Profile Ratings</Typography>
                    <IconButton onClick={() => setShowRatings(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" mb={1} gap={1}>
                    <Typography variant="body2" color="textSecondary" >
                      Trust Level
                    </Typography>
                    <StarRoundedIcon sx={{ color: 'gold', fontSize: 18 }} />
                    <Typography variant="body2" color="textSecondary" ml="-4px">
                      {userData.trustLevel || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">({userData.totalReviews} reviews)</Typography>
                  </Box>
                  <Box sx={{ height: '300px', overflowY: 'auto', scrollbarWidth: 'thin', bgcolor: 'rgba(0, 0, 0, 0.07)', borderRadius: '8px', scrollbarColor: '#aaa transparent', cursor: 'pointer' }}>
                    {userData.ratings.length ? (
                      userData.ratings.map((rating, index) => (
                        <Box
                          key={index}
                          sx={{
                            margin: "6px",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            marginTop: "6px",
                            // backgroundColor: "#fff"
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              src={`data:image/jpeg;base64,${btoa(
                                String.fromCharCode(...new Uint8Array(rating.userId?.profilePic?.data || []))
                              )}`}
                              alt={rating.userId?.username[0]}
                              style={{ width: 32, height: 32, borderRadius: '50%' }}
                            />
                            <Typography fontWeight="bold">
                              {rating.userId?.username || "Anonymous"}
                            </Typography>
                            <Rating value={rating.rating || 0} precision={0.5} readOnly sx={{ marginLeft: 'auto' }} />
                            <Typography variant="caption" color="textSecondary" marginLeft="auto">
                            {new Date(rating.createdAt).toLocaleString()}
                          </Typography>
                          </Box>
                          <Rating value={rating.rating || 0} precision={0.5} readOnly sx={{marginLeft:'2rem'}}/>
                          <Typography sx={{ paddingTop: "0.5rem" }}>{rating.comment}</Typography>
                          <Typography variant="caption" color="textSecondary" >
                            {new Date(rating.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography color="grey" textAlign="center" sx={{ m: 2 }}>
                        No Ratings available.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            )} */}
          </Box>
          
        </Box>
      }

      {isDeliveryAddressBoxOpen && (
        <Card sx={{ padding: `${isMobile ? '4px' : '1rem'}`, marginTop: '1rem', marginBottom: '1rem', mx: isMobile ? '10px' : '16px', bgcolor: '#f5f5f5', borderRadius: '8px' }}>
          <Box mb={2}>
            <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button
                variant="contained"
                onClick={() => setIsAddAddressBoxOpen((prev) => !prev)}
                sx={{ mt: 0, mb: 1, mr: 1, borderRadius: '12px' }}
              >
                Add New Address
              </Button>
            </Box>
            {isAddAddressBoxOpen && (
              <Card sx={{ borderRadius: '16px', marginBottom: '2rem' }}>
                <Box my={2} p={2} >
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
                          />
                        </Grid>
                      )
                    )}
                  </Grid>

                  <Button
                    variant="contained"
                    onClick={handleAddAddress}
                    sx={{ mt: 2, mb: 2, float: "right", minWidth: '150px', borderRadius: '12px' }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => setIsAddAddressBoxOpen(false)}
                    sx={{ mt: 2, mb: 2, mr: 1, float: "right", minWidth: '80px' }}
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
              <Typography variant="h6" sx={{ mt: 1, ml: 1 }}>Delivery Addresses</Typography>
              <Grid container spacing={1}>
                {deliveryAddresses.length > 0 ? (
                  deliveryAddresses.map((deliveryAddress, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} >
                    <List sx={{ height: "100%", width: "100%" }}>
                      <ListItem
                        key={index}
                        button="true"
                        selected={selectedAddress === deliveryAddress}
                        onClick={() => setSelectedAddress(deliveryAddress)}
                        sx={{
                          border: selectedAddress === deliveryAddress ? "2px solid blue" : "1px solid lightgray",
                          borderRadius: 2,
                          mb: 0,
                          flexDirection: "column", // column for desktop, row for mobile to align text on middle
                          height: "100%", // Make the ListItem fill the grid cell height
                        }}
                      >
                        <ListItemText
                          primary={
                            <>{`${deliveryAddress.name}, ${deliveryAddress.phone}, ${deliveryAddress.email}`}
                              <br />
                              {`${deliveryAddress.address.street}, ${deliveryAddress.address.area}, ${deliveryAddress.address.city}, ${deliveryAddress.address.state}, ${deliveryAddress.address.pincode}`}
                            </>}
                          secondary={
                            <>

                              <br />
                              <Typography sx={{ display: 'inline-block', float: 'right' }}>
                                Added on: {new Date(deliveryAddress.createdAt).toLocaleString()} {/* toLocaleDateString for displaying date only */}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                ))) : (
                  <Typography align="center" padding="1rem" variant="body1" color="error">
                    You Don't have Delivery Addresses. Add new Delivery Address.
                  </Typography>
                )}
              </Grid>

            </Box>
          </Box>
        </Card>
      )}
        {/* <Box mt={1} sx={{ borderRadius:3, bgcolor:'rgba(0, 0, 0, 0.07)'}}>
          {locationDetails && (
            <Box sx={{ margin: '1rem' }}>
              <Typography variant="h6" gutterBottom>
                Current Location Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    IP Address:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.ip}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Street:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.street}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Area:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.area}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    City:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.city}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    State:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.state}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Nation:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.nation}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Pincode:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.pincode}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Latitude:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.latitude}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Longitude:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {locationDetails.longitude}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Typography variant="body1" style={{ fontWeight: 500 }}>
                    Accuracy (meters):
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {locationDetails.accuracy}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box> */}

      {/* Delete Confirmation Dialog */}
      {/* <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title" 
        sx={{ '& .MuiPaper-root': { borderRadius: '14px', backdropFilter: 'blur(12px)', }, }}
      >
        <DialogTitle id="delete-dialog-title" >
          Are you sure you want to delete your account permanently?
        </DialogTitle>
        <DialogContent style={{ padding: '2rem' }}>
          <Typography color='error'>
            This action cannot be undone. If you proceed, all your account's data will be removed permanently...
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '1rem' }}>
          <Button onClick={handleDeleteAccount} variant='contained' color="error" sx={{ marginRight: '10px', borderRadius:'8px' }}>
            Yes, permanently delete my account
          </Button>
          <Button onClick={handleCloseDeleteDialog} variant='outlined' color="primary" sx={{borderRadius:'8px'}}>
            Cancel
          </Button>

        </DialogActions>
      </Dialog> */}

      {/* <RateUserDialog
        userId={id}
        open={isRateDialogOpen}
        onClose={handleCloseRateDialog}
        // post={post}
        isMobile={isMobile}
        // isAuthenticated={isAuthenticated} 
        // setLoginMessage={setLoginMessage}  
        setSnackbar={setSnackbar} darkMode={darkMode}
      /> */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius:'1rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default UserProfile;

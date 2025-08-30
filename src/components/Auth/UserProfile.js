// components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Alert, useMediaQuery, Grid,  Snackbar, 
  Button,
  List,
  ListItem,
  ListItemText,
  Card,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, CircularProgress
} from '@mui/material';
import { useTheme } from '@emotion/react';
import SkeletonProductDetail from '../Layout/SkeletonProductDetail';
import API, { addDeliveryAddresses, deleteDeliveryAddress, updateDeliveryAddress, updateUserProfile, updateProfilePicture, deleteProfilePicture  } from '../Apis/UserApis';
import Layout from '../Layout/Layout';
import TermsPolicyBar from '../PolicyPages/TermsPolicyBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import Cropper from 'react-easy-crop';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const tokenUsername = localStorage.getItem('tokenUsername');
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
  const navigate = useNavigate();
  const userRole = (userData?.userRole );
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
  // states for profile editing
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [profilePicDialog, setProfilePicDialog] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem('authToken');
        const response = await API.get(`/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
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

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

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
      
      const addresses = response.data.deliveryAddresses || [];
      setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Update selected address if it was the one edited
      if (selectedAddress && selectedAddress._id === currentAddress._id) {
        const updatedAddress = addresses.find(addr => addr._id === currentAddress._id);
        setSelectedAddress(updatedAddress);
      }
      
      setSnackbar({ 
        open: true, 
        message: 'Address updated successfully!', 
        severity: 'success' 
      });
      setEditAddressOpen(false);
    } catch (error) {
      console.error('Error updating address:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error updating address', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await deleteDeliveryAddress(addressId);
      
      const addresses = response.data.deliveryAddresses || [];
      setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      // Clear selected address if it was the one deleted
      if (selectedAddress && selectedAddress._id === addressId) {
        setSelectedAddress(null);
      }
      
      setSnackbar({ 
        open: true, 
        message: 'Address deleted successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      setSnackbar({ 
        open: true, 
        message: 'Error deleting address', 
        severity: 'error' 
      });
    }
  };

  const handleEditProfile = () => {
    setProfileForm({
      username: userData.username,
      email: userData.email,
      phone: userData.phone || ''
    });
    setEditProfileOpen(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      const response = await updateUserProfile(id, profileForm);
      setUserData(prev => ({
        ...prev,
        username: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phone
      }));
      localStorage.setItem('tokenUsername', response.data.user.username);
      setEditProfileOpen(false);
      setSnackbar({ 
        open: true, 
        message: 'Profile updated successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error updating profile', 
        severity: 'error' 
      });
    } finally {
      setUpdating(false);
    }
  };

  // Profile picture functions
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      const resizedBlob = await resizeImage(file, 2 * 1024 * 1024);
      const resizedFile = new File([resizedBlob], file.name, { type: file.type });
      setProfilePic(resizedFile);
    } else {
      setProfilePic(file);
    }
  };

  const resizeImage = (blob, maxSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;
        const scaleFactor = Math.sqrt(maxSize / blob.size);
        width *= scaleFactor;
        height *= scaleFactor;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (resizedBlob) => resolve(resizedBlob),
          "image/jpeg",
          0.8
        );
      };
    });
  };

  const handleCropComplete = async (_, croppedAreaPixels) => {
    if (!profilePic) return;
    const canvas = document.createElement('canvas');
    const image = new Image();
    const objectURL = URL.createObjectURL(profilePic);
    image.src = objectURL;
    image.onload = () => {
      const ctx = canvas.getContext('2d');
      const { width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        width,
        height,
        0,
        0,
        width,
        height
      );
      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedImage(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.8);
    };
  };

  const handleSaveProfilePic = async () => {
    try {
      setUpdating(true);
      if (!croppedImage) {
        setSnackbar({ 
          open: true, 
          message: 'Please select and crop an image first', 
          severity: 'warning' 
        });
        return;
      }

      const blob = await fetch(croppedImage).then(r => r.blob());
      const file = new File([blob], 'profile-pic.jpg', { type: 'image/jpeg' });
      
      const response = await updateProfilePicture(id, file);
      setUserData(prev => ({
        ...prev,
        profilePic: response.data.user.profilePic,
        lastProfilePicUpdate: response.data.user.lastProfilePicUpdate
      }));
      localStorage.setItem('tokenProfilePic', response.data.user.profilePic);
      setProfilePicDialog(false);
      setProfilePic(null);
      setCroppedImage(null);
      setSnackbar({ 
        open: true, 
        message: 'Profile picture updated successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error updating profile picture', 
        severity: 'error' 
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      setDeleting(true);
      const response = await deleteProfilePicture(id);
      setUserData(prev => ({
        ...prev,
        profilePic: null,
        lastProfilePicUpdate: response.data.user.lastProfilePicUpdate
      }));
      localStorage.setItem('tokenProfilePic', null);
      setProfilePicDialog(false);
      setSnackbar({ 
        open: true, 
        message: 'Profile picture deleted successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error deleting profile picture', 
        severity: 'error' 
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout username={tokenUsername} darkMode={darkMode} toggleDarkMode={toggleDarkMode} unreadCount={unreadCount} shouldAnimate={shouldAnimate}>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' , alignItems: 'center'}}>
        <Typography variant="h6" sx={{ flexGrow: 1, mx: isMobile ? '10px' : '16px', mt: 1 }} >
          User Profile
        </Typography>
        {userRole && <Button
          variant="contained" size="small"
          onClick={() => navigate('/sellerPage')}
          sx={{borderRadius: '12px', mx: 2, mt: 1, textTransform: 'none',}}
        >
          Seller Page
        </Button>}
      </Box>

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
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    alt={userData.username}
                    src={
                      userData.profilePic
                        ? `data:image/jpeg;base64,${userData.profilePic}`
                        : 'https://placehold.co/200x200?text=No+Image'
                    }
                    sx={{ width: isMobile ? '160px' : 'auto', height: isMobile ? '160px' : 'auto', borderRadius: isMobile ? '50%' : '50%', cursor: 'pointer' }} // fit-content
                    onClick={() => setProfilePicDialog(true)}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                      }
                    }}
                    onClick={() => setProfilePicDialog(true)}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </Box>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Profile Information</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleEditProfile}
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: '12px', textTransform: 'none' }}
                  >
                    Edit Profile
                  </Button>
                </Box>
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
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Email Verified:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {userData?.emailVerified === true ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="outlined" size="small"
                onClick={() => setIsDeliveryAddressBoxOpen((prev) => !prev)}
                sx={{borderRadius: '12px', textTransform: 'none'}}
              >
                {isDeliveryAddressBoxOpen ? 'Close Delivery Addresses' : 'Show Delivery Addresses'}
              </Button>
              
            </Box>
            
          </Box>
          
        </Box>
      }

      {isDeliveryAddressBoxOpen && (
        <Card sx={{ padding: `${isMobile ? '4px' : '1rem'}`, marginTop: '1rem', marginBottom: '1rem', mx: isMobile ? '10px' : '16px', bgcolor: '#f5f5f5', borderRadius: '8px' }}>
          <Box mb={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 1 }}>
              <Typography variant="h6" >Delivery Addresses</Typography>
              <Button
                variant="contained" size="small"
                onClick={() => setIsAddAddressBoxOpen((prev) => !prev)}
                sx={{ borderRadius: '12px', textTransform: 'none' }}
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

      {/* Edit Profile Dialog */}
      <Dialog
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box >
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={profileForm.username}
              onChange={handleProfileChange}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              margin="normal"
              required
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
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              margin="normal"
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
          </Box>
        </DialogContent>
        <DialogActions sx={{p: 2}}>
          <Button sx={{borderRadius: '12px', textTransform: 'none'}} onClick={() => setEditProfileOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateProfile} 
            variant="contained"
            disabled={updating}
            sx={{
              textTransform:'none', borderRadius: '12px'
            }}
          >
            {updating ? <CircularProgress size={24} /> : 'Update Profile'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Profile Picture Dialog */}
      <Dialog
        open={profilePicDialog}
        onClose={() => setProfilePicDialog(false)}
        maxWidth="sm"
        fullWidth
        // fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'visible'
          }
        }}
      >
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent sx={{ scrollbarWidth: 'thin' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Current Profile Picture Preview */}
            {/* {userData?.profilePic && !profilePic && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  Current Profile Picture:
                </Typography>
                <Avatar
                  src={`data:image/jpeg;base64,${userData.profilePic}`}
                  sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteProfilePic}
                  disabled={updating}
                  startIcon={<DeleteIcon />}
                  sx={{ borderRadius: '12px', textTransform: 'none' }}
                >
                  {updating ? <CircularProgress size={20} /> : 'Delete Current Photo'}
                </Button>
              </Box>
            )} */}
            <Box sx={{display: 'flex', flexDirection: isMobile ? 'column-reverse' : 'row-reverse', gap: 1, alignItems: 'center', mb: 2, }}>
              <Button 
                variant="contained" 
                component="label"
                sx={{ borderRadius: '12px' }}
              >
                Choose Photo
                <input 
                  type="file" 
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteProfilePic}
                disabled={deleting || updating}
                startIcon={<DeleteIcon />}
                sx={{ borderRadius: '12px', textTransform: 'none' }}
              >
                {deleting ? <CircularProgress size={20} /> : 'Delete Current Photo'}
              </Button>
            </Box>

            {profilePic && (
              <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
                <Cropper
                  image={URL.createObjectURL(profilePic)}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                  style={{
                    containerStyle: {
                      height: 300,
                      position: 'relative',
                    },
                    cropAreaStyle: {
                      border: '2px dashed #2196f3',
                      borderRadius: '50%',
                    },
                  }}
                />
              </Box>
            )}

            {croppedImage && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" gutterBottom>
                  Preview:
                </Typography>
                <Avatar
                  src={croppedImage}
                  sx={{ width: 120, height: 120, margin: '0 auto' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{p: 2}}>
          <Button 
            sx={{
              textTransform:'none', borderRadius: '12px'
            }} 
            onClick={() => setProfilePicDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveProfilePic} 
            variant="contained"
            disabled={updating || !croppedImage || deleting}
            sx={{
              textTransform:'none', borderRadius: '12px'
            }}
          >
            {updating ? <CircularProgress size={24} /> : 'Save Picture'}
          </Button>
        </DialogActions>
      </Dialog>
        
      <TermsPolicyBar/>

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

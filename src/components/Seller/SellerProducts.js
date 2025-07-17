import React, { useState } from "react";
import Layout from "../Layout/Layout";
import { Alert, Box, Button, Snackbar, useTheme } from "@mui/material";
import PostProduct from "./PostProduct";

const SellerProducts = ({ darkMode, toggleDarkMode, unreadCount, shouldAnimate }) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [existingMedia, setExistingMedia] = useState([]);
    const [newMedia, setNewMedia] = useState([]);
    const [mediaError, setMediaError] = useState('');
    const [loading, setLoading] = useState(false); // to show loading state
    const [submitError, setSubmitError] = useState(''); // Error for failed product submission
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
    const theme = useTheme();
    //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });


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
        // setEditingProduct(null); // Ensure it's not in editing mode
        // setExistingMedia([]); // Clear any existing media
        // setNewMedia([]); // Clear new media files
        // setGeneratedImages([]);
        // setNoImagesFound(false); // Reset no images found state
        setOpenDialog(true);
        // setActiveStep(0);
        // setValidationErrors({});
    };

    const handleCloseDialog = () => {
        // setEditingProduct(null);
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

    return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 2 }}>
                <h2>Seller Products</h2>
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
                    {/* <PostAddRoundedIcon sx={{ fontSize: '20px' }} /> */}
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Product</span>
                </Button>

                {/* <SkeletonProductDetail/> */}
            </Box>
            <PostProduct openDialog={openDialog} onCloseDialog={handleCloseDialog}
                setSnackbar={setSnackbar}
                submitError={submitError} setSubmitError={setSubmitError} theme={theme}
                //  isMobile={isMobile} fetchPostsData={fetchPostsData} /* fetchUnsplashImages={fetchUnsplashImages} noImagesFound={noImagesFound} */ 
                loading={loading} setLoading={setLoading}
                newMedia={newMedia} setNewMedia={setNewMedia}
                mediaError={mediaError} setMediaError={setMediaError}
                editingProduct={editingProduct} setEditingProduct={setEditingProduct} existingMedia={existingMedia} setExistingMedia={setExistingMedia}
            //  /* formData={formData} setFormData={setFormData} */ /* generatedImages={generatedImages} loadingGeneration={loadingGeneration} */ loadingMedia={loadingMedia}
            //  selectedDate={selectedDate} setSelectedDate={setSelectedDate} timeFrom={timeFrom} setTimeFrom={setTimeFrom} timeTo={timeTo} setTimeTo={setTimeTo}
            //  protectLocation={protectLocation} setProtectLocation={setProtectLocation} fakeAddress={fakeAddress} setFakeAddress={setFakeAddress}
            //  activeStep={activeStep} setActiveStep={setActiveStep} darkMode={darkMode} setValidationErrors={setValidationErrors} validationErrors={validationErrors}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '1rem' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default SellerProducts;
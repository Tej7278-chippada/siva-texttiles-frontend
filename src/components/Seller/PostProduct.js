// /components/Seller/PostProduct.js
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { addProduct, updateProduct } from '../Apis/SellerApis';


const PostProduct = ({ openDialog, onCloseDialog, theme, isMobile, fetchPostsData, /* generatedImages, loadingGeneration,
  noImagesFound, */ newMedia, setNewMedia, editingProduct, /* formData, setFormData, */ 
  // selectedDate, setSelectedDate,
   mediaError, setMediaError,
  // timeFrom, setTimeFrom, timeTo, setTimeTo, 
  existingMedia, setExistingMedia, /* fetchUnsplashImages, */ loadingMedia, loading, setLoading,
  setSnackbar, setSubmitError, submitError,
  //   protectLocation, setProtectLocation, fakeAddress, setFakeAddress, activeStep, setActiveStep,
  //   darkMode, validationErrors, setValidationErrors,
}) => {
  // Add formData state inside the component
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    gender: '',
    categoriesFemale: '',
    categoriesMale: '',
    categoriesKids: '',
    stockStatus: '',
    totalStock: '',
    deliveryDays: '',
    description: '',
    media: null,
    // isFullTime: false,
  });

  // Initialize form data when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.title,
        price: editingProduct.price,
        gender: editingProduct.gender,
        categoriesFemale: editingProduct?.categoriesFemale,
        categoriesMale: editingProduct?.categoriesMale,
        categoriesKids: editingProduct?.categoriesKids,
        stockStatus: editingProduct.stockStatus,
        totalStock: editingProduct.totalStock,
        deliveryDays: editingProduct.deliveryDays,
        description: editingProduct.description,
      });
    } else {
      // Reset form when creating new post
      setFormData({
        title: '',
        price: '',
        gender: '',
        categoriesFemale: '',
        categoriesMale: '',
        categoriesKids: '',
        stockStatus: '',
        totalStock: '',
        deliveryDays: '',
        description: '',
        media: null,
      });
    }
  }, [editingProduct]);

  const handleCloseDialog = () => {
    // Reset all form states
    setFormData({
      title: '',
      price: '',
      gender: '',
      categoriesFemale: '',
      categoriesMale: '',
      categoriesKids: '',
      stockStatus: '',
      totalStock: '',
      deliveryDays: '',
      description: '',
      media: null,
    });
    setExistingMedia([]);
    setNewMedia([]);
    setMediaError('');
    setSubmitError('');

    // Call parent's close handler
    onCloseDialog();  // Changed from handleCloseDialog to onCloseDialog
  };

  const resizeImage = (blob, maxSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set the new dimensions
        let width = img.width;
        let height = img.height;
        const scaleFactor = Math.sqrt(maxSize / blob.size); // Reduce size proportionally

        width *= scaleFactor;
        height *= scaleFactor;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob
        canvas.toBlob(
          (resizedBlob) => {
            resolve(resizedBlob);
          },
          "image/jpeg",
          0.8 // Compression quality
        );
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    const data = new FormData();

    // Add only new media files to FormData
    newMedia.forEach((file) => data.append('media', file));
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key !== 'media') data.append(key, formData[key]);
    });

    // Include IDs of existing media to keep
    const mediaToKeep = existingMedia.filter(media => !media.remove).map(media => media._id);
    if (mediaToKeep.length > 0) {
      data.append('existingMedia', JSON.stringify(mediaToKeep));
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
        setSnackbar({ open: true, message: `${formData.title} details updated successfully.`, severity: 'success' });
      } else {
        await addProduct(data);
        setSnackbar({ open: true, message: `New Post "${formData.title}" is added successfully.`, severity: 'success' });
      }
      // Reset form after successful submission
      setFormData({
        title: '',
        price: '',
        gender: '',
        categoriesFemale: '',
        categoriesMale: '',
        categoriesKids: '',
        stockStatus: '',
        totalStock: '',
        deliveryDays: '',
        description: '',
        media: null,
      });
      setExistingMedia([]);
      setNewMedia([]);
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting product:", error);
      setSnackbar({
        open: true, message: editingProduct
          ? `${formData.title} details can't be updated, please try again later.`
          : `New product can't be added, please try again later.`, severity: 'error'
      });
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleDeleteMedia = (mediaId) => {
    setExistingMedia(existingMedia.map(media => media._id === mediaId ? { ...media, remove: true } : media));
    // Calculate the total media count after deletion
    const updatedTotalMedia = newMedia.length + existingMedia.filter(media => !media.remove && media._id !== mediaId).length;

    // Remove error message if media count is within the limit
    if (updatedTotalMedia <= 5) {
      setMediaError("");
    }
  };

  const handleRemoveNewMedia = (index) => {
    setNewMedia((prev) => {
      const updatedMedia = prev.filter((_, i) => i !== index);

      // Calculate the total media count after deletion
      const updatedTotalMedia = updatedMedia.length + existingMedia.filter(media => !media.remove).length;

      // Remove error message if media count is within the limit
      if (updatedTotalMedia <= 5) {
        setMediaError("");
      }

      return updatedMedia;
    });
  };


  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    const resizedFiles = [];

    for (const file of selectedFiles) {
      if (file.size > 2 * 1024 * 1024) { // If file is larger than 2MB
        const resizedBlob = await resizeImage(file, 2 * 1024 * 1024);
        const resizedFile = new File([resizedBlob], file.name, { type: file.type });
        resizedFiles.push(resizedFile);
      } else {
        resizedFiles.push(file); // Keep original if <= 2MB
      }
    }

    const existingMediaCount = existingMedia.filter((media) => !media.remove).length;
    const totalMediaCount = resizedFiles.length + newMedia.length + existingMediaCount;

    // Check conditions for file count
    if (totalMediaCount > 5) {
      setMediaError("Maximum 5 photos allowed.");
      setSnackbar({ open: true, message: 'Maximum 5 photos allowed.', severity: 'warning' });
    } else {
      setMediaError("");
      // Append newly selected files at the end of the existing array
      setNewMedia((prevMedia) => [...prevMedia, ...resizedFiles]); // Add resized/valid files
    }
  };

  return (

    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth fullScreen={isMobile ? true : false} sx={{
      margin: '10px',
      '& .MuiPaper-root': { // Target the dialog paper
        borderRadius: '16px', // Apply border radius
        scrollbarWidth: 'thin', scrollbarColor: '#aaa transparent',
      }, '& .MuiDialogContent-root': {
        margin: isMobile ? '0rem' : '1rem', padding: isMobile ? '8px' : '0rem',
      }, '& .MuiDialogActions-root': {
        margin: isMobile ? '1rem' : '1rem',
      },
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}
          <IconButton
            onClick={handleCloseDialog}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              // backgroundColor: 'rgba(0, 0, 0, 0.1)',
              // color: '#333'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0rem' }}>
          {editingProduct &&
            <Card sx={{ borderRadius: 3, marginInline: '2px', bgcolor: '#f5f5f5' }}>
              {/* Existing media with delete option */}
              <Box style={{ marginBottom: '10px', marginInline: '6px' }}>
                <Typography ml={1} variant="subtitle1">Existing Images</Typography>
                <Box style={{ display: 'flex', gap: '4px', overflowX: 'scroll', scrollbarWidth: 'none', scrollbarColor: '#888 transparent' }}>
                  {loadingMedia ?
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" m={2} gap={1} flex={1}>
                      <CircularProgress size={24} />
                      <Typography color='grey' variant='body2'>Loading Existing Product Images</Typography>
                    </Box>
                    :
                    (existingMedia.length > 0)
                      ? existingMedia.map((media) => (
                        !media.remove && (
                          <Box key={media._id} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                            <img src={`data:image/jpeg;base64,${media.data}`} alt="Post Media" style={{ height: '160px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }} />
                            <Button size="small" color="secondary" onClick={() => handleDeleteMedia(media._id)}>Remove</Button>
                          </Box>
                        )))
                      : (
                        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row" m={1} gap={1} flex={1}>
                          <Typography variant="body2" color="grey" >Product doesn't have existing images.</Typography>
                        </Box>
                      )}
                </Box>
              </Box>
            </Card>
          }
          <Card sx={{ borderRadius: 3, marginBottom: '0rem', mx: '2px', bgcolor: '#f5f5f5' }}>
            <Box sx={{ mx: '6px', my: '4px' }}>
              <Box sx={{ mx: '6px' }}>
                <Typography variant="subtitle1">Add Product Photos</Typography>
                <Box sx={{ mx: '4px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'null' : 'center', gap: isMobile ? '2px' : '14px' }}>
                  {/* Styled Upload Button */}
                  <Button
                    variant="text"
                    component="label" size="small"
                    sx={{ my: 1, borderRadius: "8px", textTransform: "none", bgcolor: 'rgba(24, 170, 248, 0.07)' }}
                  >
                    Choose Photos
                    <input
                      type="file"
                      multiple
                      hidden
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="body2" color="grey">Note : Maximum 5 Photos allowed.</Typography>
                </Box>
                {mediaError && <Alert severity="error">{mediaError}</Alert>}
              </Box>
              {newMedia.length > 0 && (
                <Box sx={{ display: 'flex', gap: '4px', marginTop: '10px', mx: '4px', overflowX: 'auto', scrollbarWidth: 'none', scrollbarColor: '#888 transparent' }}>
                  {newMedia.map((file, index) => (
                    <Box key={index} style={{ display: 'flex', position: 'relative', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        style={{
                          height: '160px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          cursor: 'pointer' // Make the image look clickable
                        }}
                      />
                      <Button size="small" color="secondary" onClick={() => handleRemoveNewMedia(index)}>Remove</Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Card>
          <Box>
          </Box>

          <TextField
            label="Product Title"
            fullWidth sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                //   bgcolor: theme.palette.background.paper,
              },
              '& .MuiInputBase-input': {
                // padding: '10px 14px',
              },
              //  maxWidth: 600, mx: 'auto', paddingTop: '1rem'
            }}
            value={formData.title}
            onChange={(e) => {
              const maxLength = 100; // Set character limit
              if (e.target.value.length <= maxLength) {
                setFormData({ ...formData, title: e.target.value });
              }
            }}
            inputProps={{ maxLength: 100 }} // Ensures no more than 100 characters can be typed
            required
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* {!(formData.categories === 'UnPaid') && ( */}
            <TextField
              label="Price to the Product (INR)"
              type="number"
              fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }}
              value={formData.price}
              onChange={(e) => {
                let value = e.target.value;
                // Remove any invalid characters like "-", "+", or ","
                value = value.replace(/[-+,]/g, '');

                // Allow only numbers with up to two decimal places
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  const num = Number(value);

                  // Ensure the value is within range (0 to 10,000,000)
                  if (num >= 0 && num <= 10000000) {
                    setFormData({ ...formData, price: value });
                  }
                }
              }}
              required
            />
            {/* )} */}
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }} required>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
                label="Required Gender to service"
              >
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Kids">Kids</MenuItem>
                {/* <MenuItem value="Everyone">Everyone</MenuItem> */}
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {(formData.gender === 'Female') && (
              <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }} required>
                <InputLabel>Product Category</InputLabel>
                <Select
                  value={formData.categoriesFemale}
                  onChange={(e) => setFormData({ ...formData, categoriesFemale: e.target.value })}
                  required
                  label="Categories"
                >
                  <MenuItem value="Saari">Saari</MenuItem>
                  <MenuItem value="Dress">Dress</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
            )}
            {(formData.gender === 'Male') && (
              <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }} required>
                <InputLabel>Product Category</InputLabel>
                <Select
                  value={formData.categoriesMale}
                  onChange={(e) => setFormData({ ...formData, categoriesMale: e.target.value })}
                  required
                  label="Categories"
                >
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Top">Top</MenuItem>
                  <MenuItem value="Bottom">Bottom</MenuItem>
                </Select>
              </FormControl>
            )}
            {(formData.gender === 'Kids') && (
              <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }} required>
                <InputLabel>Product Category</InputLabel>
                <Select
                  value={formData.categoriesKids}
                  onChange={(e) => setFormData({ ...formData, categoriesKids: e.target.value })}
                  required
                  label="Categories"
                >
                  <MenuItem value="Boys">Boys</MenuItem>
                  <MenuItem value="Girls">Girls</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                </Select>
              </FormControl>
            )}
            {/* {editingProduct && ( */}
            <FormControl fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }}>
              <InputLabel>Stock Status</InputLabel>
              <Select
                value={formData.stockStatus}
                onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                required
                label="Stock Status"
              >
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Out-of-stock">Out-of-stock</MenuItem>
                <MenuItem value="Getting Ready">Getting Ready</MenuItem>
              </Select>
            </FormControl>
            {/* )} */}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {(formData.stockStatus === 'In Stock') && (
              <TextField
                label="Total Stock Count" required
                type="number"
                fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }}
                value={formData.totalStock}
                // onChange={(e) => setFormData({ ...formData, peopleCount: e.target.value })} required
                onChange={(e) => {
                  let value = e.target.value;

                  // Remove any non-numeric characters except empty string (allow backspacing)
                  value = value.replace(/[^0-9]/g, '');

                  // Convert to a number if it's not empty
                  if (value === '' || (Number(value) <= 10000)) {
                    setFormData({ ...formData, totalStock: value });
                  }
                }}
                inputProps={{ min: 1, max: 10000, step: 1 }} // Ensures only valid whole numbers
              />
            )}
            <TextField
              label="Delivey Days"
              type="number"
              fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem', } }}
              value={formData.deliveryDays}
              // onChange={(e) => setFormData({ ...formData, serviceDays: e.target.value })}
              required
              onChange={(e) => {
                let value = e.target.value;

                // Remove any non-numeric characters except empty string (allow backspacing)
                value = value.replace(/[^0-9]/g, '');

                // Convert to a number if it's not empty
                if (value === '' || (Number(value) <= 30)) {
                  setFormData({ ...formData, deliveryDays: value });
                }
              }}
              inputProps={{ min: 1, max: 30, step: 1 }} // Ensures only valid whole numbers
            />
          </div>

          <TextField
            label="Description"
            multiline
            rows={6}
            fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' }, '& .MuiInputBase-input': { scrollbarWidth: 'thin' } }}
            value={formData.description}
            // onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            onChange={(e) => {
              const maxLength = 2000; // Set character limit
              if (e.target.value.length <= maxLength) {
                setFormData({ ...formData, description: e.target.value });
              }
            }}
            inputProps={{ maxLength: 2000 }} // Ensures no more than 100 characters can be typed
            required
          />


        </DialogContent>
        {submitError && <Alert severity="error" style={{ margin: '1rem' }}>{submitError}</Alert>}
        <DialogActions sx={{ margin: '2rem', gap: '1rem' }}>
          <Button onClick={handleCloseDialog} disabled={loading} variant='text' color='warning' sx={{ borderRadius: '8px' }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            style={loading ? { cursor: 'wait' } : {}} sx={{ borderRadius: '0.5rem' }}
          >
            {loading ? <> <CircularProgress size={20} sx={{ marginRight: '8px' }} /> {editingProduct ? 'Updating...' : 'Adding...'} </> : (editingProduct ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
      </form>

    </Dialog>
  );
};

export default PostProduct;
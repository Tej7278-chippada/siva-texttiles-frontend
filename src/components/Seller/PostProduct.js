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
  Alert, alpha,
  CircularProgress,
  Chip,
  Grid,
  Avatar,
  // Divider,
  Tooltip,
  InputAdornment,
  Collapse,
  IconButton as MuiIconButton,
  Paper,
  // Stack,
} from '@mui/material';
import { Close as CloseIcon, Edit, } from '@mui/icons-material';
import {
  // Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { addProduct, updateProduct } from '../Apis/SellerApis';
import { ChromePicker } from 'react-color';

// Add these constants at the top of the file
const AVAILABLE_SIZES = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL', 'Free Size'
];

// Add ColorVariantForm component inside PostProduct.js
const ColorVariantForm = ({ variants, setVariants, removedVariants, setRemovedVariants  }) => {
  const [expanded, setExpanded] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3f51b5');
  const [editingIndex, setEditingIndex] = useState(null);
  const [tempColor, setTempColor] = useState(null);
  // const [removedVariants, setRemovedVariants] = useState([]);

  const handleAddVariant = () => {
    const newVariant = {
      colorName: `Color ${variants.length + 1}`,
      colorCode: currentColor,
      images: [],
      sizes: AVAILABLE_SIZES.map(size => ({
        size,
        count: 0
      }))
    };
    
    if (editingIndex !== null) {
      const updated = [...variants];
      updated[editingIndex] = {
        ...updated[editingIndex],
        colorCode: currentColor,
        colorName: tempColor?.name || updated[editingIndex].colorName
      };
      setVariants(updated);
      setEditingIndex(null);
      setTempColor(null);
    } else {
      setVariants([...variants, newVariant]);
    }
    setColorPickerOpen(false);
  };

  const handleEditColor = (index, variant) => {
    setCurrentColor(variant.colorCode);
    setTempColor({
      name: variant.colorName,
      code: variant.colorCode
    });
    setEditingIndex(index);
    setColorPickerOpen(true);
  };

  const handleRemoveVariant = (index) => {
    const variantToRemove = variants[index];
    // If this variant has an _id (meaning it existed in the database)
    if (variantToRemove._id) {
      setRemovedVariants([...removedVariants, variantToRemove._id]);
    }
    const updated = variants.filter((_, i) => i !== index);
    setVariants(updated);
  };

  const handleSizeCountChange = (colorIndex, sizeIndex, value) => {
    const updated = [...variants];
    updated[colorIndex].sizes[sizeIndex].count = parseInt(value) || 0;
    setVariants(updated);
  };

  const handleColorNameChange = (index, name) => {
    const updated = [...variants];
    updated[index].colorName = name;
    setVariants(updated);
  };

  const handleUndoRemoveVariant = (variantId) => {
    setRemovedVariants(removedVariants.filter(id => id !== variantId));
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Color Variants & Sizes</Typography>
        <MuiIconButton
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-label="show more"
          size="small"
        >
          <ExpandMoreIcon style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
        </MuiIconButton>
      </Box>
      
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2 }}>
          {variants.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {variants.map((variant, colorIndex) => (
                <Box key={variant._id || colorIndex} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1, position: 'relative', opacity: removedVariants.includes(variant._id) ? 0.6 : 1 }}>
                  {removedVariants.includes(variant._id) && (
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Chip label="Will be removed" color="error" />
                    </Box>
                  )}

                  {/* Add this button to the variant display: */}
                  {removedVariants.includes(variant._id) && (
                    <Button
                      size="small"
                      color="success"
                      onClick={() => handleUndoRemoveVariant(variant._id)}
                      sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                    >
                      Undo
                    </Button>
                  )}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip title="Click to change color">
                        <Avatar 
                          sx={{ 
                            bgcolor: variant.colorCode, 
                            width: 34, 
                            height: 34,
                            cursor: 'pointer'
                          }}
                          onClick={() => handleEditColor(colorIndex, variant)}
                        />
                      </Tooltip>
                      <TextField
                        size="small"
                        value={variant.colorName}
                        onChange={(e) => handleColorNameChange(colorIndex, e.target.value)}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                    <Box sx={{display: 'flex', ml: 1, gap: 1}}>
                      <IconButton
                        size="small"
                        color="info"
                        // startIcon={<Edit />}
                        onClick={() => handleEditColor(colorIndex, variant)}
                      >
                        {/* Remove */}
                        <Edit/>
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        // startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveVariant(colorIndex)}
                      >
                        {/* Remove */}
                        <DeleteIcon/>
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>Size Availability:</Typography>
                  <Grid container spacing={1}>
                    {variant.sizes.map((sizeItem, sizeIndex) => (
                      <Grid item xs={4} sm={3} md={2} key={sizeIndex}>
                        <TextField
                          label={sizeItem.size}
                          type="number"
                          size="small"
                          fullWidth
                          value={sizeItem.count}
                          onChange={(e) => handleSizeCountChange(colorIndex, sizeIndex, e.target.value)}
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {/* <Typography variant="caption">{sizeItem.size}</Typography> */}
                              </InputAdornment>
                            ),
                          }}
                          sx={{borderRadius: '12px'}}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<PaletteIcon />}
              onClick={() => {
                setEditingIndex(null);
                setCurrentColor('#3f51b5');
                setColorPickerOpen(true);
              }}
              sx={{borderRadius: '12px'}}
            >
              Add Color Variant
            </Button>
            
            {colorPickerOpen && (
              <Box sx={{ position: 'absolute', zIndex: 10 }}>
                <Box sx={{ 
                  position: 'absolute', 
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <ChromePicker
                    color={currentColor}
                    onChangeComplete={(color) => setCurrentColor(color.hex)}
                  />
                  {/* {editingIndex !== null && (
                    <TextField
                      size="small"
                      label="Color Name"
                      value={tempColor?.name || ''}
                      onChange={(e) => setTempColor({
                        ...tempColor,
                        name: e.target.value
                      })}
                      sx={{ backgroundColor: 'white' }}
                    />
                  )} */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setColorPickerOpen(false);
                        setEditingIndex(null);
                        setTempColor(null);
                      }}
                      sx={{ flex: 1, borderRadius: '12px' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddVariant}
                      sx={{ flex: 1, borderRadius: '12px' }}
                    >
                      {editingIndex !== null ? 'Update Color' : 'Add Color'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};


const PostProduct = ({ openDialog, onCloseDialog, theme, isMobile, fetchPostsData, /* generatedImages, loadingGeneration,
  noImagesFound, */ newMedia, setNewMedia, editingProduct, /* formData, setFormData, */
  // selectedDate, setSelectedDate,
  mediaError, setMediaError,
  // timeFrom, setTimeFrom, timeTo, setTimeTo, 
  existingMedia, setExistingMedia, /* fetchUnsplashImages, */ loadingMedia, loading, setLoading,
  setSnackbar, setSubmitError, submitError, onProductSuccess 
  //   protectLocation, setProtectLocation, fakeAddress, setFakeAddress, activeStep, setActiveStep,
  //   darkMode, validationErrors, setValidationErrors,
}) => {
  const [variants, setVariants] = useState([]);
  const [removedVariants, setRemovedVariants] = useState([]);
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
      setVariants(editingProduct.variants || []);
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
      setVariants([]);
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

    // Add removed variants information
    if (removedVariants.length > 0) {
      data.append('removedVariants', JSON.stringify(removedVariants));
    }

    // Include variants data
    if (variants.length > 0) {
      data.append('variants', JSON.stringify(variants));
    }

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
      setVariants([]);
      setRemovedVariants([]);
      setExistingMedia([]);
      setNewMedia([]);
      // Call the success callback if provided
      if (onProductSuccess) {
        onProductSuccess();
      }
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
        <DialogTitle sx={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>{editingProduct ? "Edit Product" : "Add Product"}
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
                label="Gender"
              >
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                {/* <MenuItem value="Kids">Kids</MenuItem> */}
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
                  <MenuItem value="Uppada Pattu">Uppada Pattu</MenuItem>
                  <MenuItem value="Kuppadam Sarees">Kuppadam Sarees</MenuItem>
                  <MenuItem value="Kanchi Pattu">Kanchi Pattu</MenuItem>
                  <MenuItem value="Mangalagiri Pattu">Mangalagiri Pattu</MenuItem>
                  <MenuItem value="Silk Sarees">Silk Sarees</MenuItem>
                  <MenuItem value="Wedding Sarees">Wedding Sarees</MenuItem>
                  <MenuItem value="Banarasi Sarees">Banarasi Sarees</MenuItem>
                  <MenuItem value="Chanderi Sarees">Chanderi Sarees</MenuItem>
                  <MenuItem value="Cotton Sarees">Cotton Sarees</MenuItem>
                  <MenuItem value="Printed Sarees">Printed Sarees</MenuItem>
                  <MenuItem value="Party Wear Sarees">Party Wear Sarees</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
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
                  <MenuItem value="Round Neck T-Shirt (Half Sleeves)">Round Neck T-Shirt (Half Sleeves)</MenuItem>
                  <MenuItem value="Round Neck T-Shirt (Full Sleeves)">Round Neck T-Shirt (Full Sleeves)</MenuItem>
                  <MenuItem value="Collar T-Shirt (Half Sleeves)">Collar T-Shirt (Half Sleeves)</MenuItem>
                  <MenuItem value="Collar T-Shirt (Full Sleeves)">Collar T-Shirt (Full Sleeves)</MenuItem>
                  <MenuItem value="Sports Jacket">Sports Jacket</MenuItem>
                  <MenuItem value="Track Pants">Track Pants</MenuItem>
                  <MenuItem value="Shorts">Shorts</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            )}
            {/* {(formData.gender === 'Kids') && (
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
            )} */}
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

          <div>
            <ColorVariantForm variants={variants} setVariants={setVariants} removedVariants={removedVariants} setRemovedVariants={setRemovedVariants} />
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
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto', display: 'block' }}>
            {formData.description.length}/2000 characters
          </Typography>


        </DialogContent>
        {submitError && <Alert severity="error" style={{ margin: '1rem' }}>{submitError}</Alert>}
        <DialogActions sx={{ margin: '2rem', gap: '1rem', borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleCloseDialog} disabled={loading} variant='text' color='warning' sx={{ borderRadius: '8px' }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            // color="primary"
            disabled={loading}
            style={loading ? { cursor: 'wait' } : {}}
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
              // textTransform: 'none',
              fontWeight: 'medium',
              '&:hover': {
                background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(67, 97, 238, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {loading ? <> <CircularProgress size={20} sx={{ marginRight: '8px' }} /> {editingProduct ? 'Updating...' : 'Adding...'} </> : (editingProduct ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
      </form>

    </Dialog>
  );
};

export default PostProduct;
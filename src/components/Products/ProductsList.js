import React from "react";
import Layout from "../Layout/Layout";
// import SkeletonProductDetail from "../Layout/SkeletonProductDetail";
import { 
    Box, Button,
    Typography, 
    // Card, 
    // CardContent,
     useMediaQuery,
} from '@mui/material';
// import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import { useNavigate } from "react-router-dom";
import { useTheme } from '@emotion/react';
// import ProductsPage from "./ProductsPage";

const ProductsList = ({darkMode, toggleDarkMode, unreadCount, shouldAnimate}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    return (
        <Layout>
            {/* Demo Posts Banner Section */}
            <Box sx={{
                // Refined gradient with better color harmony
                background: isMobile 
                    ? 'linear-gradient(310deg, rgb(245, 191, 47) 0%, rgb(184, 134, 11) 40%, rgb(166, 130, 39) 70%, rgba(255,255,255,0.05) 100%)' 
                    : 'linear-gradient(310deg, rgb(247, 203, 59) 0%, rgb(191, 142, 15) 35%, rgb(156, 114, 10) 65%, rgba(255,255,255,0.08) 100%)',
                
                // Improved text color for better readability
                color: '#ffffff',
                
                // Responsive padding with better proportions
                padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
                paddingTop: '6rem',
                
                textAlign: 'center',
                borderRadius: '0 0 20px 20px',
                marginTop: -8,
                
                // Enhanced shadow with warmer tones
                boxShadow: '0 6px 30px rgba(184, 134, 11, 0.25), 0 2px 12px rgba(0,0,0,0.1)',
                
                position: 'relative',
                overflow: 'hidden',
                
                // Refined glass effect overlay
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: [
                        'radial-gradient(circle at 75% 25%, rgba(255,255,255,0.15) 0%, transparent 60%)',
                        'radial-gradient(circle at 25% 75%, rgba(255,248,220,0.08) 0%, transparent 50%)',
                        'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
                    ].join(', '),
                    backdropFilter: 'blur(1px)',
                    zIndex: 0
                },
                
                // Subtle texture overlay
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3Ccircle cx="53" cy="53" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    zIndex: 1
                }
            }}>
                <Typography 
                    variant={isMobile ? 'h5' : 'h4'} 
                    component="h1" 
                    sx={{
                        fontWeight: 700,
                        marginBottom: 1.5,
                        position: 'relative',
                        zIndex: 2,
                        
                        // Enhanced text shadow for better depth
                        textShadow: [
                            '0 2px 4px rgba(0,0,0,0.3)',
                            '0 1px 2px rgba(139,101,8,0.4)'
                        ].join(', '),
                        
                        // Subtle text glow
                        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.1))',
                        
                        // Better letter spacing
                        letterSpacing: '-0.02em'
                    }}
                >
                    Welcome to Siva Textiles!
                </Typography>
                
                <Typography 
                    variant={isMobile ? 'body1' : 'h6'} 
                    sx={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 2,
                        
                        // Improved opacity for better readability
                        opacity: 0.95,
                        lineHeight: 1.7,
                        
                        // Subtle text shadow
                        textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        
                        // Better font weight for hierarchy
                        fontWeight: isMobile ? 400 : 500,
                        
                        // Refined letter spacing
                        letterSpacing: '0.01em'
                    }}
                >
                    Discover the finest collection of Handloom Sarees & authentic traditional wear crafted with love and heritage
                </Typography>
            </Box>
            <Box sx={{display: 'flow', m: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                    <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{
                            background: 'linear-gradient(135deg, #4361ee 0%, #3f37c9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text', m:'6px'
                        }}
                    >
                        Products List
                    </Typography>
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
                        e.stopPropagation(); navigate('/sellerProducts');
                        // Handle view
                        }}
                    >
                        Seller Page
                    </Button>
                </Box>
                {/* Coming Soon Section */}
            {/* <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(25, 118, 210, 0.05) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(25, 118, 210, 0.2)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)'
            }}>
                <CardContent sx={{ 
                    textAlign: 'center', 
                    // p: isMobile ? 2 : 3
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mb: 1.5 
                    }}>
                        <LocalMallRoundedIcon sx={{ 
                            color: 'primary.main', 
                            fontSize: '2rem' 
                        }} />
                    </Box>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        mb: 1
                    }}>
                        Coming Soon
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        mb: 1
                    }}>
                        The Products List feature is currently in development and will be available soon.
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        fontStyle: 'italic'
                    }}>
                        Browse the latest and variety of Saaries on our website!
                    </Typography>
                </CardContent>
            </Card> */}
            </Box>
            {/* <ProductsPage/> */}
        </Layout>
    );
};

export default ProductsList;
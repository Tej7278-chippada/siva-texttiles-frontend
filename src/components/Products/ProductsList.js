import React from "react";
import Layout from "../Layout/Layout";
// import SkeletonProductDetail from "../Layout/SkeletonProductDetail";
import { 
    Box, Button,
    Typography, 
    Card, 
    CardContent,
} from '@mui/material';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import { useNavigate } from "react-router-dom";

const ProductsList = ({darkMode, toggleDarkMode, unreadCount, shouldAnimate}) => {

    const navigate = useNavigate();

    return (
        <Layout>
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
            <Card sx={{ 
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
            </Card>
            </Box>
        </Layout>
    );
};

export default ProductsList;
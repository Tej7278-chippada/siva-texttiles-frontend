import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Chip, Button } from '@mui/material';
import { Sparkles, ShoppingBag, Star, ArrowRight } from 'lucide-react';

const TextilesBanner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    { icon: <Sparkles size={16} />, text: "Handcrafted Quality" },
    { icon: <Star size={16} />, text: "Premium Collections" },
    { icon: <ShoppingBag size={16} />, text: "Authentic Handloom" }
  ];

  return (
    <Box sx={{
      background: `linear-gradient(135deg, 
        #2d1b69 0%, 
        #4338ca 25%, 
        #7c3aed 50%, 
        #a855f7 75%, 
        #c084fc 100%)`,
      color: 'white',
      padding: isMobile ? '2rem 1rem 3rem' : '3rem 2rem 4rem',
      pt: isMobile ? '5rem' : '6rem',
      textAlign: 'center',
      borderRadius: '0 0 24px 24px',
      mt: -8,
      boxShadow: `
        0 20px 40px rgba(67, 56, 202, 0.4),
        0 8px 24px rgba(124, 58, 237, 0.3),
        inset 0 1px 0 rgba(255,255,255,0.1)
      `,
      position: 'relative',
      overflow: 'hidden',
      transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      
      // Animated background patterns
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(168,85,247,0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(196,181,253,0.2) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      },
      
      // Floating particles effect
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(196,181,253,0.6), transparent),
          radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(168,85,247,0.4), transparent)
        `,
        backgroundSize: '150px 100px',
        animation: 'sparkle 8s linear infinite',
        zIndex: 1
      },
      
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
        '50%': { transform: 'translateY(-10px) rotate(5deg)' }
      },
      
      '@keyframes sparkle': {
        '0%': { backgroundPosition: '0 0, 0 0, 0 0, 0 0' },
        '100%': { backgroundPosition: '150px 100px, -150px 100px, 100px -100px, -100px -100px' }
      }
    }}>
      
      {/* Main Content Container */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        
        {/* Brand Badge */}
        <Chip
          label="✨ Premium Handloom Collection"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 600,
            transform: isVisible ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
              transform: 'scale(1.05)',
            }
          }}
        />

        {/* Main Heading */}
        <Typography 
          variant={isMobile ? 'h4' : 'h2'} 
          component="h1" 
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
          }}
        >
          Welcome to{' '}
          <Box component="span" sx={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-4px',
              left: '50%',
              width: '80%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
              transform: 'translateX(-50%)',
              borderRadius: '2px'
            }
          }}>
            Siva Textiles
          </Box>
        </Typography>

        {/* Subtitle */}
        <Typography 
          variant={isMobile ? 'h6' : 'h5'} 
          sx={{
            maxWidth: '700px',
            margin: '0 auto 3rem',
            opacity: 0.95,
            lineHeight: 1.6,
            fontWeight: 400,
            color: '#f1f5f9',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            // opacity: isVisible ? 0.95 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s',
          }}
        >
          Discover the finest collection of{' '}
          <Box component="span" sx={{ 
            fontWeight: 600, 
            color: '#fbbf24',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(251, 191, 36, 0.3)',
            textUnderlineOffset: '4px'
          }}>
            Handloom Sarees
          </Box>{' '}
          & authentic traditional wear crafted with love and heritage
        </Typography>

        {/* Feature Tags */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1.5, 
          justifyContent: 'center', 
          mb: 4,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s',
        }}>
          {features.map((feature, index) => (
            <Chip
              key={index}
              icon={feature.icon}
              label={feature.text}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.875rem',
                fontWeight: 500,
                py: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                }
              }}
            />
          ))}
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowRight size={20} />}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            borderRadius: '50px',
            textTransform: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
              transform: 'translateY(-3px) scale(1.05)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.5)',
            },
            '&:active': {
              transform: 'translateY(-1px) scale(1.02)'
            }
          }}
        >
          Explore Collections
        </Button>

        {/* Stats Row */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: isMobile ? 2 : 4, 
          mt: 4,
          flexWrap: 'wrap',
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.7s',
        }}>
          {[
            { number: '500+', label: 'Unique Designs' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '25+', label: 'Years Heritage' }
          ].map((stat, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#fbbf24',
                fontSize: isMobile ? '1.25rem' : '1.5rem'
              }}>
                {stat.number}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.875rem'
              }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TextilesBanner;
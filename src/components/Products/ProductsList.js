import React from "react";
import Layout from "../Layout/Layout";
import SkeletonProductDetail from "../Layout/SkeletonProductDetail";
import { Box } from "@mui/material";

const ProductsList = ({darkMode, toggleDarkMode, unreadCount, shouldAnimate}) => {

    return (
        <Layout>
            <Box sx={{display: 'flow'}}>
                <h1>Products List</h1>
                <SkeletonProductDetail/>
            </Box>
        </Layout>
    );
};

export default ProductsList;
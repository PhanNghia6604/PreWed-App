import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { People, Event, Star } from "@mui/icons-material";
import styles from "./ExpertDashboard.module.css";  // Import CSS Module

const ExpertDashboard = () => {
    // Dữ liệu giả lập - có thể lấy từ API
    const statistics = {
        totalAppointments: 25,
        totalClients: 15,
        averageRating: 4.8,
    };

    return (
        <div className={styles.dashboardContainer}>
            <Typography variant="h4" className={styles.dashboardTitle}>
                Thống kê tổng quan
            </Typography>

            <Grid container spacing={3}>
                {/* Tổng số buổi tư vấn */}
                <Grid item xs={12} md={4}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Event fontSize="large" color="primary" />
                            <Typography variant="h5">{statistics.totalAppointments}</Typography>
                            <Typography variant="subtitle1">Buổi tư vấn</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tổng số khách hàng */}
                <Grid item xs={12} md={4}>
                    <Card className={styles.card}>
                        <CardContent>
                            <People fontSize="large" color="primary" />
                            <Typography variant="h5">{statistics.totalClients}</Typography>
                            <Typography variant="subtitle1">Khách hàng</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Đánh giá trung bình */}
                <Grid item xs={12} md={4}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Star fontSize="large" color="primary" />
                            <Typography variant="h5">{statistics.averageRating} / 5</Typography>
                            <Typography variant="subtitle1">Đánh giá trung bình</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ExpertDashboard;

import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Divider, Skeleton, Box } from "@mui/material";
import { People, Event, Star } from "@mui/icons-material";
import styles from "./ExpertDashboard.module.css";

const ExpertDashboard = () => {
    const storedExperts = JSON.parse(localStorage.getItem("experts")) || [];
    const loggedInExpertUsername = localStorage.getItem("currentExpert");
    
    const loggedInExpert = storedExperts.find(expert => expert.username === loggedInExpertUsername);
    const expertId = loggedInExpert?.id || localStorage.getItem("id");

    const [stats, setStats] = useState({
        totalAppointments: 0,
        totalClients: 0,
        averageRating: null,  // Để tránh hiển thị "0 / 5" nếu chưa có đánh giá
    });
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm lấy tất cả lịch hẹn từ localStorage
    const getAllBookings = () => {
        return Object.keys(localStorage)
            .filter(key => key.startsWith("bookings_"))
            .flatMap(key => JSON.parse(localStorage.getItem(key)) || []);
    };

    useEffect(() => {
        if (!expertId) {
            console.error("Expert ID is not available!");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const storedBookings = getAllBookings();
            const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
            

            // Lọc lịch hẹn đã hoàn thành
            const expertAppointments = storedBookings.filter(
                booking => String(booking.expertId) === String(expertId) && booking.status === "Đã hoàn thành"
            );
            const totalAppointments = expertAppointments.length;
            const uniqueClients = new Set(expertAppointments.map(booking => booking.userName)).size;

            // Lọc đánh giá của chuyên gia
            const expertFeedbacks = storedFeedbacks.filter(feedback =>
                String(feedback.expertId) === String(expertId)
            );

            // Tính điểm trung bình rating
            const totalRatings = expertFeedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
            const ratingCount = expertFeedbacks.length;
            const averageRating = ratingCount ? (totalRatings / ratingCount).toFixed(1) : null;

            setStats({ totalAppointments, totalClients: uniqueClients, averageRating });
            setFeedbacks(expertFeedbacks);
            setLoading(false);
        }, 1000);
    }, [expertId]);

    return (
        <div className={styles.dashboardContainer}>
            <Typography variant="h4" className={styles.dashboardTitle}>
                📊 Thống kê tổng quan
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Event fontSize="large" color="primary" />
                            <Typography variant="h5">
                                {loading ? <Skeleton width={40} /> : stats.totalAppointments}
                            </Typography>
                            <Typography variant="subtitle1">Buổi tư vấn</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className={styles.card}>
                        <CardContent>
                            <People fontSize="large" color="primary" />
                            <Typography variant="h5">
                                {loading ? <Skeleton width={40} /> : stats.totalClients}
                            </Typography>
                            <Typography variant="subtitle1">Khách hàng</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card className={styles.card}>
                        <CardContent>
                            <Star fontSize="large" color="primary" />
                            <Typography variant="h5">
                                {loading ? <Skeleton width={60} /> : (stats.averageRating ? `${stats.averageRating} / 5` : "Chưa có đánh giá")}
                            </Typography>
                            <Typography variant="subtitle1">Đánh giá trung bình</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h5" className={styles.feedbackTitle} style={{ marginTop: "20px" }}>
                ⭐ Đánh giá từ khách hàng
            </Typography>

            {loading ? (
                <Skeleton variant="rectangular" width="100%" height={100} />
            ) : feedbacks.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                    Chưa có đánh giá nào.
                </Typography>
            ) : (
                feedbacks.map((feedback, index) => (
                    <Card key={index} className={styles.feedbackCard}>
                        <CardContent>
                            <Box display="flex" alignItems="center">
                                <Star color="primary" />
                                <Typography variant="h6" style={{ marginLeft: "8px" }}>
                                    {feedback.rating ? `${feedback.rating} / 5` : "Chưa có đánh giá sao"}
                                </Typography>
                            </Box>
                            <Typography variant="subtitle1">
                                <b>{feedback.user}</b> - {feedback.date}
                            </Typography>
                            <Divider style={{ margin: "10px 0" }} />
                            <Typography variant="body1">{feedback.comment}</Typography>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};

export default ExpertDashboard;

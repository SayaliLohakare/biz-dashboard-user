"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../../constant/api";
import Layout from "../../components/Layout";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        if (!userId) {
          setError("Invalid token: user ID missing");
          setLoading(false);
          return;
        }

        const { data } = await axios.post(
          `${apiUrl}/myorders`,
          { userId },
          {
            withCredentials:true
          }
        );

        const flattened = [];
        data.orders?.forEach((order) => {
          order.line_items?.forEach((item) => {
            const leadsMeta = item.meta_data?.find(
              (meta) => meta.key === "purchase_leads"
            );
            const purchaseLeads = leadsMeta ? leadsMeta.display_value : "-";

            flattened.push({
              order_id: order.order_id,
              date: order.createdAt,
              status: order.status,
              total: order.total,
              product_name: item.name,
              quantity: item.quantity,
              product_total: item.total,
              purchaseLeads,
              product_id: item.product_id,
            });
          });
        });

        setOrders(flattened);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProductClick = (productId, productName) => {
    router.push(
      `/orders/dataset?productId=${productId}&name=${encodeURIComponent(
        productName
      )}`
    );
  };

  return (
    <Layout>
      {loading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: { xs: 1, sm: 2, md: 3 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h4" color="black" gutterBottom>
            My Orders
          </Typography>

          {/* Horizontal scroll wrapper */}
          <Box sx={{ overflowX: "auto !important" }}>
            <TableContainer
              component={Paper}
             sx={{
  border: "1px solid #ccc",
  maxHeight: "720px", // Vertical scroll for >7 rows
  overflowX: "auto",
  "&::-webkit-scrollbar": {
    width: "4px",   // vertical scrollbar thickness
    height: "4px",  // horizontal scrollbar thickness
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#2ea3f2",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
  },
}}

            >
              <Table stickyHeader sx={{ tableLayout: "auto", minWidth: 750 }} aria-label="orders table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#2ea3f2", color: "white", whiteSpace: "nowrap" }}>
                      Sr. No.
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2ea3f2", color: "white", whiteSpace: "nowrap" }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2ea3f2", color: "white", whiteSpace: "nowrap" }}>
                      Purchased Leads
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2ea3f2", color: "white", whiteSpace: "nowrap" }}>
                      Product Total
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#2ea3f2", color: "white", whiteSpace: "nowrap" }}>
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((row, index) => (
                      <TableRow key={`${row.order_id}-${index}`}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <MuiLink
                            component="button"
                            underline="hover"
                            color="primary"
                            onClick={() => handleProductClick(row.product_id, row.product_name)}
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {row.product_name}
                          </MuiLink>
                        </TableCell>
                        <TableCell>{row.purchaseLeads}</TableCell>
                        <TableCell>{`$${row.product_total}`}</TableCell>
                        <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : "-"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
    </Layout>
  );
}

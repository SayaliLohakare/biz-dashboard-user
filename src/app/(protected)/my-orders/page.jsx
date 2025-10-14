"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
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
import {apiUrl}  from '../../../../constant/api';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfoCookie = Cookies.get("userinfo");
        if (!userInfoCookie) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userInfoCookie);

        const { data } = await axios.post(
          `${apiUrl}/myorders`,
          { userId: user.id },
          { withCredentials: true }
        );

        // Flatten orders: one row per line_item
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
              product_id: item.product_id, // ✅ make sure backend returns this
            });
          });
        });

        setOrders(flattened);
      } catch (err) {
        // console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleProductClick = (productId, productName) => {
    // ✅ Store productId in cookie for data details page
    const productData = {
      id: productId,
      name: productName
    };
    Cookies.set("selectedProduct", JSON.stringify(productData), { expires: 1 }); // 1 day expiry
    router.push("/my-orders/dataset");
  };

  if (loading)
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Typography >{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Purchased Leads</TableCell>
              <TableCell>Product Total</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row, index) => (
              <TableRow key={`${row.order_id}-${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <MuiLink
                    component="button"
                    underline="hover"
                    color="primary"
                    onClick={() => handleProductClick(row.product_id,row.product_name)}
                  >
                    {row.product_name}
                  </MuiLink>
                </TableCell>
                <TableCell>{row.purchaseLeads}</TableCell>
                <TableCell>{`$${row.product_total}`}</TableCell>
                <TableCell>
                  {row.date
                    ? new Date(row.date).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

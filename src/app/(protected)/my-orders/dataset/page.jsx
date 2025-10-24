"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  CircularProgress,
  Collapse,
  Box,
  IconButton,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { apiUrl } from "../../../../constant/api";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState({}); // track expanded rows

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/all-orders`, { withCredentials: true });
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        All Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Sr No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => {
            const lineItems = Array.isArray(order.line_items)
              ? order.line_items
              : JSON.parse(order.line_items || "[]");

            return (
              <React.Fragment key={order.id}>
                {/* Main order row */}
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        setOpenRows((prev) => ({ ...prev, [order.id]: !prev[order.id] }))
                      }
                    >
                      {openRows[order.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.customer_email}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>

                {/* Sub-rows for products */}
                <TableRow>
                  <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={openRows[order.id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="subtitle2">Products</Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Product Name</TableCell>
                              <TableCell>Price</TableCell>
                              <TableCell>Lead Count</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {lineItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>
                                  {item.meta_data?.find((m) => m.key === "purchase_leads")?.value ||
                                    "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;

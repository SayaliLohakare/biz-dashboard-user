"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Pagination,
  Stack,
  Tooltip,
  Checkbox,
  Button,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "../../../../../constant/api";

const columns = [
  { field: "sr", headerName: "Sr No" },
  { field: "first_name", headerName: "First Name" },
  { field: "last_name", headerName: "Last Name" },
  { field: "email", headerName: "Email" },
  { field: "company_name", headerName: "Company" },
  { field: "title", headerName: "Title" },
  { field: "company_website", headerName: "Website" },
  { field: "company_linkedin_url", headerName: "LinkedIn" },
];

export default function DataTable() {
  const [data, setData] = useState([]);
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [userId, setUserId] = useState(null);
  const [productId, setProductId] = useState(null);

  const handleChange = (event, value) => setPage(value);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const userInfoCookie = Cookies.get("userinfo");
      const storedProduct = Cookies.get("selectedProduct");

      if (!userInfoCookie || !storedProduct) {
        setError("Missing user or product information");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userInfoCookie);
      const product = JSON.parse(storedProduct);

      setUserId(user.id);
      setProductId(product.id);
      setProductName(product.name);

      const res = await axios.post(
        `${apiUrl}/user-purchased-data`,
        { userId: user.id, productId: product.id, page },
        { withCredentials: true }
      );

      setData(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Data fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!userId || !productId) return;
    setExportLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/export`,
        { userId, productId },
        {withCredentials: true,},
        { responseType: "blob" }
      );
      console.log("Export response:", response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${productName || "PurchasedList"}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSelectRow = (row) => {
    const exists = selectedRows.find((r) => r.id === row.id);
    setSelectedRows(
      exists
        ? selectedRows.filter((r) => r.id !== row.id)
        : [...selectedRows, row]
    );
  };

  const isSelected = (row) => selectedRows.some((r) => r.id === row.id);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Header: Title + Export Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {productName || "Purchased List"}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={exportLoading}
        >
          {exportLoading ? "Exporting..." : "Export"}
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: 3 }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ background: "#1976d2" }}>
                {/* <TableCell sx={{ color: "white", fontWeight: "bold" }} /> */}
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      backgroundColor: "#1976d2",
                    }}
                  >
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    align="center"
                    sx={{ color: "red" }}
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <Typography>No data found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, idx) => (
                  <TableRow key={row.id || idx} hover>
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(row)}
                        onChange={() => handleSelectRow(row)}
                      />
                    </TableCell> */}
                    {columns.map((col) => (
                      <TableCell
                        key={col.field}
                        sx={{
                          maxWidth: 150,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        <Tooltip
                          title={row[col.field] ?? "-"}
                          placement="top"
                          arrow
                        >
                          <span>
                            {col.field === "sr"
                              ? (page - 1) * 10 + idx + 1
                              : row[col.field] ?? "-"}
                          </span>
                        </Tooltip>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          color="primary"
          shape="rounded"
          variant="outlined"
          size="medium"
        />
      </Stack>
    </Box>
  );
}

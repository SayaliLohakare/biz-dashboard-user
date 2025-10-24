"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
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
import { useSearchParams, useRouter } from "next/navigation";
import { apiUrl } from "../../../../constant/api";
import Layout from '@/components/Layout';

export default function DatasetPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = searchParams.get("productId");
  const productName = searchParams.get("name");

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/v1/user-purchased-data`,
        {productId, page: 1, limit: 10 },
        {
          withCredentials: true, // fixed syntax
        }
      );

      // Flatten API data to match table
      const flattened = (response.data.data || []).map((row, index) => ({
        id: row.id || index,
        first_name: row.first_name || "-",
        last_name: row.last_name || "-",
        email: row.email || "-",
        company_name: row.company_name || "-",
        title: row.title || "-",
        company_website: row.company_website || "-",
        company_linkedin_url: row.company_linkedin_url || "-",
      }));

      setData(flattened);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (productId) {
    fetchData();
  } else {
    setError("Product ID missing in URL");
    setLoading(false);
  }
}, [productId]);


  const handleBack = () => {
    router.back();
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
          <Box mt={2}>
            <MuiLink component="button" onClick={handleBack} underline="hover">
              Go Back
            </MuiLink>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" color="black" gutterBottom>
            Dataset for {productName || "Product"}
          </Typography>

          <Box sx={{ overflowX: "auto !important" }}>
           <TableContainer
  component={Paper}
  sx={{
    border: "1px solid #ccc",
    maxHeight: "520px",
    overflowX: "auto",
    "&::-webkit-scrollbar": { width: "4px", height: "4px" }, // thinner scrollbar
    "&::-webkit-scrollbar-thumb": { backgroundColor: "#2ea3f2", borderRadius: "8px" },
    "&::-webkit-scrollbar-track": { backgroundColor: "#f1f1f1" },
  }}
>

              <Table stickyHeader sx={{ tableLayout: "auto", minWidth: 750 }} aria-label="dataset table">
                <TableHead>
                  <TableRow>
                    {["Sr. No.", "First Name", "Last Name", "Email", "Company", "Title", "Website", "LinkedIn"].map(
                      (header) => (
                        <TableCell
                          key={header}
                          sx={{ backgroundColor: "#2ea3f2", color: "white", whiteSpace: "nowrap" }}
                        >
                          {header}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.length > 0 ? (
                    data.map((row, index) => (
                      <TableRow key={row.id || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.first_name}</TableCell>
                        <TableCell>{row.last_name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.company_name}</TableCell>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>
                          {row.company_website !== "-" ? (
                            <MuiLink href={row.company_website} target="_blank" rel="noopener">
                              {row.company_website}
                            </MuiLink>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {row.company_linkedin_url !== "-" ? (
                            <MuiLink href={row.company_linkedin_url} target="_blank" rel="noopener">
                              LinkedIn
                            </MuiLink>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No data found.
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

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Container } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
const LoginPage = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
const PASSWORD = import.meta.env.VITE_REACT_APP_ACCSESS_TO_TABLE_PAGE
  const handleLogin = (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    // Replace 'YOUR_PASSWORD' with your actual password
    if (password === PASSWORD) {
        login();
        navigate("/table");
    } else {
      alert("סיסמא שגויה. אנא נסה שוב.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Card style={{ marginTop: "50px" }}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center">
            התחברות
          </Typography>
          <form onSubmit={handleLogin} style={{ textAlign: "center", marginTop: "20px" }}>
            <TextField
              label="נא הזן סיסמא"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
            />
            <Button type="submit" variant="contained" color="primary">
              התחבר
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;

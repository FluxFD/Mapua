// LoginPage.js
import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import Toastify from "../components/Toastify";
import { auth } from "../services/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../index.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (email === "test@gmail.com") {
        toast.success("Logged in successfully");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Admin Permission Needed");
    }
  };

  return (
    <div className="login-bg">
      <Container className="centered">
        <Card className="glass-morphism py-5" style={{ width: "28rem" }}>
          <Card.Body>
            <Card.Title className="text-center text-dark mb-5">
              <b> MIS Login</b>
            </Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100 mt-3">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default LoginPage;

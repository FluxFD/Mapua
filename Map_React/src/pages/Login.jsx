import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/Firebase";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const storedCredentials = localStorage.getItem("credentials");
  
  useEffect(() => {  
    if (storedCredentials !== null) {
      const { email, password } = JSON.parse(storedCredentials);
      signIn(email, password);
    }else{
      localStorage.removeItem("credentials");
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/main");
    } catch (error) {
      console.error("Authentication Error:", error.message);
      throw error; // Propagate the error to the caller
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/main");
    } catch (error) {
      console.error("Authentication Error:", error.message);
    }
  };
  

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleMessage = (event) => {
    if (event.data.type === "localStorageChange") {
      const credentials = event.data.credentials;
      localStorage.setItem("credentials", credentials);
      // Do whatever you want with the credentials
    }
  };

  return (
    <div className="login-bg">
      <Container className="centered">
        <Card className="glass-morphism py-5" style={{ width: "28rem" }}>
          <Card.Body>
            <Card.Title className="text-center text-dark mb-5">
              <Image className="" src="/logo.png" style={{ width: "40%" }} />
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

              <Button
                href="http://localhost/fingerprint/login"
                variant="link"
                type="button"
                className="w-100 mt-3"
              >
                Sign in using Fingerprint
              </Button>

              <Button variant="success" type="submit" className="w-100 mt-3">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <iframe
        src="http://localhost/fingerprint/throwcred"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default LoginPage;

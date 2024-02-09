import React, { useState } from 'react';
import { Container, Card, Form, Button, Image } from 'react-bootstrap';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/Firebase';
import { useNavigate } from 'react-router-dom';
import Logo from '../../public/logo.png';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the form from submitting normally

    try {
      // Sign in user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      
      // If successful, redirect to another page (e.g., dashboard)
      navigate('/main');
    } catch (error) {
      // Handle any authentication errors
      console.error('Authentication Error:', error.message);
      // You can also show a toast or error message to the user
    }
  };

  return (
    <div className="login-bg">
      <Container className="centered">
        <Card className="glass-morphism py-5" style={{ width: '28rem' }}>
          <Card.Body>
            <Card.Title className="text-center text-dark mb-5">
              <Image className="" src={Logo} style={{ width: '40%' }} />
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

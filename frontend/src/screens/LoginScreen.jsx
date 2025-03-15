import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

// Function for auth user
import { login } from "../services/apiUser";
// Function for saving user info
import { setCredentials } from "../slices/authSlice";

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Auth user mutation
  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      dispatch(setCredentials({ ...data }));
      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    mutation.mutate();
  }

  if (mutation.isPending) {
    return <Loader />;
  }
  return (
    <Row className="justify-content-center mt-4">
      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4 fw-bold">Sign In</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Sign In
              </Button>
            </Form>
            <Row className="mt-3">
              <Col className="text-center">
                New customer? <Link to="/register">Register</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginScreen;

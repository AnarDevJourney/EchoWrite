import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";

// Function for register user
import { createNewAccount } from "../services/apiUser";

const RegisterScreen = () => {
  const navigate = useNavigate();

  // Initializing React Hook Form
  const { register, formState, getValues, handleSubmit } = useForm();
  const { errors } = formState;

  // Register mutation
  const mutation = useMutation({
    mutationFn: createNewAccount,
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Register failed");
    },
  });

  function onSubmit({ name, email, password }) {
    mutation.mutate({ name, email, password });
  }

  if (mutation.isPending) {
    return <Loader />;
  }

  return (
    <Row className="justify-content-center mt-4">
      <Col md={6}>
        <Card className="shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4 fw-bold">Create New Account</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  {...register("name", {
                    required: "This field is required",
                  })}
                />
                {errors?.name?.message && (
                  <Message
                    variant="danger"
                    message={errors.name.message}
                    margin="mt-3"
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Please provide a valid email address",
                    },
                  })}
                />
                {errors?.email?.message && (
                  <Message
                    variant="danger"
                    message={errors.email.message}
                    margin="mt-3"
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "This field is required",
                  })}
                />
                {errors?.password?.message && (
                  <Message
                    variant="danger"
                    message={errors.password.message}
                    margin="mt-3"
                  />
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "This field is required",
                    validate: (value) =>
                      value === getValues().password ||
                      "Passwords need to match",
                  })}
                />
                {errors?.confirmPassword?.message && (
                  <Message
                    variant="danger"
                    message={errors.confirmPassword.message}
                    margin="mt-3"
                  />
                )}
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Register
              </Button>
            </Form>
            <Row className="mt-3">
              <Col className="text-center">
                Already have an account? <Link to="/login">Login</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default RegisterScreen;

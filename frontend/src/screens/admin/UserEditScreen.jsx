import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

// Functions for fetching user details and update user data
import { getUserDetails, updateUserById } from "../../services/apiUser";

const UserEditScreen = () => {
  const navigate = useNavigate();

  // Getting user id from URL
  const { id: userId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetching user details
  const {
    data: user,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["editinguser", userId],
    queryFn: () => getUserDetails(userId),
  });

  const queryClient = useQueryClient();

  // Update product mutation
  const { mutate: updateUserData, isPending: isUpdatingUserData } = useMutation(
    {
      mutationFn: updateUserById,
      onSuccess: () => {
        toast.success("User data updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["editinguser", "allusers"],
        });
        navigate("/admin/userlist");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update user data");
      },
    }
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  function handleSubmit(e) {
    e.preventDefault();
    updateUserData({
      id: user._id,
      name,
      email,
      isAdmin,
    });
  }

  if (isLoading || isUpdatingUserData) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <Row className="justify-content-center mt-4">
      <Col md={8}>
        <Card className="shadow-sm">
          <Card.Body>
            <h1 className="text-center mb-4 fw-bold">Edit User</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="isadmin" className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Is Admin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100">
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UserEditScreen;

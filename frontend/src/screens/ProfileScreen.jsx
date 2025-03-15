import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  ListGroup,
  Card,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Error from "../components/Error";

// Function for updating user data
import { updateUserProfile } from "../services/apiUser";

// Function for saving user data
import { setCredentials } from "../slices/authSlice";

// Blog API functions
import { getMyblogs, deleteBlog, updateBlog } from "../services/apiBlog";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const categories = [
    "Technology",
    "Health",
    "Lifestyle",
    "Education",
    "Business",
  ];

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedTags, setUpdatedTags] = useState("");

  // Getting userinfo from redux store
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo.name, userInfo.email, userInfo]);

  // Update profile mutation
  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: updateUserProfile,
      onSuccess: (data) => {
        dispatch(setCredentials(data));
        toast.success("Profile updated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    });

  // Fetching user's blogs
  const {
    data: myBlogs,
    error: myBlogsError,
    isError: isMyBlogsError,
    isLoading: isLoadingMyBlogs,
    refetch: myBlogsRefetch,
  } = useQuery({
    queryKey: ["myBlogs"],
    queryFn: getMyblogs,
  });

  const queryClient = useQueryClient();

  // Delete blog mutation
  const { mutate: deleteBlogMutation, isPending: isDeletingBlog } = useMutation(
    {
      mutationFn: deleteBlog,
      onSuccess: () => {
        toast.success("Blog deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["myBlogs"],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete blog");
      },
    }
  );

  // Update blog mutation
  const { mutate: updateBlogMutation, isPending: isUpdatingBlog } = useMutation(
    {
      mutationFn: updateBlog,
      onSuccess: () => {
        toast.success("Blog updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["myBlogs"],
        });
        setShowEditModal(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update blog");
      },
    }
  );

  function handleSubmit(e) {
    e.preventDefault();
    updateProfileMutation({ name, email, password });
  }

  function handleDeleteBlog(id) {
    deleteBlogMutation(id);
  }

  function handleEditBlog(blog) {
    setSelectedBlog(blog);
    setUpdatedTitle(blog.title);
    setUpdatedContent(blog.content);
    setUpdatedCategory(blog.category);
    setUpdatedTags(blog.tags.join(", "));
    setShowEditModal(true);
  }

  function handleUpdateBlog() {
    if (selectedBlog) {
      updateBlogMutation({
        id: selectedBlog._id,
        title: updatedTitle,
        content: updatedContent,
        category: updatedCategory,
        tags: updatedTags.split(",").map((tag) => tag.trim()),
      });
    }
  }

  if (
    isUpdatingProfile ||
    isLoadingMyBlogs ||
    isDeletingBlog ||
    isUpdatingBlog
  ) {
    return <Loader />;
  }

  if (isMyBlogsError) {
    return <Error message={myBlogsError.message} onRetry={myBlogsRefetch} />;
  }

  return (
    <>
      <Row>
        {/* Profile Section */}
        <Col md={3}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <h1 className="text-center mb-4 fw-bold">User Profile</h1>
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
                  <Form.Label>Email</Form.Label>
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
                  Update
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* My Blogs Section */}
        <Col md={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="text-center mb-4 fw-bold">My Blogs</h1>
              {myBlogs.length === 0 ? (
                <Alert variant="info">You have no blogs yet.</Alert>
              ) : (
                <ListGroup variant="flush">
                  {myBlogs?.map((blog) => (
                    <ListGroup.Item key={blog._id} className="mb-3">
                      <Card className="shadow-sm">
                        <Card.Body>
                          <Link
                            to={`/blog/${blog._id}`}
                            className="text-decoration-none text-dark"
                          >
                            <Card.Title className="fw-bold fs-5">
                              {blog.title}
                            </Card.Title>
                          </Link>
                          <Card.Text className="text-muted mb-2">
                            {blog.content.substring(0, 100)}...
                          </Card.Text>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className="text-muted">
                                Category: {blog.category}
                              </span>
                              <br />
                              <span className="text-muted">
                                Tags: {blog.tags.join(", ")}
                              </span>
                            </div>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="light"
                                id="dropdown-basic"
                                className="p-0"
                              ></Dropdown.Toggle>

                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => handleEditBlog(blog)}
                                >
                                  Edit
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() => handleDeleteBlog(blog._id)}
                                >
                                  Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </Card.Body>
                      </Card>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Blog Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="updatedTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="updatedContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter content"
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="updatedCategory" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={updatedCategory}
                onChange={(e) => setUpdatedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="updatedTags" className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags, separated by commas"
                value={updatedTags}
                onChange={(e) => setUpdatedTags(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateBlog}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileScreen;

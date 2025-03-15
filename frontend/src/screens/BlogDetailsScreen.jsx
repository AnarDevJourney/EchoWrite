import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  Badge,
  Row,
  Col,
  Alert,
  ListGroup,
  Form,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { toast } from "react-toastify";
import LikeComponent from "../components/LikeComponent";
import Loader from "../components/Loader";
import Error from "../components/Error";

// Function for fetching single blog by id
import { getBlogById } from "../services/apiBlog";

// Comments API functions
import {
  createComment,
  getCommentsForBlog,
  deleteComment,
  updateComment,
} from "../services/apiComment";

const BlogDetailsScreen = () => {
  // Getting blog id from URL
  const { id: blogId } = useParams();

  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  const [comment, setComment] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");

  // Fetching blog
  const {
    data: blog,
    error: blogError,
    isError: isBlogError,
    isLoading: isBlogLoading,
    refetch: blogRefetch,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: () => getBlogById(blogId),
  });

  // Fetching comments
  const {
    data: comments,
    error: commentsError,
    isError: isCommentsError,
    isLoading: isCommentsLoading,
    refetch: commentsRefetch,
  } = useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => getCommentsForBlog(blogId),
  });

  const queryClient = useQueryClient();

  // Create comment mutation
  const { mutate: createCommentMutation, isPending: isCreatingComment } =
    useMutation({
      mutationFn: () => createComment({ blogPost: blogId, content: comment }),
      onSuccess: () => {
        toast.success("Comment added successfully");
        queryClient.invalidateQueries({
          queryKey: ["comments", blogId],
        });
        setComment("");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create comment");
      },
    });

  // Delete comment mutation
  const { mutate: deleteCommentMutation, isPending: isDeletingComment } =
    useMutation({
      mutationFn: (commentId) => deleteComment(commentId),
      onSuccess: () => {
        toast.success("Comment deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["comments", blogId],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete comment");
      },
    });

  // Update comment mutation
  const { mutate: updateCommentMutation, isPending: isUpdatingComment } =
    useMutation({
      mutationFn: ({ commentId, content }) =>
        updateComment({ commentId, content }),
      onSuccess: () => {
        toast.success("Comment updated successfully");
        queryClient.invalidateQueries({
          queryKey: ["comments", blogId],
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update comment");
      },
    });

  function handleSubmitComment(e) {
    e.preventDefault();
    createCommentMutation();
  }

  function handleDeleteComment(commentId) {
    deleteCommentMutation(commentId);
  }

  function handleShowUpdateModal(comment) {
    setSelectedComment(comment);
    setUpdatedContent(comment.content);
    setShowUpdateModal(true);
  }

  function handleCloseUpdateModal() {
    setShowUpdateModal(false);
    setSelectedComment(null);
    setUpdatedContent("");
  }

  function handleUpdateComment() {
    if (selectedComment) {
      updateCommentMutation({
        commentId: selectedComment._id,
        content: updatedContent,
      });
      handleCloseUpdateModal();
    }
  }

  if (
    isBlogLoading ||
    isCommentsLoading ||
    isCreatingComment ||
    isDeletingComment ||
    isUpdatingComment
  ) {
    return <Loader />;
  }

  if (isBlogError) {
    return <Error message={blogError.message} onRetry={blogRefetch} />;
  }

  if (isCommentsError) {
    return <Error message={commentsError.message} onRetry={commentsRefetch} />;
  }

  return (
    <>
      {/* Blog Details */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="fw-bold fs-3 mb-3">
                {blog.title}
              </Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Category: {blog.category}
              </Card.Subtitle>
              <div className="mb-3">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} bg="secondary" className="me-2">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Card.Text>{blog.content}</Card.Text>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1">
                    <strong>Author:</strong> {blog.author.name}
                  </p>
                  <p className="mb-0">
                    <strong>Views:</strong> {blog.views}
                  </p>
                </div>
                <LikeComponent blogId={blogId} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Comments Section */}
      <Row>
        <Col md={8}>
          <h2 className="mb-3">Comments</h2>
          {comments.length === 0 ? (
            <Alert variant="info">No Comments</Alert>
          ) : (
            <ListGroup>
              {comments.map((comment) => (
                <ListGroup.Item
                  key={comment._id}
                  className="d-flex justify-content-between align-items-center mb-3 shadow-sm"
                >
                  <div>
                    <strong>{comment.author.name}</strong>
                    <p className="mb-1 text-muted">
                      {comment.createdAt.substring(0, 10)}
                    </p>
                    <p className="mb-0">{comment.content}</p>
                  </div>
                  {(userInfo && userInfo._id === comment.author._id) ||
                  (userInfo && userInfo.isAdmin) ? (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        id="dropdown-basic"
                        className="p-0"
                      ></Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleShowUpdateModal(comment)}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : null}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Add Comment Section */}
          <Card className="mt-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Write a Comment</h3>
              {userInfo ? (
                <Form onSubmit={handleSubmitComment}>
                  <Form.Group controlId="content" className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter your comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Form>
              ) : (
                <Alert variant="info">
                  Please <Link to="/login">Sign In</Link> to write a comment
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Update Comment Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="updatedContent" className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateComment}>
            Update Comment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogDetailsScreen;

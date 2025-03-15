import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

// API functions
import { getAllBlogs, deleteBlog, updateBlog } from "../../services/apiBlog";

const BlogListScreen = () => {
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

  // Fetching blogs
  const {
    data: blogs,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allBlogs"],
    queryFn: getAllBlogs,
  });

  const queryClient = useQueryClient();

  // Delete blog mutation
  const { mutate: deleteBlogMutation, isPending: isDeletingBlog } = useMutation(
    {
      mutationFn: deleteBlog,
      onSuccess: () => {
        toast.success("Blog deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["allBlogs"],
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
          queryKey: ["allBlogs"],
        });
        setShowEditModal(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update blog");
      },
    }
  );

  function handleDeleteBlog(id) {
    deleteBlogMutation(id);
  }

  function handleShowEditModal(blog) {
    setSelectedBlog(blog);
    setUpdatedTitle(blog.title);
    setUpdatedContent(blog.content);
    setUpdatedCategory(blog.category);
    setUpdatedTags(blog.tags.join(", "));
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
    setSelectedBlog(null);
    setUpdatedTitle("");
    setUpdatedContent("");
    setUpdatedCategory("");
    setUpdatedTags("");
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

  if (isLoading || isDeletingBlog || isUpdatingBlog) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <h1 className="mb-3 fw-bold">Blogs</h1>
      <Table striped responsive hover className="table-sm mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>TITLE</th>
            <th>CATEGORY</th>
            <th>AUTHOR</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog._id}</td>
              <td>{blog.title}</td>
              <td>{blog.category}</td>
              <td>{blog.author.name}</td>
              <td>
                <Button
                  type="button"
                  variant="secondary"
                  className="mx-1 mb-2 mb-lg-0"
                  onClick={() => handleShowEditModal(blog)}
                >
                  <FaEdit />
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="mx-1"
                  onClick={() => handleDeleteBlog(blog._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
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
          <Button variant="secondary" onClick={handleCloseEditModal}>
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

export default BlogListScreen;

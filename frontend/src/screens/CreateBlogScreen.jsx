import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

// Function for creating blog
import { createBlog } from "../services/apiBlog";

const CreateBlogScreen = () => {
  const navigate = useNavigate();

  const categories = [
    "Technology",
    "Health",
    "Lifestyle",
    "Education",
    "Business",
  ];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");

  // Create blog mutation
  const { mutate: createBlogMutation, isPending: isCreatingBlog } = useMutation(
    {
      mutationFn: () => {
        createBlog({
          title,
          content,
          category,
          tags: tags.split(",").map((tag) => tag.trim()),
        });
      },
      onSuccess: () => {
        toast.success("Blog created successfully!");
        navigate("/");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create blog");
      },
    }
  );

  function handleSubmit(e) {
    e.preventDefault();
    createBlogMutation();
  }

  if (isCreatingBlog) {
    return <Loader />;
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="mb-4 fw-bold">Create New Blog</h1>
          <Form onSubmit={handleSubmit}>
            {/* Title Field */}
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Content Field */}
            <Form.Group controlId="content" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter blog content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            {/* Category Field */}
            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Tags Field */}
            <Form.Group controlId="tags" className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags, separated by commas"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" variant="primary" disabled={isCreatingBlog}>
              {isCreatingBlog ? "Creating..." : "Create Blog"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default CreateBlogScreen;

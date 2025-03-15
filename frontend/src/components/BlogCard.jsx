import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const BlogCard = ({ blog }) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fw-bold fs-5 mb-2 blog-title">
          {blog.title}
        </Card.Title>
        <Card.Subtitle className="mb-3 text-muted">
          {blog.category}
        </Card.Subtitle>
        <Card.Text className="flex-grow-1 mb-3">
          {blog.content.substring(0, 100)}...
        </Card.Text>
        <Button
          as={Link}
          to={`/blog/${blog._id}`}
          variant="primary"
          className="align-self-start"
        >
          Read More
        </Button>
      </Card.Body>
      <Card.Footer className="bg-white border-0">
        <small className="text-muted">Views: {blog.views}</small>
      </Card.Footer>
    </Card>
  );
};

export default BlogCard;

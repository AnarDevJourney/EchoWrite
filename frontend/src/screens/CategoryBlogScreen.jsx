import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Error from "../components/Error";
import BlogCard from "../components/BlogCard";

// Function for fetching blogs by category
import { getBlogsByCategory } from "../services/apiBlog";

const CategoryBlogScreen = () => {
  // Getting category from URL
  const { category } = useParams();

  // Fetching blogs
  const {
    data: blogs,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blogsByCategory", category],
    queryFn: () => getBlogsByCategory(category),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <h1 className="mb-4 fw-bold">{category}</h1>
      <Row>
        {blogs.map((blog) => (
          <Col key={blog._id} md={6} lg={4} className="mb-4">
            <BlogCard blog={blog} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CategoryBlogScreen;

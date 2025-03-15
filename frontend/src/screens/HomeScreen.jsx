import { useQuery } from "@tanstack/react-query";
import { Row, Col } from "react-bootstrap";
import Loader from "../components/Loader";
import Error from "../components/Error";
import BlogCard from "../components/BlogCard";

// Function for fetching blogs
import { getAllBlogs } from "../services/apiBlog";

const HomeScreen = () => {
  // Fetching blogs
  const {
    data: blogs,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAllBlogs,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Error message={error.message} onRetry={refetch} />;
  }

  return (
    <>
      <h1 className="mb-4 fw-bold">Recent Posts</h1>
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

export default HomeScreen;

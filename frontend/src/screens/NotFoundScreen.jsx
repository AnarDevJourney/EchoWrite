import { Link } from "react-router-dom";
import { Button, Card, Row, Col } from "react-bootstrap";

const NotFoundScreen = () => {
  return (
    <div className="d-flex justify-content-center align-items-center custom-height">
      <Row>
        <Col>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <h1 className="display-1 fw-bold text-danger">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="text-muted mb-4">
                Oops! The page you are looking for does not exist.
              </p>
              <Link to="/">
                <Button variant="primary" size="lg">
                  Go to Home
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotFoundScreen;

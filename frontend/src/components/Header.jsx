import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { IoCreateSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import Loader from "./Loader";

// Function for logout user
import { logoutAPI } from "../services/apiUser";

// Function for removing user data from localstorage and redux store
import { logout } from "../slices/authSlice";

const Header = () => {
  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout mutation
  const mutation = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  function handleLogout() {
    mutation.mutate();
  }

  if (mutation.isPending) {
    return <Loader />;
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" className="shadow-sm">
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
            EchoWrite
          </Navbar.Brand>

          {/* Toggle Button */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navbar Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* Category Dropdown */}
              <NavDropdown title="Category" id="category" className="mx-2">
                <NavDropdown.Item as={Link} to="/blogs/category/Technology">
                  Technology
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blogs/category/Health">
                  Health
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blogs/category/Lifestyle">
                  Lifestyle
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blogs/category/Education">
                  Education
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/blogs/category/Business">
                  Business
                </NavDropdown.Item>
              </NavDropdown>

              {/* Create Blog Link */}
              <Nav.Link as={Link} to="/create-blog" className="mx-2">
                <IoCreateSharp className="me-1" />
                Create Blog
              </Nav.Link>

              {/* User Dropdown */}
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  id="username"
                  className="mx-2"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="mx-2">
                  <FaUser className="me-1" />
                  Sign In
                </Nav.Link>
              )}

              {/* Admin Dropdown */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu" className="mx-2">
                  <NavDropdown.Item as={Link} to="/admin/bloglist">
                    Blogs
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist">
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

// Function for fetching all blogs
export async function getAllBlogs() {
  try {
    const res = await fetch("/api/blogs");

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch blogs");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch blogs");
  }
}

// Function for fetching blogs by category
export async function getBlogsByCategory(category) {
  try {
    const res = await fetch(`/api/blogs/category/${category}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch blogs");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch blogs");
  }
}

// Function for fetching blog details by id
export async function getBlogById(blogId) {
  try {
    const res = await fetch(`/api/blogs/${blogId}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch blog");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch blog");
  }
}

// Function for create blog
export async function createBlog({ title, content, category, tags }) {
  try {
    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, category, tags }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create blog");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while creating blog"
    );
  }
}

// Function for fetching user's blogs
export async function getMyblogs() {
  try {
    const res = await fetch("/api/blogs/my-blogs");

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch blogs");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching blogs"
    );
  }
}

// Function for delete blog
export async function deleteBlog(id) {
  try {
    const res = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete blog");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while deleting blog"
    );
  }
}

// Function for update blog
export async function updateBlog({ id, title, content, category, tags }) {
  try {
    const res = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, category, tags }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update blog");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while updating blog"
    );
  }
}

// Function for approve blog (ADMIN)
export async function approveBlog(id) {
  try {
    const res = await fetch(`/api/blogs/${id}/approve`, {
      method: "PUT",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to approve blog");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while approving blog"
    );
  }
}

// Function for fetching pending blogs (ADMIN)
export async function getPendingBlogs() {
  try {
    const res = await fetch("/api/blogs/pending");

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch blogs");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while approving blog"
    );
  }
}

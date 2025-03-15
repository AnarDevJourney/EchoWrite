// Function for creating comment
export async function createComment({ blogPost, content }) {
  try {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogPost, content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create comment");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while creating comment"
    );
  }
}

// Function for fetching blog comments
export async function getCommentsForBlog(blogId) {
  try {
    const res = await fetch(`/api/comments/${blogId}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch comments");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while fetching comments"
    );
  }
}

// Function for deleting comment
export async function deleteComment(commentId) {
  try {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete comment");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while deleting comment"
    );
  }
}

// Function for updating comment
export async function updateComment({ commentId, content }) {
  try {
    const res = await fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update comment");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Something went wrong while updating comment"
    );
  }
}

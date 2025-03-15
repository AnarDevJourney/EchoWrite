// Function for like the post
export async function likePost(blogPost) {
  try {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blogPost }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to like this post");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
}

// Function unlike the post
export async function unlikePost(id) {
  try {
    const res = await fetch(`/api/likes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to unlike this post");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
}

// Function for checking if user liked the post
export async function checkIfUserLikedPost(blogId) {
  try {
    const res = await fetch(`/api/likes/check/${blogId}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to check");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
}

// Function for getting likes for post
export async function getLikesForPost(blogId) {
  try {
    const res = await fetch(`/api/likes/${blogId}`);

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch likes");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Something went wrong");
  }
}

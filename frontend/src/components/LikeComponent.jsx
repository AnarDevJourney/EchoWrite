import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Like API functions
import {
  likePost,
  unlikePost,
  getLikesForPost,
  checkIfUserLikedPost,
} from "../services/apiLike";

const LikeComponent = ({ blogId }) => {
  // Getting user info from redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Checking if user liked the post
  const { data: isLiked, refetch: isLikedRefetch } = useQuery({
    queryKey: ["isLiked", blogId],
    queryFn: () => checkIfUserLikedPost(blogId),
    enabled: !!userInfo,
  });

  // Fetching likes
  const { data: likes, refetch: likesRefetch } = useQuery({
    queryKey: ["likes", blogId],
    queryFn: () => getLikesForPost(blogId),
  });

  // Like mutation
  const { mutate: likeMutation } = useMutation({
    mutationFn: () => likePost(blogId),
    onSuccess: () => {
      toast.success("Post liked successfully");
      isLikedRefetch();
      likesRefetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to like the post");
    },
  });

  // Unlike mutation
  const { mutate: unlikeMutation } = useMutation({
    mutationFn: () => unlikePost(isLiked.likeId),
    onSuccess: () => {
      toast.success("Post unliked successfully");
      isLikedRefetch();
      likesRefetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to unlike the post");
    },
  });

  function handleLike() {
    if (!userInfo) {
      toast.info("Please login to like the post");
      return;
    }

    if (isLiked?.liked) {
      unlikeMutation();
    } else {
      likeMutation();
    }
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <button
        onClick={handleLike}
        disabled={!userInfo}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: isLiked?.liked ? "red" : "gray",
        }}
      >
        {isLiked?.liked ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
      </button>
      <span>{likes?.length || 0} Likes</span>
    </div>
  );
};

export default LikeComponent;

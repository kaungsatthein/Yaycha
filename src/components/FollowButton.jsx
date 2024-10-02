import { Button } from "@mui/material";
import { useMutation } from "react-query";
import { useApp, queryClient } from "../ThemedApp";
import { postFollow, deleteFollow } from "../libs/fetcher";
import { useState, useEffect } from "react";

export default function FollowButton({ user }) {
  const { auth } = useApp();
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  // Check if the user is following on initial render
  useEffect(() => {
    if (user.following) {
      setIsFollowingUser(
        user.following.some((item) => item.followerId === auth.id)
      );
    }
  }, [user, auth.id]);

  if (!auth) return <></>; // Exit if not authenticated

  const follow = useMutation((id) => postFollow(id), {
    onSuccess: () => {
      setIsFollowingUser(true); // Update local state
      // Optionally refetch queries if needed
      queryClient.refetchQueries("users");
      queryClient.refetchQueries("user");
      queryClient.refetchQueries("search");
    },
  });

  const unfollow = useMutation((id) => deleteFollow(id), {
    onSuccess: () => {
      setIsFollowingUser(false); // Update local state
      // Optionally refetch queries if needed
      queryClient.refetchQueries("users");
      queryClient.refetchQueries("user");
      queryClient.refetchQueries("search");
    },
  });

  return auth.id === user.id ? (
    <></>
  ) : (
    <Button
      size="small"
      edge="end"
      variant={isFollowingUser ? "outlined" : "contained"}
      sx={{ borderRadius: 5, mt: "15px" }} // Apply additional styles
      onClick={(e) => {
        e.stopPropagation(); // Prevent event bubbling
        if (isFollowingUser) {
          unfollow.mutate(user.id); // Unfollow
        } else {
          follow.mutate(user.id); // Follow
        }
      }}
    >
      {isFollowingUser ? "Following" : "Follow"}
    </Button>
  );
}

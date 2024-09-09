import { Box, Button, TextField } from "@mui/material";

import Item from "../components/Item";
import { useNavigate, useParams } from "react-router-dom";
import { queryClient, useApp } from "../ThemedApp";
import { useMutation, useQuery } from "react-query";
import { commentDelete, postComment, postDelete } from "../libs/fetcher";
import { useRef } from "react";

const api = import.meta.env.VITE_API;

export default function Comments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setGlobalMsg, auth } = useApp();
  const contentInput = useRef();

  const { isLoading, isError, error, data } = useQuery("comments", async () => {
    const res = await fetch(`${api}/content/posts/${id}`);
    return res.json();
  });

  const removePost = useMutation(async (contentId) => postDelete(contentId), {
    onSuccess: async () => {
      await queryClient.invalidateQueries("posts");
      setGlobalMsg("A post deleted successfully.");
      navigate("/");
    },
  });

  const removeComment = useMutation(
    async (commentId) => commentDelete(commentId),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries("comments");
        setGlobalMsg("A comment deleted successfully.");
      },
    }
  );

  const addComment = useMutation((content) => postComment(content, id), {
    onSuccess: async (comment) => {
      await queryClient.cancelQueries("comments");
      await queryClient.setQueryData("comments", (old) => {
        old.comments = [...old.comments, comment];
        return { ...old };
      });
      setGlobalMsg("A comment added");
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      <Item primary item={data} remove={removePost.mutate} />
      {data.comments.map((comment) => {
        return (
          <Item
            comment
            key={comment.id}
            item={comment}
            remove={removeComment.mutate}
          />
        );
      })}

      {auth && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = contentInput.current.value;
            if (!content) return false;
            addComment.mutate(content);
            e.currentTarget.reset();
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 3,
            }}
          >
            <TextField
              inputRef={contentInput}
              multiline
              placeholder="Your Comment"
            />
            <Button type="submit" variant="contained">
              Reply
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}

import { useQuery, useMutation } from "react-query";
import { Box, Alert } from "@mui/material";
import Form from "../components/Form";
import Item from "../components/Item";
import { queryClient, useApp } from "../ThemedApp";
import { postDelete, postPost } from "../libs/fetcher";

export default function Home() {
  const { showForm, setGlobalMsg, auth } = useApp();

  const api = import.meta.env.VITE_API;

  const { isLoading, isError, error, data } = useQuery("posts", async () => {
    const res = await fetch(`${api}/content/posts`);
    return res.json();
  });

  const add = useMutation(async (content) => postPost(content), {
    onSuccess: async (post) => {
      await queryClient.cancelQueries("posts");
      await queryClient.setQueryData("posts", (old) => [post, ...old]);
      setGlobalMsg("A post added successfully.");
    },
  });

  const remove = useMutation(async (contentId) => postDelete(contentId), {
    // onSuccess: async (contentId) => {
    //   await queryClient.cancelQueries("posts");
    //   await queryClient.setQueryData("posts", (old) =>
    //     old.filter((post) => post.id !== contentId)
    //   );
    //   setGlobalMsg("A post deleted successfully.");
    // },
    onSuccess: async () => {
      await queryClient.invalidateQueries("posts");
      setGlobalMsg("A post deleted successfully.");
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
      {showForm && auth && <Form add={add} />}
      {data.map((item) => {
        return <Item key={item.id} item={item} remove={remove} />;
      })}
    </Box>
  );
}

import { useQuery, useMutation } from "react-query";
import { Box, Alert } from "@mui/material";
import Form from "../components/Form";
import Item from "../components/Item";
import { queryClient, useApp } from "../ThemedApp";

export default function Home() {
  const { showForm, setGlobalMsg } = useApp();

  const api = import.meta.env.VITE_API;

  const { isLoading, isError, error, data } = useQuery("posts", async () => {
    const res = await fetch(`${api}/content/posts`);
    return res.json();
  });

  const remove = useMutation(
    async (id) => {
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
      });
    },
    {
      onMutate: (id) => {
        queryClient.cancelQueries("posts");
        queryClient.setQueryData("posts", (old) =>
          old.filter((item) => item.id !== id)
        );
        setGlobalMsg("A post deleted successfully.");
      },
    }
  );

  const add = (content, name) => {
    const id = data[0].id + 1;
    setData([{ id, content, name }, ...data]);
    setGlobalMsg("An item added");
  };

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
      {showForm && <Form add={add} />}
      {data.map((item) => {
        return <Item key={item.id} item={item} remove={remove.mutate} />;
      })}
    </Box>
  );
}

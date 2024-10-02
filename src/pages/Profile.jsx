import { Avatar, Box, Typography, Alert, IconButton } from "@mui/material";
import { pink } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { fetchUser, postDelete } from "../libs/fetcher";
import { useMutation, useQuery } from "react-query";
import Item from "../components/Item";
import { queryClient, useApp } from "../ThemedApp";
import FollowButton from "../components/FollowButton";
import { mt } from "date-fns/locale";

export default function Profile() {
  const { id } = useParams();
  const { setGlobalMsg } = useApp();

  const { isLoading, isError, error, data } = useQuery(
    `users/${id}`,
    async () => fetchUser(id)
  );

  const remove = useMutation(async (id) => postDelete(id), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(`users/${id}`);
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
      <Box sx={{ bgcolor: "banner", height: 150, borderRadius: 4 }}></Box>
      <Box
        sx={{
          mb: 4,
          marginTop: "-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500] }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography>{data.name}</Typography>
          <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
            {data.bio}
          </Typography>
          {console.log(data)}
          <FollowButton user={data} />
          <Box sx={{ marginTop: "50px" }}>
            {isLoading ? (
              <Typography>Loading...</Typography> // Show loading state
            ) : isError ? (
              <Typography>Error: {error.message}</Typography> // Show error message
            ) : data?.posts && data.posts.length > 0 ? (
              data.posts.map((item) => (
                <Item key={item.id} item={item} remove={remove.mutate} />
              ))
            ) : (
              <Typography>No posts available</Typography> // Show no posts message
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

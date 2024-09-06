import { useRef } from "react";
import { TextField, Box, Button } from "@mui/material";

export default function Form({ add }) {
  const contentRef = useRef();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const content = contentRef.current.value;
        add.mutate(content);
        e.currentTarget.reset();
      }}
    >
      <Box sx={{ mb: 2, textAlign: "right" }}>
        <TextField
          inputRef={contentRef}
          type="text"
          placeholder="Content"
          fullWidth
          sx={{ mb: 1 }}
        />
      </Box>
      <Button variant="contained" type="submit" sx={{ mb: 4 }}>
        Post
      </Button>
    </form>
  );
}

import Header from "./components/Header";
import Item from "./components/Item";
import Form from "./components/Form";
import { useApp } from "./ThemedApp";
import { Box, Container } from "@mui/material";

import { useState } from "react";

export default function App() {
  const [data, setData] = useState([
    { id: 1, content: "Hello, World!", name: "Alice" },
    { id: 2, content: "React is fun.", name: "Bob" },
    { id: 3, content: "Yay, interesting.", name: "Chris" },
  ]);
  const { showForm, setGlobalMsg } = useApp();

  const add = (content, name) => {
    const id = data[data.length - 1].id + 1;
    setData([...data, { id, content, name }]);
    setGlobalMsg("An item added successfully!");
  };

  const remove = (id) => {
    setData(data.filter((item) => item.id !== id));
    setGlobalMsg("An item removed successfully!");
  };

  return (
    <Box>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {showForm && <Form add={add} />}
        {data.map((item) => (
          <Item key={item.id} item={item} remove={remove} />
        ))}
      </Container>
    </Box>
  );
}

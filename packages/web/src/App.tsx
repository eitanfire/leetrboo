import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { FC } from "react";
import { Container } from "reactstrap";
import AddPlayerForm from "./components/AddPlayerForm";
import ListPlayerEntries from "./components/ListPlayerEntries";

console.log(import.meta.env.VITE_APP_SUPABASE_URL);

type Props = {};

const App: React.FC<Props> = ({}) => {
  return (
    <Container fluid className="p-0">
      <Header />
      <AddPlayerForm />
      <ListPlayerEntries />
      <div className="content-body"></div>
    </Container>
  );
};

export default App;

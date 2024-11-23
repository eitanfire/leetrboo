import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { FC } from "react";
import { Container } from "reactstrap";
import { createClient } from "@supabase/supabase-js";
import AddPlayerForm from "./components/AddPlayerForm";

console.log(import.meta.env.VITE_APP_SUPABASE_URL);

const supabase = createClient(
  import.meta.env.VITE_APP_SUPABASE_URL!,
  import.meta.env.VITE_APP_SUPABASE_ANON_KEY!
);

supabase.from("test").select("*").then((res) => {
  console.log(res);
});

supabase.from("test").insert({ name: "test", url: "https://leetr.boo" }).then((res) => {
  console.log(res);
});

type Props = {};

const App: React.FC<Props> = ({}) => {
  return (
    <Container fluid className="p-0">
      <Header />
      <AddPlayerForm />
      <div className="content-body"></div>
    </Container>
  );
};

export default App;

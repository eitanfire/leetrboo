import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React from "react";
import { Container } from "reactstrap";
import { useAuth } from "./hooks/useAuth";

console.log(import.meta.env.VITE_APP_SUPABASE_URL);

type Props = {};

const App: React.FC<Props> = ({ }) => {
  const user = useAuth();

  return (
    <Container fluid className="p-0">
{user == null?<div>no user</div>:<div>user</div>}
    </Container>
  );
};

export default App;

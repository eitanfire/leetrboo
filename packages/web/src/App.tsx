import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { supabase } from "./services/supabaseClient";
import type { User } from "@supabase/supabase-js";

console.log(import.meta.env.VITE_APP_SUPABASE_URL);

type Props = {};

//TODO create custom hook
const App: React.FC<Props> = ({ }) => {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const userPromise = supabase.auth.getUser()
    userPromise.then((userResponse) => {
      setUser(userResponse.data.user)
    })
  }, [])

  return (
    <Container fluid className="p-0">
{user == null?<div>no user</div>:<div>user</div>}
    </Container>
  );
};

export default App;

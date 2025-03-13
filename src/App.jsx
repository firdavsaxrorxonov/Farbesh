import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layouts from "./loyout";

function App() {
  return (
    <div className="container max-w-dvh mx-auto">
      <Routes>
        <Route index element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layouts />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

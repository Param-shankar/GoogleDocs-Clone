import { Editor } from "./components/Editor";
import { v4 as uuidv4 } from "uuid";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  redirect,
  RouterProvider,
  Navigate,
  Routes,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to={`documents/${uuidv4()}`} />} />
      <Route path="/documents/:id" element={<Editor />} />
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

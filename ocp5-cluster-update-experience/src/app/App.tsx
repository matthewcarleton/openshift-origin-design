import { Analytics } from "@vercel/analytics/react";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
    </>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminClient from "./AdminClient";
import { redirect } from "next/navigation"; // ✅ add this import


export default async function AdminApp() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // If not logged in
  }

  return <AdminClient />;
}

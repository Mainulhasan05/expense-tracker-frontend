import { redirect } from "next/navigation";

export default function Home() {
  // In a real app, check if user is authenticated
  // If not, show login page, otherwise redirect to dashboard
  redirect("/login");
}

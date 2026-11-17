import { getAdmins } from "@/lib/adminsDb";
import AdminsClient from "./AdminsClient";

export const revalidate = 60;

export default async function Page() {
  const admins = await getAdmins();
  return <AdminsClient admins={admins} />;
}
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/session";

export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get("admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    redirect("/login");
  }
}

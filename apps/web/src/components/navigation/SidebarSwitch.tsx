"use client";

import { useAuth } from "@/lib/auth";
import { isOperatorRole } from "@/lib/role-ui";
import { Sidebar } from "./Sidebar";
import { StudioSidebar } from "./StudioSidebar";

export function SidebarSwitch() {
  const user = useAuth((state) => state.user);
  return isOperatorRole(user?.role) ? <StudioSidebar /> : <Sidebar />;
}

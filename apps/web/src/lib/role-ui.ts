export type UserRole = "PARENT" | "INSTRUCTOR" | "STUDENT";
export type ViewRole = "PARENT" | "INSTRUCTOR" | "STUDENT";

export function parseRoleParam(role: string | null | undefined): ViewRole {
  if (role === "INSTRUCTOR") return "INSTRUCTOR";
  if (role === "STUDENT") return "STUDENT";
  return "PARENT";
}

export function normalizeRole(role: UserRole | null | undefined): ViewRole {
  if (role === "INSTRUCTOR") return "INSTRUCTOR";
  if (role === "STUDENT") return "STUDENT";
  return "PARENT";
}

export function getRoleLabel(role: UserRole | null | undefined) {
  const r = normalizeRole(role);
  if (r === "INSTRUCTOR") return "강사";
  if (r === "STUDENT") return "학생";
  return "학부모";
}

export function isOperatorRole(role: UserRole | null | undefined) {
  return normalizeRole(role) === "INSTRUCTOR";
}

export function getRoleHomePath(role: UserRole | null | undefined) {
  const r = normalizeRole(role);
  if (r === "INSTRUCTOR") return "/studio";
  if (r === "STUDENT") return "/student";
  return "/home";
}

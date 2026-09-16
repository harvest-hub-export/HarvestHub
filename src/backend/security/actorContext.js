import { currentMember } from "wix-members-backend";
import { AuthorizationError } from "./authorization.js";

/**
 * Derives the commercial actor entirely on the server.
 *
 * The web-method boundary already requires Wix Admin permission. We still
 * verify the backend session reports the Wix "Admin" role and then map that
 * trusted server-side identity to the Harvest Hub ADMIN application role.
 *
 * Frontend-supplied actor IDs, names, and roles are never trusted.
 */
export async function deriveServerActor() {
  let wixRoles;

  try {
    wixRoles = await currentMember.getRoles();
  } catch (error) {
    throw new AuthorizationError("Unable to resolve authenticated Wix roles.");
  }

  const wixRoleNames = Array.isArray(wixRoles)
    ? wixRoles.map((role) => role?.name).filter(Boolean)
    : [];

  if (!wixRoleNames.includes("Admin")) {
    throw new AuthorizationError("Commercial operations require a Wix admin session.");
  }

  let member = null;
  try {
    member = await currentMember.getMember();
  } catch (_) {
    // Admin/collaborator identity may not always resolve to a normal site-member
    // record. Platform Admin permission + server-side Admin role remains required.
  }

  return Object.freeze({
    id: member?._id || "",
    name:
      member?.profile?.nickname ||
      member?.contactDetails?.firstName ||
      "Wix Admin",
    roles: Object.freeze(["ADMIN"]),
    wixRoleNames: Object.freeze([...wixRoleNames]),
  });
}

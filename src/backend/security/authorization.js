import { ROLE_CAPABILITIES } from "./roles.js";

export class AuthorizationError extends Error {
  constructor(message = "Not authorized.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function hasCapability(actor = {}, capability) {
  const roles = Array.isArray(actor.roles) ? actor.roles : [];
  return roles.some((role) => {
    const capabilities = ROLE_CAPABILITIES[role] || [];
    return capabilities.includes(capability);
  });
}

export function assertCapability(actor, capability) {
  if (!hasCapability(actor, capability)) {
    throw new AuthorizationError(`Missing capability: ${capability}`);
  }
}

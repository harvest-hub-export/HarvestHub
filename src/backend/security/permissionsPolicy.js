export const EXPOSURE_POLICY = Object.freeze({
  internalCommercialMethods: Object.freeze({
    wixPermission: "Admin",
    applicationCapabilityRequired: true,
  }),
  publicMethods: Object.freeze({
    allowed: [],
    note: "Public RFQ submission remains separate from the internal commercial facade.",
  }),
});

import wixData from "wix-data";
import { COLLECTIONS, QUOTE_STATUS } from "./constants.js";

const INTERNAL_OPTIONS = Object.freeze({ suppressAuth: true });

async function countCollection(collectionId, filterBuilder = null) {
  let query = wixData.query(collectionId);
  if (typeof filterBuilder === "function") {
    query = filterBuilder(query);
  }

  const result = await query.limit(1).find(INTERNAL_OPTIONS);
  return result.totalCount;
}

async function countQuotesByStatus(status) {
  return countCollection(
    COLLECTIONS.QUOTES,
    (query) => query.eq("status", status)
  );
}

export async function calculateCommercialKpis() {
  const [
    rfqCount,
    totalQuotes,
    wonQuotes,
    lostQuotes,
    sentQuotes,
    approvalPending,
    riskReviewRfqs,
  ] = await Promise.all([
    countCollection(COLLECTIONS.RFQ_SUBMISSIONS),
    countCollection(COLLECTIONS.QUOTES),
    countQuotesByStatus(QUOTE_STATUS.WON),
    countQuotesByStatus(QUOTE_STATUS.LOST),
    countQuotesByStatus(QUOTE_STATUS.SENT),
    countQuotesByStatus(QUOTE_STATUS.APPROVAL_PENDING),
    countCollection(
      COLLECTIONS.RFQ_SUBMISSIONS,
      (query) => query.eq("commercialRiskStatus", "REVIEW")
    ),
  ]);

  const decided = wonQuotes + lostQuotes;
  const winRatePct = decided > 0 ? (wonQuotes / decided) * 100 : 0;

  return {
    rfqCount,
    totalQuotes,
    sentQuotes,
    wonQuotes,
    lostQuotes,
    approvalPending,
    riskReviewRfqs,
    winRatePct,
  };
}

// scripts/check-quote-include.ts
import "dotenv/config";
import { getSequelize } from "@/lib/db";

(async () => {
  const s = getSequelize();
  const Quote = s.model("Quote") as any;
  const Opportunity = s.model("Opportunity") as any;

  console.log("Models:", Object.keys(s.models)); // should include Quote, Opportunity
  await Quote.findAll({
    include: [{ model: Opportunity, required: false }],
    limit: 1,
  });
  console.log("Quote → include Opportunity works ✅");
})();

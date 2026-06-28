import { Router, Request, Response } from "express";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";
import { query } from "../config/db";

const router = Router();

// M-Pesa STK Push — initiates payment
router.post("/mpesa/stk-push", authenticate, authorize("parent", "principal"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { phone, amount, studentId, description } = req.body;
  if (!phone || !amount || !studentId) {
    res.status(400).json({ error: "phone, amount and studentId are required" });
    return;
  }
  try {
    // Obtain M-Pesa OAuth token
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
      headers: { Authorization: `Basic ${auth}` },
    });
    const { access_token } = await tokenRes.json() as { access_token: string };

    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.ceil(amount),
        PartyA: phone.replace(/^0/, "254"),
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone.replace(/^0/, "254"),
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `ACADEBIT-${studentId}`,
        TransactionDesc: description || "School fee payment",
      }),
    });
    const stkData = await stkRes.json();
    res.json(stkData);
  } catch {
    res.status(500).json({ error: "STK push failed" });
  }
});

// M-Pesa callback — called by Safaricom after payment
router.post("/mpesa/callback", async (req: Request, res: Response): Promise<void> => {
  const callback = req.body?.Body?.stkCallback;
  if (callback?.ResultCode === 0) {
    const meta = callback.CallbackMetadata?.Item || [];
    const get = (name: string) => meta.find((i: { Name: string }) => i.Name === name)?.Value;
    try {
      await query(
        `INSERT INTO mpesa_transactions (checkout_request_id, mpesa_receipt, phone, amount, account_ref, paid_at)
         VALUES ($1,$2,$3,$4,$5,NOW())`,
        [callback.CheckoutRequestID, get("MpesaReceiptNumber"), get("PhoneNumber"), get("Amount"), get("AccountReference")]
      );
    } catch (err) {
      console.error("Failed to record M-Pesa transaction", err);
    }
  }
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

export default router;

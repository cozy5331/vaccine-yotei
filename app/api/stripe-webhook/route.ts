import Stripe from "stripe";
import { runFileMakerScript } from "@/lib/filemaker";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return Response.json(
      { status: "error", message: "stripe-signature がありません" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey) {
      return Response.json(
        { status: "error", message: "STRIPE_SECRET_KEY が未設定です" },
        { status: 500 }
      );
    }

    if (!webhookSecret) {
      return Response.json(
        { status: "error", message: "STRIPE_WEBHOOK_SECRET が未設定です" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const requestId = session.metadata?.request_id ?? "";
      const paymentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.id;

      if (!requestId) {
        return Response.json(
          {
            status: "error",
            message: "metadata.request_id がありません",
          },
          { status: 400 }
        );
      }

      const fm = await runFileMakerScript("Web受付_API_支払済反映", {
        request_id: requestId,
        payment_id: paymentId,
      });

      let scriptResult: any = {};
      try {
        scriptResult = JSON.parse(fm?.response?.scriptResult ?? "{}");
      } catch {
        scriptResult = { raw: fm?.response?.scriptResult ?? "" };
      }

      return Response.json(
        {
          status: "ok",
          event_type: event.type,
          request_id: requestId,
          payment_id: paymentId,
          filemaker: scriptResult,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        status: "ok",
        ignored: true,
        event_type: event.type,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "webhook failed",
      },
      { status: 400 }
    );
  }
}
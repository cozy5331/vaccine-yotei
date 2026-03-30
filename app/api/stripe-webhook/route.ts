import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
      return Response.json(
        { status: "error", message: "STRIPE_WEBHOOK_SECRET が未設定です" },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      return Response.json(
        {
          status: "ok",
          event_type: event.type,
          request_id: session.metadata?.request_id ?? "",
          payment_intent: session.payment_intent ?? "",
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
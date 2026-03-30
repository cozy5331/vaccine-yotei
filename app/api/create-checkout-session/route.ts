import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const requestId = body?.request_id;

    if (!requestId) {
      return Response.json(
        {
          status: "error",
          message: "request_id がありません",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: process.env.PRICE_ID_ONE_TIME_100!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_BASE_URL}/result?request_id=${encodeURIComponent(requestId)}`,
      cancel_url: `${process.env.APP_BASE_URL}/form?request_id=${encodeURIComponent(requestId)}&canceled=1`,
      metadata: {
        request_id: requestId,
        flow_type: "initial",
      },
    });

    return Response.json(
      {
        status: "ok",
        checkout_url: session.url,
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      {
        status: "error",
        message:
          err instanceof Error ? err.message : "create-checkout-session failed",
      },
      { status: 500 }
    );
  }
}
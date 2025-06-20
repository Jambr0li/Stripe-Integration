// checkout/route.ts
import { Polar } from "@polar-sh/sdk";
import { NextRequest, NextResponse } from 'next/server';

const polar = new Polar({
  accessToken: process.env["POLAR_ACCESS_TOKEN"] ?? "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: process.env.POLAR_SUCCESS_URL,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
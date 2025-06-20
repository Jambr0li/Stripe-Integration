// checkout/route.ts
import { Polar } from "@polar-sh/sdk";
import { NextRequest, NextResponse } from 'next/server';

const polar = new Polar({
  server: "sandbox",
  accessToken: process.env["POLAR_ACCESS_TOKEN"] ?? "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;
    
    console.log('Received productId:', productId);
    console.log('Access token present:', !!process.env.POLAR_ACCESS_TOKEN);
    console.log('Success URL:', process.env.POLAR_SUCCESS_URL);

    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: process.env.POLAR_SUCCESS_URL,
    });

    console.log('Checkout created successfully:', checkout.url);
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error('Error creating checkout:', error);
    console.error('Error message:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error },
      { status: 500 }
    );
  }
}
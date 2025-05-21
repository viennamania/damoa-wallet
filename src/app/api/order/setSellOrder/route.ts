import { NextResponse, type NextRequest } from "next/server";

import {
	insertSellOrder,
} from '@lib/api/order';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { chain, walletAddress, usdtAmount, krwAmount, rate, privateSale } = body;

  console.log("walletAddress", walletAddress);
  

  const result = await insertSellOrder({
    chain: chain,
    walletAddress: walletAddress,
    usdtAmount: usdtAmount,
    krwAmount: krwAmount,
    rate: rate,
    privateSale: privateSale,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}

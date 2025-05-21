import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrdersForBuyer,
} from '@lib/api/order';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, walletAddress, searchMyTrades } = body;



  const result = await getSellOrdersForBuyer({
    limit: 300,
    page: 1,
    chain,
    walletAddress,
    searchMyTrades,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}

import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrders,
} from '@lib/api/order';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {chain, walletAddress, searchMyOrders } = body;



  const result = await getSellOrders({
    limit: 300,
    page: 1,
    chain,
    walletAddress,
    searchMyOrders,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}

import { NextResponse, type NextRequest } from "next/server";

import {
  getRewards,
} from '@lib/api/reward';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    limit,
    page,
    walletAddress,
    contractAddress,
    //tokenId,
  } = body;




  const result = await getRewards(
    limit,
    page,
    walletAddress,
    contractAddress,
    //tokenId,
  );

 
  return NextResponse.json({

    result,
    
  });
  
}

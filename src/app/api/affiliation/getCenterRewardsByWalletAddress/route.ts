import { NextResponse, type NextRequest } from "next/server";

import {
  getCenterRewards,
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




  const result = await getCenterRewards(
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

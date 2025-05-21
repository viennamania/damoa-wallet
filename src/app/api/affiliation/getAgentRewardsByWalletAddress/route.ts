import { NextResponse, type NextRequest } from "next/server";

import {
  getAgentRewards,
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




  const result = await getAgentRewards(
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

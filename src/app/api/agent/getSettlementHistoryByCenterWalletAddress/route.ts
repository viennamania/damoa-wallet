import { NextResponse, type NextRequest } from "next/server";

import {
	getSettlemeHistoryByWalletAddress,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

    const body = await request.json();

    const {
      limit,
      page,
      walletAddress
    } = body;

    if (!walletAddress) {
      return NextResponse.error();
    }


    const result = await getSettlemeHistoryByWalletAddress({
      limit: limit || 100,
      page: page || 1,
      walletAddress,
      roleType: "center",
    });

    //console.log("resultSummary", resultSummary);


    return NextResponse.json({
  
      settlements: result,
      
    });
  
}

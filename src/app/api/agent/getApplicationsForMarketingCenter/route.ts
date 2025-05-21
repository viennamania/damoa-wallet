import { NextResponse, type NextRequest } from "next/server";



import {
	getAllApplicationsForMarketingCenter,
  getSummaryApplicationsForMarketingCenter,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, marketingCenter } = body;

  if (!walletAddress) {
    return NextResponse.error();
  }

  if (!marketingCenter) {
    return NextResponse.error();
  }

  //console.log("walletAddress", walletAddress);
  //console.log("marketingCenter", marketingCenter);

    const result = await getAllApplicationsForMarketingCenter({
      marketingCenter
    });

    //console.log("result", result);


    const resultSummary = await getSummaryApplicationsForMarketingCenter({
      marketingCenter,
    });

    //console.log("resultSummary", resultSummary);


    return NextResponse.json({
  
      result,
      resultSummary,
      
    });
  
}

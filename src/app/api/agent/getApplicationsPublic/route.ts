import { NextResponse, type NextRequest } from "next/server";



import {
	getAllApplicationsPublicData,
} from '@lib/api/agent';




export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress } = body;


  
  if (!walletAddress) {

    return NextResponse.error();

  }
  

      
      const result = await getAllApplicationsPublicData({
        limit: 200,
        page: 1,
      });
      

 
      return NextResponse.json({
        status: "success",
        result: result,
      });



  
}

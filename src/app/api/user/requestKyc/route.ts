import { NextResponse, type NextRequest } from "next/server";

import {
	updateKycInfo,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
    walletAddress,
    realName,
    idNumber,
  } = body;


  const result = await updateKycInfo({
    walletAddress: walletAddress,
    realName: realName,
    idNumber: idNumber,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}

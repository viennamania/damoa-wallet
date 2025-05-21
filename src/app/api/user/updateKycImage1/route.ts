import { NextResponse, type NextRequest } from "next/server";

import {
	updateKycImage1,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, avatar } = body;

  console.log("walletAddress", walletAddress);
  console.log("avatar", avatar);

  const result = await updateKycImage1({
    walletAddress: walletAddress,
    avatar: avatar,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}

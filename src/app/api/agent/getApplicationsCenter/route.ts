import { NextResponse, type NextRequest } from "next/server";



import {
	getAllAgents,
  getAgentCenterSummary,
} from '@lib/api/agent';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, marketingCenter } = body;


  if (!walletAddress) {

    return NextResponse.error();
  }

  if (walletAddress === "0x7bfF3359841D26C8046364b93E7dA01886ae1c22" // wayne
      || walletAddress === "0x648A9CF18A02ec961990C1183eCc1e0C6989d10B" // wayne ppumpt telegram
      || walletAddress === "0x2C91bf7ac8300913367Bf1c29b14c25556c0df92" // wayne owin telegram

      || walletAddress === "0x030549f3E1644008c920d0046caE758317Dab8CE" // ppump wayne

      || walletAddress === "0x79bA77332cE549cA99a2851b8D7e9c0229432417" // ppump orry

      

      || walletAddress === "0x5Cb2D01Cd138D9aB7a7435A85e8B12b0B2852A7a" // center

      || walletAddress === "0xFb580c68794A963632FF272ab5A7233ee6114fef" // 곽준규

      || walletAddress === "0x4d459172eeDA205Ed0DbA2b8897c9cA864069057" // 오원대표

      || walletAddress === "0xaB6fB9F80469511195Db7Ac707Cb3F4aD99b1755" // 

      || walletAddress === "0xfD6c58c58029212a5f181EA324cBC6051c7161EF" // owin 센터

      || walletAddress === "0xFE9a0204e39E2BBc2DDaaEb6a7ce1f248cAF5Ff7" // owin 센터 추가



      

      || walletAddress === "0x0d2846FDbaAc5e9526f9409aE18d3e2c9CdC9466" // wayne

      || walletAddress === "0xBB5af298798539303eA929Fc68De4F2341A5c12B" // kwak

      || walletAddress === "0xAF590E8617d4C1729E1B252dE799621819F8313A" // exms center wallet address 유재민

      || walletAddress === "0xe2F5254c5493356E2EEB81e442e225E39a7E2350" // ppump center wallet address 곽준규

      || walletAddress === "0xfabB5F1BBcA9F2aE4ab48E994C474404cB4FEBBC" // 12월 19일 추가

      || walletAddress === "0x59C0d2BED6A59E5099EFdFB60c3172B1acA51027" // 20250107 추가
    
    ) {

      const result = await getAllAgents({
        marketingCenter,
      });

      const result2 = await getAgentCenterSummary({
        marketingCenter,
      });
 
      return NextResponse.json({
    
        result,
        summary: result2,
        
      });


  } else {

    return NextResponse.error();

  }


  
}

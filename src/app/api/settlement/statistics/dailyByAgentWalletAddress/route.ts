import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsDailyTradingVolumeByAgentWalletAddress,
    getStatisticsDailyTradingAccountBalanceByAgentWalletAddress,
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();

    const { agentWalletAddress } = body;


    const tradingVolume = await getStatisticsDailyTradingVolumeByAgentWalletAddress(agentWalletAddress);

    const tradingAccountBalance = await getStatisticsDailyTradingAccountBalanceByAgentWalletAddress(agentWalletAddress);




    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}

import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsDailyTradingVolumeByMasterWalletAddress,
    getStatisticsDailyTradingAccountBalanceByApplicationId,

    getOneByWalletAddress,
} from '@lib/api/agent';




export async function POST(request: NextRequest) {

    const body = await request.json();

    const { masterWalletAddress } = body;

    if (!masterWalletAddress) {
        return NextResponse.error();
    }


    // get applicationId from masterWalletAddress
    const result = await getOneByWalletAddress(masterWalletAddress);
    if (!result) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const { id } = result;

    const applicationId = id;



    const tradingVolume = await getStatisticsDailyTradingVolumeByMasterWalletAddress(
        {
            masterWalletAddress
        }
    );


    const tradingAccountBalance = await getStatisticsDailyTradingAccountBalanceByApplicationId(
        {
            applicationId
        }
    );
 

    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}

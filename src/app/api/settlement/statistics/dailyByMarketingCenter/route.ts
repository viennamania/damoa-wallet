import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsDailyTradingVolumeByMarketingCenter,
    getStatisticsDailyTradingAccountBalanceByMarketingCenter,
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();

    const { marketingCenter } = body;


    const tradingVolume = await getStatisticsDailyTradingVolumeByMarketingCenter(marketingCenter);

    const tradingAccountBalance = await getStatisticsDailyTradingAccountBalanceByMarketingCenter(marketingCenter);


    ///console.log("tradingVolume", tradingVolume);

    ///console.log("tradingAccountBalance", tradingAccountBalance);


    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}

import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsHourlyTradingVolumeByMarketingCenter,
    getStatisticsHourlyTradingAccountBalanceByMarketingCenter,
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();

    const { marketingCenter } = body;


    const tradingVolume = await getStatisticsHourlyTradingVolumeByMarketingCenter(marketingCenter);

    const tradingAccountBalance = await getStatisticsHourlyTradingAccountBalanceByMarketingCenter(marketingCenter);


    ///console.log("tradingVolume", tradingVolume);

    ///console.log("tradingAccountBalance", tradingAccountBalance);


    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}

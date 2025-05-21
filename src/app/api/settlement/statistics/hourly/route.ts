import { NextResponse, type NextRequest } from "next/server";



import {
    getStatisticsHourlyTradingVolume,
    getStatisticsHourlyTradingAccountBalance,
} from '@lib/api/agent';


export async function POST(request: NextRequest) {

    const body = await request.json();



    const tradingVolume = await getStatisticsHourlyTradingVolume();

    const tradingAccountBalance = await getStatisticsHourlyTradingAccountBalance();


    ///console.log("tradingVolume", tradingVolume);

    ///console.log("tradingAccountBalance", tradingAccountBalance);


    return NextResponse.json({

        tradingVolume,
        tradingAccountBalance

    });

}

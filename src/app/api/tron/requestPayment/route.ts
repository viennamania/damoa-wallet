import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
  getOneByOrderId,
	requestPayment,

} from '@lib/api/order';

import { getOneByWalletAddress } from '@lib/api/user';


// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';




export async function POST(request: NextRequest) {

  const body = await request.json();

  const {orderId } = body;

  console.log("orderId", orderId);
  

  const order = await getOneByOrderId(orderId);

  if (!order) {
    return NextResponse.json({
      error: "order not found",
    });
  }


  const user = await getOneByWalletAddress(order.walletAddress);



  const fromWalletAddress = user?.tronWalletAddress;
  const tronWalletPrivateKey = user?.tronWalletPrivateKey;


  const toWalletAddress = user?.tronEscrowWalletAddress;
  const usdtAmount = order.usdtAmount;


  console.log("fromWalletAddress", fromWalletAddress);
  console.log("tronWalletPrivateKey", tronWalletPrivateKey);


  // USDT contract address
  const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';


    const tronWeb = new TronWeb({
      fullHost: 'https://api.trongrid.io',
      headers: {
        'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY,
      },
      privateKey: tronWalletPrivateKey,
    });




    const tx = await tronWeb.transactionBuilder.triggerSmartContract(
      //"TRC-20 Contract Address according to network you use",
      //'transfer(address,uint256)',

      contractAddress,
      'transfer(address,uint256)',
      {
        
        //feeLimit: 10000000,
        feeLimit: 1e9,

        callValue: 0
      },
      [
        {
          type: 'address',
          value: toWalletAddress
        },
        {
          type: 'uint256',
          value: usdtAmount * 1000000
        }
      ],
      tronWeb.address.toHex(fromWalletAddress || "")
    );

    const signedTx = await tronWeb.trx.sign(tx.transaction);

    const broadcastTx = await tronWeb.trx.sendRawTransaction(signedTx);

    if (!broadcastTx || !broadcastTx.transaction || !broadcastTx.transaction.txID) {
      return NextResponse.json({
        result: null,
      });
    }


    const transactionHash = broadcastTx.transaction.txID;



  const result = await requestPayment({
    orderId: orderId,
    transactionHash: transactionHash,
  });


  //console.log("result", JSON.stringify(result));

  const {
    mobile: mobile,
    seller: seller,
    buyer: buyer,
    tradeId: tradeId,
    krwAmount: krwAmount,
  } = result as UserProps;


  const bankName = seller.bankInfo.bankName;
  const accountNumber = seller.bankInfo.accountNumber;
  const accountHolder = seller.bankInfo.accountHolder;
  const depositName = tradeId;
  const amount = krwAmount;


    // send sms


    console.log("byuer.mobile", buyer.mobile);



    if (!buyer.mobile) {
      return NextResponse.json({
        result,
      });
    }

    // check buyer.mobile is prefixed with +
    if (!buyer.mobile.startsWith("+")) {
      return NextResponse.json({
        result,
      });
    }

    const to = buyer.mobile;




    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);



    let message = null;

    try {

      const msgBody = `[똑똑한코인] TID[${tradeId}] ${bankName} ${accountNumber} ${accountHolder} 입금자명:[${depositName}] ${amount}원`;

      message = await client.messages.create({
        ///body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        body: msgBody,
        from: "+17622254217",
        to: to,
      });

      console.log(message.sid);

    } catch (e) {
        
      console.log("error", e);

    }


 
  return NextResponse.json({

    result,
    
  });
  
}

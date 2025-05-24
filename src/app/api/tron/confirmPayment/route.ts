import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	confirmPayment,
  getOrderById,
} from '@lib/api/order';

import {
  getOneByWalletAddress 
} from '@lib/api/user';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, orderId, paymentAmount, isSmartAccount } = body;

  console.log("lang", lang);
  console.log("chain", chain);

  console.log("orderId", orderId);

  console.log("paymentAmount", paymentAmount);

  console.log("isSmartAccount", isSmartAccount);






  
  try {



    // get buyer wallet address


    const order = await getOrderById( orderId );

    if (!order) {
      return NextResponse.json({
        result: null,
      });
    }
    

    const {
      walletAddress: walletAddress,
      usdtAmount: usdtAmount,
      buyer: buyer,
    } = order as UserProps;


    const sellerWalletAddress = walletAddress;

    //console.log("sellerWalletAddress", sellerWalletAddress);


    if (!sellerWalletAddress) {
      return NextResponse.json({
        result: null,
      });
    }

    const user = await getOneByWalletAddress(sellerWalletAddress);

    ///console.log("user", user);

    if (!user) {
      return NextResponse.json({
        result: null,
      });
    }


    //const escrowWalletAddress = user.escrowWalletAddress;
    const fromWalletAddress = user.tronEscrowWalletAddress;
    const tronWalletPrivateKey = user.tronEscrowWalletPrivateKey;

    const buyerWalletAddress = buyer.walletAddress;

    const buyerUser = await getOneByWalletAddress(buyerWalletAddress);

    const toWalletAddress = buyerUser?.tronWalletAddress;



  

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

    if (!broadcastTx) {
      return NextResponse.json({
        result: null,
      });
    }


    const transactionHash = broadcastTx.transaction.txID;






    console.log("Sent successfully!");



    const result = await confirmPayment({
      lang: lang,
      chain: chain,
      orderId: orderId,
      paymentAmount: paymentAmount,

      queueId: null,
      
      transactionHash: transactionHash,
    });
  
  
    //console.log("result", JSON.stringify(result));
  
    const {
      nickname: nickname,
      tradeId: tradeId,
    } = result as UserProps;
  
  
  
    const amount = usdtAmount;


    // send sms


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

      


      const msgBody = `[똑똑한코인] TID[${tradeId}] You received ${amount} USDT from ${nickname}`;
  
      message = await client.messages.create({
        ///body: "This is the ship that made the Kessel Run in fourteen parsecs?",
        body: msgBody,
        from: "+17622254217",
        to: to,
      });
  
      console.log(message.sid);

    } catch (error) {
        
      console.log("error", error);
  
    }
  
    
    return NextResponse.json({
  
      result,
      
    });





  } catch (error) {
      
    console.log(" error=====>" + error);



  }

  


 
  return NextResponse.json({

    result: null,
    
  });
  
}

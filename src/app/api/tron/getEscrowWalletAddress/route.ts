import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
  getOneByWalletAddress,

  setTronEscrowWalletAddressByWalletAddress,

} from '@lib/api/user';




import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { lang, chain, walletAddress } = body;

  console.log("lang", lang);
  console.log("chain", chain);
  console.log("walletAddress", walletAddress);






  
  try {


    // get user by wallet address

    const user = await getOneByWalletAddress(walletAddress);

    ///console.log("user", user);

    if (!user) {
      return NextResponse.json({
        result: null,
      });
    }

    let tronEscrowWalletAddress = user.tronEscrowWalletAddress;

    //console.log("escrowWalletAddress", escrowWalletAddress);

    if (tronEscrowWalletAddress) {
      return NextResponse.json({
        result: {
          tronEscrowWalletAddress: tronEscrowWalletAddress,
        }
      });
    }





    const newWallet = await TronWeb.createAccount();
    ////console.log("newWallet", newWallet);

    tronEscrowWalletAddress = newWallet.address.base58;
    const tronEscrowWalletPrivateKey = newWallet.privateKey;

    console.log("tronEscrowWalletAddress", tronEscrowWalletAddress);




    const result = await setTronEscrowWalletAddressByWalletAddress(
      walletAddress,
      tronEscrowWalletAddress,
      tronEscrowWalletPrivateKey,
    );

    //console.log("setEscrowWalletAddressByWalletAddress result", result);


    if (!result) {
      return NextResponse.json({
        result: null,
      });
    }

    return NextResponse.json({
      result: {
        tronEscrowWalletAddress: tronEscrowWalletAddress,
      }
    });



  } catch (error) {
      
    console.log(" error=====>" + error);

  }

  
  return NextResponse.json({
    result: null,
  });


}
import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



import {
  getOneByWalletAddress,
  getOneByTelegramId,
} from '@lib/api/user';



import {
    createThirdwebClient,

    ///ContractOptions,

    getContract,
    sendAndConfirmTransaction,
    
    sendBatchTransaction,

    SendBatchTransactionOptions,
  
} from "thirdweb";


//import { polygonAmoy } from "thirdweb/chains";
import { polygon } from "thirdweb/chains";

import {
    privateKeyToAccount,
    ///smartWallet,
    getWalletBalance,
    SmartWalletOptions,
} from "thirdweb/wallets";

import {
  smartWallet,
  //////DEFAULT_ACCOUNT_FACTORY_V0_7,
} from "thirdweb/wallets/smart";

 




import {
    mintTo,
    //totalSupply,
    transfer,
    
    getBalance,
  
    //balanceOf,
  
} from "thirdweb/extensions/erc20";


import { parse } from "path";
import { token } from "thirdweb/extensions/vote";


///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

////const chain = polygon;


// KCT Token (KCT)
const tokenContractAddressKCT = '0xeb9198c8342BcB29A1Fe41d45A6CF6A3Ac568a0E';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




export async function POST(request: NextRequest) {

  const body = await request.json();

  const {
      lang,
      chain,
      walletAddress,
      amount,
      toWalletAddress,
  } = body;


  console.log("body", body);



  try {



    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });

    


  
    if (!client) {
      return NextResponse.json({
        result: null,
      });
    }


    const contractUSDT = getContract(
      {
        client: client,
        chain: polygon,
        address: tokenContractAddressKCT,
      }
    );

    const snowballWalletPrivateKey = process.env.SNOWBALL_WALLET_PRIVATE_KEY || "";



    const personalAccount = privateKeyToAccount({
      client,
      privateKey: snowballWalletPrivateKey,
    });

    const wallet = smartWallet({
      chain: polygon,
      sponsorGas: true,
      ///factoryAddress: DEFAULT_ACCOUNT_FACTORY_V0_7, // 0.7 factory address

    });

    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });

    const snowballWalletAddress = account.address;

    console.log("snowballWalletAddress: ", snowballWalletAddress);
    // 0xef236138f40fadCac5Af0E01bB51612ad116C91f



      const transactions = [] as any;



      const transactionMaster = transfer({
        contract: contractUSDT,
        to: toWalletAddress,
        amount: amount,
      });
      transactions.push(transactionMaster);



      
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
      
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );
      console.log("batchResponse", batchResponse);

      if (!batchResponse) {
        return NextResponse.json({
          result: {
            error: "batchResponse is null",
          },
        });
      }



      return NextResponse.json({
        result: {
          response: batchResponse,
        },


      });





    } catch (error) {
      console.error("error", error);
      return NextResponse.json({
          
          result: {
              error,
          },
      });

    }
      


}

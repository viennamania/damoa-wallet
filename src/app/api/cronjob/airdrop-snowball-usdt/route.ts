import { NextResponse, type NextRequest } from "next/server";

import moment from 'moment';

import { Network, Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';



import {
  getOneByWalletAddress,
  getOneByTelegramId,
} from '@lib/api/user';


import {
  checkReferralRewardsDay,
  insertReferralRewards,
} from '@lib/api/reward';

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
    smartWallet,
    getWalletBalance,
    SmartWalletOptions,
} from "thirdweb/wallets";


import {
    mintTo,
    //totalSupply,
    transfer,
    
    getBalance,
  
    //balanceOf,
  
} from "thirdweb/extensions/erc20";

import {
  getNFT,

  balanceOf,
  
  totalSupply,
  
} from "thirdweb/extensions/erc1155";
import { parse } from "path";
import { token } from "thirdweb/extensions/vote";


///import { Network, Alchemy } from 'alchemy-sdk';


//import { useSearchParams } from 'next/navigation'
 

const chain = polygon;


// USDT Token (USDT)
const tokenContractAddressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';




export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic';



const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);




export async function GET(request: NextRequest) {

 
  // get prarameter from url
  const url = request.nextUrl;
  const searchParams = url.searchParams;

  const tokenId = searchParams.get("tokenId");

  console.log("tokenId: ", tokenId);
  


  if (tokenId !== "0" && tokenId !== "1") {
    return NextResponse.json({
      error: "tokenId is not 0 or 1",
    });
  }

    //const tokenId = BigInt("0");



    // check time 
    /*
    const date = new Date();
    const hours = date.getHours() + 9;
    if (hours >= 23 || hours < 9) {

      
      return;
    }
    */







    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY || "",
    });


    const contractUSDT = getContract(
      {
        client: client,
        chain: chain,
        address: tokenContractAddressUSDT,
      }
    );
  
    const snowballWalletPrivateKey = process.env.똑똑한코인_REWARD_WALLET_PRIVATE_KEY || "";
  
 

    const personalAccount = privateKeyToAccount({
      client,
      privateKey: snowballWalletPrivateKey,
    });
  
    const wallet = smartWallet({
      chain: chain,
      sponsorGas: true,
    });


    console.log("wallet: ", wallet);

  
    const account = await wallet.connect({
      client: client,
      personalAccount: personalAccount,
    });


    console.log("account: ", account);

  
    const snowballWalletAddress = account.address;
  
    console.log("snowballWalletAddress: ", snowballWalletAddress);
  
    // 0x35C482f619D3072c0fd6891E249f8BeCCB4e2FCb






    const tokenContractAddressErc1155 = '0x796f8867E6D474C1d63e4D7ea5f52B48E4bA83D6';






    const contractErc1155 = getContract(
      {
        client: client,
        chain: chain,
        address: tokenContractAddressErc1155,
      }
    );





    const result = await alchemy.nft.getOwnersForNft(
      tokenContractAddressErc1155,
      ///tokenId
      BigInt(tokenId)
      
    );

    //console.log("result", result);
    /*
      {    owners: [
        '0x1ab86ceA8DcFBdD56DF8086f5190a2C6d5795C94',
        '0x3C9C78c24148e52393221347af3D3F74A5729e5f',
        '0x542197103Ca1398db86026Be0a85bc8DcE83e440',
        '0x58a9E653ded2004ff94e5Fa3f342412a7B4cc563',
        '0x7071060C66d4f365CdE477436Ca02509912054fF',
        '0xA8B4BE80b986BD6868A2778fAD135aE51f79C332',
        '0xc147840E00F1840183de52FE57AC04ed3d474442',
        '0xC3f8DA6cD73c214aE5665D2555f14a286F152CB1',
        '0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C'
      ],
      pageKey: undefined,
    }
    */

   



    let transactions = [] as any;

    
    if (result && result.owners && result.owners.length > 0) {

      //result.owners.map(async (owner : any) => {
      //result.owners.forEach(async (owner : any) => {

      console.log("result.owners", result.owners);


      for (const owner of result.owners) {

        //const owner = result.owners[0];
        
        const balanceResult = await balanceOf({
            contract: contractErc1155,
            owner: owner,
            //tokenId: tokenId,
            tokenId: BigInt(tokenId),
        });

        //console.log("balanceResult", balanceResult);

        // balanceResult 1n

        const balance = parseFloat(balanceResult.toString());

        ///console.log("owner: ", owner, "balance: ", balance);


        /*
        const airdropAmount = 10;

        const share = ((Number(balance) / Number(totalSupplyResult.toString())) * airdropAmount).toFixed(6);
      

        console.log("owner: ", owner, "balance: ", balance, "share: ", share);
        */

        if (balance > 0.0) {


          const masterWalletAddress = owner;





          // check date
          // if exists, then continue
          const resultCheckDate = await checkReferralRewardsDay({
            masterWalletAddress: masterWalletAddress,
            tokenId: tokenId,
            contractAddress: tokenContractAddressErc1155,
          });


          if (resultCheckDate) {
            console.log("resultCheckDate: ", resultCheckDate);
            continue;
          }














          // getOneByWalletAddress
          const user = await getOneByWalletAddress( masterWalletAddress );
          if (!user) {

            console.log("user is empty");

            //return NextResponse.error();

            continue;

          }




          let agentWalletAddress = masterWalletAddress;

          // get nft from agentWalletAddress
          const response = await alchemy.nft.getOwnersForNft(
            user.start?.split("_")[0] || "",
            BigInt(user.start?.split("_")[1] || "0")
          );


          // { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] }
          if (response?.owners.length > 0) {
            agentWalletAddress = response?.owners[0];
          }








          // if user's referral tokenId is 134, 135, 136, then user address is centerWalletAddress

          let centerWalletAddress = masterWalletAddress;

          let referralContractAddress = "";
          let referralTokenId = 0n;

   
          let userOwner = user;

          let userStart = user.start;


          while (true) {

            ///console.log("userStart: ", userStart);


            referralContractAddress = userStart?.split("_")[0] || "";
            referralTokenId = BigInt(userStart?.split("_")[1] || "0");

            if (referralTokenId === 134n || referralTokenId === 135n || referralTokenId === 136n) {
              //console.log("referralTokenId is 134, 135, 136");
              centerWalletAddress = userOwner.walletAddress;
              break;
            }


            const response = await alchemy.nft.getOwnersForNft(referralContractAddress, referralTokenId);
            // { owners: [ '0xf5fff32cf83a1a614e15f25ce55b0c0a6b5f8f2c' ] }
            const ownerWalletAddress = response?.owners[0];

            if (!ownerWalletAddress) {
              console.log("ownerWalletAddress is empty");
              break;
            }


            const UserResponse = await getOneByWalletAddress( ownerWalletAddress );

            if (!UserResponse) {
              console.log("userOwner is empty");
              break;
            }

            userOwner = UserResponse;

            userStart = userOwner.start;



          }
          


          let masterAmount = 0.0;

          let agentAmount = 0.0;

          let centerAmount = 0.0;
          
          //let platformAmount = 0.0;


 
          //const shareTotalAmount = 1.0 * balance;

          const masterRateTokenId0 = 0.45;
          const masterRateTokenId1 = 4.5;

          const agentRateTokenId0 = 0.09;
          const agentRateTokenId1 = 0.9;

          const centerRateTokenId0 = 0.045;
          const centerRateTokenId1 = 0.45;



          if (BigInt(tokenId) === 0n) {
            masterAmount = masterRateTokenId0 * parseFloat(balance.toString());
            agentAmount = agentRateTokenId0 * parseFloat(balance.toString());
            centerAmount = centerRateTokenId0 * parseFloat(balance.toString());

          } else if (BigInt(tokenId) === 1n) {
            masterAmount = masterRateTokenId1 * parseFloat(balance.toString());
            agentAmount = agentRateTokenId1 * parseFloat(balance.toString());
            centerAmount = centerRateTokenId1 * parseFloat(balance.toString());
          }

          //agentAmount = 3.4 * parseFloat(balance.toString());

          //centerAmount = 1.7 * parseFloat(balance.toString());


          //platformAmount = 0;


          console.log("masterWalletAddress: ", masterWalletAddress, "masterAmount: ", masterAmount);
          console.log("agentWalletAddress: ", agentWalletAddress, "agentAmount: ", agentAmount);
          console.log("centerWalletAddress: ", centerWalletAddress, "centerAmount: ", centerAmount);
          
          //console.log("platformWalletAddress: ", platformWalletAddress, "platformAmount: ", platformAmount);

          const transactionMaster = transfer({
            contract: contractUSDT,
            to: masterWalletAddress,
            amount: masterAmount,
          });
          transactions.push(transactionMaster);

          
          const transactionAgent = transfer({
            contract: contractUSDT,
            to: agentWalletAddress,
            amount: agentAmount,
          });
          transactions.push(transactionAgent);

          const transactionCenter = transfer({
            contract: contractUSDT,
            to: centerWalletAddress,
            amount: centerAmount,
          });
          transactions.push(transactionCenter);



          //console.log("transactions length: ", transactions.length);
        



          // insertReferralRewards

          const data = {
            contractAddress: tokenContractAddressErc1155,
            tokenId: tokenId,
            balance: balance,

            masterWalletAddress: masterWalletAddress,

            agentWalletAddress: agentWalletAddress,
            centerWalletAddress: centerWalletAddress,

            //agentWalletAddress: agentWalletAddress,
            //centerWalletAddress: centerWalletAddress,



            //platformWalletAddress: platformWalletAddress,


            masterAmount: masterAmount,
            agentAmount: agentAmount,
            centerAmount: centerAmount,
            //platformAmount: platformAmount,
            timestamp: moment().unix(),
          };



          const result = await insertReferralRewards(data);

          ////console.log("insertReferralRewards result: ", result);
    




        }


      }



      //console.log("transactions: ", transactions);




      if (transactions.length > 0) {
      
        try {

          
          const batchOptions: SendBatchTransactionOptions = {
            account: account,
            transactions: transactions,
          };
          


          /*
          let transactionsAAA = [] as any;

          const transactionCenter = transfer({
            contract: contractUSDT,
            to: "0x542197103Ca1398db86026Be0a85bc8DcE83e440",
            amount: 90
          });
          transactionsAAA.push(transactionCenter);

          const batchOptions: SendBatchTransactionOptions = {
            account: account,
            transactions: transactionsAAA,
          };
          */
    


          
          const batchResponse = await sendBatchTransaction(
            batchOptions
          );
      
          console.log("batchResponse: ", batchResponse);
      
          if (!batchResponse) {
            return NextResponse.error();
          }
          
          

          return NextResponse.json({
              
              result: {
                  transactions,
              },
          });

        






        } catch (error) {
          console.error("error", error);
          return NextResponse.json({
              
              result: {
                  transactions,
                  error,
              },
          });

        }

      }



      



    }




    return NextResponse.json({
        
        result: {
            transactions,
        },
    });



    /*
    const response = await alchemy.nft.getNftsForOwner(
      walletAddress, {
      omitMetadata: false, // // Flag to omit metadata
    });
  
    ///console.log("response?.ownedNfts", response?.ownedNfts);
  
  
    // get tokenType is 'ERC721' from the response
  
    response?.ownedNfts?.map((nft) => {
    */





      /*
      //console.log("members: ", members);
    
      // amount is random from 0.00001 to 0.1
      const amount = Math.random() * (1 - 0.00001) + 0.00001;

    
      const client = createThirdwebClient({
        secretKey: process.env.THIRDWEB_SECRET_KEY || "",
      });
    
      
      //const contractOptions: ContractOptions = {
      //  client: client,
      //  chain: chain,
      //  address: tokenContractAddressUSDT,
      //};
      
      
      const contractUSDT = getContract(
        //contractOptions
        {
          client: client,
          chain: chain,
          address: tokenContractAddressUSDT,
        }
      );
    
      const claimWalletPrivateKey = process.env.CLAIM_WALLET_PRIVATE_KEY || "";
    
      const personalAccount = privateKeyToAccount({
        client,
        privateKey: claimWalletPrivateKey,
      });
    
      const wallet = smartWallet({
        chain: chain,
        sponsorGas: true,
      });
    
      const account = await wallet.connect({
        client: client,
        personalAccount: personalAccount,
      });
    
      const claimWalletAddress = account.address;
    
      //console.log("claimWalletAddress: ", claimWalletAddress);
      // 0x4EF39b249A165cdA40b9c7b5F64e79bAb78Ff0C2
    
    

      //console.log("members: ", members);

    
      let transactions = [] as any;
    
      const sendAmount = amount / members.length;
    
      members.forEach(async (member : any) => {
    
        const toWalletAddress = member.walletAddress;

        const transaction = transfer({
          contract: contractUSDT,
          to: toWalletAddress,
          amount: sendAmount,
        });
    
        transactions.push(transaction);
    
      } );
    

    

    
      const batchOptions: SendBatchTransactionOptions = {
        account: account,
        transactions: transactions,
      };
    
      const batchResponse = await sendBatchTransaction(
        batchOptions
      );



    return NextResponse.json({
        
        result: {
            members,
            amount,
            claimWalletAddress,
        },
    });
    */

}

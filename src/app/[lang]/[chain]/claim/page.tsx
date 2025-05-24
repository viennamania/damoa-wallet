// nickname settings
'use client';
import React, { use, useEffect, useState } from 'react';



import { toast } from 'react-hot-toast';

import { client } from "../../../client";


import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
    polygon,
    arbitrum,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,
    useConnectModal,

    useConnectedWallets,
    useSetActiveWallet,
} from "thirdweb/react";

import { inAppWallet } from "thirdweb/wallets";


import {
    getProfiles,
} from "thirdweb/wallets/in-app";


import Image from 'next/image';

//import GearSetupIcon from "@/components/gearSetupIcon";

//import Uploader from '@/components/uploader';
//import { add } from 'thirdweb/extensions/farcaster/keyGateway';




import {
    useRouter,
    useSearchParams
  }from "next//navigation";

import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../../dictionaries";

import { deployERC721Contract } from 'thirdweb/deploys';

import {
    lazyMint,
    claimTo,
    mintTo,
 
    totalSupply,
    nextTokenIdToMint,
  
    //nextTokenIdToClaim,

    getOwnedNFTs,

    getNFT,
  
} from "thirdweb/extensions/erc1155";



import {
    getNFT as getNFT721,
} from "thirdweb/extensions/erc721";


import { getContractMetadata } from "thirdweb/extensions/common";


import { Alert, useForkRef } from '@mui/material';


import thirdwebIcon from "@public/thirdweb.svg";
import { add } from 'thirdweb/extensions/farcaster/keyGateway';
import { time } from 'console';


const wallets = [
    inAppWallet({
      auth: {
        options: [
            "phone",
             
        ],
      },
    }),
];


const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum



const erc1155ContractAddress = "0xd782447a0762966714a150dBC0E5a16fE488d566"; // Polygon

/*
const contractErc1155 = getContract({
    client,
    chain: polygon,
    address: erc1155ContractAddress,
});


const nftInfoTbot100 = await getNFT({
    contract: contractErc1155,
    tokenId: 0n,
});

console.log("nftInfoTbot100", nftInfoTbot100);

const nftInfoTbot1000 = await getNFT({
    contract: erc1155ContractAddress,
    tokenId: 1n,
});

const nftInfoTbot10000 = await getNFT({
    contract: erc1155ContractAddress,
    tokenId: 2n,
});
*/


const contractErc1155 = getContract({
    client,
    chain: polygon,
    address: erc1155ContractAddress,
});


export default function AIPage({ params }: any) {

    
    // get params from the URL

    const searchParams = useSearchParams();

    const center = searchParams.get('center') || "";

    const agent = searchParams.get('agent') || "0xD146c66F924C8A1F533ddFFFD63abff11921DdcF";

    const agentNumber = searchParams.get('tokenId') || "0";


    
    
    const [data, setData] = useState({
        title: "",
        description: "",
    
        menu : {
        buy: "",
        sell: "",
        trade: "",
        chat: "",
        history: "",
        settings: "",
        },
    
        Go_Home: "",
        My_Balance: "",
        My_Nickname: "",
        My_Buy_Trades: "",
        My_Sell_Trades: "",
        Buy: "",
        Sell: "",
        Buy_USDT: "",
        Sell_USDT: "",
        Contact_Us: "",
        Buy_Description: "",
        Sell_Description: "",
        Send_USDT: "",
        Pay_USDT: "",
        Coming_Soon: "",
        Please_connect_your_wallet_first: "",

        Wallet_Settings: "",
        Profile_Settings: "",


        My_Wallet_Address: "",
        My_Phone_Number: "",
    
        Wallet_Address_Description1: "",
        Wallet_Address_Description2: "",
    
        I_understand_that_I_should_never_deposit_any_other_tokens: "",

        Copy: "",

        Disconnect_Wallet: "",


        Prompt_input_placeholder: "",

        Real_prompt: "",

        Generate_prompt: "",
    
        Reset_prompt: "",

        Generating_prompt: "",

        Download_Image: "",

        Downloading_Image: "",

        Alert_download_image_success: "",
    
        Make_OpenSea_Collection: "",

        Alert_OpenSea_Collection_made: "",

        If_you_make_an_OpenSea_collection: "",

        Making_OpenSea_Collection: "",

        OpenSea_Collection_Address: "",

        OpenSea_Collection: "",

        Mint_NFT: "",

        Alert_NFT_minted: "",

        Minting_NFT: "",

        Loading_my_images: "",


        Enter_your_nickname: "",

        Nickname_should_be_alphanumeric_lowercase: "",

        Nickname_should_be_at_least_5_characters_and_at_most_10_characters: "",

        Nickname_should_be_5_10_characters: "",

        Save: "",
    
    } );
    
    useEffect(() => {
        async function fetchData() {
            const dictionary = await getDictionary(params.lang);
            setData(dictionary);
        }
        fetchData();
    }, [params.lang]);
    
    const {
        title,
        description,
        menu,
        Go_Home,
        My_Balance,
        My_Nickname,
        My_Buy_Trades,
        My_Sell_Trades,
        Buy,
        Sell,
        Buy_USDT,
        Sell_USDT,
        Contact_Us,
        Buy_Description,
        Sell_Description,
        Send_USDT,
        Pay_USDT,
        Coming_Soon,
        Please_connect_your_wallet_first,

        Wallet_Settings,
        Profile_Settings,

        My_Wallet_Address,
        My_Phone_Number,

        Wallet_Address_Description1,
        Wallet_Address_Description2,

        I_understand_that_I_should_never_deposit_any_other_tokens,

        Copy,

        Disconnect_Wallet,


        Prompt_input_placeholder,

        Real_prompt,

        Generate_prompt,

        Reset_prompt,

        Generating_prompt,

        Download_Image,

        Downloading_Image,

        Alert_download_image_success,

        Make_OpenSea_Collection,

        If_you_make_an_OpenSea_collection,

        Making_OpenSea_Collection,

        Alert_OpenSea_Collection_made,

        OpenSea_Collection_Address,

        OpenSea_Collection,

        Mint_NFT,

        Alert_NFT_minted,

        Minting_NFT,

        Loading_my_images,

        Enter_your_nickname,

        Nickname_should_be_alphanumeric_lowercase,

        Nickname_should_be_at_least_5_characters_and_at_most_10_characters,

        Nickname_should_be_5_10_characters,

        Save,

    } = data;
    
    


    const router = useRouter();



    // agentBot
    const [agentBot, setAgentBot] = useState("");



    // get the active wallet
    const activeWallet = useActiveWallet();


    const smartAccount = useActiveAccount();

    
    
    const address = smartAccount?.address || "";

    // test
    ///const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";







    /*
    const connectWallets = useConnectedWallets();
    const smartConnectWallet = connectWallets?.[0];
    const setActiveAccount = useSetActiveWallet();
    useEffect(() => {
        setActiveAccount(
            smartConnectWallet
        )

    } , [smartConnectWallet , setActiveAccount]);
    */








    const contract = getContract({
        // the client you have created via `createThirdwebClient()`
        client,
        // the chain the contract is deployed on
        
        
        chain: params.chain === "arbitrum" ? arbitrum : polygon,
        
        
        
        // the contract's address
        ///address: contractAddress,

        address: params.chain === "arbitrum" ? contractAddressArbitrum : contractAddress,


        // OPTIONAL: the contract's abi
        //abi: [...],
    });





    const [balance, setBalance] = useState(0);

    useEffect(() => {
  
      if (!address) return;
      // get the balance
  
  
      if (!contract) {
        return;
      }
  
      const getBalance = async () => {
  
        try {
          const result = await balanceOf({
            contract,
            address: address,
          });
      
          //console.log(result);
      
          setBalance( Number(result) / 10 ** 6 );
  
        } catch (error) {
          console.error("Error getting balance", error);
        }
  
      };
  
      if (address) getBalance();
  
      // get the balance in the interval
      /*
      const interval = setInterval(() => {
        getBalance();
      }, 1000);
  
  
      return () => clearInterval(interval);
        */
  
    } , [address, contract]);



    
    /*
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
  
  
      if (smartAccount) {
  
        //const phoneNumber = await getUserPhoneNumber({ client });
        //setPhoneNumber(phoneNumber);
  
  
        getUserPhoneNumber({ client }).then((phoneNumber) => {
          setPhoneNumber(phoneNumber || "");
        });
  
  
  
      }
  
    } , [smartAccount]);
     */



    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userType, setUserType] = useState("");
    const [userTelegramId, setUserTelegramId] = useState("");
    //const [userAvatar, setUserAvatar] = useState("");
    //const [userNickname, setUserNickname] = useState("");



    useEffect(() => {

        const fetchData = async () => {
    
          getProfiles({ client }).then((profiles) => {
            
            ///console.log("profiles======", profiles);
    
            if (profiles) {
              profiles.forEach((
                profile  // { type: "phone", details: { phone: "+8201098551647", id: "30e2276d8030b0bb9c27b4b7410d9de8960bab3d632f34d23d6e089182625506" } }
              ) => {
                if (profile.type === "phone") {
                  setUserType("phone");
                  setUserPhoneNumber(profile.details.phone || "");
                } else if (profile.type === "telegram") {
                  setUserType("telegram");
                  const details = profile.details as any;
                  setUserTelegramId(details.id || "");
                }
              });
            }
    
          } );
    
        }
    
    
        client && fetchData();
    
      }, []);



    const { connect, isConnecting } = useConnectModal();

    const handleConnect = async () => {
      await connect({
        chain: params.chain === "arbitrum" ? arbitrum : polygon,
        client,
        wallets,
  
        accountAbstraction: {
            chain: params.chain === "arbitrum" ? arbitrum : polygon,
              
            sponsorGas: true
        },

  
  
        showThirdwebBranding: false,
        theme: 'light',
        
        /*
        appMetadata: {
          name: "GoodTether",
          description: "GoodTether",
          url: "https://gold.goodtether.com",
          //icons: ["https://gold.goodtether.com/logo.png"],
        },
        */
  
        size: 'compact',
  
        /*
        size: 'wide',
  
        welcomeScreen: {
          title: "Custom Title",
          subtitle: "Custom Subtitle",
          img: {
            src: "https://example.com/image.png",
            width: 100,
            height: 100,
          },
        },
        */
      
       locale: 'en_US',
        
      });
    };
  

    
    const [nickname, setNickname] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [userCode, setUserCode] = useState("");



    const [masterBot, setMasterBot] = useState({} as any);


    //console.log("address", address);

    const [loadingUserData, setLoadingUserData] = useState(false);
    const [isLoadingUserDataError, setIsLoadingUserDataError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {

            if (!address) {
                return;
            }

            setLoadingUserData(true);

            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching user");

                setIsLoadingUserDataError(true);

                setLoadingUserData(false);
                return;
            }

            const data = await response.json();

            //console.log("data", data);


            if (data.result) {
                setNickname(data.result.nickname);
                setUserCode(data.result.id);

                setMasterBot(data.result.masterBot);

            }

            setLoadingUserData(false);
        };

        fetchData();
    }, [address]);






    /*
        settlements

        {
        "applicationId": 945194,
        "timestamp": "2025-01-15T00:32:31.295Z",
        "settlementClaim": {
            "settlementTradingVolume": 23432.23
            "totalSettlementTradingVolume": 23432.23
            "okxUid": "650230456906336098",
            "masterInsentive": "2.69895320",
            "masterWalletAddress": "0xfD6c58c58029212a5f181EA324cBC6051c7161EF",
        }
        }
      */





    const [myAgent, setMyAgent] = useState({} as any);
    const [myAgentNFT, setMyAgentNFT] = useState({} as any);

    const [loadingMyAgent, setLoadingMyAgent] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoadingMyAgent(true);
            const response = await fetch("/api/agent/getMyAgent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error("Error fetching my agent");
                setLoadingMyAgent(false);
                return;
            }

            const data = await response.json();

            ////console.log("getMyAgent data=========", data);

            if (data.result) {

                setMyAgent(data.result);


                const erc721ContractAddress = data.result.agentBot;
                const tokenId = data.result.agentBotNumber;

                const fetchedNFT = await fetch("/api/agent/getAgentNFTByContractAddressAndTokenId", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        erc721ContractAddress: erc721ContractAddress,
                        tokenId: tokenId,
                    }),
                });

                if (!fetchedNFT.ok) {
                    console.error("Error fetching NFT");
                    setLoadingMyAgent(false);
                    return;
                }


                const nftData = await fetchedNFT.json();

                setMyAgentNFT(nftData.result);

                
            }

            setLoadingMyAgent(false);


        };

        address && fetchData();

    } , [address]);




    // getSettlementHistoryByMasterWalletAddress
    const [settlementHistory, setSettlementHistory] = useState([] as any[]);
    const [loadingSettlementHistory, setLoadingSettlementHistory] = useState(false);
    const getSettlementHistory = async () => {
        
        setLoadingSettlementHistory(true);

        const response = await fetch("/api/agent/getSettlementHistoryByMasterWalletAddress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                limit: 10,
                page: 1,
                walletAddress: address,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching settlement history");
            setLoadingSettlementHistory(false);
            return;
        }

        const data = await response.json();

        ///console.log("data", data);

        if (data.settlements) {
            setSettlementHistory(data.settlements);
        } else {
            setSettlementHistory([]);
        }

        setLoadingSettlementHistory(false);

    }

    useEffect(() => {
        address && getSettlementHistory();
    } , [address]);




    const [statisticsDaily, setStatisticsDaily] = useState([] as any[]);

    const [loadingStatisticsDaily, setLoadingStatisticsDaily] = useState(false);

    const [averageTradingAccountBalanceDaily, setAverageTradingAccountBalanceDaily] = useState(0);

    const [sumMasterBotProfit, setSumMasterBotProfit] = useState(0);

    useEffect(() => {

        const getStatisticsDaily = async () => {
            
            setLoadingStatisticsDaily(true);

            const response = await fetch("/api/settlement/statistics/dailyByMasterWalletAddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    masterWalletAddress: address,
                }),
            });

            if (!response.ok) {
                console.error('Error fetching data');

                setLoadingStatisticsDaily(false);
                return;
            }

            const data = await response.json();

            ///console.log("getStatisticsDaily data", data);

            //setStatisticsDaily(data.statisticsDaily);

            const tradingVolumeDaily = data.tradingVolume;

            const tradingAccountBalanceDaily = data.tradingAccountBalance;

            // select average from tradingAccountBalanceDaily where tradingAccountBalanceDaily.average > 0

            let sumTradingAccountBalanceDaily = 0;
            let countTradingAccountBalanceDaily = 0;
            for (let i = 0; i < tradingAccountBalanceDaily?.length; i++) {
                if (tradingAccountBalanceDaily[i].average > 0) {
                    sumTradingAccountBalanceDaily += tradingAccountBalanceDaily[i].average;
                    countTradingAccountBalanceDaily++;
                }
            }

            setAverageTradingAccountBalanceDaily(sumTradingAccountBalanceDaily / countTradingAccountBalanceDaily);


            let sumMasterBotProfit = 0;

            for (let i = 0; i < tradingAccountBalanceDaily?.length; i++) {
                if (tradingAccountBalanceDaily[i].average > 0) {

                    // find tradingVolumenDaily where yearmonthday is the same


                    tradingVolumeDaily?.map((item: any) => {
                        if (item._id.yearmonthday === tradingAccountBalanceDaily[i]._id.yearmonthday) {
                            
                            sumMasterBotProfit += item.masterReward / tradingAccountBalanceDaily[i].average * 100;

                        }
                    } );

                }
            }
            setSumMasterBotProfit(sumMasterBotProfit);

            //console.log("sumMasterBotProfit", sumMasterBotProfit);
            ///console.log("averageTradingAccountBalanceDaily", averageTradingAccountBalanceDaily);


            //setStatisticsDaily(tradingVolumenDaily);


            const merged = tradingVolumeDaily?.map((item: any) => {
                const tradingAccountBalance = tradingAccountBalanceDaily?.find((item2: any) => item2._id.yearmonthday === item._id.yearmonthday);
        
                return {
                    ...item,
                    tradingAccountBalance: tradingAccountBalance?.average || 0,
                };
            });

            ///console.log("merged", merged);

            /*
            {
                "_id": {
                    "yearmonthday": "2025-01-19",
                    "claimedTradingVolume": 432.11999999999534
                },
                "tradingAccountBalance": 42.271692100295574
}
            */

            setStatisticsDaily(merged);






            setLoadingStatisticsDaily(false);

        }

        address && getStatisticsDaily();

    } , [address]);




    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

            <div className="py-0 w-full">
        

                <AppBarComponent />

                
                {/* history back */}
                {/* sticky top-0 bg-white */}
                <div className='
                    sticky top-0 bg-white z-50
                    flex flex-row items-center justify-between gap-4
                    p-4
                    w-full
                '>
                    <button
                        onClick={() => router.back()}
                        className="flex flex-row items-center gap-2 bg-gray-500 text-white p-2 rounded-lg
                        hover:bg-gray-600
                        "
                    >
                        <Image
                        src="/icon-back.png"
                        width={24}
                        height={24}
                        alt="Back"
                        />
                        <span className='text-sm text-white'>
                        뒤로가기
                        </span>
                    </button>
                </div>
                


                <div className="flex flex-col items-start justify-center space-y-4">

                    <div className='flex flex-row items-center gap-4'>
                        
                        <Image
                            src="/tbot.png"
                            alt="TBOT"
                            width={100}
                            height={40}
                        />
                        <span className="text-sm font-semibold text-gray-500">
                            치근 보상내역 (최근 10개)
                        </span>
                    </div>

                    
                    <div className='mt-10 w-full flex flex-col items-start gap-5'>
                        {/* live icon */}
                        {address ? (
                            <div className='flex flex-row items-center gap-2'>
                                <Image
                                    src="/icon-wallet.png"
                                    alt="Live"
                                    width={50}
                                    height={50}
                                />

                                <span className='text-lg font-semibold text-blue-500'>
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                </span>


                            </div>
                        ) : (
                            <div className='flex flex-col items-start gap-2'>
                                
                                <ConnectButton
                                    client={client}
                                    wallets={wallets}
                                    accountAbstraction={{
                                        chain: polygon,
                                        
                                        sponsorGas: true
                                    }}
                                    theme={"light"}
                                    connectButton={{
                                        label: "Sign in with Wallet",
                                    }}
                                    connectModal={{
                                        size: "wide", 
                                        titleIcon: "https://damoa-wallet.vercel.app/icon-kcbc.jpeg",                           
                                        showThirdwebBranding: false,

                                    }}
                                    locale={"ko_KR"}
                                    //locale={"en_US"}
                                />

                      


                                <span className='text-sm font-semibold text-red-500'>
                                    {Please_connect_your_wallet_first}
                                </span>
                            </div>
                        )}
                    </div>

                    {address && userCode && nickname && (
                        <div className='flex flex-row items-center gap-2'>
                            {/* dot */}
                            <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                            <span className='text-sm font-semibold text-zinc-800'>
                                {My_Nickname}
                            </span>
                            <span className='text-2xl font-semibold text-blue-500'>
                                {nickname}
                            </span>
                        </div>
                    ) }

                    {address
                    && !loadingUserData && !isLoadingUserDataError
                    && !userCode && !nickname && (
                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-red-500'>
                                아이디가 없습니다. 아이디를 만들어 주세요.
                            </span>

                        </div>
                    )}

                    {!loadingUserData && !myAgent?.masterBotInfo && (

                        <div className='w-full flex flex-col gap-2 items-start justify-between'>
                            <span className='text-lg font-semibold text-gray-500'>
                                마스트봇이 없습니다.
                            </span>
                            <span className='text-lg font-semibold text-gray-500'>
                                마스트봇을 만들어 주세요.
                            </span>
                            {/* goto button for /tbot */}
                            <button
                                onClick={() => {
                                    router.push(
                                        '/' + params.lang + '/' + params.chain + '/tbot'
                                    );
                                }}
                                className='w-full bg-blue-500 text-white p-4 rounded-lg'
                            >
                                마스트봇 만들로 가기
                            </button>
                        </div>
                    )}


                    {/* masterBot */}
                    {myAgent?.masterBotInfo ? (

                        <div className='w-full flex flex-col gap-2 items-start justify-between'>

                            <div className='flex flex-col gap-2
                                border border-gray-300 p-4 rounded-lg
                            '>
                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src="/logo-opensea.png"
                                        alt="OpenSea"
                                        width={20}
                                        height={20}
                                    />
                                    <span className='text-sm font-semibold text-blue-500'>
                                        Master Bot NFT
                                    </span>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                    <Image
                                        src={myAgent?.masterBotInfo?.imageUrl || "/logo-masterbot100.png"}
                                        alt="Master Bot"
                                        width={500}
                                        height={500}
                                        className='animate-pulse w-full rounded-lg'
                                    />

                                </div>
                            </div>




                           {loadingStatisticsDaily && (
                                <div className='flex flex-col items-center justify-center'>
                                        <Image
                                            src="/icon-reward.gif"
                                            alt="Loading"
                                            width={300}
                                            height={300}
                                        />
                                </div>
                            )}

                           {/* statisticsDaily */}
                           {/* tradingVolume, total, count */}
                           <div className='mt-5 flex flex-col gap-5
                                border border-gray-300 p-4 rounded-lg bg-gray-100
                            '>
                            

                                <div className='w-full flex flex-row gap-2 items-center justify-start'>
                                    <Image
                                        src="/icon-mining.gif"
                                        alt="mining"
                                        width={50}
                                        height={50}
                                        className='rounded-lg'
                                    />

                                    <span className='text-lg text-gray-800 font-semibold'>
                                        일별 채굴보상
                                    </span>
                                </div>

                                
                                { // 날짜, 거래량, 마스터봇 보상, 에이전트봇 보상, 센터봇 보상 table view
                                
                                !loadingStatisticsDaily && statisticsDaily?.length > 0 && (

                                    <div className='w-full flex flex-col gap-5'>

                                        <table className='w-full'>
                                            <thead
                                                className='bg-gray-200
                                                    border border-gray-300 p-2 rounded-lg
                                                '
                                            >
                                                <tr
                                                    className='border-b border-gray-300
                                                        hover:bg-gray-200 h-12
                                                    '
                                                >
                                                    <th className='text-sm text-gray-800 font-semibold text-center'>
                                                        날짜
                                                    </th>
                                                    <th className='text-sm text-gray-800 font-semibold text-center'>
                                                        AUM($)
                                                    </th>

                                                    <th className='text-sm text-gray-800 font-semibold text-center'>
                                                        채굴보상
                                                    </th>
                                                    {/* 운용자산대비 채굴보상 비율 */}
                                                    <th className='text-sm text-gray-800 font-semibold text-center'>
                                                        비율(%)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody
                                                className='bg-gray-100
                                                    border border-gray-300 p-2 rounded-lg
                                                '
                                            >
                                                {statisticsDaily.map((item: any) => (
                                                    <tr key={item._id.yearmonthday}
                                                        className='border-b border-gray-300
                                                            hover:bg-gray-200 h-12
                                                        '>
                                                        <td className='text-sm text-gray-800 text-center w-40'>
                                                            {item._id.yearmonthday.slice(5)}
                                                        </td>

                                                        <td className='text-sm text-red-800 text-right'
                                                            style={{
                                                                fontFamily: 'monospace',
                                                            }}
                                                        >
                                                            {
                                                                Number(item.tradingAccountBalance.toFixed(2)).toLocaleString('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'USD'
                                                                })
                                                            }
                                                        </td>


                                                        <td className='text-sm text-gray-800 text-right pl-2 pr-2'
                                                            style={{
                                                                fontFamily: 'monospace',
                                                            }}
                                                        >
                                                            <div className='flex flex-row items-center justify-end gap-2'>
                                                                <span className='text-sm text-green-500'>
                                                                    {
                                                                    Number(item.masterReward.toFixed(2)).toLocaleString('en-US', {
                                                                        style: 'currency',
                                                                        currency: 'USD'
                                                                    })
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        
                                                        <td className='text-lg text-gray-800 text-right pl-2 pr-2'
                                                            style={{
                                                                fontFamily: 'monospace',
                                                            }}
                                                        >
                                                            <div className='flex flex-row items-center justify-end gap-2'>
                                                                
                                                                {
                                                                    (item.tradingAccountBalance > 0) ? (
                                                                        <span className='text-lg text-blue-500 font-semibold'>
                                                                            {
                                                                                (item.masterReward / item.tradingAccountBalance * 100).toFixed(4) + "%"
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className='text-sm text-gray-800 font-semibold'>
                                                                            N/A
                                                                        </span>
                                                                    )
                                                                }
                                                              
                                                            </div>
                                                        </td>

                                                    </tr>
                                                ))}


                                                {/* sum of count, total, masterReward, agentReward, centerReward */}
                                                <tr
                                                    className='border-b border-gray-300
                                                        hover:bg-gray-200 p-2

                                                        bg-gray-200
                                                        h-12

                                                    '
                                                >
                                                    <td className='text-lg text-gray-800 font-semibold text-center'>
                                                        {''}
                                                    </td>
                                                    <td className='text-lg text-red-800 text-right'
                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                           
                                                        }
                                                    </td>

                                                    <td className='text-lg text-green-500 text-right pl-2 pr-2'
                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                            Number(statisticsDaily.reduce((acc, item) => acc + item.masterReward, 0).toFixed(2)).toLocaleString('en-US', {
                                                                style: 'currency',
                                                                currency: 'USD'
                                                            })
                                                        }
                                                    </td>
                                                    <td className='text-xl text-blue-500 font-semibold text-right pl-2 pr-2'
                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                            sumMasterBotProfit.toFixed(4) + "%"
                                                        }
                                                    </td>

                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>

                                )}

                            </div>





                            {/* 보상 내역 table view designed */}
                            {/* getSettlementHistory */}
                            {/* 지급시간, 거래량, 보상(USDT) */}

                            {/* 거래량: if totalSettlementTradingVolume not exist, then use settlementTradingVolume */}



                            <div className='mt-5 w-full flex flex-col gap-2 items-start justify-between'>
                                <div className='w-full flex flex-row items-center gap-2'>
                                    {/* dot */}
                                    <div className='w-4 h-4 bg-blue-500 rounded-full'></div>
                                    <span className='text-lg font-semibold text-gray-500'>
                                        최근 보상 내역 (최근 10개)
                                    </span>
                                </div>

                                {loadingSettlementHistory ? (
                                    <div className='w-full flex flex-col gap-2 items-start justify-between'>
                                        <span className='text-lg font-semibold text-gray-500'>
                                            Loading...
                                        </span>
                                    </div>
                                ) : (
                                    <table
                                        className='w-full border border-gray-300'
                                    >
                                        <thead>
                                            <tr>


                                                <th className='border border-gray-300 p-2 text-sm'>
                                                    보상금액(USDT)
                                                </th>
                                                <th className='border border-gray-300 p-2 text-sm'>
                                                    정산채굴량
                                                </th>
                                                <th className='border border-gray-300 p-2 text-sm'>
                                                    지급시간
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                      
                                            {settlementHistory.map((settlement: any, index: number) => (
                                                <tr key={index}>

                                                    <td
                                                        className='border border-gray-300 p-2 text-2xl text-right text-blue-500'
                                                        style={{
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {
                                                        Number(settlement.settlementClaim.masterInsentive).toFixed(6)
                                                        }
                                                    </td>

                                                    <td className='border border-gray-300 p-2 text-sm text-right'>
                                                        {
                                                        settlement.settlementClaim.totalSettlementTradingVolume
                                                        ? Number(settlement.settlementClaim.totalSettlementTradingVolume).toFixed(0)
                                                        : Number(settlement.settlementClaim.settlementTradingVolume).toFixed(0)
                                                        }
                                                    </td>


                                                    <td className='border border-gray-300 p-2 text-sm text-right'>
                                                        {
                                                            (
                                                                new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 ? "방금 전" : (
                                                                    (
                                                                        new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 ? 
                                                                        Math.floor(
                                                                            (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60
                                                                        ) + "분 전" : (
                                                                            (
                                                                                new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 ? 
                                                                                Math.floor(
                                                                                    (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60
                                                                                ) + "시간 전" : (
                                                                                    (
                                                                                        new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 * 7 ? 
                                                                                        Math.floor(
                                                                                            (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24
                                                                                        ) + "일 전" : (
                                                                                            (
                                                                                                new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 * 30 ? 
                                                                                                Math.floor(
                                                                                                    (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24 / 7
                                                                                                ) + "주 전" : (
                                                                                                    (
                                                                                                        new Date().getTime() -  new Date(settlement.timestamp).getTime() < 1000 * 60 * 60 * 24 * 30 * 12 ? 
                                                                                                        Math.floor(
                                                                                                            (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24 / 30
                                                                                                        ) + "달 전" : (
                                                                                                            Math.floor(
                                                                                                                (new Date().getTime() -  new Date(settlement.timestamp).getTime()) / 1000 / 60 / 60 / 24 / 30 / 12
                                                                                                            ) + "년 전"
                                                                                                        )
                                                                                                    )
                                                                                                )
                                                                                            )
                                                                                        )
                                                                                    )
                                                                                )
                                                                            )
                                                                        )
                                                                    )

                                                                )

                                                            )

                                                        }


                                                    </td>



                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                            </div>






                        </div>
                    ) : (
     
                        <div className='w-full flex flex-col xl:flex-row items-center justify-between gap-2'>

                        </div>

                    )}




                </div>


                {/* select agent */}



            </div>

        </main>

    );

}

          




function Header(
    {
        center,
        agent,
        tokenId,
    } : {
        center: string
        agent: string
        tokenId: string
    }
) {

    const router = useRouter();
  
  
    return (
      <header className="flex flex-col items-center mb-5 md:mb-10">
  
        {/* header menu */}
        <div className="w-full flex flex-row justify-between items-center gap-2
          bg-green-500 p-4 rounded-lg mb-5
        ">
            {/* logo */}
            <button
                onClick={() => {
                    router.push(
                        '/kr/polygon/?agent=' + agent + '&tokenId=' + tokenId + '&center=' + center
                    );
                }}
            >            
                <div className="flex flex-row gap-2 items-center">
                    <Image
                    src="/icon-kcbc.jpeg"
                    alt="Circle Logo"
                    width={35}
                    height={35}
                    className="rounded-full w-10 h-10 xl:w-14 xl:h-14"
                    />
                    <span className="text-lg xl:text-3xl text-gray-800 font-semibold">
                        똑똑한코인
                    </span>
                </div>
            </button>


            <div className="flex flex-row gap-2 items-center">

            </div>

        </div>
        
      </header>
    );
  }
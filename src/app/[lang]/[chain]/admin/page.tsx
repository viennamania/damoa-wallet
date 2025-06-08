"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";



import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

import { useSearchParams } from "next/navigation";

import {
  AutoConnect,
  ConnectButton,
  useActiveWallet,
} from "thirdweb/react";

import {
  polygon,
  arbitrum,
  ethereum,
} from "thirdweb/chains";

import {
  getContract,
} from "thirdweb";



import { balanceOf, transfer } from "thirdweb/extensions/erc20";

import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";

import { client } from "../../../client";


const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "discord",
        "email",
        "x",
        "passkey",
        //"phone",
        "facebook",
        "line",
        "apple",
        "coinbase",
      ],
    },
  }),
  /*
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
  createWallet("io.metamask"),
  //createWallet("com.binance.wallet"),
  createWallet("com.bitget.web3"),
  createWallet("com.trustwallet.app"),
  createWallet("com.okex.wallet"),
  */
];



const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon

const contractAddressKCT = "0xeb9198c8342BcB29A1Fe41d45A6CF6A3Ac568a0E"; // KCT on Polygon


const claimWalletAddress = "0x35C482f619D3072c0fd6891E249f8BeCCB4e2FCb"; // claim wallet address




function HomeContent() {

  const searchParams = useSearchParams();

  const marketingCenter = searchParams.get('marketingCenter');

  const center = searchParams.get('center');


  console.log('center', center);


  
  const account = useActiveAccount();

  const activeWallet = useActiveWallet();
  

  const contract = getContract({
    client,
    chain: polygon,
    address: contractAddress,
  });

  const contractKCT = getContract({
    client,
    chain: polygon,
    address: contractAddressKCT,
  });



  const address = account?.address;


  // test address
  //const address = "0x542197103Ca1398db86026Be0a85bc8DcE83e440";



    // select center
    const [selectCenter, setSelectCenter] = useState(center);






  const [balance, setBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getBalance = async () => {

      if (!address) {
          return;
      }
      
      const result = await balanceOf({
        contract,
        address: address,
      });

  
      //console.log(result);

      if (!result) return;
  
      setBalance( Number(result) / 10 ** 6 );

    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract]);



  // claim wallet usdt balance
  const [claimWalletBalance, setClaimWalletBalance] = useState(0);
  useEffect(() => {
    // get the balance
    const getClaimWalletBalance = async () => {
      if (!claimWalletAddress) {
          return;
      }

      const result = await balanceOf({
        contract: contract,
        address: claimWalletAddress,
      });
      //console.log(result);
      if (!result) return;
      setClaimWalletBalance( Number(result) / 10 ** 6 );
    };
    getClaimWalletBalance();
    const interval = setInterval(() => {
      if (claimWalletAddress) getClaimWalletBalance();
    } , 1000);
    return () => clearInterval(interval);
  } , [contract]);


  console.log("claimWalletBalance", claimWalletBalance);



  // get centerList
  const [centerList, setCenterList] = useState([] as any[]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
          setLoadingCenters(true);
          const response = await fetch("/api/user/getAllCenters", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  limit: 100,
                  page: 0,
                  marketingCenter: marketingCenter,
              }),
          });

          if (!response.ok) {
              console.error("Error fetching centers");
              setLoadingCenters(false);
              return;
          }

          const data = await response.json();

          //console.log("getAllCenters data", data);
          /*
          [
            {
                "_id": "owin_anawin_bot",
                "count": 3
            },
            {
                "_id": "owin_kingkong_bot",
                "count": 1
            },

          ]
          */

          setCenterList(data.result);

          setLoadingCenters(false);

      };

      marketingCenter && fetchData();

  }, [marketingCenter]);




  // select user by walletAddress
  const [selectUser, setSelectUser] = useState(null);

  // get agnetNft
  const [agentNft, setAgentNft] = useState<any[]>([]);
  const [loadingAgentNft, setLoadingAgentNft] = useState(false);

  
  const [noahNft, setNoahNft] = useState([] as any[]);
  const [loadingNoahNft, setLoadingNoahNft] = useState(false);


  const [userBalanceUsdt, setUserBalanceUsdt] = useState(0);
  const [userBalanceKCT, setUserBalanceKCT] = useState(0);


  useEffect(() => {

    const fetchNfts = async () => {

        setLoadingAgentNft(true);


        const response = await fetch("/api/affiliation/getAgentNFTByWalletAddress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: selectUser,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching agentNft");
            setLoadingAgentNft(false);
            return;
        }

        const data = await response.json();

        //console.log("getAgentNft data", data);
        /*
        [
          {

              "name": "미자부자다",
              "tokenUri": "https://alchemy.mypinata.cloud/ipfs/QmPdQJ5HjqvVSbqqsMno5HrAatopNw8UEBRSdg7cqEPdGu/0",
              "image": {
                  "thumbnailUrl": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/matic-mainnet/c0dfa75257307f42ad3d6467ba13563a",
              },
          },

      ]
        */

        setAgentNft(data.result.ownedNfts);


        setLoadingAgentNft(false);

    };

        

    const fetchNoahNfts = async () => {

      setLoadingNoahNft(true);


      const response = await fetch("/api/snowball/getAgentNFTByWalletAddress", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              walletAddress: selectUser,
          }),
      });

      if (!response.ok) {
          console.error("Error fetching agentNft");
          setLoadingNoahNft(false);
          return;
      }

      const data = await response.json();

      setNoahNft(data.result.ownedNfts);


      setLoadingNoahNft(false);

    };




      // fetch one application by walletAddress
      /*
      const fetchApplication = async () => {

        const response = await fetch("/api/agent/getOneApplication", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: selectUser,
            }),
        });

        if (!response.ok) {
            console.error("Error fetching application");
            return;
        }

        const data = await response.json();

        console.log("getOneApplication data", data);

        setApplicationData(data.result);


      }
      */



      // get usdt balance
      const fetchUserBalanceUsdt = async () => {

        if (!selectUser) {
          return;
        }

        const result1 = await balanceOf({
          contract,
          address: selectUser,
        });

        setUserBalanceUsdt( Number(result1) / 10 ** 6 );

      }


      // get KCT balance
      const fetchUserBalanceKCT = async () => {

        if (!selectUser) {
          return;
        }

        const result2 = await balanceOf({
          contract: contractKCT,
          address: selectUser,
        });

        setUserBalanceKCT( Number(result2) / 10 ** 18 );

      }





      if (selectUser) {

        fetchNfts();

        fetchNoahNfts();

        //fetchApplication();

        fetchUserBalanceUsdt();
        fetchUserBalanceKCT();

      }

  }, [selectUser]);




  // getAllUsersTelegramIdByCenter


  const [searchNickname, setSearchNickname] = useState("");
  
  const [totalCount, setTotalCount] = useState(0);
  const [users, setUsers] = useState([] as any[]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
      const fetchData = async () => {
          setLoadingUsers(true);
          const response = await fetch("/api/user/getAllUsers", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  walletAddress: address,
                  limit: 100,
                  page: 1,
                  center: selectCenter,
                  searchNickname: searchNickname,
              }),
          });

          if (!response.ok) {
              console.error("Error fetching users");
              setLoadingUsers(false);
              return;
          }

          const data = await response.json();

          //console.log("getAllUsers data", data);
          //setAgentBotSummaryList(data.resultSummany);


          setUsers(data.result.users);

          setTotalCount(data.result.totalCount);

          setLoadingUsers(false);



          /*
          data.result.users.forEach(async (user: any) => {

            const result = await balanceOf({
              contract: contractKCT,
              address: user.walletAddress,
            });

            //console.log("user balance KCT", result);
            user.balanceKCT = Number(result) / 10 ** 18;
          }  );
          */


      };

      if (address) {
          fetchData();
      }

  }, [address ]);


  //console.log("users", users);



  // get KCT balance of each user
  const getKCTBalanceOfUserWalletAddress = async (walletAddress: string) => {
      if (!walletAddress) {
          return 0;
      }

      const result = await balanceOf({
          contract: contractKCT,
          address: walletAddress,
      });

      console.log("user balance KCT", result);

      const balance = Number(result) / 10 ** 18;

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.walletAddress === walletAddress) {
            return {
              ...user,
              balanceKCT: balance,
            };
          }
          return user;
        })
      );

  }





  // airDrop
  const [amountAirDrop, setAmountAirDrop] = useState(0);
  const [loadingAirDrop, setLoadingAirDrop] = useState(false);
  const airDrop = async (amountAirDrop: number) => {

      setLoadingAirDrop(true);
      const response = await fetch("/api/settlement/airdrop", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              amount: amountAirDrop,
              center: selectCenter,
          }),
      });

      if (!response.ok) {
          console.error("Error airdropping");
          setLoadingAirDrop(false);
          return;
      }

      const data = await response.json();

      //console.log("airdrop data", data);

      if (data?.result) {
          alert("에어드롭이 완료되었습니다.");
      }


      setLoadingAirDrop(false);

  };


  // send erc20 to address

  const [toTelegramId, setToTelegramId] = useState("");
  const [amountSend, setAmountSend] = useState(0);
  const [loadingSend, setLoadingSend] = useState(false);
  const send = async () => {
    
      setLoadingSend(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/settlement/sendToUserTelegramId", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userTelegramId: toTelegramId,
            amount: amountSend,
          }),
      });

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setLoadingSend(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);

      if (data?.result) {
          alert("전송이 완료되었습니다.");
      } else {
          alert("전송에 실패했습니다.");
      }

      setLoadingSend(false);

  }



  // send roulette game to all users
  const [sendingRouletteAll, setSendingRouletteAll] = useState(false);
  const sendRouletteAll = async () => {
    
      setSendingRouletteAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game/sendRouletteAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });

      console.log("sendRouletteAll response", response);

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingRouletteAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");


      setSendingRouletteAll(false);

  }






  // send roulette game to all users
  const [sendingRaceGameAll, setSendingRaceGameAll] = useState(false);
  const sendRaceGameAll = async () => {
    
      setSendingRaceGameAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game/sendRaceGameAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });

      console.log("sendRaceGameAll response", response);

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingRaceGameAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");


      setSendingRaceGameAll(false);

  }





  // send roulette game
  const [sendRouletteTelegramId, setSendRouletteTelegramId] = useState("");
  const [sendRouletteAmount, setSendRouletteAmount] = useState(0);

  const [sendingRoulette, setSendingRoulette] = useState(false);
  const sendRoulette = async () => {
    
      setSendingRoulette(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/game/sendToUserTelegramId", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userTelegramId: sendRouletteTelegramId,
            amount: sendRouletteAmount,
          }),
      });

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingRoulette(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);

      if (data?.result) {
          alert("전송이 완료되었습니다.");
      } else {
          alert("전송에 실패했습니다.");
      }

      setSendingRoulette(false);

  }




  // send survey to all users
  const [sendingSurveyAll, setSendingSurveyAll] = useState(false);

  const sendSurveyAll = async () => {
    
      setSendingSurveyAll(true);
      // api call sendToUserTelegramId
      const response = await fetch("/api/poll/sendPollAll", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            center: selectCenter,
          }),
      });

      console.log("sendSurveyAll response", response);

      if (!response.ok) {
          console.error("Error sending");
          alert("전송에 실패했습니다.");
          setSendingSurveyAll(false);
          return;
      }

      const data = await response.json();

      //console.log("send data", data);


      alert("전송이 완료되었습니다.");

      setSendingSurveyAll(false);

  }


 


 

  
  return (

    
   
    <main
      className="
        p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-xl mx-auto
        bg-cover bg-center bg-no-repeat
        "
    >
      <div className="py-20 w-full flex flex-col gap-10 items-center justify-center">
    

          
          <div className="flex flex-row gap-2 items-center justify-between">
            {!address && (

                <div className="w-full flex flex-col justify-center items-center gap-2 p-2">

                
                    <ConnectButton
                    client={client}
                    wallets={wallets}
                    accountAbstraction={{
                        chain: polygon,
                        sponsorGas: true
                    }}
                    
                    theme={"light"}
        
                    // button color is dark skyblue convert (49, 103, 180) to hex
                    connectButton={{
                        style: {
                        backgroundColor: "#3167b4", // dark skyblue
                        // font color is gray-300
                        color: "#f3f4f6", // gray-300
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontSize: "16px",
                        // w-full
                        width: "100%",
                        },
                        label: "로그인 및 회원가입",
                    }}
        
                    connectModal={{
                        size: "wide", 
                        //size: "compact",
                        titleIcon: "https://damoa-wallet.vercel.app/icon-kcbc.jpeg",                           
                        showThirdwebBranding: false,
                    }}
        
                    locale={"ko_KR"}
                    //locale={"en_US"}
                    />
                    
                

                </div>

            )}

            {address && (
                <div className="w-full flex items-center justify-between gap-5">


                    <div className="flex flex-col gap-2">
  
                        <button
                            onClick={() => {
                                confirm("지갑 연결을 해제하시겠습니까?") && activeWallet?.disconnect();
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                        로그아웃
                        </button>
                    </div>

                </div>
            )}
          </div>
          
          




        








        <div className='mb-10 w-full flex flex-col gap-2 items-start justify-between'>

   
          {/* claim wallet address and balance */}
          <div className="w-full flex flex-row gap-2 items-start justify-between">

            <div className="hidden flex flex-row gap-2 items-center justify-start">
              {/* dot */}
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-800 font-semibold">
                  보상지급용 회사 지갑주소
              </span>
              {/*
              new window open
              https://polygonscan.com/address/0x35C482f619D3072c0fd6891E249f8BeCCB4e2FCb#tokentxns */}
              <button
                onClick={() => {
                  
                  window.open(
                    "https://polygonscan.com/address/" + claimWalletAddress + "#tokentxns"
                  );
                  

                }}
                className="
                  inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                "
              >
                {claimWalletAddress?.slice(0, 6) + "..." + claimWalletAddress?.slice(-4)}
              </button>
            </div>

            {/*

            {address && !loadingUsers && (

              <div className="flex flex-row gap-2 items-center justify-between">

                <span className="text-lg text-gray-800 font-semibold bg-gray-100 p-2 rounded">
                  잔고: {claimWalletBalance} USDT
                </span>

              </div>

            )}
            */}
          </div>


          <div className="w-full flex flex-row gap-2 items-start justify-between">

            <div className="flex flex-row gap-2 items-center justify-start">
              {/* dot */}
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-800 font-semibold">
                  똑똑한 코인 회원 목록
              </span>
            </div>

  
              <div className="flex flex-row gap-2 items-center justify-between">

                {/* 회원수 */}
                <span className="text-lg text-gray-800 font-semibold bg-gray-100 p-2 rounded">
                  전체 회원수: {totalCount}
                </span>

              </div>

      


          </div>

          {/* user list */}
          {/* table */}
          <div className='w-full flex flex-col gap-2 items-start justify-between border border-gray-300 p-4 rounded-lg'>
            
            <div className="flex flex-row gap-2 items-center justify-between">


              {/* searchNickname */}
              <div className="flex flex-row gap-2 items-center justify-end">
                <input
                  disabled={loadingUsers}
                  onChange={(e) => {
                    setSearchNickname(e.target.value);
                  }}
                  type="text"
                  placeholder="회원아이디"
                  className="w-36 p-2 rounded border border-gray-300"
                />
                <Button
                  disabled={loadingUsers}
                  onClick={() => {
                    // search
                    //setSelectUser(null);
                    //setUsers([]);

                    const fetchData = async () => {
                      setLoadingUsers(true);
                      const response = await fetch("/api/user/getAllUsers", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                              walletAddress: address,
                              limit: 100,
                              page: 1,
                              center: selectCenter,
                              searchNickname,
                          }),
                      });

                      if (!response.ok) {
                          console.error("Error fetching users");
                          setLoadingUsers(false);
                          return;
                      }

                      const data = await response.json();

                      setUsers(data.result.users);

                      setLoadingUsers(false);

                      /*
                      data.result.users.forEach(async (user: any) => {

                        const result = await balanceOf({
                          contract: contractKCT,
                          address: user.walletAddress,
                        });

                        //console.log("user balance KCT", result);
                        user.balanceKCT = Number(result) / 10 ** 18;
                      }  );
                      */



                    };

                    fetchData();

                  }}
                  className={`${loadingUsers ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                >
                  {loadingUsers ? "로딩중..." : "검색"}
                </Button>
              </div>
        
            </div>

            {/* 전체회원에게 설문조사 보내기 */}
            {/*
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingSurveyAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendSurveyAll();
                }}
                className={`${sendingSurveyAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingSurveyAll ? "전송중..." : "전체회원에게 설문조사 보내기"}
              </Button>
            </div>
            */}


            {/* 전체회원에게 게임 보내기 */}
            {/*
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingRouletteAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendRouletteAll();
                }}
                className={`${sendingRouletteAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingRouletteAll ? "전송중..." : "전체회원에게 게임 보내기"}
              </Button>
            </div>
            */}


            {/* 전체회원에게 경마게임 보내기 */}
            {/*
            <div className="w-full flex flex-row gap-2 items-start justify-end">
              <Button
                disabled={sendingRaceGameAll}
                onClick={() => {
                  // send
                  confirm("전송하시겠습니까?") && sendRaceGameAll();
                }}
                className={`${sendingRaceGameAll ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
              >
                {sendingRaceGameAll ? "전송중..." : "전체회원에게 경마게임 보내기"}
              </Button>
            </div>
            */}

            {/* 에어드롭 USDT */}
            {/*

            <div className="w-full flex flex-row gap-2 items-start justify-end">
                <input
                    disabled={loadingAirDrop}

                    onChange={(e) => {
                      setAmountAirDrop(Number(e.target.value));
                    }}
                    type="number"
                    placeholder="에어드롭 USDT"
                    className=" w-36  p-2 rounded border border-gray-300"
                  />
                  <Button
                    disabled={loadingAirDrop}
                    onClick={() => {
                      // airDrop
                      confirm("에어드롭을 진행하시겠습니까?") && airDrop(
                        amountAirDrop
                      );



                    }}
                    className={`${loadingAirDrop ? "bg-gray-400" : "bg-green-500"} text-zinc-100 p-2 rounded`}
                  >
                    {loadingAirDrop ? "로딩중..." : "에어드롭"}
                  </Button>
              </div>
            */}


            <div className="w-full flex flex-col gap-2 items-start justify-between">
            
              {
                address && (
              

                <>          
                  {loadingUsers ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (

                    <table className="w-full">
                        <thead>
                            <tr className="bg-zinc-800 text-zinc-100">
                                <th className="p-2">회원아이디</th>
                                <th className="p-2">등록일</th>
                                <th className="p-2">지갑주소</th>
                                <th className="p-2">KCT 잔액</th>
                                {/*
                                <th className="p-2">레퍼럴코드</th>
                                <th className="p-2">센터장</th>
                                <th className="p-2">자산 읽어오기</th>
                                <th className="p-2">보상내역</th>
                                */}
                                
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr
                                  key={index}
                                  className={`${selectUser === user?.walletAddress ? "bg-green-500 text-zinc-100" : "bg-zinc-800 text-zinc-100"}`}
                                >

                                    <td className="p-2">
                                      
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <Image
                                          src={user?.avatar || "/icon-anonymous.png"}
                                          alt={user?.nickname}
                                          width={50}
                                          height={50}
                                          className="rounded w-6 h-6"
                                        />
                                        <span className="text-sm">
                                          {user?.nickname}
                                        </span>
                                      </div>
                                    
                                    </td>

                                    <td className="p-2">
                                      
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          {
                                            //user?.createdAt
                                            new Date(user?.createdAt).toLocaleString()
                                          }
                                        </span>
                                      </div>
                                    </td>

                                    <td className="p-2"> 
                                      
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        {/* monospace font */}
                                        <span
                                          className="text-sm"
                                          style={{
                                            fontFamily: "monospace",
                                          }}
                                        >
                                          {user?.walletAddress?.slice(0, 6) + "..." + user?.walletAddress?.slice(-4)}
                                        </span>
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(user?.walletAddress);
                                            alert(`${user?.walletAddress} 복사되었습니다.`);
                                          }}
                                          className="w-16
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          복사
                                        </Button>
                                      

                                        {/* polygon scan */}
                                        <Button
                                          onClick={() => {
                                            window.open(
                                              "https://polygonscan.com/address/" + user?.walletAddress
                                            );
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          <div className="flex flex-row gap-2 items-center justify-start">
                                            <Image
                                              src="/logo-polygon.png"
                                              alt="Polygon Scan"
                                              width={20}
                                              height={20}
                                              className="rounded"
                                            />
                                          </div>
                                        </Button>

                                      </div>
                                      
                                    </td>

                                    <td className="p-2">
                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <button
                                          onClick={() => {
                                            getKCTBalanceOfUserWalletAddress(user?.walletAddress);
                                          }}
                                          className="w-28
                                          text-sm
                                          bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors duration-200"
                                        >
                                          잔액 읽어오기
                                        </button>
                                        {/* KCT balance */}
                                        <span className="text-sm">
                                          {user?.balanceKCT ? Number(user?.balanceKCT).toLocaleString() : "0.00"}
                                        </span>
                                      </div>
                                    </td>


                                    {/*
                                    <td className="p-2">

                                      <div className="flex flex-row gap-2 items-center justify-start">
                                        <span className="text-sm">
                                          

                                          {user?.start?.split("_")[1]}

                                        </span>
                                        <Button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              "https://damoa-wallet.vercel.app/kr/polygon/?start=" + user?.start
                                            );
                                            alert(`${user?.start} 복사되었습니다.`);
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          복사
                                        </Button>
   
                                        <Button
                                          onClick={() => {
                                            window.open(
                                            

                                              "https://opensea.io/assets/matic/" + user?.start?.split("_")[0] + "/" + user?.start?.split("_")[1]


                                            );
                                          }}
                                          className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                          "
                                        >
                                          <div className="flex flex-row gap-2 items-center justify-start">
                                            <Image
                                              src="/logo-opensea.png"
                                              alt="OpenSea"
                                              width={20}
                                              height={20}
                                              className="rounded"
                                            />
                                          </div>
                                        </Button>
                                      </div>

                                    </td>
                                    */}

                                    {/*
                                    <td className="p-2 text-center">
                                      {
                                        user.walletAddress === "0x2b1CEC9C587E3FCF5d45C5ef1B020D0174446222" ? (
                                          <span className="text-white font-semibold bg-red-500 p-1 rounded">
                                            CEO
                                          </span>
                                        ) : (

                                          user.start === '0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_134'
                                          || user.start === '0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_135'
                                          || user.start === '0x0276aE1b0768bBfe47d3Dd34493A225405aDB6AA_136'
                                          ? (
                                          <span className="text-white font-semibold bg-green-500 p-1 rounded">
                                            O
                                          </span>
                                          ) : (
                                            <></>
                                          )

                                        )
                                      }
                                    </td>
                                    */}
                                    
                                    {/*
                                    <td className="p-2 text-center">
                                      <input
                                        type="radio"
                                        id={user?.walletAddress}
                                        name="user"
                                        value={user?.telegramId}
                                        checked={selectUser === user?.walletAddress}
                                        onChange={() => {
                                            setSelectUser(user?.walletAddress);
                                        }}
                                        className="w-4 h-4"
                                      />
                                    </td>
                                    */}

                                    {/*
                                    <td className="p-2 text-center">


                                      <Button
                                        onClick={() => {
                                          //(window as any).Telegram.WebApp.openLink(
                                            "https://damoa-wallet.vercel.app/kr/polygon/admin/" + user?.walletAddress
                                          //);
                                          window.open(
                                            "https://damoa-wallet.vercel.app/kr/polygon/admin/" + user?.walletAddress
                                          );
                                        }}
                                        className="
                                          inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                        "
                                      >
                                        보상내역
                                      </Button>

                                    </td>
                                    */}

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                  )}
                </>
              )}


            
              {
                selectUser && (

                <>


                  {loadingAgentNft ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (


                    <div className="w-full flex flex-col gap-2 items-start justify-between">

                        {/* USDT balance, KCT balance */}
                        <div className="hidden w-full flex-col gap-2 items-start justify-start">
                          <div className="flex flex-row gap-2 items-center justify-start">
                            <span className="text-sm text-gray-800 font-semibold">
                                USDT 잔고
                            </span>
                            <span className="text-lg text-green-500 font-semibold bg-green-100 p-2 rounded">
                              {
                                userBalanceUsdt
                                  ? Number(userBalanceUsdt).toLocaleString()
                                  : "0.00"
                              }
                            </span>
                          </div>

                          <div className="flex flex-row gap-2 items-center justify-start">
                            <span className="text-sm text-gray-800 font-semibold">
                                KCT 잔고
                            </span>
                            <span className="text-lg text-green-500 font-semibold bg-green-100 p-2 rounded">
                              {
                              userBalanceKCT
                                ? Number(userBalanceKCT).toLocaleString()
                                : "0.00"

                              }
                            </span>
                          </div>
                        </div>



                        <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                            에이전트 NFT 목록
                        </div>
                        <div className="w-full grid grid-cols-8 gap-5 items-start justify-between">
                            {agentNft && agentNft.length === 0 && (
                                <div className="w-full flex flex-col items-center justify-center">
                                    <span className="text-sm text-gray-400">
                                        NFT가 없습니다.
                                    </span>
                                </div>
                            )}

                            {agentNft && agentNft.map((nft : any, index : number) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 items-center justify-between"
                                >
                                    <div className="
                                      border border-gray-300 p-4 rounded-lg
                                      flex flex-col gap-1 items-center justify-start">

                                        <div className="flex flex-col gap-2 items-start justify-between">
                                          {/* tokenId */}
                                          <span className="text-sm">
                                            계약번호: #{nft.tokenId}
                                          </span>
                                          <span className="text-sm">
                                            {nft.name && nft.name?.slice(0, 10) + "..."}
                                          </span>
                                          <span className="text-sm text-gray-400">
                                            {nft.description && nft.description?.slice(0, 10) + "..."}
                                          </span>
                                        </div>

                                        <div className="flex flex-row gap-2 items-center justify-start">


                                          <Image
                                            src={nft?.image?.thumbnailUrl || "/icon-nft.png"}
                                            alt={nft?.name}
                                            width={100}
                                            height={100}
                                            className="rounded w-10 h-10"
                                          />
                                        
                                          <Button
                                            onClick={() => {
                                                (window as any).Telegram.WebApp.openLink(
                                                  "https://opensea.io/assets/matic/" + nft.contract.address + "/" + nft.tokenId
                                                );
                                            }}
                                            className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                            "
                                          >
                                            <div className="flex flex-row gap-2 items-center justify-start">
                                              <Image
                                                src="/logo-opensea.png"
                                                alt="OpenSea"
                                                width={20}
                                                height={20}
                                                className="rounded"
                                              />
                                            </div>
                                          </Button>

                                        </div>

                                    </div>

                                    {/* copy telegram link */}
                                    <div className="flex flex-row gap-2 items-center justify-start">
                                      <Button
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            "https://damoa-wallet.vercel.app/" + "?start=" + nft.contract.address + "_" + nft.tokenId
                                          );
                                          alert(`레퍼럴 링크 복사되었습니다.`);
                                        }}
                                        className="
                                          inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                        "
                                      >
                                        레퍼럴 복사하기
                                      </Button>
                                    </div>



                                </div>
                            ))}

                        </div>
                    </div>

                  )}


                  {/* 똑똑한코인 NFT 목록 */}
                  {loadingNoahNft ? (
                    <div className="mt-5 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
                    </div>
                  ) : (
                    
                    <div className="mt-5 w-full flex flex-col gap-2 items-start justify-between">
                        <div className="bg-green-500 text-sm text-zinc-100 p-2 rounded">
                            똑똑한코인 NFT 목록
                        </div>
                        <div className="w-full grid grid-cols-8 gap-2 items-start justify-between">

                            {noahNft && noahNft.length === 0 && (
                                <div className="w-full flex flex-col items-center justify-center">
                                    <span className="text-sm text-gray-400">
                                        NFT가 없습니다.
                                    </span>
                                </div>
                            )}

                            {noahNft && noahNft.map((nft : any, index : number) => (
                                <div
                                    key={index}
                                    className="flex flex-row gap-2 items-center justify-between"
                                >
                                    <div className="
                                      border border-gray-300 p-4 rounded-lg
                                      flex flex-col gap-1 items-center justify-start">

                                        <div className="flex flex-col gap-2 items-start justify-between">
                                          {/* tokenId */}
                                          <span className="text-sm">
                                            계약번호: #{nft.tokenId}
                                          </span>
                                          <span className="text-sm">
                                            {nft.name}
                                          </span>
                                          <span className="text-sm text-gray-400">
                                            {nft.description && nft.description?.slice(0, 10) + "..."}
                                          </span>
                                        </div>

                                        {/* image */}
                                        <div className="flex flex-row gap-2 items-center justify-start">
                                          <Image
                                            src={nft?.image?.thumbnailUrl || "/icon-nft.png"}
                                            alt={nft?.name}
                                            width={100}
                                            height={100}
                                            className="rounded w-10 h-10"
                                          /> 

                                          {/* open opensea new window */}
                                          <Button
                                            onClick={() => {

                                                window.open(
                                                  "https://opensea.io/assets/matic/" + nft.contract.address + "/" + nft.tokenId
                                                );
                                                
                                            }}
                                            className="
                                            inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white
                                            "
                                          >
                                            <div className="flex flex-row gap-2 items-center justify-start">
                                              <Image
                                                src="/logo-opensea.png"
                                                alt="OpenSea"
                                                width={20}
                                                height={20}
                                                className="rounded"
                                              />
                                            </div>
                                          </Button>
                                        </div>

                                        {/* 수량 balance */}
                                        <div className="flex flex-row gap-2 items-center justify-start">
                                          <span className="text-sm">
                                            수량:
                                          </span>
                                          <span className="text-lg text-green-500 font-semibold bg-green-100 p-2 rounded">
                                            {nft.balance}
                                          </span>
                                        </div>

                                      </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}




                </>

              )}

            </div>

          </div>



        </div>



      </div>
    </main>
  );
}






export default function Home() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
          <HomeContent />
      </Suspense>
  );
}
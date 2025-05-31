// send USDT
'use client';


import React, { use, useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';
import { client } from '../../../client';

import {
    //ThirdwebProvider,
    ConnectButton,
  
    useConnect,
  
    useReadContract,
  
    useActiveWallet,

    useActiveAccount,
    useSendBatchTransaction,

    useConnectedWallets,

    useSetActiveWallet,
    
} from "thirdweb/react";

import {
    polygon,
    arbitrum,
    ethereum,
} from "thirdweb/chains";

import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
  createWallet,
  inAppWallet,
} from "thirdweb/wallets";

import Image from 'next/image';

import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../../dictionaries";

import { useQRCode } from 'next-qrcode';

import {
  Scanner,
  useDevices,
  outline,
  boundingBox,
  centerText,
} from "@yudiel/react-qr-scanner";

const styles = {
  container: {
    width: 400,
    margin: "auto",
  },
  controls: {
    marginBottom: 8,
  },
};






const wallets = [
  inAppWallet({
    auth: {
      options: ["phone"],
    },
  }),
];




const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum
const contractAddressEthereum = "0xdac17f958d2ee523a2206206994597c13d831ec7"; // USDT on Ethereum

const contractAddressKCT = "0xeb9198c8342BcB29A1Fe41d45A6CF6A3Ac568a0E"; // KCT on Polygon




/*
const smartWallet = new smartWallet(config);
const smartAccount = await smartWallet.connect({
  client,
  personalAccount,
});
*/

import {
  useRouter,
  useSearchParams
} from "next//navigation";

import { Select } from '@mui/material';
import { Sen } from 'next/font/google';
import { Router } from 'next/router';
import path from 'path';

import { TronWeb, utils as TronWebUtils, Trx, TransactionBuilder, Contract, Event, Plugin } from 'tronweb';






export default function SendUsdt({ params }: any) {




  const [recipient, setRecipient] = useState({
    _id: '',
    id: 0,
    email: '',
    nickname: '',
    avatar: '',
    mobile: '',
    walletAddress: '',
    tronWalletAddress: '',
    createdAt: '',
    settlementAmountOfFee: '',
  });

  //console.log("recipient", recipient);



  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [tracker, setTracker] = useState<string | undefined>("centerText");
  const [pause, setPause] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

  const handleScan = async (data: string) => {
    setPause(true);

    /*
    setRecipient({
      _id: '',
      id: 0,
      email: '',
      nickname: '',
      avatar: '',
      mobile: '',
      walletAddress: data,
      tronWalletAddress: '',
      createdAt: '',
      settlementAmountOfFee: '',
    });
    */
    setRecipient({
      ...recipient,
      walletAddress: data,
    })

    // close scanner
    setShowQrScanner(false);

    /*
    try {

      const response = await fetch(
        `your-api-url?code=${encodeURIComponent(data)}`
      );
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Success! Welcome to the conference.");
      } else {
        alert(result.message);
      }


    } catch (error: unknown) {
      console.log(error);
    } finally {
      setPause(false);
    }
    */

  };









  //console.log("params", params);

  const searchParams = useSearchParams();
 

  const token = searchParams.get('token');

  const center = searchParams.get('center');


  const agent = searchParams.get('agent');
  const agentNumber = searchParams.get('tokenId');

  

  //console.log("token", token);

  const tokenImage = "/token-" + String(token).toLowerCase() + "-icon.png";
  

  let contract = null;
  
  if (String(token).toLowerCase() === "usdt") {
    contract = getContract({
      // the client you have created via `createThirdwebClient()`
      client,
      // the chain the contract is deployed on
      
      
      chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
    
    
    
      // the contract's address
      ///address: contractAddress,

      address: params.chain === "arbitrum" ? contractAddressArbitrum : params.chain === "polygon" ? contractAddress : params.chain === "ethereum" ? contractAddressEthereum : contractAddress,


      // OPTIONAL: the contract's abi
      //abi: [...],
    });
  } else if (String(token).toLowerCase() === "KCT") {
    contract = getContract({
      // the client you have created via `createThirdwebClient()`
      client,
      // the chain the contract is deployed on
      chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
      // the contract's address
      address: contractAddressKCT,
      // OPTIONAL: the contract's abi
      //abi: [...],
    });
  }




  



  const { Canvas } = useQRCode();










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

    USDT_sent_successfully: "",
    Failed_to_send_USDT: "",

    Go_Buy_USDT: "",
    Enter_Wallet_Address: "",
    Enter_the_amount_and_recipient_address: "",
    Select_a_user: "",
    User_wallet_address: "",
    This_address_is_not_white_listed: "",
    If_you_are_sure_please_click_the_send_button: "",

    Sending: "",

    Anonymous: "",

    My_Wallet_Address: "",

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

    USDT_sent_successfully,
    Failed_to_send_USDT,

    Go_Buy_USDT,
    Enter_Wallet_Address,
    Enter_the_amount_and_recipient_address,
    Select_a_user,
    User_wallet_address,
    This_address_is_not_white_listed,
    If_you_are_sure_please_click_the_send_button,

    Sending,

    Anonymous,

    My_Wallet_Address,

  } = data;



  const router = useRouter();



  const activeAccount = useActiveAccount();

  const address = activeAccount?.address;



  const [amount, setAmount] = useState(0);




  const [nativeBalance, setNativeBalance] = useState(0);

  const [balance, setBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getBalance = async () => {

  
      if (String(token).toLowerCase() === "usdt") {

        const contractUSDT = getContract({
          client,
          chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
          address: contractAddress,
        });

        const result = await balanceOf({
          contract : contractUSDT,
          address: address || "",
        });


        setBalance( Number(result) / 10 ** 6 );

      } else if (String(token).toLowerCase() === "kct") {

        const contractKCT = getContract({
          client,
          chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
          address: contractAddressKCT,
        });

        const result = await balanceOf({
          contract : contractKCT,
          address: address || "",
        });

        setBalance( Number(result) / 10 ** 18 );
      }


      /*
      await fetch('/api/user/getBalanceByWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: params.chain,
          walletAddress: address,
        }),
      })

      .then(response => response.json())

      .then(data => {
          setNativeBalance(data.result?.displayValue);
      });
      */

    };

    if (address && params.chain && token) getBalance();

    const interval = setInterval(() => {
      if (address && contract) getBalance();
    } , 1000);

    return () => clearInterval(interval);


  } , [address, params.chain, token]);





  // swap token balance
  const [swapTokenBalance, setSwapTokenBalance] = useState(0);
  useEffect(() => {

    // get the balance
    const getSwapTokenBalance = async () => {

      ///console.log('getBalance address', address);

      if (token === "USDT") {
        
        const contract = getContract({
          client,
          chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
          address: contractAddressKCT,
        });
        const result = await balanceOf({
          contract : contract as any,
          address: address || "",
        });
        if (!result) return;
        setSwapTokenBalance( Number(result) / 10 ** 18 );
      } else if (token === "KCT") {
        const contract = getContract({
          client,
          chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
          address: contractAddress,
        });
        const result = await balanceOf({
          contract : contract as any,
          address: address || "",
        });
        if (!result) return;
        setSwapTokenBalance( Number(result) / 10 ** 6 );
      }

    };

    if (address) getSwapTokenBalance();

    const interval = setInterval(() => {
      if (address) getSwapTokenBalance();
    } , 1000);

    return () => clearInterval(interval);

  } , [address, contract, params.chain, token]);











  const [user, setUser] = useState(
    {
      _id: '',
      id: 0,
      email: '',
      nickname: '',
      avatar: '',
      mobile: '',
      walletAddress: '',
      createdAt: '',
      settlementAmountOfFee: '',
      tronWalletAddress: '',
      tronWalletPrivateKey: '',
    }
  );

  useEffect(() => {

    if (!address) return;

    const getUser = async () => {

      const response = await fetch('/api/user/getUserByWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });

      if (!response) return;

      const data = await response.json();


      setUser(data.result);

    };

    getUser();

  }, [address]);








  // get list of user wallets from api
  const [users, setUsers] = useState([
    {
      _id: '',
      id: 0,
      email: '',
      avatar: '',
      nickname: '',
      mobile: '',
      walletAddress: '',
      createdAt: '',
      settlementAmountOfFee: '',
    }
  ]);

  const [totalCountOfUsers, setTotalCountOfUsers] = useState(0);

  useEffect(() => {

    if (!address) return;

    const getUsers = async () => {

      const response = await fetch('/api/user/getAllUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

        }),
      });

      if (!response) return;

      const data = await response.json();

      console.log("getUsers", data);


      ///setUsers(data.result.users);
      // set users except the current user

      setUsers(data.result.users.filter((user: any) => user.walletAddress !== address));



      setTotalCountOfUsers(data.result.totalCount);

    };

    ///getUsers();


  }, [address]);










  ///console.log("recipient", recipient);

  //console.log("recipient.walletAddress", recipient.walletAddress);
  //console.log("amount", amount);



  const [otp, setOtp] = useState('');

  
  
  /////const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(true); // for testing


  const [isSendedOtp, setIsSendedOtp] = useState(false);



  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [isVerifingOtp, setIsVerifingOtp] = useState(false);

  

  const sendOtp = async () => {

    setIsSendingOtp(true);
      
    const response = await fetch('/api/transaction/setOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang: params.lang,
        chain: params.chain,
        walletAddress: address,
        mobile: user.mobile,
      }),
    });

    const data = await response.json();

    //console.log("data", data);

    if (data.result) {
      setIsSendedOtp(true);
      toast.success('OTP sent successfully');
    } else {
      toast.error('Failed to send OTP');
    }

    setIsSendingOtp(false);

  };

  const verifyOtp = async () => {

    setIsVerifingOtp(true);
      
    const response = await fetch('/api/transaction/verifyOtp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lang: params.lang,
        chain: params.chain,
        walletAddress: address,
        otp: otp,
      }),
    });

    const data = await response.json();

    //console.log("data", data);

    if (data.status === 'success') {
      setVerifiedOtp(true);
      toast.success('OTP verified successfully');
    } else {
      toast.error('Failed to verify OTP');
    }

    setIsVerifingOtp(false);
  
  }


  const [wantToReceiveWalletAddress, setWantToReceiveWalletAddress] = useState(true);


  const [sending, setSending] = useState(false);



  const sendUsdt = async () => {
    if (sending) {
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount) {
      toast.error('Please enter a valid amount');
      return;
    }

 

    setSending(true);



    try {



      console.log("recipient", recipient);

      let transaction = null;

        // send KCT
        // Call the extension function to prepare the transaction

        if (String(token).toLowerCase() === "usdt") {
          const contractUSDT = getContract({
            client,
            chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
            address: contractAddress,
          });

          transaction = transfer({
              //contract,

              contract: contractUSDT,

              to: recipient.walletAddress,
              amount: amount,
          });
        } else if (String(token).toLowerCase() === "kct") {
          const contractKCT = getContract({
            client,
            chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
            address: contractAddressKCT,
          });

          transaction = transfer({
              //contract,

              contract: contractKCT,

              to: recipient.walletAddress,
              amount: amount,
          });
        }

        if (!transaction) {
          toast.error("잘못된 토큰입니다.");
          setSending(false);
          return;
        }



        const { transactionHash } = await sendTransaction({
          
          account: activeAccount as any,

          transaction,
        });

        console.log("transactionHash", transactionHash);

        
        if (transactionHash) {

          /*
          await fetch('/api/transaction/setTransfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lang: params.lang,
              chain: params.chain,
              walletAddress: address,
              amount: amount,
              toWalletAddress: recipient.walletAddress,
            }),
          });
          */



          //toast.success(USDT_sent_successfully);
          toast.success("전송 완료");

          setAmount(0); // reset amount

          // refresh balance

          // get the balance



          //console.log(result);

          if (String(token).toLowerCase() === "usdt") {

            const contractUSDT = getContract({
              client,
              chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
              address: contractAddress,
            });

            const result = await balanceOf({
              contract: contractUSDT,
              address: address,
            });

            setBalance( Number(result) / 10 ** 6 );
          } else if (String(token).toLowerCase() === "kct") {

            const contractKCT = getContract({
              client,
              chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
              address: contractAddressKCT,
            });

            const result = await balanceOf({
              contract: contractKCT,
              address: address,
            });

            setBalance( Number(result) / 10 ** 18 );
          }

        } else {

          toast.error("전송 실패");

        }

    

      


    } catch (error) {
      
      console.error("error", error);

      //toast.error(Failed_to_send_USDT);
      toast.error("전송 실패");
    }

    setSending(false);
  };



  // get user by wallet address
  const getUserByWalletAddress = async (walletAddress: string) => {

    const response = await fetch('/api/user/getUserByWalletAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
      }),
    });

    const data = await response.json();

    //console.log("getUserByWalletAddress", data);

    return data.result;

  };

  const [isWhateListedUser, setIsWhateListedUser] = useState(false);



  const [selectDeposit, setSelectDeposit] = useState(true);
  const [selectWithdraw, setSelectWithdraw] = useState(false);
  const [selectSwap, setSelectSwap] = useState(false);





  // usdt balance
  /*
  const [usdtBalance, setUsdtBalance] = useState(0);
  useEffect(() => {
    
      const getUsdtBalance = async () => {



        
        if (address) {
          


          if (contract) {
  
            const balance = await balanceOf({
              contract: contract,
              address: address,
            });

            console.log("balance==========", balance);

            setUsdtBalance(Number(balance) / 10 ** 6);
          }

        }
          



      };

      getUsdtBalance();

  } , [address, params.chain, contract]);

  */

  // 0xef236138f40fadCac5Af0E01bB51612ad116C91f
  // usdt balance
  // KCT balance
  const swapPoolAddress = "0xef236138f40fadCac5Af0E01bB51612ad116C91f";

  const [swapPoolUsdtBalance, setSwapPoolUsdtBalance] = useState(0);
  const [swapPoolKCTBalance, setSwapPoolKCTBalance] = useState(0);
  useEffect(() => {
    const getSwapPoolBalance = async () => {

      const contractUsdt = getContract({
        client,
        chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
        address: contractAddress,
      });

      const contractKCT = getContract({
        client,
        chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
        address: contractAddressKCT,
      });

      const usdtBalance = await balanceOf({
        contract: contractUsdt as any,
        address: swapPoolAddress,
      });

      setSwapPoolUsdtBalance(Number(usdtBalance) / 10 ** 6);

      const KCTBalance = await balanceOf({
        contract: contractKCT as any,
        address: swapPoolAddress,
      });

      setSwapPoolKCTBalance(Number(KCTBalance) / 10 ** 18);

    };

    getSwapPoolBalance();

  }, [address, params.chain]);

  console.log("swapPoolUsdtBalance", swapPoolUsdtBalance);
  console.log("swapPoolKCTBalance", swapPoolKCTBalance);




  // swap function
  // 스왑할 수량
  const [swapAmount, setSwapAmount] = useState(0);

  // 스왑될 수량
  const [swapAmountTo, setSwapAmountTo] = useState(0);


  const [loadingSwap, setLoadingSwap] = useState(false);

  const swap = async () => {
    if (loadingSwap) {
      return;
    }

    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!swapAmount) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (token === "USDT" && swapAmount > swapPoolKCTBalance) {
      toast.error("스왑 풀에 KCT 잔액이 부족합니다.");
      return;
    }

    if (token === "KCT" && swapAmount > swapPoolUsdtBalance) {
      toast.error("스왑 풀에 USDT 잔액이 부족합니다.");
      return;
    }



    setLoadingSwap(true);

    try {

      // if swap USDT to KCT
      // swapAmount is USDT amount
      // send swapAmount USDT to swap pool address

      if (token === "USDT") {
        const contractUsdt = getContract({
          client,
          chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
          address: contractAddress,
        });

        const transaction = transfer({
          contract: contractUsdt as any,
          to: swapPoolAddress,
          amount: swapAmount,
        });

        const { transactionHash } = await sendTransaction({
          account: activeAccount as any,
          transaction,
        });

        if (transactionHash) {
          //toast.success(USDT_sent_successfully);

          // api call to send swapAmount KCT to user wallet address

          await fetch('/api/swap/sendKCT', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lang: params.lang,
              chain: params.chain,
              walletAddress: address,
              amount: swapAmountTo,
              toWalletAddress: address,
            }),
          });


          toast.success("스왑 완료");

          // refresh swap pool balance

          if (token === "USDT") {
            const contractKCT = getContract({
              client,
              chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
              address: contractAddressKCT,
            });
            const KCTBalance = await balanceOf({
              contract: contractKCT as any,
              address: swapPoolAddress,
            });
            setSwapPoolKCTBalance(Number(KCTBalance) / 10 ** 18);
          } else if (token === "KCT") {
            const contractUsdt = getContract({
              client,
              chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
              address: contractAddress,
            });
            const usdtBalance = await balanceOf({
              contract: contractUsdt as any,
              address: swapPoolAddress,
            });
            setSwapPoolUsdtBalance(Number(usdtBalance) / 10 ** 6);
          }


          // 



          setSwapAmount(0); // reset amount
          setSwapAmountTo(0); // reset amount to

        } else {

          toast.error("스왑 실패");
        }

      } else if (token === "KCT") {
        const contractKCT = getContract({
          client,
          chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
          address: contractAddressKCT,
        });

        const transaction = transfer({
          contract: contractKCT as any,
          to: swapPoolAddress,
          amount: swapAmount,
        });

        const { transactionHash } = await sendTransaction({
          account: activeAccount as any,
          transaction,
        });

        if (transactionHash) {
          //toast.success(USDT_sent_successfully);

          // api call to send swapAmount USDT to user wallet address

          await fetch('/api/swap/sendUsdt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              lang: params.lang,
              chain: params.chain,
              walletAddress: address,
              amount: swapAmountTo,
              toWalletAddress: address,
            }),
          });

          toast.success("스왑 완료");

          // refresh swap pool balance
          const contractUsdt = getContract({
            client,
            chain: params.chain === "arbitrum" ? arbitrum : params.chain === "polygon" ? polygon : params.chain === "ethereum" ? ethereum : polygon,
            address: contractAddress,
          });
          const usdtBalance = await balanceOf({
            contract: contractUsdt as any,
            address: swapPoolAddress,
          });
          setSwapPoolUsdtBalance(Number(usdtBalance) / 10 ** 6);

          setSwapAmount(0); // reset amount
          setSwapAmountTo(0); // reset amount to

        } else {
          toast.error("스왑 실패");
        }

      } else {
        toast.error("잘못된 스왑 요청입니다.");
      }



    } catch (error) {
      
      console.error("error", error);

      toast.error("스왑 실패");
    }

    setLoadingSwap(false);

  }

  

  // toggle qr scanner
  const [showQrScanner, setShowQrScanner] = useState(false);





  const [transferListKCT, setTransferListKCT] = useState([]);
  const [loadingTransferListKCT, setLoadingTransferListKCT] = useState(false);
  useEffect(() => {
    const getTransferListKCT = async () => {
      setLoadingTransferListKCT(true);
      const response = await fetch('/api/transfer/getAllTransferKCT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });
      if (!response.ok) {
        toast.error("전송 내역을 불러오는 데 실패했습니다.");
        setLoadingTransferListKCT(false);
        return;
      }
      const data = await response.json();

      setTransferListKCT(data.result.transfers);

      setLoadingTransferListKCT(false);
    };


    if (address) {
      getTransferListKCT();
    }

    // setInterval to refresh transfer list every 5 seconds
    const interval = setInterval(() => {
      if (address) {
        getTransferListKCT();
      }
    }
    , 5000);
    return () => {
      clearInterval(interval);
    };


  }, [address]);







  return (

    <main className="min-h-[100vh] flex flex-col items-center justify-start container max-w-screen-lg mx-auto
    ">


      {/* go back button */}
      <div className="p-4 w-full flex justify-start items-center gap-2">
          <button
              onClick={() => router.back()}
              className="flex items-center justify-center bg-gray-200 rounded-full p-2">
              <Image
                  src="/icon-back.png"
                  alt="Back"
                  width={20}
                  height={20}
                  className="rounded-full"
              />
          </button>
          {/* title */}
          <div className='flex flex-row items-center gap-2'>

              <span className="text-lg font-semibold">
                {token}
              </span>
          </div>
      </div>


      <div className="p-4 w-full min-h-[100vh] bg-[#E7EDF1]">


        {!address && (

          <div className="
          mt-16
          w-full flex flex-col justify-center items-center gap-2 p-2">


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




            <div className="w-full flex flex-col gap-2 items-start">


              <div className="w-full flex flex-col xl:flex-row items-start justify-between gap-3">

                <div className="w-full flex flex-col xl:flex-row items-start gap-3">
                  

                  {/* 입금 button / 출금 button / 스왑 button*/}
                  {/* radio buttons */}
                  <div className="w-full flex flex-row gap-2 items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
                    <button
                      onClick={() => {
                        setSelectDeposit(true);
                        setSelectWithdraw(false);
                        setSelectSwap(false);
                      }}
                      className={`w-full p-2 rounded-lg text-sm font-semibold

                        ${selectDeposit ? 'bg-[#3167b4] text-white' : 'bg-gray-300 text-gray-400'}
                        
                      `}
                    >
                      <div className='flex flex-col gap-2 items-center justify-start'>
                        {/*}
                        <Image
                          src="/icon-deposit.png"
                          alt="deposit"
                          width={20}
                          height={20}
                        />
                        */}
                        <span className='text-sm'>
                          입금
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectDeposit(false);
                        setSelectWithdraw(true);
                        setSelectSwap(false);
                      }}
                      className={`w-full p-2 rounded-lg text-sm font-semibold

                        ${selectWithdraw ? 'bg-[#3167b4] text-white' : 'bg-gray-300 text-gray-400'}
                        
                      `}
                    >
                      출금
                    </button>

                    <button
                      onClick={() => {
                        setSelectDeposit(false);
                        setSelectWithdraw(false);
                        setSelectSwap(true);
                      }}
                      className={`w-full p-2 rounded-lg text-sm font-semibold

                        ${selectSwap ? 'bg-[#3167b4] text-white' : 'bg-gray-300 text-gray-400'}
                        
                      `}
                    >
                      스왑
                    </button>

                  </div>
   





                    







                </div>

              </div>



            </div>




            {address
            && selectDeposit
            && (

              <div className='mt-5 w-full flex flex-col gap-5'>


                <div className="w-full flex flex-row gap-2 items-center justify-between bg-white border border-gray-300 rounded-lg p-4">

                <div className='flex flex-row gap-2 items-center justify-start'>
                  <Image
                    src={tokenImage}
                    alt="token"
                    width={35}
                    height={35}
                    className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                  />

                </div>

                <div className="flex flex-row items-center justify-end  gap-2">
                  <span className="text-2xl font-semibold text-gray-800">

                    {Number(balance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                  </span>
                  <span className="text-lg">{token}</span>
                </div>
                </div>




                <div className="w-full flex flex-col gap-2 items-center justify-center
                  border border-zinc-400 rounded-md p-2">

                  <div className="text-sm text-gray-800">
                    {My_Wallet_Address}
                  </div>

                  <div className="w-full flex flex-row items-center justify-center gap-2">
                    <button
                      className="text-sm text-zinc-400 underline"
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        toast.success('지갑주소가 복사되었습니다.');
                      } }
                    >
                      {address.substring(0, 6)}...{address.substring(address.length - 4)}
                    </button>

                  </div>

                  <Canvas
                    text={address}
                      options={{
                        //level: 'M',
                        margin: 2,
                        scale: 4,
                        ///width: 200,
                        // width 100%
                        width: 200,
                        color: {
                            dark: '#000000FF',
                            light: '#FFFFFFFF',
                        },
          
                      }}
                  />



                </div>





                {String(token).toLowerCase() === "kct" && (
                  <div className="w-full mt-5 bg-white rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">전송 내역</h2>
                    
                    {loadingTransferListKCT ? (
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src="/loading.png"
                          alt="loading"
                          width={50}
                          height={50}
                          className='animate-spin'
                        />
                      </div>
                    ) : (
                      <table className="w-full table-auto">
                        <thead>
                          <tr
                            className="bg-gray-200 text-gray-700 text-sm font-semibold">


                            <th className="px-4 py-2">날짜<br/>보내기 / 받기</th>
                            <th className="px-4 py-2">보낸 사람<br/>받는 사람</th>
                            <th className="px-4 py-2">수량</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transferListKCT.map((transfer : any, index: number) => (


                            <tr key={transfer._id}

                              className={`${
                                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                              }`}
                            >
                              <td className="border px-4 py-2">
                                <div className='flex flex-col gap-1'>
                                  <span className="text-sm">
                                    {new Date(transfer.transferData.timestamp).toLocaleTimeString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(transfer.transferData.timestamp).toLocaleDateString()}
                                  </span>
                                </div>

                                <span className="font-semibold text-lg">
                                  {transfer.sendOrReceive === "send" ? (
                                    <span className="text-red-500">보내기</span>
                                  ) : (
                                    <span className="text-green-500">받기</span>
                                  )}
                                </span>


                              </td>

                              <td className="border px-4 py-2">
                                {transfer.transferData.fromAddress.slice(0, 6)}...{transfer.transferData.fromAddress.slice(-4)}<br/>
                                {transfer.transferData.toAddress.slice(0, 6)}...{transfer.transferData.toAddress.slice(-4)}
                              </td>
                              <td className="border px-4 py-2">
                                {
                                  (Number(transfer.transferData.value) / 10 ** 18)
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>





                )}





              </div>

            ) }







            {address
            && selectWithdraw
            && (

              <div className='mt-5 w-full flex flex-col gap-5'>


                <div className="w-full flex flex-row gap-2 items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
                  <div className='flex flex-row gap-2 items-center justify-start'>
                    <Image
                      src={tokenImage}
                      alt="token"
                      width={35}
                      height={35}
                      className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                    />

                  </div>

                  <div className="flex flex-row items-center justify-end  gap-2">
                    <span className="text-2xl font-semibold text-gray-800">

                      {Number(balance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                    </span>
                    <span className="text-lg">{token}</span>
                  </div>
                </div>

 


                <div className='
                  w-full  flex flex-col gap-5 border
                  bg-zinc-800 text-white
                  p-4 rounded-lg

                  '>


                  <div className='flex flex-row gap-2 items-center justify-start'>
                    {/* dot icon */}
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="text-sm
                      text-white

                    ">
                      {Enter_the_amount_and_recipient_address}
                    </div>
                  </div>


                  <div className='w-full mb-5 flex flex-col xl:flex-row gap-5 items-start justify-between'>

                    <div className='w-full flex flex-col gap-5 items-start justify-between'>
                      <input
                        disabled={sending}
                        type="number"
                        //placeholder="Enter amount"
                        className=" w-full p-2 border border-gray-300 rounded text-black text-5xl font-semibold "
                        
                        value={amount}

                        onChange={(e) => (

                          // check if the value is a number


                          // check if start 0, if so remove it

                          e.target.value = e.target.value.replace(/^0+/, ''),



                          // check balance

                          setAmount(e.target.value as any)

                        )}
                      />
                
            

                      {/* check box for want to receive wallet address */}
                      {/*
                      <div className="flex flex-row items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-6 h-6"
                          checked={wantToReceiveWalletAddress}
                          onChange={(e) => setWantToReceiveWalletAddress(e.target.checked)}
                        />
                        <div className="text-white">{Enter_Wallet_Address}</div>
                      </div>
                      */}

                    </div>


                
                
                    {!wantToReceiveWalletAddress ? (
                      <>
                        <div className='w-full flex flex-col gap-5 items-start justify-between'>




                          <select
                            disabled={sending}

                            className="
                              
                              w-56 p-2 border border-gray-300 rounded text-black text-2xl font-semibold "
                              
                            value={
                              recipient?.nickname
                            }


                            onChange={(e) => {

                              const selectedUser = users.find((user) => user.nickname === e.target.value) as any;

                              console.log("selectedUser", selectedUser);

                              setRecipient(selectedUser);

                            } } 

                          >
                            <option value="">{Select_a_user}</option>
                            

                            {users.map((user) => (
                              <option key={user.id} value={user.nickname}>{user.nickname}</option>
                            ))}
                          </select>

                          {/* select user profile image */}

                          <div className=" w-full flex flex-row gap-2 items-center justify-center">
                            <Image
                              src={recipient?.avatar || '/profile-default.png'}
                              alt="profile"
                              width={38}
                              height={38}
                              className="rounded-full"
                              style={{
                                objectFit: 'cover',
                                width: '38px',
                                height: '38px',
                              }}
                            />

                            {recipient?.walletAddress && (
                              <Image
                                src="/verified.png"
                                alt="check"
                                width={28}
                                height={28}
                              />
                            )}

                          </div>

                        </div>

                
                        {/* input wallet address */}
                        
                        <input
                          disabled={true}
                          type="text"
                          placeholder={User_wallet_address}
                          className=" w-80  xl:w-full p-2 border border-gray-300 rounded text-white text-xs xl:text-lg font-semibold"
                          value={
                            params.chain === "tron" ?
                            recipient?.walletAddress
                            :
                            recipient?.walletAddress
                          }
                          onChange={(e) => {
          
                            setRecipient({
                              ...recipient,
                              walletAddress: e.target.value,
                            });

                          } }

                        />

                  


              


                      </>

                    ) : (

                      <div className='w-full flex flex-col gap-5 items-center justify-between'>
                        <input
                          disabled={sending}
                          type="text"
                          placeholder={User_wallet_address}
                          className=" w-full p-2 border border-gray-300 rounded text-white bg-black text-sm xl:text-sm font-semibold"

                          value={recipient.walletAddress}

                          onChange={(e) => setRecipient({
                            ...recipient,
                            walletAddress: e.target.value,
                          })}

                        />

                        {isWhateListedUser ? (
                          <div className="flex flex-row gap-2 items-center justify-center">


                            <Image
                              src={recipient.avatar || '/profile-default.png'}
                              alt="profile"
                              width={30}
                              height={30}
                              className="rounded-full"
                              style={{
                                objectFit: 'cover',
                                width: '38px',
                                height: '38px',
                              }}
                            />
                            <div className="text-white">{recipient?.nickname}</div>
                            <Image
                              src="/verified.png"
                              alt="check"
                              width={30}
                              height={30}
                            />
                            
                          </div>
                        ) : (
                          <>

                          {/*
                          {recipient?.walletAddress && (
                            <div className='flex flex-row gap-2 items-center justify-center'>

                              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>

                              <div className="text-red-500">
                                {This_address_is_not_white_listed}<br />
                                {If_you_are_sure_please_click_the_send_button}
                              </div>
                            </div>

                          )}
                          */}

                          </>
                        )}



                        {/* qr scanner button */}
                        <div className="w-full flex flex-row gap-2 items-center justify-center">
                          <button
                            disabled={sending}
                            onClick={() => setShowQrScanner(!showQrScanner)}
                            className="w-full p-2 rounded-lg text-sm font-semibold bg-gray-300 text-gray-400"
                          >
                            {showQrScanner ? 'Close QR Scanner' : 'Open QR Scanner'}
                          </button>
                        </div>

                        { showQrScanner && (


                          <div className="w-full flex flex-col items-center justify-center gap-2">
                            {/*
                            <div style={styles.controls}>
                              <select onChange={(e) => setDeviceId(e.target.value)}>
                                <option value={undefined}>Select a device</option>
                                {devices.map((device, index) => (
                                  <option key={index} value={device.deviceId}>
                                    {device.label}
                                  </option>
                                ))}
                              </select>
                              <select
                                style={{ marginLeft: 5 }}
                                onChange={(e) => setTracker(e.target.value)}
                              >
                                <option value="centerText">Center Text</option>
                                <option value="outline">Outline</option>
                                <option value="boundingBox">Bounding Box</option>
                                <option value={undefined}>No Tracker</option>
                              </select>
                            </div>
                            */}
                            <Scanner
                              formats={[
                                "qr_code",
                                "micro_qr_code",
                                "rm_qr_code",
                                "maxi_code",
                                "pdf417",
                                "aztec",
                                "data_matrix",
                                "matrix_codes",
                                "dx_film_edge",
                                "databar",
                                "databar_expanded",
                                "codabar",
                                "code_39",
                                "code_93",
                                "code_128",
                                "ean_8",
                                "ean_13",
                                "itf",
                                "linear_codes",
                                "upc_a",
                                "upc_e",
                              ]}
                              constraints={{
                                deviceId: deviceId,
                              }}
                              onScan={(detectedCodes) => {
                                handleScan(detectedCodes[0].rawValue);
                              }}
                              onError={(error) => {
                                console.log(`onError: ${error}'`);
                              }}
                              styles={{ container: { height: "400px", width: "350px" } }}
                              components={{
                                onOff: true,
                                torch: true,
                                zoom: true,
                                finder: true,
                                tracker: getTracker(),
                              }}
                              allowMultiple={true}
                              scanDelay={2000}
                              paused={pause}
                            />
                          </div>


                        )}





                      </div>

                    )}

                    

                  </div>

                  {/* otp verification */}
                  {/*
                  {verifiedOtp ? (
                    <div className="w-full flex flex-row gap-2 items-center justify-center">
                      <Image
                        src="/verified.png"
                        alt="check"
                        width={30}
                        height={30}
                      />
                      <div className="text-white">OTP verified</div>
                    </div>
                  ) : (
                
            
                    <div className="w-full flex flex-row gap-2 items-start">

                      <button
                        disabled={!address || !recipient?.walletAddress || !amount || isSendingOtp}
                        onClick={sendOtp}
                        className={`
                          
                          ${isSendedOtp && 'hidden'}

                          w-32 p-2 rounded-lg text-sm font-semibold

                            ${
                            !address || !recipient?.walletAddress || !amount || isSendingOtp
                            ?'bg-gray-300 text-gray-400'
                            : 'bg-green-500 text-white'
                            }
                          
                          `}
                      >
                          Send OTP
                      </button>

                      <div className={`flex flex-row gap-2 items-center justify-center ${!isSendedOtp && 'hidden'}`}>
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className=" w-40 p-2 border border-gray-300 rounded text-black text-sm font-semibold"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />

                        <button
                          disabled={!otp || isVerifingOtp}
                          onClick={verifyOtp}
                          className={`w-32 p-2 rounded-lg text-sm font-semibold

                              ${
                              !otp || isVerifingOtp
                              ?'bg-gray-300 text-gray-400'
                              : 'bg-green-500 text-white'
                              }
                            
                            `}
                        >
                            Verify OTP
                        </button>
                      </div>

                    </div>

                  )}
                  */}
                  



                  <button
                    
                    disabled={!address || !recipient?.walletAddress || !amount || sending || !verifiedOtp}

                    onClick={sendUsdt}

                    className={`mt-5 w-full p-2 rounded-lg text-xl font-semibold

                        ${
                        !address || !recipient?.walletAddress || !amount || sending || !verifiedOtp
                        ?'bg-gray-300 text-gray-400'
                        : 'bg-green-500 text-white'
                        }
                      
                      `}
                  >
                      {token} 출금
                  </button>

                  <div className="w-full flex flex-row gap-2 text-xl font-semibold">

                    {/* sending rotate animation with white color*/}
                    {sending && (
                      <div className="
                        w-6 h-6
                        border-2 border-zinc-800
                        rounded-full
                        animate-spin
                      ">
                        <Image
                          src="/loading.png"
                          alt="loading"
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                    <div className="text-white">
                      {sending ? Sending : ''}
                    </div>

                  </div>

                </div>

                {/* transfer history */}
                {/* table view */}
                {/*

                  [
                    {
                        "_id": "683a833a7a4edd08cb8716df",
                        "user": {
                            "_id": "67f46b566692fd42650470f0",
                            "telegramId": "",
                            "walletAddress": "0x534ea8bf168AEBf71ea37ba2Ae0fCEC8E09aA83A"
                        },
                        "sendOrReceive": "send",
                        "transferData": {
                            "transactionHash": "0x425678ff54ad22e524cb013e5e1472e5b081eade5ddf1ff98f6c6035e4d4b838",
                            "transactionIndex": 17,
                            "fromAddress": "0x534ea8bf168AEBf71ea37ba2Ae0fCEC8E09aA83A",
                            "toAddress": "0x5FD40E75e88eb09AA2F4cC772E2263a140a34405",
                            "value": "1000000000000000000000",
                            "timestamp": 1748665142000,
                            "_id": "683a833a7a4edd08cb8716de"
                        }
                    }
                ]
                  */}

                {String(token).toLowerCase() === "kct" && (
                  <div className="w-full mt-5 bg-white rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">전송 내역</h2>
                    
                    {loadingTransferListKCT ? (
                      <div className="w-full flex items-center justify-center">
                        <Image
                          src="/loading.png"
                          alt="loading"
                          width={50}
                          height={50}
                          className='animate-spin'
                        />
                      </div>
                    ) : (
                      <table className="w-full table-auto">
                        <thead>
                          <tr
                            className="bg-gray-200 text-gray-700 text-sm font-semibold">


                            <th className="px-4 py-2">날짜<br/>보내기 / 받기</th>
                            <th className="px-4 py-2">보낸 사람<br/>받는 사람</th>
                            <th className="px-4 py-2">수량</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transferListKCT.map((transfer : any, index: number) => (


                            <tr key={transfer._id}

                              className={`${
                                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                              }`}
                            >
                              <td className="border px-4 py-2">
                                <div className='flex flex-col gap-1'>
                                  <span className="text-sm">
                                    {new Date(transfer.transferData.timestamp).toLocaleTimeString()}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(transfer.transferData.timestamp).toLocaleDateString()}
                                  </span>
                                </div>

                                <span className="font-semibold text-lg">
                                  {transfer.sendOrReceive === "send" ? (
                                    <span className="text-red-500">보내기</span>
                                  ) : (
                                    <span className="text-green-500">받기</span>
                                  )}
                                </span>


                              </td>

                              <td className="border px-4 py-2">
                                {transfer.transferData.fromAddress.slice(0, 6)}...{transfer.transferData.fromAddress.slice(-4)}<br/>
                                {transfer.transferData.toAddress.slice(0, 6)}...{transfer.transferData.toAddress.slice(-4)}
                              </td>
                              <td className="border px-4 py-2">
                                {
                                  (Number(transfer.transferData.value) / 10 ** 18)
                                  .toFixed(2)
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>





                )}








              </div>

            )}



            {/* select swap */}
            {/* KCT -> usdt */}
            {/* usdt -> KCT */}
            {/* input 스왑 수량 */}
            {
              address
              && selectSwap
              && (

                <div className='mt-5 w-full flex flex-col gap-5'>


                  <div className="w-full flex flex-row gap-2 items-center justify-between bg-white border border-gray-300 rounded-lg p-4">

                    <div className='flex flex-row gap-2 items-center justify-start'>
                      <Image
                        src={tokenImage}
                        alt="token"
                        width={35}
                        height={35}
                        className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                      />

                    </div>

                    <div className="flex flex-row items-center justify-end  gap-2">
                      <span className="text-2xl font-semibold text-gray-800">

                        {Number(balance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}

                      </span>
                      <span className="text-lg">{token}</span>
                    </div>
                  </div>



               {/* below arrow image */}
               <div className="w-full flex flex-row gap-2 items-center justify-center">
                  <Image
                    src="/icon-swap-updown.png"
                    alt="arrow"
                    width={30}
                    height={30}
                  />
                </div>


                {token === "USDT" && (
                  <div className="w-full flex flex-row gap-2 items-center justify-between bg-white border border-gray-300 rounded-lg p-4">

                    <div className='flex flex-row gap-2 items-center justify-start'>
                      <Image
                        src="/token-KCT-icon.png"
                        alt="token"
                        width={35}
                        height={35}
                        className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                      />

                    </div>

                    <div className="flex flex-row items-center justify-end  gap-2">
                      <span className="text-2xl font-semibold text-gray-800">

                        {Number(swapTokenBalance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 

                      </span>
                      <span className="text-lg">KCT</span>
                    </div>
                  </div>

                )}

                {token === "KCT" && (
                  <div className="w-full flex flex-row gap-2 items-center justify-between bg-white border border-gray-300 rounded-lg p-4">

                    <div className='flex flex-row gap-2 items-center justify-start'>
                      <Image
                        src="/token-usdt-icon.png"
                        alt="token"
                        width={35}
                        height={35}
                        className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                      />

                    </div>

                    <div className="flex flex-row items-center justify-end  gap-2">
                      <span className="text-2xl font-semibold text-gray-800">

                        {Number(swapTokenBalance).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 

                      </span>
                      <span className="text-lg">USDT</span>
                    </div>
                  </div>

                )}
                

                  <div className='
                    w-full  flex flex-col gap-5 border
                    bg-zinc-800 text-white
                    p-4 rounded-lg

                    '>
                    <div className='flex flex-row gap-2 items-center justify-start'>
                      {/* dot icon */}
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="text-sm
                        text-white

                      ">
                        {/*Buy_Description*/}
                        {token === "USDT" ? "스왑할 USDT 수량을 입력하세요."
                        : "스왑할 KCT 수량을 입력하세요."
                        }
                      </div>
                    </div>

                    <div className='w-full mb-5 flex flex-col xl:flex-row gap-5 items-start justify-between'>

                      <div className='w-full flex flex-row gap-5 items-start justify-between'>
                        <input
                          disabled={loadingSwap}
                          type="number"
                          //placeholder="Enter amount"
                          className=" w-full p-2 border border-gray-300 rounded text-black text-5xl font-semibold "
                          
                          value={swapAmount}

                          onChange={(e) => (

                            // check if the value is a number
                            // check if start 0, if so remove it
                            e.target.value = e.target.value.replace(/^0+/, ''),
                            // check balance

                            setSwapAmount(e.target.value as any),

                            // if swapAmount is USDT, set swapAmountTo to swapAmount * 10.0
                            // if swapAmount is KCT, set swapAmountTo to swapAmount * 0.1

                            setSwapAmountTo(
                              token === "USDT" ? Number(e.target.value) * 10.0 : Number(e.target.value) * 0.1
                            )

                          )}

                        />
                
            

                        {/* check box for want to receive wallet address */}
                        {/*
                        <div className="flex flex-row items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-6 h-6"
                            checked={wantToReceiveWalletAddress}
                            onChange={(e) => setWantToReceiveWalletAddress(e.target.checked)}
                          />
                          <div className="text-white">{Enter_Wallet_Address}</div>
                        </div>
                        */}

                      </div>


                      {/* swap 풀 balance */}
                      {token === "USDT" ? (
                        <div className='w-full flex flex-row gap-5 items-center justify-between'>
                          <div className='flex flex-row gap-2 items-center justify-start'>
                            <Image
                              src="/token-KCT-icon.png"
                              alt="token"
                              width={35}
                              height={35}
                              className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                            />

                            <span className="text-lg font-semibold text-gray-200">
                              {swapPoolKCTBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} KCT
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            스왑 풀 잔액
                          </div>
                        </div>
                      ) : (
                        <div className='w-full flex flex-row gap-5 items-center justify-between'>
                          <div className='flex flex-row gap-2 items-center justify-start'>
                            <Image
                              src="/token-usdt-icon.png"
                              alt="token"
                              width={35}
                              height={35}
                              className='rounded-full w-8 h-8 xl:w-10 xl:h-10'
                            />

                            <span className="text-lg font-semibold text-gray-200">
                              {swapPoolUsdtBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} USDT
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            스왑 풀 잔액
                          </div>
                        </div>
                      )}


                      {/* swapAmountTo */}
                      {/* 받게될 수량 */}
                      <div className='w-full flex flex-col gap-5 items-start justify-between'>
                        <div className='flex flex-row gap-2 items-center justify-start'>
                          {/* dot icon */}
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="text-sm
                            text-white
                          ">
                            {token === "USDT" ? "받게될 KCT 수량"
                            : "받게될 USDT 수량"
                            }
                          </div>
                        </div>
                        <div className="text-2xl font-semibold text-gray-200">
                          {swapAmountTo.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          {token === "USDT" ? " KCT"
                          : " USDT"
                          }
                        </div>
                      </div>
        

                    </div>

                    <button
                      disabled={!address || !swapAmount || loadingSwap}

                      onClick={swap}

                      className={`w-full p-2 rounded-lg text-xl font-semibold
                          ${
                          !address || !swapAmount || loadingSwap
                          ?'bg-gray-300 text-gray-400'
                          : 'bg-green-500 text-white'
                          }
                        
                        `}
                    >
                      {loadingSwap ? (
                        <div className="w-full flex flex-row items-center justify-center gap-2">
                          {/* sending rotate animation with white color*/}
                          <div className="
                            w-6 h-6
                            border-2 border-zinc-800
                            rounded-full
                            animate-spin
                          ">
                            <Image
                              src="/loading.png"
                              alt="loading"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="text-white">
                            {token} 스왑 중...
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex flex-row items-center justify-center gap-2">
                          {token} 스왑
                        </div>
                      )}
                    </button>

                  </div>

                </div>

              )
            }

                



       








            {/* transaction history table */}
            {/*
            <div className="w-full flex flex-col gap-5 items-start justify-start
              border border-gray-300 rounded-lg p-4
            ">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border border-gray-300">Date</th>
                    <th className="p-2 border border-gray-300">Amount</th>
                    <th className="p-2 border border-gray-300">Recipient</th>
                    <th className="p-2 border border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-300">2024-08-01</td>
                    <td className="p-2 border border-gray-300">100.24</td>
                    <td className="p-2 border border-gray-300">0x1234567890</td>
                    <td className="p-2 border border-gray-300">Success</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300">2024-08-01</td>
                    <td className="p-2 border border-gray-300">100.24</td>
                    <td className="p-2 border border-gray-300">0x1234567890</td>
                    <td className="p-2 border border-gray-300">Success</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-300">2024-08-01</td>
                    <td className="p-2 border border-gray-300">100.24</td>
                    <td className="p-2 border border-gray-300">0x1234567890</td>
                    <td className="p-2 border border-gray-300">Success</td>
                  </tr>

                </tbody>
              </table>

              <div className="w-full flex flex-row gap-2 items-center justify-center">
                <button className="p-2 rounded-lg bg-gray-300 text-gray-400">Prev</button>
                <button className="p-2 rounded-lg bg-gray-300 text-gray-400">Next</button>
              </div>
            </div>
            */}





        </div>

    </main>

  );

}





function Header(
  {
      lang,
      chain,
      center,
      agent,
      tokenId,
  } : {
      lang: string
      chain: string
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
                    '/' + lang + '/' + chain + '/?agent=' + agent + '&tokenId=' + tokenId
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

        {/* menu */}
        {/*
        <div className="flex flex-row gap-2 items-center">

              <button
                onClick={() => {
                    router.push(
                        '/kr/polygon/my-nft?agent=' + agent + '&tokenId=' + tokenId + '&center=' + center
                    );
                }}
                className="text-gray-600 hover:underline text-xs xl:text-lg"
              >
                NFT
              </button>

        </div>
        */}
        
      </div>
      
    </header>
  );
}
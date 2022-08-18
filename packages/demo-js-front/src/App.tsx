import React, { useCallback, useEffect } from "react";
import * as t from '@onflow/types';

import "./App.css";
import {
  fcl,
  FlowEnv,
  MatrixMarketClient,
  MatrixMarketOpenOfferClient, MatrixMarketTemplateNFTClient,
} from '@matrix-labs/matrix-marketplace-nft-sdk';
const openOfferClient = new MatrixMarketOpenOfferClient();
const nftClient = new MatrixMarketClient();
const templateNFTClient = new MatrixMarketTemplateNFTClient();
const network = process.env.REACT_APP_NETWORK;
function App() {
  const check = useCallback(async () => {
    
    Object.assign(window,{
      fcl,
      c: nftClient,
      t
    });
    await fcl.currentUser.unauthenticate();
    console.log(`checking.....${network}`);
    if (network === "testnet") {
      console.log("checking test....");
      await nftClient.bindFcl(fcl, FlowEnv.flowTestnet);
      await openOfferClient.bindFcl(fcl, FlowEnv.flowTestnet);

      await fcl.config().put('discovery.authn.endpoint','https://fcl-discovery.onflow.org/api/testnet/authn')
      await fcl.config().put('discovery.authn.include',['0x33f75ff0b830dcec'])
      fcl.discovery.authn.subscribe(res => console.log(res.results))
      console.log(`1:`, 1);

    } else if (network === "mainnet") {
      console.log("checking local....");
      await nftClient.bindFcl(fcl, FlowEnv.flowMainnet);
      await openOfferClient.bindFcl(fcl, FlowEnv.flowMainnet);
      await templateNFTClient.bindFcl(fcl, FlowEnv.flowMainnet)
      await fcl.logIn();
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  Object.assign(window,{fcl,nftClient})

  const mint = async () => {
    let ret;
    const user = await fcl.currentUser().snapshot();
    console.log(user);
    ret = await nftClient
      .mintNFTs(
        "0x7f3812b53dd4de20",
        [user.addr],
        ["1231as"],
        [[{ key: "version", value: "1.0.0" }]]
      )
      .catch(console.error);
    console.log(ret);
  };

  const checkNFTsCollection = async () => {
    let ret;
    const user = await fcl.currentUser().snapshot();
    const info = await fcl.account(user.addr)
    console.log(`info:`, info);
    //ret = await nftClient.checkNFTsCollection("0x445697f20309b7c0");
    ret = await nftClient.checkNFTsCollection(user.addr);
    console.log(ret);
  };

  const getNFTs = async () => {
    let ret;

    const user = await fcl.currentUser().snapshot();
    console.log(user);
    ret = await nftClient.getNFTs(user.addr);
    console.log(ret);
  };

  const initNFTCollection = async () => {
    let ret;
    ret = await nftClient.initNFTCollection().catch(e=>e);
    console.log(ret);
  };

  const initOpenOffer = async () => {
    let ret;
    const user = await fcl.currentUser().snapshot();
    console.log(user);
    ret = await openOfferClient.initOpenOffer().catch(console.error);
    console.log(ret);
  };

  const openOffer = async () => {
    // let ret;
    const user = await fcl.currentUser().snapshot();
    console.log(user);
    // ret = await openOfferClient.openOffer(19, "2.58").catch(console.error);
    // console.log(ret);
  };

  const removeOpenOffer = async () => {
    try {
      let ret;
      const user = await fcl.currentUser().snapshot();
      console.log(user);
      ret = await openOfferClient.removeOffer(90575769);
      console.log(ret);
    } catch (e) {
      console.log(`1:`, 1);
      //@ts-ignore
      window.ee = e;
      throw e;
    }
  };

  const acceptOffer = async () => {
    // let ret;
    try {
      const user = await fcl.currentUser().snapshot();
      console.log(user);
    } catch (e) {
      //@ts-ignore
      window.ee = e;
      throw e;
    }
    // ret = await openOfferClient
    //   .acceptOffer(90576137, "0xae8b87df71d454cb")
    //   .catch(console.error);
    // console.log(ret);
  };

  const getOfferDetails = async () => {
    let ret;

    const user = await fcl.currentUser().snapshot();
    console.log(user);
    ret = await openOfferClient.getOfferDetails("0xae8b87df71d454cb", 90576137);
    console.log(ret);
  };

  const getOfferIds = async () => {
    let ret;

    const user = await fcl.currentUser().snapshot();
    console.log(user);
    ret = await openOfferClient.getOfferIds(user.addr);
    console.log(ret);
  };
  
  const deployFlowNia = async () => {
    try {
      let ret;
      ret = await templateNFTClient.deploy('FlowNia');
      console.log(ret);
    } catch (e) {
      console.error(`e:`, e);
    }
  };
  const deployFlowNiaMysteryBox = async () => {
    try {
      let ret;
      ret = await templateNFTClient.deploy('FlowNiaMysteryBox');
      console.log(ret);
    } catch (e) {
      console.error(`e:`, e);
    }
  };

  return (
    <div className="App">
      <button onClick={initNFTCollection} className="App-link">
        initNFTCollection
      </button>
      <button onClick={checkNFTsCollection} className="App-link">
        checkNFTsCollection
      </button>
      <button onClick={getNFTs} className="App-link">
        getNFTs
      </button>
      <button onClick={mint} className="App-link">
        mint
      </button>

      <button onClick={initOpenOffer} className="App-link">
        initOpenOffer
      </button>
      <button onClick={openOffer} className="App-link">
        openOffer
      </button>
      <button onClick={removeOpenOffer} className="App-link">
        removeOpenOffer
      </button>
      <button onClick={acceptOffer} className="App-link">
        acceptOffer
      </button>
      <button onClick={getOfferDetails} className="App-link">
        getOfferDetails
      </button>
      <button onClick={getOfferIds} className="App-link">
        getOfferIds
      </button>
    </div>
  );
}

export default App;

<template>
  <div class="home">
    <HelloWorld />   
      <el-button id="Getter" type="primary"  class="clearfix" @click="Getter">Getter </el-button>
      <el-button id="Increase" type="primary"  class="clearfix" @click="Increase">Increase</el-button>
      {{value}}
      <br>
      <input type="text" v-model="hash2">
      {{hash2}}
      <el-button id="getEvidence" type="primary"  class="clearfix" @click="getEvidence"> getEvidence</el-button>

      <el-button id="getUsers" type="primary"  class="clearfix" @click="getUsers">getUsers</el-button>
      <br>
      <input type="text" v-model="hash">
      {{hash}}
      <el-button id="saveEvidence" type="primary"  class="clearfix" @click="saveEvidence">saveEvidence</el-button>

  </div>
</template>

<script>
// @ is an alias to /src

import HelloWorld from '@/components/HelloWorld.vue'
import Web3 from "web3";
import Tx from "ethereumjs-tx";

import HDWalletProvider from "@truffle/hdwallet-provider";
//import VueMetamask from 'vue-metamask'
export default {
  name: 'home',
  components: {
  //   VueMetamask,
    HelloWorld
  },
  data(){
    return {
      users: [],
      value: 5,
      msg: "This is demo net work",
      hash:"",
      hash2:""
    }
  },
  methods:{
  /*  onComplete(data){
      console.log('data', data);
    }
  }*/
  Getter(){
      window.myContract.methods.value().call().then((value)=>{
        console.log(value);
        this.value = value;
      })
  },
  Increase(){
  
   window.myContract.methods.increase(1).send({from:window.defaultAccount})
   .on('transactionHash',(transactionHash)=>{
     console.log('transactionHash', transactionHash)
   })
   .on('receipt',(receipt)=>{
     console.log({ receipt:receipt })
   })
   .on('error',(error, receipt)=>{
     console.log({ error:error, receipt:receipt})
   })
   
  },
  getEvidence(){
    window.myContract2.methods.getEvidence(this.hash2).send({from:window.defaultAccount})
    .on('transactionHash',(transactionHash)=>{
     console.log('transactionHash', transactionHash)
   })
   .on('receipt',(receipt)=>{
     //console.log({ receipt:receipt })
      var flag = receipt.events.GetEvidence.returnValues[0];
      if (flag == 3003){
        console.log({ event:receipt.events.GetEvidence.returnValues[0] })
      }else if (flag == 3001){
        console.log({ event:receipt.events.GetEvidence.returnValues[2] })
      }
    
    
   })
   .on('error',(error, receipt)=>{
     console.log({ error:error, receipt:receipt})
   })
  },
  getUsers(){
    window.myContract2.methods.getUsers().call().then((Users)=>{
      console.log(Users);
    })
  },
  saveEvidence(){
    window.myContract2.methods.saveEvidence(this.hash).send({from:window.defaultAccount})
    .on('transactionHash',(transactionHash)=>{
     console.log('transactionHash', transactionHash)
   })
   .on('receipt',(receipt)=>{
     console.log({ receipt:receipt })
   })
   .on('error',(error, receipt)=>{
     console.log({ error:error, receipt:receipt})
   })
  },
},
async mounted() {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      //window.web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/e6b151ba42004b5ebce395b52fa4de91"));
      //window.web3 = new Web3("https://kovan.infura.io/v3/e6b151ba42004b5ebce395b52fa4de91");
      try {
        const accounts = await ethereum.enable();
        console.log(accounts);
        const provider = window['ethereum']
        console.log(provider)
        console.log(provider.chainId)
        //this.web3TimerCheck(window.web3);
        const web3 = new Web3(provider)
        console.log(web3)
/******************** */
        const abi = require("./contract_abi.json");
        const address = "0xc10e4ed0258b6229e58cf90ae470c2df6f07043b"
        const privateKey =  Buffer.from('257b0cdc788702dda2221b06358d20bb7ab30256b7e1e3356c1bf0027bd091e4',"hex")
        console.log("privateKey: ",privateKey)
        const account = web3.eth.accounts.privateKeyToAccount("0x"+"257b0cdc788702dda2221b06358d20bb7ab30256b7e1e3356c1bf0027bd091e4");
        let keyaddress = account.address;
        console.log("address: ",keyaddress)
        window.myContract = new web3.eth.Contract(abi.abi, address)
        console.log(window.myContract)
/******************** */
        window.defaultAccount = accounts[0].toLowerCase()
        console.log(window.defaultAccount)
        const abi2 = require("./contract_abi2.json")
        const address2 = "0xb1d17b075d13ee1ec7a686d692809182ac9f19f0"
        window.myContract2 = new web3.eth.Contract(abi2.abi, address2)
        console.log(window.myContract2)
      } catch (error) {
        /*
        this.Log(
          this.MetamaskMsg.USER_DENIED_ACCOUNT_AUTHORIZATION,
          "USER_DENIED_ACCOUNT_AUTHORIZATION"
        );*/
        console.log(error)
      }
    } else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      //this.web3TimerCheck(window.web3);
    } else {
      this.web3 = null;
      this.Log(this.MetamaskMsg.METAMASK_NOT_INSTALL, "NO_INSTALL_METAMASK");
      console.error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },
};
</script>
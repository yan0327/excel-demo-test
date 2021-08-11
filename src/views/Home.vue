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
import EthereumTx from "ethereumjs-tx";


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
      //window.web3 = new Web3(ethereum);
      web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/e6b151ba42004b5ebce395b52fa4de91"));
      //window.web3 = new Web3("https://kovan.infura.io/v3/e6b151ba42004b5ebce395b52fa4de91");
      /*
      var _from = "0xf84B519A79d308b3DCdD4f0Ae4ac12C7CDda4233";
      var privateKey1 = Buffer.from('257b0cdc788702dda2221b06358d20bb7ab30256b7e1e3356c1bf0027bd091e4','hex');//process.env.PRIVATE_KEY_1
      web3.eth.getTransactionCount(_from,(err,txcount)=>{
        var txObject ={
        nonce: web3.utils.toHex(txcount),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
        gasLimit: web3.utils.toHex(21000),
        to: '0xf84B519A79d308b3DCdD4f0Ae4ac12C7CDda4233',
        value:web3.utils.toHex(web3.utils.toWei('0.0001','ether')),
}
      var tx = new Tx(txObject);
      tx.sign(privateKey1);
      var serializedTx = tx.serialize();
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
          if (!err){
              console.log(hash);
          }else{
              console.log(err);
          }
      })
});*/

//智能合约地址
const registryAddress = "0xc10e4ed0258b6229e58cf90ae470c2df6f07043b"
//智能合约对应Abi文件
var contractAbi = require("./contract_abi.json");
//私钥转换为Buffer
const privateKey =  Buffer.from('257b0cdc788702dda2221b06358d20bb7ab30256b7e1e3356c1bf0027bd091e4',"hex")//推荐使用cmd set命令然后env.process导出来
//私钥转换为账号                
const account = web3.eth.accounts.privateKeyToAccount("0x"+"257b0cdc788702dda2221b06358d20bb7ab30256b7e1e3356c1bf0027bd091e4");
//私钥对应的账号地地址
const address = account.address
console.log("address: ",address)

//获取合约实例
var myContract = new web3.eth.Contract(contractAbi.abi,registryAddress)

myContract.methods.value().call().then((value)=>{
        console.log(value);
        this.value = value;
      })


//获取nonce,使用本地私钥发送交易
/*
web3.eth.getTransactionCount(address).then(
    nonce => {
        console.log("nonce: ",nonce)
        const txParams = {
            nonce: nonce,
            gasPrice: web3.utils.toHex(web3.utils.toWei('10','gwei')),
            gasLimit: web3.utils.toHex(210000),
            to: registryAddress,
            data: myContract.methods.increase(1).encodeABI(), //ERC20转账
           
          }
          const tx = new EthereumTx(txParams)
        tx.sign(privateKey)
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
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
    e => console.log(e)
)*/
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
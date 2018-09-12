const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(transactions, timestamp, previousHash=''){
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + JSON.stringify(this.transactions) + this.timestamp + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined", this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }
    createGenesisBlock(){
        return new Block("Genesis Block", "11/09/1999", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i =1;i<this.chain.length;++i){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.calculateHash() !== currentBlock.hash){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;   
    }
}

let nimCoin = new Blockchain();
console.log("Mining Block 1");
nimCoin.addBlock(new Block({amount:4},"12/12/2015"));

console.log("Mining Block 2");
nimCoin.addBlock(new Block({amount:5},"12/02/2016"));

console.log("Mining Block 3");
nimCoin.addBlock(new Block({amount:7},"12/12/2016"));

// console.log(JSON.stringify(nimCoin, null,4));



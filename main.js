const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(transactions, timestamp, previousHash=''){
        this.transactions = transactions;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
        this.pendingTransactions = [];
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
        this.difficulty = 4;
        this.miningReward = 10;
        this.pendingTransactions = [];
    }
    createGenesisBlock(){
        return new Block("Genesis Block", "11/09/1999", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    minePendingTransactions(miningRewardAddress){
        let block = new Block(this.pendingTransactions,Date.now());
        block.mineBlock(this.difficulty);
        console.log("Block mined ");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    getBalance(address){
        let balance = 0;
        for(let i =1;i<this.chain.length;++i){
            this.chain[i].transactions.forEach((transaction)=>{
                if(transaction.fromAddress == address) balance -= transaction.amount;
                else if  (transaction.toAddress == address) balance += transaction.amount;  
            })
        }
        return balance;
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
nimCoin.createTransaction(new Transaction('adress1','address2',100));
nimCoin.createTransaction(new Transaction('adress2','address1',50));

console.log("Starting mining");
nimCoin.minePendingTransactions('nimish');
console.log('nimCoin balance of nimish is', nimCoin.getBalance('nimish'));

console.log("Starting mining again");
nimCoin.minePendingTransactions('nimish2');
console.log('nimCoin balance of nimish is', nimCoin.getBalance('nimish'));




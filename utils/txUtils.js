import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as constants from './constants.js';

export async function getHashOfMostRecentConfirmedTx(connection, pubkey) {
    const limit = 1;
    const signatures = await connection.getConfirmedSignaturesForAddress2(pubkey, {limit: limit}, 'confirmed');
    return signatures[0].signature;
}

export function isNullOrFailedTx(tx) {
    return tx == null || tx.blockTime == null || tx.meta == null || tx.meta.err != null || 
        tx.meta.logMessages.filter(message => message.includes("failed")) > 0;
}

export function isNotACollectionSale(tx) {
    const instructions = tx.transaction.message.instructions;
    
    // Sales use only 1 instruction so inner instructions come from index 0
    const innerInstructions = tx.meta.innerInstructions[0].instructions;

    // The number of inner instructions a collection 
    // uses for sales depends on the number of creator addresses.
    // E.g. 5 inner instructions for 2 creators, 6 for 3 ...
    return instructions.length != 1 || innerInstructions.length != constants.NUM_CREATORS + 3;  
}

export function decodeSaleTx(tx) {
    const innerInstructions = tx.meta.innerInstructions[0].instructions;
    const length = innerInstructions.length
    const buyer = innerInstructions[length-2].parsed.info.source;
    const seller = innerInstructions[length-2].parsed.info.destination;
    let price = 0;
    for (let i = 0; i < length-1; i++) {
        price += innerInstructions[i].parsed.info.lamports;
    }
    const mint = tx.meta.preTokenBalances[0].mint;

    return {
        mint: mint,
        price: price / LAMPORTS_PER_SOL,
        buyer: buyer,
        seller: seller 
    }
}

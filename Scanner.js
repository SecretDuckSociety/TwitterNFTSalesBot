import { Connection, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import * as txUtils from './utils/txUtils.js';
import * as utils from './utils/utils.js';
import * as constants from './utils/constants.js';
import * as tweet from './tweet.js';

async function monitor() {
    const collectionMetadata = JSON.parse(fs.readFileSync('./json/CollectionMetadata.json', 'utf8'));

    const connection = new Connection(constants.RPC_ENDPOINT);
    const magicEdenPubkey = new PublicKey(constants.MAGIC_EDEN_ADDRESS);
    let lastHash = await txUtils.getHashOfMostRecentConfirmedTx(connection, magicEdenPubkey);
    while (true) {
        const signatures = await connection.getConfirmedSignaturesForAddress2(magicEdenPubkey, {until: lastHash}, 'confirmed');
        if (signatures.length == 0) {
            await utils.sleep(2000);
            continue;
        }
        for (let i = signatures.length - 1; i >= 0; i--) {
            if (i == 0) lastHash = signatures[i].signature;
            const tx = await connection.getParsedConfirmedTransaction(signatures[i].signature, 'confirmed');
            if (txUtils.isNullOrFailedTx(tx) || txUtils.isNotACollectionSale(tx)) continue;

            const decodedTx = txUtils.decodeSaleTx(tx)
            const nftMetadata = getNftMetadataFromCollectionMetadata(decodedTx.mint, collectionMetadata);
            if (nftMetadata == null) continue;

            const hash = signatures[i].signature;
            const imageUrl = await utils.fetchImageUri(nftMetadata.uri);
            const tweetText = tweet.formatTweetText(decodedTx, nftMetadata, hash)

            await tweet.tweetWithImage(tweetText, imageUrl);
        }
        await utils.sleep(10000);
    }
}

function getNftMetadataFromCollectionMetadata(mint, collectionMetadata) {
    for (const nftMetadata of collectionMetadata) {
        if (mint === nftMetadata.mint) {
            return nftMetadata;
        }
    }
    return null;
}

(async () => await monitor())();

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
    const alphaArtPubkey = new PublicKey(constants.ALPHA_ART_ADDRESS);
    let [lastMEHash, lastAAHash] = await Promise.all([txUtils.getHashOfMostRecentConfirmedTx(connection, magicEdenPubkey), 
                                                      txUtils.getHashOfMostRecentConfirmedTx(connection, alphaArtPubkey)]);
    monitorMarketPlace(constants.MAGIC_EDEN, lastMEHash, magicEdenPubkey, connection, collectionMetadata);
    monitorMarketPlace(constants.ALPHA_ART, lastAAHash, alphaArtPubkey, connection, collectionMetadata);
}



async function monitorMarketPlace(marketplace, lastHash, pubkey, connection, collectionMetadata) {
    console.log(`Starting scan of ${marketplace}`);
    while (true) {
        try {
            const signatures = await connection.getConfirmedSignaturesForAddress2(pubkey, {until: lastHash}, 'confirmed');
            if (signatures.length == 0) {
                await utils.sleep(10000);
                continue;
            }
            console.log(`Scanning ${signatures.length} signatures from ${marketplace}`);
            for (let i = signatures.length - 1; i >= 0; i--) {
                lastHash = signatures[i].signature;
                const tx = await connection.getParsedConfirmedTransaction(signatures[i].signature, 'confirmed');
                if (txUtils.isNullOrFailedTx(tx) || !txUtils.isCollectionSale(tx, marketplace)) continue;

                const decodedTx = txUtils.decodeSaleTx(tx, marketplace);
                const nftMetadata = getNftMetadataFromCollectionMetadata(decodedTx.mint, collectionMetadata);
                if (nftMetadata == null) continue;

                console.log(`Found sale from ${marketplace}`);
                const hash = signatures[i].signature;
                const imageUrl = await utils.fetchImageUri(nftMetadata.uri);
                const tweetText = tweet.formatTweetText(decodedTx, nftMetadata, hash);
                console.log(tweetText);

                await tweet.tweetWithImage(tweetText, imageUrl);
            }
        } catch (err) {
            console.log(err);
        } finally {
            await utils.sleep(15000);
        }
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
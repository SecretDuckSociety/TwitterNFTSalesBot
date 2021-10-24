import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import base58 from 'bs58';
import * as fs from 'fs';
import * as constants from './utils/constants.js';

async function getCollectionAccounts() {
    let connection = new Connection(clusterApiUrl('mainnet-beta'));
    let metaplexPubkey = new PublicKey(constants.METAPLEX_PUBKEY)
    let programAccounts = await connection.getProgramAccounts(metaplexPubkey, constants.updateAuthorityFilter);
    return programAccounts;
}

function getMetadataFromAccount(account) {
    const metadata = constants.AccountLayout.decode(account.account.data, 0);
    const updateAuthority = base58.encode(metadata.update_authority)
    const mint = base58.encode(metadata.mint)
    const name = Buffer.from(metadata.name).toString().trim().replace(/[^ -~]+/g, ""); // magic regex to remove 
    const uri = Buffer.from(metadata.uri).toString().trim().replace(/[^ -~]+/g, "");   // non-ascii characters
    const id = parseInt(name.substring(name.indexOf('#') + 1))
    return {
        id: id,
        updateAuthority: updateAuthority,
        mint: mint,
        name: name,
        uri: uri,
        address: account.pubkey.toString()
    }
}

async function main() {
    let accountInfo = await getCollectionAccounts();
    let metadataArr = []
    for (const account of accountInfo) {
        let metadata = getMetadataFromAccount(account);
        metadataArr.push(metadata)
    }
    fs.writeFileSync("./json/CollectionMetadata.json", JSON.stringify(metadataArr, null, 2));
    process.exit(0);
}


(async () => await main())();



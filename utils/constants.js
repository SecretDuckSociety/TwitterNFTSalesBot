import * as BufferLayout from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';

export const UPDATE_AUTHORITY_PUBKEY = process.env.UPDATE_AUTHORITY;
export const METAPLEX_PUBKEY = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
export const DIGITAL_EYES_ADDRESS = "F4ghBzHFNgJxV4wEQDchU5i7n4XWWMBSaq7CuswGiVsr"; // TODO
export const MAGIC_EDEN_ADDRESS = "GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp";
export const RPC_ENDPOINT = process.env.RPC_ENDPOINT;
export const SOLANA_EXPORER_TX_BASE = 'https://explorer.solana.com/tx/';

export const NUM_CREATORS = 2;

export const twitterConfig = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

export const AccountLayout = BufferLayout.struct([
    BufferLayout.u8('key'),
    BufferLayout.blob(32, 'update_authority'),
    BufferLayout.blob(32, 'mint'),
    BufferLayout.blob(32, 'name'),
    BufferLayout.blob(10, 'symbol'),
    BufferLayout.blob(4, "padding"),
    BufferLayout.blob(200, 'uri')
]);

export const updateAuthorityFilter = {
    commitment: 'confirmed', 
    filters: [ 
        {
            memcmp: 
                {
                    bytes: new PublicKey(UPDATE_AUTHORITY_PUBKEY).toBase58(), 
                    offset: 1
                } 
        }
    ]
};

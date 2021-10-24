
import twit from 'twit'; 
import * as utils from './utils/utils.js'
import * as constants from './utils/constants.js'

const twitterClient = new twit(constants.twitterConfig);

export async function tweetWithImage(tweetText, imageUrl) {
    const processedImage = await utils.getBase64(imageUrl);

    twitterClient.post('media/upload', { media_data: processedImage }, (err, data, response) => {
        if (!err) {
            const mediaIdStr = data.media_id_string;
            const altText = `${Duck}`
            const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }
            
            twitterClient.post('media/metadata/create', meta_params, function (err, data, response) {
                if (!err) {
                    const tweet = { status: tweetText, media_ids: [mediaIdStr]};
                
                    twitterClient.post('statuses/update', tweet, function (err, data, response) {
                        if (!err) {
                            console.log(`Successfully tweeted: ${tweetText}`);
                        } else {
                            console.error(err);
                        }
                    })
                } else {
                    console.log(err);
                }
            })
        } else {
            console.log(err);
        }
    });
}

// TODO: update
export async function formatTweetText(decodedTx, nftMetadata, hash) {
    const text = 
`${nftMetadata.name} sold for ${decodedTx.price} S◎L

${constants.SOLANA_EXPORER_TX_BASE}${hash}`;
   
    return text;
}

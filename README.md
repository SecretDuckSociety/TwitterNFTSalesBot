![image](https://user-images.githubusercontent.com/92042266/138783963-75192638-e232-42e9-a0a6-6132495d37ef.png)

🦆 [Website](https://secretducksociety.com) 🦆 [Twitter](https://twitter.com/secretducknft) 🦆 [Discord](https://discord.gg/a7nVsdsv5Q) 🦆

# TwitterNFTSalesBot

### About

Powering the Secret Duck Society Twitter sales bot https://twitter.com/Secretducksales.

The is a javascript implementation for a Twitter Solana NFT collection sales bot. It monitors secondary marketplaces for sales from a given collection and tweets about them. As of now, the bot only monitors Magic Eden and Alpha Art, but functionality for other marketplaces is on the way.

Along with the bot comes a [Collection Fetcher](https://github.com/SecretDuckSociety/TwitterNFTSalesBot/blob/main/CollectionFetcher.js) that will generate a json file of the metadata from your NFT collection. Here is an example of the format the metadata for each NFT comes in.
```
    "id": 1968,
    "updateAuthority": "8yvshU8TYtg3c5TwmvJEzRRUgRGZSuWkghv1ZXP9UQUb",
    "mint": "Ezp7t9Mg1yuAu37AV7WAKTVjEGDhmF2beZm31imTdoR4",
    "name": "Duck #1968",
    "uri": "https://arweave.net/jZiFIUvG8cS9nAgiJ34mKxjGmvO8mfdKHsNaD4hEjhA",
    "address": "376bvNdBLagKgqmL7RcWnL3DeCUgk1ND2b4GRnc5NAKj"
```
The scanner works by monitoring the addresses of secondary marketplaces. It continously uses the function [getConfirmedSignaturesForAddress2](https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getConfirmedSignaturesForAddress2) to pull a list of the recent transactions for each marketplace address, and then filters these for transactions that are sales involving the desired NFT collection. 

If the scanner detects a sale from the collection, it passes the appropriate information to [tweet.js](https://github.com/SecretDuckSociety/TwitterNFTSalesBot/blob/main/tweet.js) to handle Twitter functionality.

### Prerequisites
You must download some prerequisite software to be able to run this code:
- [Node](https://nodejs.org/en/download/)
- [Git](https://github.com/git-guides/install-git)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

And set up [Twitter Developer Accounts](https://developer.twitter.com/en/apply-for-access)

### Installation
```
git clone https://github.com/SecretDuckSociety/TwitterNFTSalesBot.git
yarn install
```

### How to run the bot

1. Fill in your .env file with the appropriate values. Note that due to rate limits, if you try to use the public endpoints (https://api.mainnet-beta.solana.com) for RPC_ENDPOINT you will likely be throttled. To use the current iteration of the code you need to use a custom endpoint that doesn't include rate limits.
2. Visit the [constants file](https://github.com/SecretDuckSociety/TwitterNFTSalesBot/blob/main/utils/constants.js) and change the NUM_CREATORS variable to match the number of creators for your collection. Your candy machine counts as a creator.
3. Run `node -r dotenv/config CollectionFetcher.js` to fetch the metadata associated with your collection.
4. Run `node -r dotenv/config Scanner.js` to fire up the bot. It will keep running until the process is killed (ctrl-c). Using [tmux](https://github.com/tmux/tmux) to run your bot is recommended. Alternatively, you could run it as a Heroku app (see [Heroku Remote](https://devcenter.heroku.com/articles/git#creating-a-heroku-remote)).

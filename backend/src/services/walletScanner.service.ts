import { rpc } from "./rpc.service";
import { getTokenSymbol } from "../utils/tokenMetadata";

export async function scanWallet(env:any,address:string){

  address = address.toLowerCase();

  const results:any[] = [];

  const latestHex = await rpc(env,"eth_blockNumber");
  const latestBlock = parseInt(latestHex,16);

  const SCAN_DEPTH = 200;

  for(let i=0;i<SCAN_DEPTH;i++){

    const blockHex =
      "0x"+(latestBlock-i).toString(16);

    const block =
      await rpc(env,"eth_getBlockByNumber",[blockHex,true]);

    if(!block) continue;

    for(const tx of block.transactions){

      const from = tx.from?.toLowerCase();
      const to = tx.to?.toLowerCase();

      const receipt =
        await rpc(env,"eth_getTransactionReceipt",[tx.hash]);

      const status =
        receipt?.status==="0x1"
        ?"success"
        :"failed";

      /* ETH TRANSFER */

      if(from===address || to===address){

        const amount =
          Number(BigInt(tx.value))/1e18;

        results.push({
          type:"ETH_TRANSFER",
          txHash:tx.hash,
          from,
          to,
          amount,
          symbol:"ETH",
          status
        });

      }

      /* ERC20 TRANSFER */

      if(receipt?.logs){

        for(const log of receipt.logs){

          const topic = log.topics[0];

          if(topic && topic.startsWith("0xddf252ad")){

            const fromAddr =
              "0x"+log.topics[1].slice(26)
              .toLowerCase();

            const toAddr =
              "0x"+log.topics[2].slice(26)
              .toLowerCase();

            if(fromAddr===address || toAddr===address){

              const symbol =
                await getTokenSymbol(env,log.address);

              results.push({
                type:"ERC20_TRANSFER",
                txHash:tx.hash,
                from:fromAddr,
                to:toAddr,
                amount:BigInt(log.data).toString(),
                symbol,
                status
              });

            }

          }

        }

      }

      if(results.length>=10){
        return results.slice(0,10);
      }

    }

  }

  return results.slice(0,10);

}
// waht it does is it scans the latest 200 blocks for transactions involving the given address, and returns a list of ETH and ERC20 transfers. It uses eth_call to fetch token symbols for ERC20 transfers. and it returns the 10 most recent transactions.
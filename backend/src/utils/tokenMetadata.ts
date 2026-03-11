import { rpc } from "../services/rpc.service";

const tokenCache: Record<string,string> = {};

export async function getTokenSymbol(env:any,address:string){

  address = address.toLowerCase();

  if(tokenCache[address]){
    return tokenCache[address];
  }

  try{

    const result = await rpc(env,"eth_call",[
      {
        to: address,
        data:"0x95d89b41"
      },
      "latest"
    ]);

    const symbol =
      Buffer.from(result.slice(130),"hex")
      .toString()
      .replace(/\0/g,"");

    tokenCache[address] = symbol;

    return symbol;

  }catch{

    return "UNKNOWN";

  }
}

// what this do is it fetches the token symbol for a given address using an eth_call to the blockchain. 
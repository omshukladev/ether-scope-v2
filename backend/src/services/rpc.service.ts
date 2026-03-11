type RpcResponse = {
  jsonrpc: string
  id: number
  result: any
}

export async function rpc(env: any, method: string, params: any[] = []) {

  const response = await fetch(env.LAVA_RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1
    })
  });

  const data = await response.json() as RpcResponse;

  return data.result;
}
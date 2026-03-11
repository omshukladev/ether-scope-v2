const BASE_URL = "https://api.etherscan.io/v2/api";

type EtherscanResponse = {
  status: string
  message: string
  result: any[]
};

export const fetchWalletTransactions = async (
  env: any,
  address: string
) => {

  const params = {
    chainid: "1",
    module: "account",
    address,
    startblock: "0",
    endblock: "99999999",
    sort: "desc",
    apikey: env.ETHERSCAN_API_KEY
  };

  const ethURL =
    `${BASE_URL}?${new URLSearchParams({
      ...params,
      action: "txlist",
      page: "1",
      offset: "50"
    })}`;

  const tokenURL =
    `${BASE_URL}?${new URLSearchParams({
      ...params,
      action: "tokentx",
      page: "1",
      offset: "50"
    })}`;

  const [ethRes, tokenRes] = await Promise.all([
    fetch(ethURL),
    fetch(tokenURL)
  ]);

  const ethData = await ethRes.json() as EtherscanResponse;
  const tokenData = await tokenRes.json() as EtherscanResponse;

  const ethTxs = ethData.status === "1" ? ethData.result : [];
  const tokenTxs = tokenData.status === "1" ? tokenData.result : [];

  const normalizedETH = ethTxs.map((tx: any) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    amount: Number(tx.value) / 1e18,
    symbol: "ETH",
    date: new Date(Number(tx.timeStamp) * 1000).toISOString(),
    type: tx.to.toLowerCase() === address.toLowerCase()
      ? "incoming"
      : "outgoing",
    status: tx.isError === "0" ? "success" : "failed"
  }));

  const normalizedTokens = tokenTxs.map((tx: any) => ({
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    amount: Number(tx.value) / 10 ** Number(tx.tokenDecimal),
    symbol: tx.tokenSymbol,
    date: new Date(Number(tx.timeStamp) * 1000).toISOString(),
    type: tx.to.toLowerCase() === address.toLowerCase()
      ? "incoming"
      : "outgoing",
    status: "success"
  }));

  const merged = [...normalizedETH, ...normalizedTokens];

  merged.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  return merged.slice(0, 10);
};
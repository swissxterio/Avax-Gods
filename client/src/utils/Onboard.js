const FUJI_CHAIN_ID = 43113;
const FUJI_CHAIN_HEX = '0xA869';

export const getWalletProvider = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found. Install Core Wallet or another EVM wallet to connect.');
  }

  return window.ethereum;
};

const parseChainId = (chainId) => {
  if (typeof chainId === 'number') return chainId;
  if (typeof chainId === 'string') return Number.parseInt(chainId, chainId.startsWith('0x') ? 16 : 10);
  return null;
};

export const connectInjectedWallet = async () => {
  const provider = getWalletProvider();
  const accounts = await provider.request({ method: 'eth_requestAccounts' });

  if (!accounts?.[0]) {
    throw new Error('The wallet did not return an account. Unlock it and try again.');
  }

  return {
    account: accounts[0],
    chainId: parseChainId(await provider.request({ method: 'eth_chainId' })),
  };
};

export const readWalletAccounts = async (provider) => provider.request({ method: 'eth_accounts' });

export const parseWalletChainId = parseChainId;

export const switchToFuji = async () => {
  const provider = getWalletProvider();

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: FUJI_CHAIN_HEX }],
    });
  } catch (error) {
    if (error.code !== 4902) {
      throw error;
    }

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: FUJI_CHAIN_HEX,
        chainName: 'Avalanche Fuji Testnet',
        nativeCurrency: {
          name: 'Avalanche',
          symbol: 'AVAX',
          decimals: 18,
        },
        rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
        blockExplorerUrls: ['https://testnet.snowtrace.io'],
      }],
    });
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: FUJI_CHAIN_HEX }],
    });
  }
};

export { FUJI_CHAIN_ID };

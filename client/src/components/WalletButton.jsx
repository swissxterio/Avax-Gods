import React, { useState } from 'react';
import { FUJI_CHAIN_ID, switchToFuji } from '../utils/Onboard';
import { useGlobalContext } from '../context';

const WalletButton = ({ onConnected, large = false }) => {
  const {
    walletAddress,
    walletChainId,
    connectWallet,
    setWalletChainId,
  } = useGlobalContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isConnected = Boolean(walletAddress);

  const handleConnect = async () => {
    setErrorMessage('');
    setIsConnecting(true);

    try {
      await connectWallet();
      onConnected?.();
    } catch (error) {
      setErrorMessage(error.code === 4001 ? 'Wallet connection was rejected.' : error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    setErrorMessage('');

    try {
      await switchToFuji();
      setWalletChainId(FUJI_CHAIN_ID);
    } catch (error) {
      setErrorMessage(error.code === 4001 ? 'Network switch was rejected.' : error.message);
    }
  };

  if (isConnected) {
    return (
      <div className={`wallet-control ${large ? 'wallet-control-large' : ''}`}>
        <span className="wallet-address" title={walletAddress}>
          <span className="wallet-status-dot" aria-hidden="true" />
          {`${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`}
        </span>
        {walletChainId !== FUJI_CHAIN_ID ? (
          <button type="button" className="wallet-network-button" onClick={handleSwitchNetwork}>
            Switch to Fuji
          </button>
        ) : (
          <span className="wallet-network-label">Fuji testnet</span>
        )}
        {errorMessage && <span className="wallet-error" role="alert">{errorMessage}</span>}
      </div>
    );
  }

  return (
    <div className={`wallet-control ${large ? 'wallet-control-large' : ''}`}>
      <button
        type="button"
        className="wallet-connect-button"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        <span aria-hidden="true">◈</span>
        {isConnecting ? 'Connecting wallet…' : 'Connect wallet'}
      </button>
      {errorMessage && <span className="wallet-error" role="alert">{errorMessage}</span>}
    </div>
  );
};

export default WalletButton;

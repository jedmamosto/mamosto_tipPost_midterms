import { useWallet } from '../hooks/useWallet';

export function ConnectWallet() {
  const { account, connectWallet, isConnecting, error } = useWallet();

  const truncateAddress = (addr: string) => 
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="top-bar">
      <h1 className="logo">TipPost</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {error && <span style={{ color: 'var(--error)' }}>{error}</span>}
        
        {account ? (
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
            <span className="mono-text" style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {truncateAddress(account)}
            </span>
          </div>
        ) : (
          <button 
            className="btn-primary" 
            onClick={connectWallet} 
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  );
}

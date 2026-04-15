interface EarningsProps {
  totalEarned: string;
}

export function Earnings({ totalEarned }: EarningsProps) {
  return (
    <div className="earnings-board">
      <span className="earnings-label">
        Lifetime Earnings
      </span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <span className="mono-text earnings-total">
          {totalEarned}
        </span>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Ξ</span>
      </div>
    </div>
  );
}

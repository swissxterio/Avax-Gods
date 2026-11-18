import React, { useEffect } from 'react';
import CustomButton from './CustomButton';

const RewardModal = ({ player, onUpgrade, onNext, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const upgrades = [
    { id: 'health', label: '+5 max HP', current: `${player.maxHealth || 25}/100` },
    { id: 'mana', label: '+3 max mana', current: `${player.maxMana || 10}/40` },
    { id: 'attack', label: '+1 attack', current: `+${player.attackBonus || 0}/12` },
  ];

  return (
    <div
      className="reward-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="reward-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-title"
        aria-describedby="reward-description"
      >
        <button type="button" className="reward-close" aria-label="Close rewards" onClick={onClose}>
          ×
        </button>
        <div className="reward-emblem" aria-hidden="true">✦</div>
        <p className="reward-kicker">Arena victory</p>
        <h2 id="reward-title" className="reward-title">You conquered the arena</h2>
        <p id="reward-description" className="reward-description">
          You earned <strong>3 upgrade points</strong>. Spend them to strengthen your hero.
          These are in-game rewards, not cryptocurrency or on-chain tokens.
        </p>

        <div className="reward-points">
          <span className="reward-points-value">+3</span>
          <span className="reward-points-label">upgrade points earned</span>
          <span className="reward-points-total">{player.upgradePoints || 0} available</span>
        </div>

        <div className="reward-upgrades">
          {upgrades.map((upgrade) => {
            const capped = upgrade.id === 'health'
              ? player.maxHealth >= 100
              : upgrade.id === 'mana' ? player.maxMana >= 40 : player.attackBonus >= 12;

            return (
              <button
                key={upgrade.id}
                type="button"
                disabled={!player.upgradePoints || capped}
                onClick={() => onUpgrade(upgrade.id)}
                className="reward-upgrade"
              >
                <span>{upgrade.label}</span>
                <span>{upgrade.current}</span>
              </button>
            );
          })}
        </div>

        <div className="reward-actions">
          <CustomButton title="Enter next arena" handleClick={onNext} restStyles="mt-5" />
          <button type="button" className="reward-dismiss" onClick={onClose}>
            Keep rewards for later
          </button>
        </div>
      </section>
    </div>
  );
};

export default RewardModal;

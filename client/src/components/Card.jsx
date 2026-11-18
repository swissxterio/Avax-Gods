import React, { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';

import styles from '../styles';
import { characters } from '../assets';

const Card = ({ card, title, restStyles, cardRef }) => {
  const character = characters.find((item) => item.id === card.characterId) || characters[0];
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    setImageUnavailable(false);
  }, [character.image]);

  return (
    <Tilt>
      <div ref={cardRef} className={`${styles.cardContainer} ${restStyles}`}>
        {imageUnavailable ? (
          <div className="battle-card-fallback" role="img" aria-label={`${character.name} card`}>
            <span className="battle-card-fallback-gem" aria-hidden="true">◆</span>
            <span className="battle-card-fallback-name">{character.name}</span>
            <span className="battle-card-fallback-caption">Arena fighter</span>
          </div>
        ) : (
          <img
            src={character.image}
            alt={character.name}
            className={styles.cardImg}
            onError={() => setImageUnavailable(true)}
          />
        )}

        <div className={`${styles.cardPointContainer} sm:left-[21.2%] left-[22%] ${styles.flexCenter}`}>
          <p className={`${styles.cardPoint} text-yellow-400`}>{card.att}</p>
        </div>
        <div className={`${styles.cardPointContainer} sm:right-[14.2%] right-[15%] ${styles.flexCenter}`}>
          <p className={`${styles.cardPoint} text-red-700`}>{card.def}</p>
        </div>

        <div className={`${styles.cardTextContainer} ${styles.flexCenter}`}>
          <p className={styles.cardText} title={title}>{title}</p>
        </div>
      </div>
    </Tilt>
  );
};

export default Card;

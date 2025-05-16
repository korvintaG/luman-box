// SandClockLoader.tsx
import React from 'react';
import styles from './SandClockLoader.module.css';

interface SandClockLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const SandClockLoader: React.FC<SandClockLoaderProps> = ({
  size = 'medium',
  color = '#333',
}) => {
  const sizeClass = styles[`size-${size}`];

  return (
    <div className={`${styles.sandClock} ${sizeClass}`} style={{ color }}>
      <div className={styles.top}></div>
      <div className={styles.middle}></div>
      <div className={styles.bottom}></div>
    </div>
  );
};

export default SandClockLoader;
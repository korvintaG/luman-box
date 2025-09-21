import React, { useMemo } from 'react';

interface SvgIconProps {
  svgString: string;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ svgString, className }) => {
  const sanitizedSvg = useMemo(() => {
    // Очистка SVG (если нужно) или добавление атрибутов
    return svgString;
  }, [svgString]);

  return (
    <div 
      data-cy="svg-icon"
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
    />
  );
};

export default SvgIcon;
import React from "react";

interface FolderSlaveProps extends React.SVGProps<SVGSVGElement> {
  // Дополнительные пропсы, если нужно
  customProp?: string;
}

// 
export const FolderSlave: React.FC<FolderSlaveProps> = ({ customProp, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 46 50" 
    stroke="currentColor"
    fill="currentColor"
    {...props}
  >
  <path d="M45.0703 36.8164V11.7188C45.0703 8.48789 42.4418 5.85938 39.2109 5.85938H23.6067L17.7474 0H0.929688V36.8164H21.5352V42.1875H0.929688V50H3.85938V45.1172H11.2324V50H14.1621V45.1172H21.5352V50H24.4648V45.1172H31.8379V50H34.7676V45.1172H42.1406V50H45.0703V42.1875H24.4648V36.8164H45.0703ZM3.85938 2.92969H16.5339L19.4636 5.85938H6.78906C5.72266 5.85938 4.72168 6.1458 3.85938 6.6457V2.92969ZM3.85938 33.8867V11.7188C3.85938 10.1033 5.17363 8.78906 6.78906 8.78906H39.2109C40.8264 8.78906 42.1406 10.1033 42.1406 11.7188V33.8867H3.85938Z" 
    />    
  </svg>
);

export default FolderSlave;

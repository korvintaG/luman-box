import React from "react";

interface FolderSlaveProps extends React.SVGProps<SVGSVGElement> {
  // Дополнительные пропсы, если нужно
  customProp?: string;
}

// 
export const Arrow: React.FC<FolderSlaveProps> = ({ customProp, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    stroke="currentColor"
    fill="currentColor"
    preserveAspectRatio="none"
    {...props}
  >
  <path d="m12 2v16.5h-5.2c-.4 0-.7.2-.9.6s-.1.8.2 1.1l9.2 10.5c.2.2.5.3.8.3s.6-.1.8-.3l9.2-10.5c.2-.2.2-.4.2-.7 0-.1 0-.3-.1-.4-.2-.4-.5-.6-.9-.6h-5.3v-16.5c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1zm6 1v16.5c0 .6.4 1 1 1h4l-7 8-7-8h4c.6 0 1-.4 1-1v-16.5z">
  </path>
  </svg>
);

export default Arrow;

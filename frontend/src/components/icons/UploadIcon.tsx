import React from 'react';

interface UploadIconProps {
  className?: string;
}

export const UploadIcon: React.FC<UploadIconProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      className={className}
    >
      <path d="M384 64H128c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64zM256 113.9L384 241.9h-64v96H192v-96h-64L256 113.9z" />
    </svg>
  );
};

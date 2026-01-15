import React from 'react'

interface BioProps {
  children?: React.ReactNode;
}

const Bio: React.FC<BioProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center text-white text-4xl">
      {children}
    </div>
  );
}

export default Bio
import React from 'react'

interface BioProps {
  children?: React.ReactNode;
}

const Bio: React.FC<BioProps> = ({ children }) => {
  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      {children}
    </div>
  );
}

export default Bio
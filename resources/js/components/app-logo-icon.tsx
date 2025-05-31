import { SVGAttributes } from 'react';

export default function PolicePhoneIcon(props: SVGAttributes<SVGElement>) {
  return (
    <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
      {/* Police Hat */}
      <path d="M10 2H30V6H27L25 9H15L13 6H10V2Z" fill="#1A237E"/>
      <circle cx="20" cy="5" r="1.5" fill="#FFC107"/>
      <rect x="19" y="2" width="2" height="1.5" fill="#FFC107"/>
      
      {/* Simplified Phone Body */}
      <rect x="8" y="9" width="24" height="30" rx="2" fill="#37474F"/>
      <rect x="13" y="11" width="14" height="3" rx="1" fill="#78909C"/>
      <circle cx="20" cy="32" r="3" fill="#455A64"/>
      <rect x="18" y="37" width="4" height="2" rx="1" fill="#455A64"/>
    </svg>
  );
}
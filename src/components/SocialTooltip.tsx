import React from "react";
import styled from "styled-components";

export default function SocialTooltip() {
  return (
    <Wrap>
      <ul className="example-2">
        <li className="icon-content">
          <a href="https://www.linkedin.com/in/bruno-schutze-649394288/" aria-label="LinkedIn" data-social="linkedin" target="_blank" rel="noreferrer">
            <div className="filled" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <div className="tooltip">LinkedIn</div>
        </li>

        <li className="icon-content">
          <a href="https://github.com/BrunoSchutze" aria-label="GitHub" data-social="github" target="_blank" rel="noreferrer">
            <div className="filled" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
          <div className="tooltip">GitHub</div>
        </li>

        <li className="icon-content">
          <a href="https://www.instagram.com/bruno.schutze/" aria-label="Instagram" data-social="instagram" target="_blank" rel="noreferrer">
            <div className="filled" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <div className="tooltip">Instagram</div>
        </li>

        <li className="icon-content">
          <a href="mailto:brunoschutze8@gmail.com" aria-label="Gmail" data-social="gmail">
            <div className="filled" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
          <div className="tooltip">Gmail</div>
        </li>
      </ul>
    </Wrap>
  );
}

const Wrap = styled.div`
  ul { list-style: none; padding: 0; margin: 0; }
  .example-2 { display: flex; gap: 16px; align-items: center; }

  .icon-content { position: relative; }
  
  .tooltip {
    position: absolute; 
    top: -34px; 
    left: 50%; 
    transform: translateX(-50%);
    padding: 6px 10px; 
    border-radius: 6px; 
    font-size: 13px;
    color: #fff; 
    background: rgba(0,0,0,.8);
    opacity: 0; 
    visibility: hidden; 
    transition: .25s ease;
    white-space: nowrap;
    backdrop-filter: blur(4px);
  }
  
  .icon-content:hover .tooltip { 
    opacity: 1; 
    visibility: visible; 
    top: -46px; 
  }

  .icon-content a {
    width: 52px; 
    height: 52px; 
    border-radius: 50%;
    display: flex; 
    align-items: center; 
    justify-content: center;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.2);
    color: #fff; 
    position: relative; 
    overflow: hidden;
    transition: all .2s ease;
  }
  
  .icon-content a:hover { 
    transform: translateY(-2px); 
    border-color: transparent;
    color: #fff; 
  }

  .icon-content a svg { 
    width: 22px; 
    height: 22px; 
    position: relative;
    z-index: 2;
  }

  .icon-content .filled {
    position: absolute; 
    inset: 0;
    transform: scale(0);
    border-radius: 50%;
    transition: transform .25s ease;
  }
  
  .icon-content a:hover .filled { 
    transform: scale(1); 
  }

  /* Colores por red */
  .icon-content a[data-social="linkedin"] .filled { background: #0077b5; }
  .icon-content a[data-social="linkedin"] ~ .tooltip { background: #0077b5; }
  
  .icon-content a[data-social="github"] .filled { background: #333; }
  .icon-content a[data-social="github"] ~ .tooltip { background: #333; }
  
  .icon-content a[data-social="instagram"] .filled {
    background: radial-gradient(circle at 30% 107%, 
      #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  }
  .icon-content a[data-social="instagram"] ~ .tooltip {
    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  }
  
  .icon-content a[data-social="gmail"] .filled { background: #ea4335; }
  .icon-content a[data-social="gmail"] ~ .tooltip { background: #ea4335; }
`;
import React, { useEffect, useState, useMemo } from "react";
import styled, { keyframes, css } from "styled-components";

export default function Splash() {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  const title = "Bienvenido";
  const letters = useMemo(() => title.split(""), []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let value = 0;
    const interval = setInterval(() => {
      value += Math.random() * 3 + 1; // avanza suavemente
      if (value >= 100) {
        value = 100;
        clearInterval(interval);
        setTimeout(() => {
          setClosing(true);
          setTimeout(() => {
            setHidden(true);
            document.body.style.overflow = "auto";
          }, 900);
        }, 500);
      }
      setProgress(Math.floor(value));
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (hidden) return null;

  const visibleLetters = Math.floor((progress / 100) * letters.length);

  return (
    <Overlay $closing={closing}>
      <Content $closing={closing}>
        <Title>
          {letters.map((ch, i) => (
            <Letter key={i} $visible={i < visibleLetters}>
              {ch}
            </Letter>
          ))}
        </Title>

        <BarWrapper>
          <BarTrack>
            <BarFill style={{ width: `${progress}%` }} />
          </BarTrack>
          <Counter>{progress}%</Counter>
        </BarWrapper>

        <Hint>Preparando tu experiencia...</Hint>
      </Content>
    </Overlay>
  );
}

// Animaciones
const fadeOut = keyframes`to { opacity: 0; visibility: hidden; }`;
const letterAnim = keyframes`
  from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
`;

const Overlay = styled.section`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0f0f10;
  display: grid;
  place-items: center;
  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${fadeOut} 0.8s ease forwards;
    `}
`;

const Content = styled.div`
  text-align: center;
  transition: opacity 0.5s ease;
`;

const Title = styled.h1`
  font-size: clamp(42px, 6vw, 72px);
  font-weight: 900;
  margin-bottom: 28px;
`;

const Letter = styled.span`
  display: inline-block;
  opacity: ${({ $visible }) => ($visible ? 1 : 0.2)};
  color: ${({ $visible }) => ($visible ? "#fff" : "rgba(255,255,255,0.4)")};
  animation: ${letterAnim} 0.6s ease both;
`;

const BarWrapper = styled.div`
  width: min(500px, 80vw);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 14px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #5b8cff, #af7bff, #ffb86b);
  transition: width 0.2s ease;
`;

const Counter = styled.div`
  font-weight: 700;
  color: #fff;
  min-width: 50px;
`;

const Hint = styled.p`
  color: #aaa;
  font-size: 14px;
`;

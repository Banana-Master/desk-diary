import React from 'react';
import styled from 'styled-components';

type SpeechBubbleProps = {
  width: string;
  text: string;

};

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  width,
}) => {
  return (
    <Container width={width}>
      {text.split('\n').map((str, index) => (
        <span key={index}>
          {str}
          <br />
        </span>
      ))}
    </Container>
  );
};
const Container = styled.div<{ width: string }>`
  font-size: 17px;
  font-weight: 500;
  width: ${props => props.width};
  text-align: center;
  background-color: white;
  border-radius: 20px;
  position: relative;
  padding: 20px;
  white-space: pre-wrap;
  /* >span{
    color: white;
    font-weight: 500;
    font-size: 24px;
  } */
  &:after {
    content: '';
    position: absolute;
    bottom: 1px;
    left: 50%;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: white;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: -10px;
  }
`;
export default SpeechBubble;

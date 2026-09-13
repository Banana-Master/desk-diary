import styled from 'styled-components';

import { FaVideoSlash } from 'react-icons/fa';
import cute from '../../../../images/character/blue.png'

const DefaultScreen = (): JSX.Element => {
  return (
    <Default>
      {/* <FaVideoSlash style={{ fontSize: '50px', color: '#e90000' }} /> */}
      <img src={cute} alt="non-cam" />
    </Default>
  );
};

const Default = styled.div`
  height: 300px;
  width: 400px;
  background: black;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    margin: auto;
  }
`;

export default DefaultScreen;

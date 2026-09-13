import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import {
  fetchHobbyLatest,
  fetchHobbyLatestSearch,
  fetchHobbyPopular,
  fetchHobbyPopularSearch,
  fetchRoomLatest,
  fetchRoomPopular,
  fetchRoomTopLatest,
  fetchRoomTopPopular,
  fetchStudyLatest,
  fetchStudyLatestSearch,
  fetchStudyPopularSearch,
  fetchStudyPopular,
  fetchUser,
} from '../../../axios/api';
import RoomCard from './RoomCard';
import { Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
type RoomListProps = {
  label: string;
  show?: string;
};
const fetchFunctions = {
  fetchRoomPopular: fetchRoomPopular,
  fetchRoomLatest: fetchRoomLatest,
  fetchRoomTopPopular: fetchRoomTopPopular,
  fetchRoomTopLatest: fetchRoomTopLatest,
  fetchStudyPopular: fetchStudyPopular,
  fetchHobbyPopular: fetchHobbyPopular,
  fetchStudyLatest: fetchStudyLatest,
  fetchHobbyLatest: fetchHobbyLatest,
};
const fetchFunctions2 = {
  fetchStudyPopularSearch: fetchStudyPopularSearch,
  fetchHobbyPopularSearch: fetchHobbyPopularSearch,
  fetchStudyLatestSearch: fetchStudyLatestSearch,
  fetchHobbyLatestSearch: fetchHobbyLatestSearch,
};
const RoomList: React.FC<RoomListProps> = ({ label, show }) => {
  const [isPopular, setIsPopular] = useState(true);
  const [sort, setSort] = useState('Popular');
  const [roomList, setRoomList] = useState<any[]>([]);
  const [num, setNum] = useState(1);
  const [count, setCount] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  let iPage = 1;
  const target = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    observer.observe(target.current);
  }, []);
  const options = {
    threshold: 1.0,
  };
  const callback = () => {
    handlePageChange(iPage);
    if(iPage <= count) {
      iPage++
    }
  };
  const changePopular = (value: boolean) => {
    setIsPopular(value);
    if (value) {
      setSort('Popular');
    } else {
      setSort('Latest');
    }
    setRoomList([]);
  };
  const [searchText, setSearchText] = useState('');
  let fetchName = show + sort;
  const handlePageChange = (pageNumber: number) => {
    setNum(pageNumber);
    const fetchData = async () => {
      const fetchFunc =
        fetchFunctions[fetchName as keyof typeof fetchFunctions];
      const result = await fetchFunc(pageNumber);
      if (result.totalCount % 10 === 0) {
        setCount(result.totalCount / 10);
      } else {
        setCount(Math.floor(result.totalCount / 10) + 1);
      }
      if (
        fetchName === 'fetchRoomPopular' ||
        fetchName === 'fetchRoomLatest' ||
        fetchName === 'fetchRoomTopPopular' ||
        fetchName === 'fetchRoomTopLatest'
      ) {
        setRoomList(prevList => {
          const uniqueData = result.filter((newRoom: { uuid: string }) =>
            prevList.every(oldRoom => oldRoom.uuid !== newRoom.uuid)
          );
          return [...prevList, ...uniqueData];
        });
        return result;
      } else if ('QueryResults' in result) {
        setRoomList(prevList => {
          const uniqueData = result.QueryResults.filter((newRoom: { uuid: string }) =>
            prevList.every(oldRoom => oldRoom.uuid !== newRoom.uuid)
          );
          return [...prevList, ...uniqueData];
        });
        return result;
      } else {
        throw new Error('Invalid fetchName');
      }
    };
    const fetchData2 = async () => {
      setIsSearch(true)
      fetchName += 'Search';
      const fetchFunc =
        fetchFunctions2[fetchName as keyof typeof fetchFunctions2];
      const result = await fetchFunc(searchText, pageNumber);
      if (result.totalCount % 10 === 0) {
        setCount(result.totalCount / 10);
      } else {
        setCount(Math.floor(result.totalCount / 10) + 1);
      }
      if (
        fetchName === 'fetchRoomPopular' ||
        fetchName === 'fetchRoomLatest' ||
        fetchName === 'fetchRoomTopPopular' ||
        fetchName === 'fetchRoomTopLatest'
      ) {
        setRoomList(prevList => {
          const uniqueData = result.filter((newRoom: { uuid: string }) =>
            prevList.every(oldRoom => oldRoom.uuid !== newRoom.uuid)
          );
          return [...prevList, ...uniqueData];
        });
        return result;
      } else if ('QueryResults' in result) {
        setRoomList(prevList => {
          const uniqueData = result.QueryResults.filter((newRoom: { uuid: string }) =>
            prevList.every(oldRoom => oldRoom.uuid !== newRoom.uuid)
          );
          return [...prevList, ...uniqueData];
        });
        return result;
      } else {
        throw new Error('Invalid fetchName');
      }
    };
    setCount(pageNumber);
    if (searchText.length > 0) {
      fetchData2();
    } else {
      fetchData();
      setIsSearch(false);
    }
  };
  useEffect(() => {
    if (isPopular) {
      setSort('Popular');
    } else {
      setSort('Latest');
    }
    handlePageChange(1);
  }, [isPopular]);
  const SearchHandler = () => {
    handlePageChange(1);
  };
  const onChangeSearchHandler = (e: any) => {
    setSearchText(e.target.value);
  };
  useEffect(() => {
    // 검색이 활성화되어 있지 않을 때만 인터벌을 설정합니다.
    if (searchText.length === 0) {
      const intervalId = setInterval(() => {
        handlePageChange(num);
      }, 5000);
      // 컴포넌트가 언마운트되거나 검색이 활성화될 때 인터벌을 해제합니다.
      return () => clearInterval(intervalId);
    }
  }, [num, isSearch]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // 이벤트의 기본 동작을 중지합니다.
      SearchHandler();
    }
  };
  const observer = new IntersectionObserver(callback, options);
  return (
    <List>
      {fetchName !== 'fetchRoomPopular' &&
        fetchName !== 'fetchRoomLatest' &&
        fetchName !== 'fetchRoomTopPopular' &&
        fetchName !== 'fetchRoomTopLatest' && (
          <Search>
            <input
              type="text"
              placeholder="무엇이든 찾아보세요"
              value={searchText}
              onKeyPress={handleKeyPress}
              onChange={onChangeSearchHandler}
            />
            <SearchIcon onClick={SearchHandler} />
          </Search>
        )}
      <ListInfo>
        <ListTitle>{label}</ListTitle>
        <Categorys>
          <Category
            $category={sort}
            $me='Popular'
            onClick={() => changePopular(true)}
          >
            인기순
          </Category>
          <Category
            $category={sort}
            $me='Latest'
            onClick={() => changePopular(false)}
          >
            최신순
          </Category>
        </Categorys>
      </ListInfo>
      <JoinedRooms>
        {roomList?.map(room => {
          return <RoomCard key={room.uuid} room={room} fetch={fetchName} />;
        })}
        {roomList.length === 0 && <div>데이터가 없습니다.</div>}
      </JoinedRooms>
      {/* {fetchName !== 'fetchRoomPopular' &&
        fetchName !== 'fetchRoomLatest' &&
        fetchName !== 'fetchRoomTopPopular' &&
        fetchName !== 'fetchRoomTopLatest' && (
          <Pagination
            count={count}
            showFirstButton
            showLastButton
            page={num} // 현재 페이지를 num 상태 변수와 동기화
            onChange={(event, page) => handlePageChange(page)} // 페이지 번호 변경 이벤트 핸들러
            style={{ marginTop: '50px' }}
          />
        )} */}
        <div style={{ height: "100px"}} ref={target}></div>
    </List>
  );
};
const Search = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 25px;
  background-color: white;
  margin-bottom: 50px;
  input {
    width: 85%;
    padding: 10px;
    border: none;
    outline: none;
  }
`;
const ListInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const Categorys = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const Category = styled.button<{ $category: string, $me: string }>`
  font-size: 14px;
  font-weight: 500;
  width: 50px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-bottom: 2px;
  color: ${props =>
    props.$category === props.$me ? 'var(--primary-01)' : 'var(--gray-07)'};
  border-bottom: 1px solid
    ${props => (props.$category === props.$me ? 'var(--primary-01)' : 'none')};

  &:hover {
    color: var(--primary-01);
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  margin: 60px 0;
  height: 100%;
  width: 100%;
  @media (max-width: 1400px) {
    width: 1000px;
  }
  @media (max-width: 1200px) {
    width: 800px;
  }
  @media (max-width: 768px) {
    width: 500px;
  }
`;
const ListTitle = styled.div`
  margin-bottom: 16px;
  font-size: 24px;
`;
const JoinedRooms = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  width: 1200px;
  min-height: 420px;
  @media (max-width: 1400px) {
    width: 1000px;
    grid-template-columns: repeat(4, 1fr);
    min-height: 630px;
  }
  @media (max-width: 1200px) {
    width: 800px;
    grid-template-columns: repeat(3, 1fr);
    min-height: 830px;
  }
  @media (max-width: 768px) {
    width: 500px;
    grid-template-columns: repeat(2, 1fr);
    min-height: 1030px;
  }
`;
export default RoomList;
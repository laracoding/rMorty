import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const fetchCharacters = async ({ pageParam }) => {
  const response = await axios.get(
    `https://rickandmortyapi.com/api/character/?page=${pageParam}`
  );
  return response.data;
};

function App() {
  const {
    data: charactersData,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["characters"],
    queryFn: fetchCharacters,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      if (_lastPage.info.next) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const { ref, inView } = useInView({
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, isFetchingNextPage, hasNextPage]);

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <div className="font-['schwifty'] text-3xl text-green-500 mt-32">
      <div className="flex justify-center font-lucky mb-20 text-gray-300 tracking-widest">
        Rick and Morty list of characters
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mx-2 sm:mx-10 bg-gray-100 rounded-2xl">
        {charactersData?.pages.map((page) =>
          page.results.slice(0, 5).map((person) => (
            <div
              className="flex bg-gray-300 justify-between px-4 md:justify-around py-4 my-2 mx-2 rounded-2xl"
              key={person.id}
            >
              <div className="flex">
                <img
                  className="max-w-28 rounded-full drop-shadow-2xl"
                  src={person.image}
                />
              </div>
              <div className="flex px-8">
                <p className="text-xl self-center">{person.name}</p>
              </div>
            </div>
          ))
        )}
        <div ref={ref}>{isFetchingNextPage && "loading..."}</div>
      </div>
    </div>
  );
}

export default App;

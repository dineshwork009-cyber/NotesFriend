import { memo } from "react";
import Skeleton from "react-loading-skeleton";
import { Box, Flex } from "@theme-ui/components";
import "react-loading-skeleton/dist/skeleton.css";
import { getRandomArbitrary } from "@notesfriend/common";

const Lines = [1, 2].map(() => getRandomArbitrary(40, 90));
export const ListLoader = memo(function ListLoader() {
  return (
    <>
      {Lines.map((width) => (
        <Box key={width} sx={{ py: 2, px: 1 }}>
          <Skeleton
            enableAnimation={false}
            height={16}
            width={`${width}%`}
            style={{ marginBottom: 5 }}
          />
          <Skeleton height={12} count={2} />
          <Flex>
            <Skeleton enableAnimation={false} height={10} inline width={50} />
            <Skeleton
              enableAnimation={false}
              height={10}
              inline
              width={10}
              circle
              style={{ marginLeft: 5 }}
            />
            <Skeleton
              enableAnimation={false}
              height={10}
              inline
              width={10}
              circle
              style={{ marginLeft: 5 }}
            />
          </Flex>
        </Box>
      ))}
    </>
  );
});

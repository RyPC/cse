import { Box, Text } from "@chakra-ui/react";
import ReviewModal from "../reviewModals/reviewModal";
import ReviewSubmittedModal from "../reviewModals/reviewSubmittedModal";

export const Playground = () => {
  return (
    // <Box>
    //   <Text>This is page will be used to test any modal or component that does not have a specific place for it yet!</Text>
    //   <ReviewModal></ReviewModal>
    // </Box>
    <>
      {/* <ReviewModal /> */}
      <ReviewSubmittedModal />
    </>
  );
};

import { Box, Text } from "@chakra-ui/react";
import ReviewModal from "../reviewModals/reviewModal";
import ReviewSubmittedModal from "../reviewModals/reviewSubmittedModal";
import ReviewFailureModal from "../reviewModals/reviewFailureModal";
import ClassInfoModal from "../reviewModals/classInfoModal";

export const Playground = () => {
  return (
    // <Box>
    //   <Text>This is page will be used to test any modal or component that does not have a specific place for it yet!</Text>
    //   <ReviewModal></ReviewModal>
    // </Box>
    <>
      <ReviewModal />
      <ReviewSubmittedModal />
      <ReviewFailureModal />
      <ClassInfoModal
        title="Yoga for Beginners"
        description="A beginner-friendly yoga class that focuses on flexibility and relaxation techniques."
        location="Downtown Studio, Room 301"
        capacity={20}
        level="beginner"
        costume="Comfortable clothes, no shoes"
      />
    </>
  );
};

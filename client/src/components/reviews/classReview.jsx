import { useEffect, useState } from "react";

import { Box, VStack } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import StudentReview from "./studentReview";

const PublishedReviews = ({ classId }) => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await backend
        .get(`/reviews/class/${classId}`)
        .then((res) => res.data);
      setReviews(reviews);
    };
    fetchReviews();
  }, [backend, currentUser.uid]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignContent={"center"}
      justifyContent={"center"}
      padding="2rem"
    >
      <StudentReview id={classId} />
      {JSON.stringify(reviews)}
    </Box>
  );
};

export default PublishedReviews;

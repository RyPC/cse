import { useEffect, useState } from "react";

import { Box, Divider, Stack, Text } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ReviewCard from "./reviewCard";
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
    <Stack
      padding="1rem"
      spacing="2"
    >
      <Text
        fontSize="xl"
        fontWeight="bold"
      >
        Reviews
      </Text>
      <StudentReview id={classId} />

      <Divider />
      <Stack height={"fit-content"}>
        {reviews.map((review) => (
          <ReviewCard
            reviewText={review.review}
            rating={review.rating}
            student_id={review.studentId}
            class_id={review.classId}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default PublishedReviews;

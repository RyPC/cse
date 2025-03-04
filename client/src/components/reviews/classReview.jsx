import { HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import useAuthContext from "../../contexts/hooks/useAuthContext";
// import StudentReview from "./studentReview";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { Box, Divider, Stack, Text } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ReviewCard from "./reviewCard";
import StudentReview from "./studentReview";

const PublishedReviews = ({
    starRating
    }) => {
    const [stars, setStars] = useState(Array(5).fill(0))

    // const { user } = useContext(useAuthContext)
    const [rating, setRating] = useState(starRating)
    const [hoverValue, setHoverValue] = useState(undefined)

    const handleMouseOverStar = value => {
        console.log(value)
        setHoverValue(value)
    };
    
    const handleMouseLeaveStar = () => {
        console.log(value)
        setHoverValue(undefined)
    }

    const handleClickStar = value => {
        console.log(value)
        setRating(value)
    };

    const colors = {
        orange: "#F2C265",
        grey: "a9a9a9"
    }

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
        <div>
            <HStack>
           {stars.map((_, index) => {
              return (
                <>
                   <FaStar
                       key={index}
                       size={24}
                       value={rating}
                       onChange={(e) => setRating(e.target.value)}
                       color={(hoverValue || rating) > index ? colors.orange : colors.grey}
                       onClick={() => handleClickStar(index + 1)}
                       onMouseOver={() => handleMouseOverStar(index + 1)}
                       onMouseLeave={() => handleMouseLeaveStar}
                    />   
                </>
               )
            })}
            </HStack> 
         </div>
      );
      
}
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

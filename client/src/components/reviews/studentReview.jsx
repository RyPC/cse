import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { FaStar } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { color } from "framer-motion";

const StudentReview = ({
  rating,
  reviewText,
  class_id,
  student_id,
  displayName,
  onUpdate,
  editMode = false,
}) => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [starRating, setStarRating] = useState(rating ?? 0);
  const [review, setReview] = useState(reviewText ?? "");
  const [attended, setAttended] = useState(null);

  const [stars, setStars] = useState(Array(5).fill(0));

  const [hoverValue, setHoverValue] = useState(undefined);

  const handleMouseOverStar = (value) => {
    console.log(value);
    setHoverValue(value);
  };

  const handleMouseLeaveStar = () => {
    setHoverValue(undefined);
  };

  const handleClickStar = (value) => {
    setStarRating(value);
  };
  const colors = {
    purple: "#422E8D",
    grey: "a9a9a9",
  };

  const isError = review === "" || starRating === 0;
  async function postReview() {
    if (isError) return;
    let response;
    if (editMode) {
      response = await backend.put("/reviews", {
        class_id: class_id,
        student_id: student_id,
        rating: starRating,
        review: review,
      });
    } else {
      response = await backend.post("/reviews", {
        class_id: class_id,
        student_id: student_id,
        rating: starRating,
        review: review,
      });
    }

    if (response.status === 200 || response.status === 201) {
      onUpdate();
      setReview("");
      setStarRating(0);
    }
  }

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!student_id || !class_id) return;

      const attendance = await backend.get(
        `/class-enrollments/student/${student_id}`
      );

      const attendanceObject = attendance.data.find((a) => a.id === class_id)

      setAttended(attendanceObject ? attendanceObject.attendance : null);
    };
    fetchAttendance();
  }, [backend, class_id, student_id]);
  
  return (
    <Card>
      <CardBody hidden={attended === null}>
        <FormControl>
          <HStack>
            <Avatar
              name="Dan Abrahmov"
              src="https://bit.ly/dan-abramov"
            />
            <Text>{displayName}</Text>
          </HStack>
          <HStack>
            {stars.map((_, index) => (
              <FaStar
                key={index}
                size={24}
                value={starRating}
                onChange={(e) => setStarRating(e.target.value)}
                color={
                  (hoverValue || starRating) > index
                    ? colors.purple
                    : colors.grey
                }
                onClick={() => handleClickStar(index + 1)}
                onMouseOver={() => handleMouseOverStar(index + 1)}
                onMouseLeave={() => handleMouseLeaveStar}
              />
            ))}
          </HStack>

          <Textarea
            placeholder="Type Here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <Button
            onClick={postReview}
            colorScheme={isError ? colors.purple : "blue"}
            disabled={isError}
          >
            {editMode ? "Save" : "Post Review"}
          </Button>
        </FormControl>
      </CardBody>
    </Card>
  );
};

export default StudentReview;

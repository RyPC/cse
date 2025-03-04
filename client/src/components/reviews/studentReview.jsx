import React, { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

import { FaPencilAlt } from "react-icons/fa";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const StudentReview = ({ id, starCount, description }) => {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");

  async function postReview() {
    console.log("test");
    const users = await backend.get(`/users/${currentUser.uid}`);

    // console.log(users.data[0].id);
    const response = await backend.post("/reviews", {
      class_id: id,
      student_id: users.data[0].id,
      rating: 5,
      review: review,
    });
    if (response.status === 201) {
      console.log("Review");
    }
  }
  return (
    <Box>
      <FormControl>
        <FormLabel>Review {id}</FormLabel>
        <Textarea
          placeholder="Type Here..."
          onChange={(e) => setReview(e.target.value)}
        />
        <Button onClick={postReview}>Submit</Button>
      </FormControl>
    </Box>
  );
};

export default StudentReview;

import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Text,
} from "@chakra-ui/react";

import { FaStar } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const ReviewCard = ({
  rating,
  reviewText,
  class_id,
  student_id,
  displayName,
  onUpdate,
}) => {
  const [student, setStudent] = useState(null);
  const { backend } = useBackendContext();
  const [stars, setStars] = useState(Array(5).fill(0));

  const colors = {
    purple: "#422E8D",
    grey: "a9a9a9",
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const user = await backend.get(`/students/${student_id}`);
      setStudent(user.data);
    };
    fetchStudent();
  }, []);
  return (
    <>
      <CardHeader>
        <HStack>
          <Avatar
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          />
          <Text>
            {student?.firstName} {student?.lastName}
          </Text>
        </HStack>
        <HStack>
          {stars.map((_, index) => (
            <FaStar
              key={index}
              size={24}
              color={rating > index ? colors.purple : colors.grey}
            />
          ))}
        </HStack>
      </CardHeader>
      <CardBody>
        <Text>{reviewText}</Text>
      </CardBody>
    </>
  );
};

export default ReviewCard;

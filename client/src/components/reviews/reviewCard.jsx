import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";

import { FaStar } from "react-icons/fa6";

import { FaUserCircle } from "react-icons/fa";

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
    purple: "purple.600",
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
        <HStack alignItems={"center"}>
            <Icon
              as={FaUserCircle} 
              w={45}
              h={45}
              mb={2}
              color="gray.500"
            />
          <Text mb={2}>
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

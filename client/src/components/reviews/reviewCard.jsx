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

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const ReviewCard = ({ rating, reviewText, class_id, student_id }) => {
  const [student, setStudent] = useState(null);
  const { backend } = useBackendContext();
  useEffect(() => {
    const fetchStudent = async () => {
      const user = await backend.get(`/students/${student_id}`);
      console.log(user.data);
      setStudent(user.data);
    };
    fetchStudent();
  }, []);
  return (
    <Card>
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
      </CardHeader>
      <CardBody>
        <Text>{reviewText}</Text>
      </CardBody>
    </Card>
  );
};

export default ReviewCard;

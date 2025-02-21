import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SignUpController from "../discovery/SignUpController";

export const ClassCard = ({
  id,
  title,
  description,
  location,
  capacity,
  level,
  costume,
}) => {
  const { backend } = useBackendContext();
  const [classDate, setClassDate] = useState(null);

  const fetchClassDate = async () => {
    if (!classDate) {
      const response = await backend.get(`/scheduled-classes/${id}`);
      if (response?.data[0]?.date) {
        const formattedDate = new Date(
          response.data[0].date
        ).toLocaleDateString("en-US");
        setClassDate(formattedDate);
      }
    }
  };
  useEffect(() => {
    fetchClassDate();
  }, [backend, classDate, id]);
  return (
    <>
      <Card w={{ base: "80%", md: "20em" }}>
        <CardHeader>
          <Heading size="lg">{title}</Heading>
        </CardHeader>

        <CardBody>
          <VStack>
            <Text>{description}</Text>
            <Text>
              {level} - {classDate}
            </Text>
            <Text>Costume: {costume}</Text>
          </VStack>
        </CardBody>

        <CardFooter justifyContent="right">
          <Text>0/{capacity} spots left</Text>
          <SignUpController
            class_id={id}
            title={title}
            description={description}
            location={location}
            capacity={capacity}
            level={level}
            costume={costume}
            date={classDate}
          />
        </CardFooter>
      </Card>
    </>
  );
};

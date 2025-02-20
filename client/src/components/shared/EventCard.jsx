import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import EventInfoModal from "../discovery/EventInfoModal";

export const EventCard = ({
  title,
  location,
  description,
  level,
  date,
  startTime,
  endTime,
  callTime,
  classId,
  costume,
  id,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <>
      <EventInfoModal
        isOpenProp={openModal}
        title={title}
        id={id}
        isCorequisiteSignUp={false}
        handleClose={() => setOpenModal(false)}
      />
      <Card w={{ base: "80%", md: "20em" }}>
        <CardHeader>
          <Heading size="lg">{title}</Heading>
        </CardHeader>

        <CardBody>
          <VStack>
            <Text>{description}</Text>
            <Text>
              {date} at {location}
            </Text>
            <Text>Call Time: {callTime}</Text>
            <Text>
              {startTime} to {endTime}
            </Text>
            <Text>Level: {level}</Text>
            <Text>Costume: {costume}</Text>
          </VStack>
        </CardBody>

        <CardFooter justifyContent="right">
          <Text>Required Class ID: {classId}</Text>
          <Button onClick={handleOpenModal}>View Details</Button>
        </CardFooter>
      </Card>
    </>
  );
};

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import SignUpController from "../discovery/SignUpController";

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
          <SignUpController
            event_id={id}
            title={title}
            description={description}
            location={location}
            capacity={10}
            level={level}
            costume={costume}
            date={date}
          />
        </CardFooter>
      </Card>
    </>
  );
};

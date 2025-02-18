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
}) => {
  return (
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
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
};

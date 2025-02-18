import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";

import { formatDate, formatTime } from "../../utils/formatDateTime";

export const ClassCard = ({
  title,
  description,
  location,
  capacity,
  level,
  costume,
  date,
  startTime,
  endTime,
  attendeeCount = 0, // Default to 0 if not provided
}) => {
  const formattedDate = date ? formatDate(date) : null;
  const formattedStartTime = startTime ? formatTime(startTime) : null;
  const formattedEndTime = endTime ? formatTime(endTime) : null;
  return (
    <Card
      w={{ base: "90%", md: "30em" }}
      bg="gray.200"
    >
      <CardHeader pb={0}>
        <Heading
          size="md"
          fontWeight="bold"
        >
          {title}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">
              {formattedDate} @ {formattedStartTime} - {formattedEndTime}
            </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">{location}</Text>
          </HStack>

          <HStack>
            <FaUser size={14} />
            <Text fontSize="sm">
              {attendeeCount} {attendeeCount === 1 ? "person" : "people"} RSVP'd
            </Text>
          </HStack>
          <Button
            alignSelf="flex-end"
            variant="solid"
            size="sm"
            bg="gray.500"
            color="black"
            _hover={{ bg: "gray.700" }}
            mt={2}
          >
            View Details &gt;
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

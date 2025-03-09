import { useEffect, useState } from "react";

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
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Event } from "../../../types/event";

export const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  useEffect(() => {
    backend
      .get("/events")
      .then((events) => {
        const filteredEvents = events.data.filter(
          (currentEvent: Event) => currentEvent.is_draft === false
        );
        setEvents(filteredEvents as Event[]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [backend]);

  return (
    <VStack>
      {events.map((currentEvent) => {
        return EventTeacherCard(currentEvent, navigate);
      })}
    </VStack>
  );
};

function EventTeacherCard(event: Event, navigate: NavigateFunction) {
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
          {currentEvent.title}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">{currentEvent.date} </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">{currentEvent.location}</Text>
          </HStack>

          <HStack>
            <FaUser size={14} />
            <Text fontSize="sm">
              {/* rsvp count placeholder here, but not in sql table so nothing here for now */}
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
            onClick={() => navigate(`/dashboard/events/${currentEvent.id}`)}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

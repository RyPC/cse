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

import { Navbar } from "../navbar/Navbar";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Booking, isClass } from "../../../types/booking";

// 4 Tab implementation, class, events, class_drafts, class_events

export const Bookings = () => {
  return (
      <Box>
          <Tabs>
              <TabList>
                  <Tab>Classes</Tab>
                  <Tab>Events</Tab>
                  <Tab>Class Drafts</Tab>
                  <Tab>Event Drafts</Tab>
              </TabList>
              <TabPanels>
                  <TabPanel>
                      <BookingsTab is_class={true} is_drafts={false} />
                  </TabPanel>
                  <TabPanel>
                      <BookingsTab is_class={false} is_drafts={false} />
                  </TabPanel>
                  <TabPanel>
                      <BookingsTab is_class={true} is_drafts={true} />
                  </TabPanel>
                  <TabPanel>
                      <BookingsTab is_class={false} is_drafts={true} />
                  </TabPanel>
              </TabPanels>
          </Tabs>
          <Navbar />
      </Box>
  )
}

export const BookingsTab = (is_class: boolean, is_drafts: boolean) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking>(null);

  const { backend } = useBackendContext();

  const newBooking = () => {
    setSelectedBooking(null)
    onOpen()
  }

  useEffect(() => {
    backend
    .get(is_class ? "/classes" : "/events")
      .then((bookings) => {
        const filteredBookings = bookings.data.filter(
          (booking: Booking) => booking.is_draft === is_drafts
        );
        setBookings(filteredBookings as Booking[]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [backend]);

  return (
    <VStack>
      {bookings.map((booking) => {
        if (is_drafts) return BookingTeacherCard(booking, navigate);
        else return BookingDraftTeacherCard(booking, onOpen);
      })}
      <BookingModal booking={selectedBooking} isOpen={isOpen} onClose={onClose} />
      <Button
          onClick={newBooking}
          position="fixed"
          bottom="160px"
          right="50px"
          borderRadius="50%"
          width="60px"
          height="60px"
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.700" }}
          fontSize="2xl">
          +
      </Button>
    </VStack>
  );
};

function BookingTeacherCard(booking: Booking, navigate: NavigateFunction) {
  const navigateOnClick = () => {
    if (isClass(booking)) navigate(`/dashboard/classes/${booking.id}`)}
    else navigate(`/dashboard/events/${booking.id}`)}
  }

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
          {booking.title}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">{booking.date} </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">{booking.location}</Text>
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
            onClick={navigateOnClick}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>);
}

function BookingDraftTeacherCard(draft: Booking, onOpen) {

  const modalOnClick = () => {
      setSelectedBooking(draft)
      onOpen()
  }

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
          {draft.title ?? "Untitled Draft"}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">{draft.date ?? "Unknown Date"} </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">
              {draft.location ?? "Unknown Location"}
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
            onClick={modalOnClick}
          >
            Edit Draft
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

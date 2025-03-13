import { useEffect, useState } from "react";

import {
  Button,
  Tabs,
  TabPanels,
  TabPanel,
  TabList,
  Tab,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";

import { Navbar } from "../../navbar/Navbar";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Booking, Class, Event, isClass } from "../../../types/booking";

import { EditBookingModal } from './BookingsModal'

// 4 Tab implementation, class, events, class_drafts, class_events

const scheduledClasses = (classes, scheduleData) => {
    const mergedClasses = scheduleData.map(scheduledClass => {
        const classData = classes.find(c => c.id === scheduledClass.classId);
        return {
            ...classData, 
            date: scheduledClass.date,
            startTime: scheduledClass.startTime,
            endTime: scheduledClass.endTime,
        };
    });
    return mergedClasses as Class[];
};


export const Bookings = () => {

  const { backend } = useBackendContext();

  const [classes, setClasses] = useState<Class[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [scheduled, setScheduled] = useState([]);

  // TODO: reload callback passed down if want reload on tab load
  // const reloadCallback = (is_class) => {
  // }

  useEffect(() => {
    if (scheduled.length == 0)
        backend.get("/scheduled-classes/")
              .then(scheduledData => setScheduled(scheduledData.data))

    const requestData = (is_c) => {
        backend
        .get(is_c ? "/classes" : "/events")
          .then((bookings) => {
            if (is_c && !scheduled.length == 0) setClasses(scheduledClasses(bookings.data, scheduled))
            else if (!is_c && events.length == 0) setEvents(bookings.data)
          })
          .catch((err) => {
            console.error(err);
          });
    }

    requestData(true)
    requestData(false)
    console.log(events)
  }, [backend, scheduled]);    

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
                      <BookingsTab bookings={classes} is_drafts={false} events={events} />
                  </TabPanel>
                  <TabPanel>
                      <BookingsTab bookings={events} is_drafts={false} events={events}/>
                  </TabPanel>
                  <TabPanel>
                      <BookingsTab bookings={classes} is_drafts={true} events={events}/>
                  </TabPanel>
                  <TabPanel>
                      <BookingsTab bookings={events} is_drafts={true} events={events}/>
                  </TabPanel>
              </TabPanels>
          </Tabs>
          <Navbar />
      </Box>
  )
}

export const BookingsTab = ({ bookings, is_drafts, events } : { bookings: Booking[], is_draft: boolean, events: Event[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [selectedBooking, setSelectedBooking] = useState<Booking>(null);

  const filteredBookings = bookings.filter(booking => booking.isDraft === is_drafts)
  if (filteredBookings.length == 0)
      return (<Box>Empty</Box>)

  const is_class = isClass(filteredBookings[0])

  const newBooking = () => {
    setSelectedBooking(null)
    onOpen()
  }

  return (
    <VStack>
      {filteredBookings.map((booking, ind) => {
        if (is_drafts) return (<BookingDraftTeacherCard key={ind} draft={booking} onOpen={onOpen} setBooking={setSelectedBooking} />)
        else return (<BookingTeacherCard key={ind} booking={booking} navigate={navigate} />)
      })}
      <EditBookingModal booking={selectedBooking} isOpen={isOpen} onClose={onClose} is_class={is_class} events={events} />
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

const BookingTeacherCard = ({ booking, navigate }) => {
  const navigateOnClick = () => {
    if (isClass(booking)) navigate(`/dashboard/classes/${booking.id}`)
    else navigate(`/dashboard/events/${booking.id}`)
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

export const BookingDraftTeacherCard = ({ draft, onOpen, setBooking }) => {
  const modalOnClick = () => {
      setBooking(draft)
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

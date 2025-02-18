import { useEffect, useState } from "react";

import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { CancelModal } from "./CancelModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { ViewModal } from "./ViewModal";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [currentModal, setCurrentModal] = useState("view");
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [attended, setAttended] = useState([]);

  useEffect(() => {
    if (currentUser) {
      backend
        .get(`/users/${currentUser.uid}`)
        .then((userRes) => {
          const userId = userRes.data[0].id;

          backend
            .get(`/class-enrollments/student/${userId}`)
            .then((res) => {
              setClasses(res.data);
            })
            .catch((err) => {
              console.log("Error fetching class enrollments:", err);
            });

          backend
            .get(`/event-enrollments/student/${userId}`)
            .then((res) => {
              setEvents(res.data);
            })
            .catch((err) => {
              console.log("Error fetching event enrollments:", err);
            });
        })
        .catch((err) => {
          console.log("Error fetching user:", err);
        });
    }
  }, [backend, currentUser]);

  useEffect(() => {
    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);
  }, [classes, events]);

  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
  };

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Tabs
          width="100%"
          variant="line"
          colorScheme="blackAlpha"
          pt={8}
        >
          <TabList justifyContent="center">
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold", // Add bold when selected
              }}
            >
              Classes
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold", // Add bold when selected
              }}
            >
              Events
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold", // Add bold when selected
              }}
            >
              Attended
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {classes.length > 0 ? (
                  classes.map((classEnrollment) => (
                    <ClassCard
                      key={classEnrollment.id}
                      title={classEnrollment.title}
                      description={classEnrollment.description}
                      location={classEnrollment.location}
                      capacity={classEnrollment.capacity}
                      level={classEnrollment.level}
                      date={classEnrollment.date}
                      startTime={classEnrollment.startTime}
                      endTime={classEnrollment.endTime}
                      attendeeCount={classEnrollment.attendeeCount}
                      onClick={onOpen}
                    />
                  ))
                ) : (
                  <Text>No classes booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {events.length > 0 ? (
                  events.map((eventEnrollment) => (
                    <EventCard
                      key={eventEnrollment.id}
                      title={eventEnrollment.title}
                      location={eventEnrollment.location}
                      date={eventEnrollment.date}
                      startTime={eventEnrollment.startTime}
                      endTime={eventEnrollment.endTime}
                      attendeeCount={eventEnrollment.attendeeCount}
                      onClick={onOpen}
                    />
                  ))
                ) : (
                  <Text>No events booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {attended.length > 0 ? (
                  attended.map((item) =>
                    item.class_id ? (
                      <ClassCard
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        location={item.location}
                        capacity={item.capacity}
                        level={item.level}
                        date={item.date}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        attendeeCount={item.attendeeCount}
                        onClick={onOpen}
                      />
                    ) : (
                      <EventCard
                        key={item.id}
                        title={item.title}
                        location={item.location}
                        date={item.date}
                        startTime={item.startTime}
                        endTime={item.endTime}
                        attendeeCount={item.attendeeCount}
                        onClick={onOpen}
                      />
                    )
                  )
                ) : (
                  <Text>No attended classes or events.</Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      {currentModal === "view" ? (
        <ViewModal
          isOpen={isOpen}
          onClose={onCloseModal}
          setCurrentModal={setCurrentModal}
        />
      ) : currentModal === "confirmation" ? (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onCloseModal}
        />
      ) : (
        <CancelModal
          isOpen={isOpen}
          onClose={onCloseModal}
          setCurrentModal={setCurrentModal}
        />
      )}
      <Navbar></Navbar>
    </Box>
  );
};

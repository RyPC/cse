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

  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [activeTab, setActiveTab] = useState("Classes")

  useEffect(() => {
    if (currentUser) {
      backend
        .get(`/users/${currentUser.uid}`)
        .then((userRes) => {
          const userId = userRes.data[0].id;
          setUserId(userId);

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

  const updateModal = (item) => {
    const type = classes.includes(item) ? "class" : "event";
    setSelectedCard(item);
    setCardType(type);
    onOpen();
  }

  const handleCancelEnrollment = async (itemId) => {
    if (!user_id) {
        console.error("User ID is missing.");
        return;
    }
    
    try {
        // Send DELETE request
        let response = null;
        if (cardType === "class") {
            response = await backend.delete(`/class-enrollments/${user_id}/${itemId}`);
        } else {
            response = await backend.delete(`/event-enrollments/${user_id}/${itemId}`);
        }
    
        // If successful, remove the deleted class from state
        if (response.status === 200) {
            if (cardType === "class") {
                setClasses((prevClasses) =>
                    prevClasses.filter((cls) => cls.id !== itemId)
                );
            } else {
                setEvents((prevEvents) =>
                    prevEvents.filter((evt) => evt.id !== itemId)
                );
            }
            
        }
    } catch (error) {
        console.error("Error deleting enrollment:", error);
    }
  };

  const itemType = (item) => {
    console.log(classes.includes(item));
    if (classes.includes(item)) {
        return "class";
    } else if (events.includes(item)) {
        return "event";
    }
  }

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
              onClick={() => setActiveTab("Classes")}
            >
              Classes
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold", // Add bold when selected
              }}
              onClick={() => setActiveTab("Events")}
            >
              Events
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold", // Add bold when selected
              }}
              onClick={() => setActiveTab("Attended")}
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
                      onClick={() => updateModal(classEnrollment)}
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
                      onClick={() => updateModal(eventEnrollment)}
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
                        onClick={() => updateModal(item)}
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
                        onClick={() => updateModal(item)}
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
          card={selectedCard}
        />
      ) : currentModal === "confirmation" ? (
        <ConfirmationModal
          isOpen={isOpen}
          onClose={onCloseModal}
          card={selectedCard}
        />
      ) : (
        <CancelModal
          isOpen={isOpen}
          onClose={onCloseModal}
          setCurrentModal={setCurrentModal}
          card={selectedCard}
          handleEvent={() => handleCancelEnrollment(selectedCard.id)}
          type={cardType}
        />
      )}
      <Navbar></Navbar>
    </Box>
  );
};

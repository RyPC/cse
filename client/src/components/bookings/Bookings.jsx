import { memo, useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CreateClassForm } from "../forms/CreateClasses";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { CancelModal } from "./CancelModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { InfoModal } from "./InfoModal";
import { ViewModal } from "./ViewModal";

export const Bookings = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();
  const [loading, setLoading] = useState(true);
  const [currentModal, setCurrentModal] = useState("view");
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [attended, setAttended] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [coEvents, setCoEvents] = useState([]);

  const isTeacher = role === "teacher";
  useEffect(() => {
    if (currentUser) {
      if (isTeacher) {
        backend
          .get("/classes")
          .then((res) => {
            const allClasses = res.data;
            const published = allClasses
              .filter((cls) => !cls.isDraft)
              .map((cls) => {
                cls.classId = cls.id;
                return cls;
              });
            const drafts = allClasses
              .filter((cls) => cls.isDraft)
              .map((cls) => {
                cls.classId = cls.id;
                return cls;
              });
            console.log("published", published);
            console.log("drafts", drafts);
            setClasses(published);
            setDrafts(drafts);
          })
          .catch((err) => {
            console.log("Error fetching teacher classes:", err);
          });

        backend
          .get("/events")
          .then((res) => {
            setEvents(res.data);
          })
          .catch((err) => {
            console.log("Error fetching teacher events:", err);
          });
      } else {
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
    }
  }, [backend, currentUser, isTeacher]);

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
    const type =
      classes.includes(item) || drafts.includes(item) ? "class" : "event";
    if (type === "class") loadCorequisites(item.id);
    setSelectedCard(item);
    setCardType(type);
    onOpen();
  };

  const handleCancelEnrollment = async (itemId) => {
    if (!user_id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      let response = null;
      if (cardType === "class") {
        response = await backend.delete(
          `/class-enrollments/${user_id}/${itemId}`
        );
      } else {
        response = await backend.delete(
          `/event-enrollments/${user_id}/${itemId}`
        );
      }

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

  const loadCorequisites = async (classId) => {
    try {
      const response = await backend.get(`/events/corequisites/${classId}`);
      if (response.status === 200) {
        setCoEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching corequisite enrollment:", error);
    }
  };

  const reloadClassesAndDrafts = async () => {
    try {
      const response = await backend.get("/classes");
      const allClasses = response.data;
      const published = allClasses
        .filter((cls) => !cls.isDraft)
        .map((cls) => {
          cls.classId = cls.id;
          return cls;
        });
      const updatedDrafts = allClasses
        .filter((cls) => cls.isDraft)
        .map((cls) => {
          cls.classId = cls.id;
          return cls;
        });

      setClasses(published);
      setDrafts(updatedDrafts);
    } catch (error) {
      console.error("Error reloading classes:", error);
    }
  };

  useEffect(() => {
    console.log("selectedCard", selectedCard);
  }, [selectedCard]);

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
                fontWeight: "bold",
              }}
            >
              Classes
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              Events
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              {isTeacher ? "Drafts" : "Attended"}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack
                spacing={4}
                width="100%"
              >
                {isTeacher ? (
                  classes.length > 0 ? (
                    classes.map((classItem, index) => (
                      <ClassTeacherCard
                        key={index}
                        setSelectedCard={setSelectedCard}
                        {...classItem}
                        navigate={navigate}
                        onOpen={onOpen}
                      />
                    ))
                  ) : (
                    <Text>No classes available.</Text>
                  )
                ) : classes.length > 0 ? (
                  classes.map((classItem) => (
                    <ClassCard
                      key={classItem.id}
                      {...classItem}
                      onClick={() => updateModal(classItem)}
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
                  events.map((eventItem) => (
                    <EventCard
                      key={eventItem.id}
                      {...eventItem}
                      onClick={() => updateModal(eventItem)}
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
                {isTeacher ? (
                  drafts.length > 0 ? (
                    drafts.map((draft, index) => (
                      <ClassTeacherCard
                        key={index}
                        setSelectedCard={setSelectedCard}
                        onOpen={onOpen}
                        classId={draft.id}
                        {...draft}
                      />
                    ))
                  ) : (
                    <Text>No drafts available.</Text>
                  )
                ) : attended.length > 0 ? (
                  attended.map((item) =>
                    item.class_id ? (
                      <ClassCard
                        key={item.id}
                        {...item}
                        onClick={() => updateModal(item)}
                      />
                    ) : (
                      <EventCard
                        key={item.id}
                        {...item}
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
          coEvents={coEvents}
          type={cardType}
          role={role}
        >
          {role === "student" ? (
            <InfoModal card={selectedCard} />
          ) : (
            <CreateClassForm
              closeModal={onCloseModal}
              modalData={selectedCard}
              reloadCallback={reloadClassesAndDrafts}
            />
          )}
        </ViewModal>
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
      {isTeacher && (
        <Button
          onClick={() => {
            setSelectedCard(null);
            onOpen();
          }}
          position="fixed"
          bottom="160px"
          right="50px"
          borderRadius="50%"
          width="60px"
          height="60px"
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.700" }}
          fontSize="2xl"
        >
          +
        </Button>
      )}
      <Navbar />
    </Box>
  );
};

const ClassTeacherCard = memo(
  ({
    classId,
    title,
    location,
    date,
    description,
    capacity,
    level,
    costume,
    performance,
    rsvpCount,
    isDraft,
    navigate,
    setSelectedCard,
    onOpen,
  }) => {
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
            {title ? title : "Placeholder Title"}
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
                {date ? date : "1/27/2025 @ 1 PM - 3 PM"}
              </Text>
            </HStack>

            <HStack>
              <FaMapMarkerAlt size={14} />
              <Text fontSize="sm">{location ? location : "Irvine"}</Text>
            </HStack>

            <HStack>
              <FaUser size={14} />
              <Text fontSize="sm">
                {rsvpCount ? rsvpCount : 10}{" "}
                {rsvpCount === 1 ? "person" : "people"} RSVP'd
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
              onClick={
                isDraft
                  ? () => {
                      const modalData = {
                        classId,
                        title,
                        location,
                        date,
                        description,
                        capacity,
                        level,
                        costume,
                        performance,
                        isDraft,
                      };
                      setSelectedCard(modalData);
                      onOpen();
                    }
                  : () => navigate(`/dashboard/classes/${classId}`)
              }
            >
              {isDraft ? "Edit" : "View Details >"}
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }
);

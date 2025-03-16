import { useEffect, useState } from "react";

import {
  Box,
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
import { TeacherCancelModal } from "./TeacherCancelModal";
import { TeacherConfirmationModal } from "./TeacherConfirmationModal";
import { TeacherEditModal } from "./TeacherEditModal";
import { TeacherViewModal } from "./TeacherViewModal";
import { ViewModal } from "./ViewModal";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();

  const [currentModal, setCurrentModal] = useState("view");
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [draftClasses, setDraftClasses] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [attended, setAttended] = useState([]);

  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [coEvents, setCoEvents] = useState([]);
  const [isAttendedItem, setIsAttendedItem] = useState(false);

  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    if (currentUser && role === "teacher") {
      backend.get(`/events/published`).then((res) => setEvents(res.data));
      backend.get(`/classes/published`).then((res) => {
        console.log("res", res)
        setClasses(res.data)});
      backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data));
      backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data));
    } else if (currentUser && role === "student") {
      backend
        .get(`/users/${currentUser.uid}`)
        .then((userRes) => {
          const userId = userRes.data[0].id;
          setUserId(userId);

          backend
            .get(`/class-enrollments/student/${userId}`)
            .then((res) => {
              console.log("res", res);
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
    setDrafts([...draftClasses, ...draftEvents]);
  }, [classes, events]);

  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
  };
  const onOpenModal = (data) => {
    console.log(data);
    setClassData(data);
    onOpen();
  };

  const triggerRefresh = () => {
    setRefresh((prev) => prev + 1)
  }

  const updateModal = (item) => {
    const type = classes.includes(item) ? "class" : "event";
    if (type === "class") loadCorequisites(item.id);
    console.log("coevetns", coEvents);
    setSelectedCard(item);
    setCardType(type);
    const isAttended = attended.some(
      (attendedItem) => attendedItem.id === item.id
    );
    setIsAttendedItem(isAttended);
    onOpen();
  };

  const handleCancelEnrollment = async (itemId) => {
    if (!user_id) {
      console.error("User ID is missing.");
      return;
    }

    try {
      // Send DELETE request
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

  const loadCorequisites = async (classId) => {
    try {
      const response = await backend.get(`classes/corequisites/${classId}`);

      if (response.status === 200) {
        setCoEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching corequisite enrollment:", error);
    }
  };

  const fetchClassData = async () => {
    try {
      const [classesResponse, classDataResponse] = await Promise.all([
        backend.get("/scheduled-classes"),
        backend.get("/classes"),
      ]);

      const classDataDict = new Map();
      classDataResponse.data.forEach((cls) => classDataDict.set(cls.id, cls));

      const formattedData = classesResponse.data
        .map((cls) => {
          const fullData = classDataDict.get(cls.classId);
          return fullData
            ? {
                classId: cls.classId,
                date: stringToDate(cls.date),
                startTime: stringToTime(cls.startTime),
                endTime: stringToTime(cls.endTime),
                title: fullData.title,
                description: fullData.description,
                location: fullData.location,
                capacity: fullData.capacity,
                level: fullData.level,
                costume: fullData.costume,
                isDraft: fullData.isDraft,
              }
            : null;
        })
        .filter(Boolean);

      setClasses(formattedData);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const stringToDate = (date) => {
    return new Date(date);
  };

  const stringToTime = (time) => {
    const [hours, minutes] = time.split(":");
    const d = new Date();
    d.setHours(hours, minutes, 0);

    return d;
  };

  console.log("classes", classes);
  // console.log("events", events);
  // console.log("attended", classes);
  console.log("selected card", selectedCard);
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
              {role !== "student" ? "Drafts" : "Attended"}
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
                      id={classEnrollment.id}
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
                      id={eventEnrollment.id}
                      key={eventEnrollment.id}
                      title={eventEnrollment.title}
                      level={eventEnrollment.level}
                      location={eventEnrollment.location}
                      date={eventEnrollment.date}
                      startTime={eventEnrollment.startTime}
                      endTime={eventEnrollment.endTime}
                      callTime={eventEnrollment.callTime}
                      attendeeCount={eventEnrollment.attendeeCount}
                      description={eventEnrollment.description}
                      costume={eventEnrollment.costume}
                      capacity={eventEnrollment.capacity}
                      onClick={() => updateModal(eventEnrollment)}
                      triggerRefresh={() => triggerRefresh()}
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
                {role === "teacher" ? (
                  drafts.length > 0 ? (
                    drafts.map((item) =>
                      draftClasses.includes(item) ? (
                        <ClassCard
                          key={item.id}
                          id={item.id}
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
                          id={item.id}
                          title={item.title}
                          location={item.location}
                          date={item.date}
                          startTime={item.startTime}
                          endTime={item.endTime}
                          callTime={item.callTime}
                          attendeeCount={item.attendeeCount}
                          description={item.description}
                          capacity={item.capacity}
                          level={item.level}
                          onClick={() => updateModal(item)}
                        />
                      )
                    )
                  ) : (
                    <Text>No draft events or classes</Text>
                  )
                ) : attended.length > 0 ? (
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
                        callTime={item.callTime}
                        attendeeCount={item.attendeeCount}
                        description={item.description}
                        costume={item.costume}
                        capacity={item.capacity}
                        level={item.level}
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
      {/* {currentModal === "view" ? (
        <ViewModal
          isOpen={isOpen}
          onClose={onCloseModal}
          setCurrentModal={setCurrentModal}
          card={selectedCard}
          coEvents={coEvents}
          type={cardType}
          isAttended={isAttendedItem}
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
      )} */}
      {role === "teacher" ? (
        currentModal === "view" ? (
          <TeacherViewModal
            isOpen={isOpen}
            onClose={onCloseModal}
            setCurrentModal={setCurrentModal}
            classData={selectedCard}
            performances={coEvents}
            setPerformances={setCoEvents}
          />
        ) : currentModal === "confirmation" ? (
          <TeacherConfirmationModal
            isOpen={isOpen}
            onClose={onCloseModal}
          />
        ) : currentModal === "edit" ? (
          <TeacherEditModal
            isOpen={isOpen}
            onClose={onCloseModal}
            setCurrentModal={setCurrentModal}
            classData={selectedCard}
            setClassData={setSelectedCard}
            performances={coEvents}
          />
        ) : (
          <TeacherCancelModal
            isOpen={isOpen}
            onClose={onCloseModal}
            setCurrentModal={setCurrentModal}
            classData={selectedCard}
          />
        )
      ) : // STUDENT VIEW HERE
      currentModal === "view" ? (
        <ViewModal
          isOpen={isOpen}
          onClose={onCloseModal}
          setCurrentModal={setCurrentModal}
          card={selectedCard}
          coEvents={coEvents}
          type={cardType}
          isAttended={isAttendedItem}
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

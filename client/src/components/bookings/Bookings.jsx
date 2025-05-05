import { memo, useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import {
  FaClock,
  FaMapMarkerAlt,
  FaMicrophoneAlt,
  FaMusic,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import {
  GiAbstract001,
  GiBallerinaShoes,
  GiBoombox,
  GiCartwheel,
  GiTambourine,
} from "react-icons/gi";
import { MdAdd, MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import { CreateClassForm } from "../forms/createClasses";
import CreateEvent from "../forms/createEvent";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { CancelModal } from "./CancelModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { InfoModal } from "./InfoModal";
import { TeacherCancelModal } from "./TeacherCancelModal";
import { TeacherConfirmationModal } from "./TeacherConfirmationModal";
import { TeacherEditModal } from "./TeacherEditModal";
import { TeacherViewModal } from "./TeacherViewModal";
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
  const [drafts, setDrafts] = useState([]);
  const [draftClasses, setDraftClasses] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [attended, setAttended] = useState([]);
  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [coEvents, setCoEvents] = useState([]);
  const [isAttendedItem, setIsAttendedItem] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [allEvents, setAllEvents] = useState([]);
  const [coreqId, setCoreqId] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});

  const [refresh, setRefresh] = useState(0);

  const isTeacher = role === "teacher";
  const [activeTab, setActiveTab] = useState("classes");

  const toggleClasses = () => {
    setActiveTab("classes");
  };

  const toggleEvents = () => {
    setActiveTab("events");
  };

  useEffect(() => {
    if (currentUser && role !== "student") {
      backend.get(`/events/published`).then((res) => setEvents(res.data));
      backend.get(`/classes/published`).then((res) => setClasses(res.data));
      backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data));
      backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data));
      backend.get("/events").then((res) => setAllEvents(res.data));
    } else if (currentUser && role === "student") {
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
  }, [backend, currentUser, isTeacher, refresh]);

  useEffect(() => {
    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);
    setDrafts([...draftClasses, ...draftEvents]);
  }, [classes, events]);

  useEffect(() => {
    const fetchCoreqId = async () => {
      if (!selectedCard?.id || !isOpen) return;

      try {
        const res = await backend.get(`/corequisites/${selectedCard.id}`);
        const data = res.data;

        if (data.length > 0) {
          const eventId = data[0].eventId;
          console.log("Fetched coreqId:", eventId);
          setCoreqId(eventId);
        } else {
          console.log("No corequisite found for class:", selectedCard.id);
          setCoreqId(null);
        }
      } catch (err) {
        console.error("Failed to fetch coreqId:", err);
        setCoreqId(null);
      }
    };

    fetchCoreqId();
  }, [backend, selectedCard, isOpen]);

  const fetchTags = async () => {
    try {
      const tagsResponse = await backend.get("/tags");
      const initialTagFilter = {};
      const initialTags = {};
      tagsResponse.data.forEach((tag) => {
        initialTagFilter[tag.id] = false;
        initialTags[tag.id] =
          tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1).toLowerCase();
      });

      setTagFilter(initialTagFilter);
      setTags(initialTags);
      // console.log(initialTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchEventsByTag = async (tagId) => {
    try {
      const res = await backend.get(`/event-tags/events/${tagId}`);
      const events = res.data;
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events for specified tag:", error);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await backend.get("/events/published");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  };

  const fetchClassesByTag = async (tagId) => {
    try {
      const res = await backend.get(`/class-tags/classes/${tagId}`);
      console.log(res.data);
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching events for specified tag:", error);
    }
  };

  const fetchAllClasses = async () => {
    try {
      const res = await backend.get("/classes/published");
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [searchInput]);

  const onCloseModal = () => {
    setSelectedCard(null);
    setCurrentModal("view");
    onClose();
    reloadClassesAndDrafts();
  };
  const onOpenModal = (data) => {
    setClassData(data);
    onOpen();
  };

  const triggerRefresh = () => {
    setRefresh(refresh + 1);
    console.log("Refresh triggered");
  };
  // https://dmitripavlutin.com/how-to-compare-objects-in-javascript/#4-deep-equality
  const deepEquality = (object1, object2) => {
    if (object1 === null || object2 === null) return object1 === object2;
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = typeof val1 === "object" && typeof val2 === "object";
      if (
        (areObjects && !deepEquality(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }

    return true;
  };

  const updateModal = (item) => {
    const type =
      classes.some((e) => deepEquality(e, item)) ||
      draftClasses.some((e) => deepEquality(e, item))
        ? "class"
        : "event";
    console.log(
      "update",
      item,
      classes,
      draftClasses,
      type,
      deepEquality(classes[0], item)
    );
    if (type === "class") loadCorequisites(item.id);
    setSelectedCard(item);
    setCardType(type);
    const isAttended = attended.some((attendedItem) => attendedItem === item);
    setIsAttendedItem(isAttended);
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

  const isFilterActive = Object.values(tagFilter).some(Boolean);

  const handleFilterToggle = (id) => () => {
    console.log(`Tag ${id} has been toggled!`);
    setTagFilter((prev) => {
      const updatedFilter = { ...prev, [id]: !prev[id] };
      return updatedFilter;
    });
    if (tagFilter[id]) {
      fetchAllEvents();
    } else {
      fetchEventsByTag(id);
    }
  };

  const handleClassFilterToggle = (id) => () => {
    console.log(`Tag ${id} has been toggled!`);
    setTagFilter((prev) => {
      const updatedFilter = { ...prev, [id]: !prev[id] };
      return updatedFilter;
    });
    if (tagFilter[id]) {
      fetchAllClasses();
    } else {
      fetchClassesByTag(id);
    }
  };

  const loadCorequisites = async (classId) => {
    try {
      const response = await backend.get(`classes/corequisites/${classId}`);

      if (response.status === 200) {
        setCoEvents(response.data);
        console.log(coEvents);
      }
    } catch (error) {
      console.error("Error fetching corequisite enrollment:", error);
    }
  };

  const reloadClassesAndDrafts = async () => {
    try {
      if (searchInput) {
        backend
          .get(`/events/search/${searchInput}`)
          .then((res) => setEvents(res.data));
        backend.get(`/classes/search/${searchInput}`).then((res) => {
          setClasses(res.data);
        });
      } else {
        backend.get(`/events/published`).then((res) => setEvents(res.data));
        backend.get(`/classes/published`).then((res) => {
          setClasses(res.data);
        });
      }
      backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data));
      backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data));

      const attendedClasses = classes.filter((c) => c.attendance !== null);
      const attendedEvents = events.filter((e) => e.attendance !== null);
      setAttended([...attendedClasses, ...attendedEvents]);
      setDrafts([...draftClasses, ...draftEvents]);
      if (selectedCard) loadCorequisites(selectedCard.id);
    } catch (error) {
      console.error("Error reloading classes:", error);
    }
  };

  const reloadClasses = async () => {
    if (searchInput) {
      backend.get(`/classes/search/${searchInput}`).then((res) => {
        setClasses(res.data);
      });
    } else {
      backend.get(`/classes/published`).then((res) => {
        setClasses(res.data);
      });
    }

    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);
    loadCorequisites(selectedCard.id);
  };

  const reloadEvents = async () => {
    if (searchInput) {
      backend.get(`/events/search/${searchInput}`).then((res) => {
        setEvents(res.data);
      });
    } else {
      backend.get(`/events/published`).then((res) => {
        setEvents(res.data);
      });
    }
    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);
    loadCorequisites(selectedCard.id);
  };

  // useEffect(() => {
  //   console.log("selectedCard", selectedCard);
  // }, [selectedCard]);

  const fetchClassData = async () => {
    try {
      const [classesResponse, classDataResponse] = await Promise.all([
        backend.get("/scheduled-classes"),
        backend.get("/classes"),
      ]);

      const classDataDict = new Map();
      classDataResponse.data.forEach((cls) => classDataDict.set(cls.id, cls));

      console.log("Fetching tags for class:", clsId);
      const response = await backend.get(`/class-tags/tags/${clsId}`);
      console.log("Raw tag data:", response.data);

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

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      if (tabIndex === 0) {
        console.log("hay");
        await reloadClasses();
        toggleClasses();
      } else if (tabIndex === 1) {
        await reloadEvents();
        toggleEvents();
      }
    }
  };

  // console.log("draft classes", draftClasses);
  // console.log("events", events);
  // console.log("attended", classes);
  // console.log("selected card", selectedCard);
  return (
    <Box pt={2}>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Box
          px={4}
          width="100%"
          pt={4}
        >
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search"
              variant="filled"
              borderRadius="full"
              borderColor={"gray.300"}
              bg="white.100"
              _hover={{ bg: "gray.200" }}
              _focus={{ bg: "white", borderColor: "gray.300" }}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </InputGroup>
        </Box>

        <Tabs
          width="100%"
          variant="line"
          colorScheme="blackAlpha"
          onChange={(index) => setTabIndex(index)}
        >
          <TabList justifyContent="center">
            <Tab
              _selected={{
                color: "black",
                borderBottom: "2px solid black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              Classes
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderBottom: "2px solid black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              Events
            </Tab>
            <Tab
              _selected={{
                color: "black",
                borderBottom: "2px solid black",
                borderColor: "black",
                fontWeight: "bold",
              }}
            >
              {role !== "student" ? "Drafts" : "Attended"}
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex
                gap={3}
                overflow={"auto"}
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                width="100%"
              >
                {Object.keys(tags).map((tag) => (
                  <Badge
                    key={tag}
                    onClick={handleClassFilterToggle(tag)}
                    rounded="xl"
                    border="1px"
                    borderColor="gray.300"
                    px={4}
                    py={1}
                    colorScheme={tagFilter[tag] ? "gray" : "white"}
                    textTransform="none"
                    cursor="pointer"
                  >
                    {tags[tag]}
                  </Badge>
                ))}
              </Flex>
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
              >
                {role !== "student" ? (
                  classes.length > 0 ? (
                    classes.map((classItem, index) => (
                      <ClassTeacherCard
                        key={index}
                        setSelectedCard={setSelectedCard}
                        {...classItem}
                        performance={coEvents}
                        navigate={navigate}
                        onOpen={updateModal}
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
                      triggerRefresh={triggerRefresh}
                      onCloseModal={onCloseModal}
                    />
                  ))
                ) : (
                  <Text>No classes booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <Flex gap={3}>
                {Object.keys(tags).map((tag) => (
                  <Badge
                    key={tag}
                    onClick={handleClassFilterToggle(tag)}
                    rounded="xl"
                    border="1px"
                    borderColor="gray.300"
                    px={4}
                    py={1}
                    colorScheme={tagFilter[tag] ? "gray" : "white"}
                    textTransform="none"
                    cursor="pointer"
                  >
                    {tags[tag]}
                  </Badge>
                ))}
              </Flex>
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
              >
                {events.length > 0 ? (
                  events.map((eventItem) => (
                    <EventCard
                      key={eventItem.id}
                      {...eventItem}
                      onClick={() => updateModal(eventItem)}
                      triggerRefresh={triggerRefresh}
                      onCloseModal={onCloseModal}
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
                my={5}
                mb={20}
              >
                {role !== "student" ? (
                  drafts.length > 0 ? (
                    drafts.map((item) =>
                      !item.callTime ? (
                        <ClassCard
                          key={item.id}
                          {...item}
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
                          triggerRefresh={triggerRefresh}
                          onCloseModal={onCloseModal}
                          // setRefresh={reloadClassesAndDrafts}
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
                        {...item}
                        onClick={() => updateModal(item)}
                      />
                    ) : (
                      <EventCard
                        key={item.id}
                        {...item}
                        onClick={() => updateModal(item)}
                        triggerRefresh={triggerRefresh}
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
      {role !== "student" ? (
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
            performances={allEvents}
            setRefresh={reloadClassesAndDrafts}
            coreqId={coreqId}
          />
        ) : currentModal === "create" ? (
          <Modal
            size="full"
            isOpen={isOpen}
            onClose={onCloseModal}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <HStack justify="space-between">
                  <MdArrowBackIosNew onClick={onCloseModal} />
                  <Heading size="lg">
                    {tabIndex === 0 ? "Create a Class" : "Create an Event"}
                  </Heading>{" "}
                  {/* Will add from prop */}
                  <MdMoreHoriz opacity={0} />
                </HStack>
              </ModalHeader>
              <ModalBody>
                {tabIndex === 0 ? (
                  <CreateClassForm
                    closeModal={onCloseModal}
                    modalData={selectedCard}
                    reloadCallback={reloadClassesAndDrafts}
                  />
                ) : (
                  <CreateEvent
                    isOpen={isOpen}
                    onClose={onCloseModal}
                    // triggerRefresh={reloadClassesAndDrafts}
                  />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
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
          onClose={onClose}
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
      {isTeacher && tabIndex !== 2 && (
        <Button
          onClick={() => {
            setSelectedCard(null);
            setCurrentModal("create");
            onOpen();
          }}
          position="fixed"
          bottom="90px"
          right="20px"
          borderRadius="50%"
          width="66px"
          height="66px"
          bg="#422E8D"
          color="white"
          _hover={{ bg: "blue.700" }}
          fontSize="4xl"
          zIndex={999}
        >
          <MdAdd size={40} />
        </Button>
      )}
      <Navbar />
    </Box>
  );
};

const ClassTeacherCard = memo(
  ({
    id,
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
    recurrencePattern,
    isRecurring,
    startDate,
    endDate,
    startTime,
    endTime,
    navigate,
    setSelectedCard,
    tagId,
    onOpen,
  }) => {
    const getIcon = () => {
      const iconSize = 60;
      switch (tagId) {
        case 1:
          return <FaMusic size={iconSize} />;
        case 2:
          return <GiBallerinaShoes size={iconSize} />;
        case 3:
          return <FaMicrophoneAlt size={iconSize} />;
        case 4:
          return <GiBoombox size={iconSize} />;
        case 5:
          return <GiAbstract001 size={iconSize} />;
        case 6:
          return <GiCartwheel size={iconSize} />;
        case 7:
          return <GiTambourine size={iconSize} />;
        default:
          return <FaMusic size={iconSize} />;
      }
    };
    return (
      <Box
        w={{ base: "100%", md: "30em" }}
        onClick={
          isDraft
            ? () => {
                const modalData = {
                  id,
                  title,
                  location,
                  date,
                  description,
                  capacity,
                  level,
                  costume,
                  performances: performance,
                  isRecurring,
                  recurrencePattern,
                  startDate,
                  endDate,
                  isDraft,
                  rsvpCount,
                  startTime,
                  endTime,
                };
                setSelectedCard(modalData);
                onOpen({
                  id,
                  title,
                  location,
                  date,
                  description,
                  capacity,
                  isRecurring,
                  recurrencePattern,
                  startDate,
                  endDate,
                  level,
                  costume,
                  isDraft,
                  startTime,
                  endTime,
                });
              }
            : () => {
                const modalData = {
                  id,
                  title,
                  location,
                  date,
                  description,
                  capacity,
                  level,
                  costume,
                  isRecurring,
                  recurrencePattern,
                  performances: performance,
                  isDraft,
                  startDate,
                  endDate,
                  rsvpCount,
                  startTime,
                  endTime,
                };
                setSelectedCard(modalData);
                onOpen({
                  id,
                  title,
                  location,
                  date,
                  description,
                  capacity,
                  level,
                  isRecurring,
                  recurrencePattern,
                  costume,
                  startDate,
                  endDate,
                  isDraft,
                  startTime,
                  endTime,
                });
              }
          // : () => navigate(`/dashboard/classes/${classId}`)
        }
        cursor="pointer"
      >
        <Card
          w={{ base: "90%", md: "30em" }}
          border="1px"
          borderColor="gray.300"
          bg="gray.50"
        >
          <HStack>
            <Box p="20px">{getIcon()}</Box>
            <Box>
              <CardHeader pb={0}>
                <HStack
                  position="absolute"
                  height="15%"
                  top="10%"
                  right="5%"
                  bg="purple.50"
                  px={3}
                  py={1}
                  borderRadius="full"
                  border="1px"
                  borderColor="purple.600"
                  color="black"
                  fontSize="sm"
                >
                  <Text>
                    {rsvpCount} {rsvpCount === 1 ? "Person " : "People "}
                    Enrolled
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody>
                <Box
                  display="flex"
                  justifyContent="center"
                >
                  <VStack
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Text
                      fontSize="1.5rem"
                      fontWeight="bold"
                    >
                      {title ? title : "Placeholder Title"}
                    </Text>

                    <HStack>
                      <Text fontSize="1.2rem">
                        {location ? location : "Irvine"}
                      </Text>
                    </HStack>

                    <HStack>
                      <Text fontSize="sm">
                        {date
                          ? `${formatDate(date)} · ${formatTime(startTime)} - ${formatTime(endTime)}`
                          : "No date"}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </CardBody>
            </Box>
          </HStack>
        </Card>
      </Box>
    );
  }
);

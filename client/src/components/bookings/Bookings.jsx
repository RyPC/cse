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

// import {
//   FaClock,
//   FaMapMarkerAlt,
//   FaMicrophoneAlt,
//   FaMusic,
//   FaSearch,
//   FaUser,
// } from "react-icons/fa";
// import {
//   GiAbstract001,
//   GiBallerinaShoes,
//   GiBoombox,
//   GiCartwheel,
//   GiTambourine,
// } from "react-icons/gi";
import { MdAdd, MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
// import { formatDate, formatTime } from "../../utils/formatDateTime";
import { CreateClassForm } from "../forms/createClasses";
import CreateEvent from "../forms/createEvent";
import { Navbar } from "../navbar/Navbar";
// import { InfoModal } from "./InfoModal";
import { SearchBar } from "../searchbar/SearchBar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { CancelModal } from "./CancelModal";
import { ClassTeacherCard } from "./ClassTeacherCard";
import { ConfirmationModal } from "./ConfirmationModal";
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
  const [tags, setTags] = useState([]);
  const [tagFilter, setTagFilter] = useState({});
  const [lastToggledTag, setLastToggledTag] = useState(null);
  const [classTagsMap, setClassTagsMap] = useState({});
  const [eventTagsMap, setEventTagsMap] = useState({});

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
      backend.get("/events/all").then((res) => setAllEvents(res.data));
    } else if (currentUser && role === "student") {
      backend
        .get(`/users/${currentUser.uid}`)
        .then((userRes) => {
          const userId = userRes.data[0].id;
          setUserId(userId);

          backend
            .get(`/class-enrollments/student/${userId}`)
            .then(async (res) => {
              const enrolledClasses = res.data;
              setClasses(enrolledClasses);

              const tagsPromises = enrolledClasses.map((cls) =>
                backend.get(`/class-tags/tags/${cls.id}`)
              );

              const tagsResults = await Promise.all(tagsPromises);
              const newClassTagsMap = {};

              enrolledClasses.forEach((cls, index) => {
                newClassTagsMap[cls.id] = tagsResults[index].data.map(
                  (tag) => tag.id
                );
              });

              setClassTagsMap(newClassTagsMap);
            })
            .catch((err) => {
              console.log("Error fetching class enrollments:", err);
            });

          backend
            .get(`/event-enrollments/student/${userId}`)
            .then(async (res) => {
              const enrolledEvents = res.data;
              setEvents(enrolledEvents);

              const tagsPromises = enrolledEvents.map((evt) =>
                backend.get(`/event-tags/tags/${evt.id}`)
              );

              const tagsResults = await Promise.all(tagsPromises);
              const newEventTagsMap = {};

              enrolledEvents.forEach((evt, index) => {
                newEventTagsMap[evt.id] = tagsResults[index].data.map(
                  (tag) => tag.id
                );
              });

              setEventTagsMap(newEventTagsMap);
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
    fetchTags();
  }, []);

  const handleFilterToggle = (id) => {
    setTagFilter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  // const isFilterActive = Object.values(tagFilter).some(Boolean);

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

  const handleClassSearch = async (query) => {
    if (currentUser && role === "student") {
      // For students, search within their enrolled classes
      const enrolledRes = await backend.get(
        `/class-enrollments/student/${user_id}`
      );
      const allEnrolledClasses = enrolledRes.data;

      // Client-side search filtering
      const filteredClasses = allEnrolledClasses.filter((cls) =>
        cls.title.toLowerCase().includes(query.toLowerCase())
      );

      setClasses(filteredClasses);
    } else {
      // For teachers/admin, keep the existing server-side search
      const searchRes = await backend.get(`/classes/search/${query}`);
      setClasses(searchRes.data);
    }
  };

  const handleEventSearch = async (query) => {
    if (currentUser && role === "student") {
      // For students, search within their enrolled events
      const enrolledRes = await backend.get(
        `/event-enrollments/student/${user_id}`
      );
      const allEnrolledEvents = enrolledRes.data;

      // Client-side search filtering
      const filteredEvents = allEnrolledEvents.filter((evt) =>
        evt.title.toLowerCase().includes(query.toLowerCase())
      );

      setEvents(filteredEvents);
    } else {
      // For teachers/admin, keep the existing server-side search
      const searchRes = await backend.get(`/events/search/${query}`);
      setEvents(searchRes.data);
    }
  };

  const reloadClassesAndDrafts = async () => {
    try {
      await Promise.all([
        backend.get(`/events/published`).then((res) => setEvents(res.data)),
        backend.get(`/classes/published`).then((res) => setClasses(res.data)),
        backend.get(`/events/drafts`).then((res) => setDraftEvents(res.data)),
        backend.get(`/classes/drafts`).then((res) => setDraftClasses(res.data)),
      ]);

      const attendedClasses = classes.filter((c) => c.attendance !== null);
      const attendedEvents = events.filter((e) => e.attendance !== null);
      setAttended([...attendedClasses, ...attendedEvents]);
      setDrafts([...draftClasses, ...draftEvents]);
      if (selectedCard) loadCorequisites(selectedCard.id);
      console.log(classes);
    } catch (error) {
      console.error("Error reloading classes:", error);
    }
  };

  const reloadClasses = async () => {
    await backend.get(`/classes/published`).then((res) => {
      setClasses(res.data);
    });

    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);

    if (selectedCard) {
      loadCorequisites(selectedCard.id);
    }
  };

  const reloadEvents = async () => {
    await backend.get(`/events/published`).then((res) => {
      setEvents(res.data);
    });

    const attendedClasses = classes.filter((c) => c.attendance !== null);
    const attendedEvents = events.filter((e) => e.attendance !== null);
    setAttended([...attendedClasses, ...attendedEvents]);

    if (selectedCard) {
      loadCorequisites(selectedCard.id);
    }
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

  return (
    <Box pt={2}>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Tabs
          width="100%"
          variant="line"
          colorScheme="blackAlpha"
          onChange={(index) => setTabIndex(index)}
        >
          <TabList justifyContent="center">
            <Tab
              _selected={{
                borderBottom: "2px",
                borderColor: "purple.600",
                fontWeight: "bold",
                color: "purple.600",
              }}
            >
              Classes
            </Tab>
            <Tab
              _selected={{
                borderBottom: "2px",
                borderColor: "purple.600",
                fontWeight: "bold",
                color: "purple.600",
              }}
            >
              Events
            </Tab>
            <Tab
              _selected={{
                borderBottom: "2px",
                borderColor: "purple.600",
                fontWeight: "bold",
                color: "purple.600",
              }}
            >
              {role !== "student" ? "Drafts" : "Attended"}
            </Tab>
          </TabList>
          {/* <Box
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
          </Box> */}
          <TabPanels>
            <TabPanel>
              <SearchBar
                onSearch={handleClassSearch}
                tags={tags}
                tagFilter={tagFilter}
                onTag={handleFilterToggle}
              />
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
                justifyContent="center"
              >
                {role !== "student" && (
                  <Box
                    // w={{ base: "100%", md: "30em" }}
                    w={"100%"}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCard(null);
                      setCurrentModal("create");
                      onOpen();
                    }}
                  >
                    <Card
                      w="100%"
                      border="1px"
                      borderColor="gray.300"
                      bg="gray.50"
                      _hover={{ bg: "gray.60" }}
                    >
                      <CardBody textAlign="center">
                        <Text
                          fontSize="xl"
                          fontWeight="semibold"
                        >
                          Add a Class +
                        </Text>
                      </CardBody>
                    </Card>
                  </Box>
                )}
                {role !== "student" ? (
                  classes.length > 0 ? (
                    classes.map((classItem, index) => (
                      <ClassTeacherCard
                        key={index}
                        setSelectedCard={setSelectedCard}
                        {...classItem}
                        performance={coEvents}
                        performances={events}
                        navigate={navigate}
                        onOpen={updateModal}
                      />
                    ))
                  ) : (
                    <Text>No classes available.</Text>
                  )
                ) : classes.length > 0 ? (
                  classes.map((classItem) => {
                    const isFilterActive =
                      Object.values(tagFilter).some(Boolean);
                    const classTags = classTagsMap[classItem.id] || [];

                    if (
                      !isFilterActive ||
                      classTags.some((tagId) => tagFilter[tagId])
                    ) {
                      return (
                        <Box
                          key={classItem.id}
                          display="flex"
                          justifyContent="center"
                          w="100%"
                        >
                          <ClassCard
                            {...classItem}
                            onClick={() => updateModal(classItem)}
                            triggerRefresh={triggerRefresh}
                            onCloseModal={onCloseModal}
                          />
                        </Box>
                      );
                    }
                    return null;
                  })
                ) : (
                  <Text>No classes booked.</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <SearchBar
                onSearch={handleEventSearch}
                tags={tags}
                tagFilter={tagFilter}
                onTag={handleFilterToggle}
              />
              <VStack
                spacing={4}
                width="100%"
                my={5}
                mb={20}
                justifyContent="center"
              >
                {role !== "student" && (
                  <Box
                    // w={{ base: "90%", md: "30em" }}
                    w={"100%"}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCard(null);
                      setCurrentModal("create");
                      onOpen();
                    }}
                  >
                    <Card
                      w="100%"
                      border="1px"
                      borderColor="gray.300"
                      bg="gray.50"
                      _hover={{ bg: "gray.60" }}
                    >
                      <CardBody textAlign="center">
                        <Text
                          fontSize="xl"
                          fontWeight="semibold"
                        >
                          Add an Event +
                        </Text>
                      </CardBody>
                    </Card>
                  </Box>
                )}
                {events.length > 0 ? (
                  events.map((eventItem) => {
                    const isFilterActive =
                      Object.values(tagFilter).some(Boolean);
                    const eventTags = eventTagsMap[eventItem.id] || [];

                    if (
                      !isFilterActive ||
                      eventTags.some((tagId) => tagFilter[tagId])
                    ) {
                      return (
                        <EventCard
                          key={eventItem.id}
                          {...eventItem}
                          onClick={() => updateModal(eventItem)}
                          triggerRefresh={triggerRefresh}
                          onCloseModal={onCloseModal}
                        />
                      );
                    }
                    return null;
                  })
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
                justifyContent={"center"}
              >
                {role !== "student" ? (
                  drafts.length > 0 ? (
                    drafts.map((item) =>
                      !item.callTime ? (
                        <ClassTeacherCard
                          key={item.id}
                          {...item}
                          onClick={() => updateModal(item)}
                          setSelectedCard={setSelectedCard}
                          performance={coEvents}
                          onOpen={updateModal}
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
                    {tabIndex === 0 ? "New Class" : "New Event"}
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
      <Navbar />
    </Box>
  );
};

// const ClassTeacherCard = memo(
//   ({
//     id,
//     title,
//     location,
//     date,
//     description,
//     capacity,
//     level,
//     costume,
//     performance,
//     attendeeCount,
//     isDraft,
//     recurrencePattern,
//     isRecurring,
//     startDate,
//     endDate,
//     startTime,
//     endTime,
//     navigate,
//     setSelectedCard,
//     tagId,
//     onOpen,
//   }) => {

//     const [openTeacherModal, setOpenTeacherModal] = useState(false);

//     const closeTeacherModal = () => {
//       setOpenTeacherModal(false);
//     };

//     const formattedDate = date ? formatDate(date) : null;
//     const formattedStartTime = startTime ? formatTime(startTime) : null;
//     const formattedEndTime = endTime ? formatTime(endTime) : null;
//     const getIcon = () => {
//       const iconSize = 50;
//       switch (tagId) {
//         case 1:
//           return <FaMusic size={iconSize} />;
//         case 2:
//           return <GiBallerinaShoes size={iconSize} />;
//         case 3:
//           return <FaMicrophoneAlt size={iconSize} />;
//         case 4:
//           return <GiBoombox size={iconSize} />;
//         case 5:
//           return <GiAbstract001 size={iconSize} />;
//         case 6:
//           return <GiCartwheel size={iconSize} />;
//         case 7:
//           return <GiTambourine size={iconSize} />;
//         default:
//           return <FaMusic size={iconSize} />;
//       }
//     };
//     return (
//       <Box
//        display="flex"
//        justifyContent="center"
//        w={{ base: "100%", md: "30em" }}
//       >

//       <Card
//         cursor="pointer"
//         key={id}
//         w={{ base: "90%", md: "30em" }}
//         border="1px"
//         borderColor="gray.300"
//         bg="gray.50"
//         onClick={
//           isDraft
//             ? () => {
//                 const modalData = {
//                   id,
//                   title,
//                   location,
//                   date,
//                   description,
//                   capacity,
//                   level,
//                   costume,
//                   performances: performance,
//                   isRecurring,
//                   recurrencePattern,
//                   startDate,
//                   endDate,
//                   isDraft,
//                   attendeeCount,
//                   startTime,
//                   endTime,
//                 };
//                 setSelectedCard(modalData);
//                 onOpen({
//                   id,
//                   title,
//                   location,
//                   date,
//                   description,
//                   capacity,
//                   isRecurring,
//                   recurrencePattern,
//                   startDate,
//                   endDate,
//                   level,
//                   costume,
//                   isDraft,
//                   startTime,
//                   endTime,
//                 });
//               }
//             : () => {
//                 const modalData = {
//                   id,
//                   title,
//                   location,
//                   date,
//                   description,
//                   capacity,
//                   level,
//                   costume,
//                   isRecurring,
//                   recurrencePattern,
//                   performances: performance,
//                   isDraft,
//                   startDate,
//                   endDate,
//                   attendeeCount,
//                   startTime,
//                   endTime,
//                 };
//                 setSelectedCard(modalData);
//                 onOpen({
//                   id,
//                   title,
//                   location,
//                   date,
//                   description,
//                   capacity,
//                   level,
//                   isRecurring,
//                   recurrencePattern,
//                   costume,
//                   startDate,
//                   endDate,
//                   isDraft,
//                   startTime,
//                   endTime,
//                 });
//               }
//           // : () => navigate(`/dashboard/classes/${classId}`)
//         }
//       >
//         <CardBody px={0}>
//           <Box
//             position="absolute"
//             textAlign="center"
//             justifyContent="center"
//             alignItems="center"
//             display="flex"
//             height="20px"
//             top="10px"
//             right="5%"
//             px="16px"
//             py="2px"
//             borderRadius="full"
//             border="0.2px solid"
//             borderColor="purple.600"
//             color="purple.700"
//             backgroundColor="purple.50"
//             fontSize="10px"
//           >
//             <Text>
//               {attendeeCount ?? 0} {(attendeeCount ?? 0) === 1 ? "Person" : "People"}{" "}
//               Enrolled
//             </Text>
//           </Box>
//           <HStack>
//             <Box px="20px">{getIcon()}</Box>
//             <VStack
//               alignItems="flex-start"
//               py="1rem"
//             >
//               <Text
//                 fontSize="1.5rem"
//                 fontWeight="bold"
//               >
//                 {title}
//               </Text>

//               <HStack>
//                 <Text fontSize="sm">{location ? `${location}` : "No location"}</Text>
//               </HStack>
//               <HStack>
//                 <Text fontSize="sm">
//                     {formattedDate
//                       ? `${formattedDate} · ${formattedStartTime} - ${formattedEndTime}`
//                       : "No date"}
//                 </Text>
//               </HStack>
//             </VStack>
//           </HStack>
//         </CardBody>
//       </Card>
//       </Box>
//     );
//   }
// );

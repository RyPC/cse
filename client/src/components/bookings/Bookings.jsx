import { useEffect, useMemo, useState } from "react";

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

import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
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
  const [modalData, setModalData] = useState(null);
  const { userRole } = useRoleContext();
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [selectedButton, setSelectedButton] = useState("classes");

  const [currentModal, setCurrentModal] = useState("view");
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [attended, setAttended] = useState([]);

  const [selectedCard, setSelectedCard] = useState();
  const [cardType, setCardType] = useState();
  const [user_id, setUserId] = useState();
  const [coEvents, setCoEvents] = useState([]);

  // useMemo(() => {
  //   if (currentUser?.uid && backend) {
  //     backend
  //       .get(`/users/${currentUser.uid}`)
  //       .then((response) => {
  //         setId(response.data[0].id);
  //       });
  //   }
  // }, [backend, currentUser?.uid]);

  // const isStudent = userRole === "student";
  // On mount, get the classes if the teacher else get the student classes I assume, and set them respectively, and also get the dra
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (currentUser?.uid && backend) {
  //       try {
  //         const userResponse = await backend.get(`/users/${currentUser.uid}`);
  //         const userId = userResponse.data[0].id;
  //         setId(userId);
  //         let classesResponse;
  //         if (isStudent) {
  //           classesResponse = await backend.get(`/students/joined/${userId}`);
  //         } else {
  //           classesResponse = await backend.get(`/classes`);
  //         }
  //         const tempClass = [];
  //         for (const value of Object.values(classesResponse.data)) {
  //           if (!value["isDraft"]) {
  //             tempClass.push(value);
  //           }
  //         }
  //         setCurrentBookings(tempClass);
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     }
  //   };
  //   fetchData();
  //   setLoading(false);
  // }, [backend, currentUser?.uid, isStudent]);

  // const handleClickEvents = async () => {
  //   setSelectedButton("events");
  //   setLoading(true);
  //   try {
  //     const events = await backend.get("/events");
  //     setCurrentBookings(events.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching events:", error);
  //   }
  // };
  // const handleClickClasses = async () => {
  //   setSelectedButton("classes");
  //   setLoading(true);
  //   try {
  //     let classesResponse;
  //     if (isStudent) {
  //       classesResponse = await backend.get(`/students/joined/${id}`);
  //     } else {
  //       classesResponse = await backend.get(`/classes`);
  //     }
  //     const tempDrafts = [];
  //     for (const value of Object.values(classesResponse.data)) {
  //       if (!value["isDraft"]) {
  //         tempDrafts.push(value);
  //       }
  //     }
  //     setCurrentBookings(tempDrafts);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching classes:", error);
  //   }
  // };

  const handleClickDrafts = async () => {
    // setSelectedButton("drafts");
    // setLoading(true);
    // try {
    //   let classesResponse;
    //   if (isStudent) {
    //     classesResponse = await backend.get(`/students/joined/${id}`);
    //   } else {
    //     classesResponse = await backend.get(`/classes`);
    //   }
    //   const tempDrafts = [];
    //   for (const value of Object.values(classesResponse.data)) {
    //     if (value["isDraft"]) {
    //       tempDrafts.push(value);
    //     }
    //   }
    //   setCurrentBookings(tempDrafts);
    //   setLoading(false);
    // } catch (error) {
    //   console.error("Error fetching drafts:", error);
    // }
    console.log("handle clickd rafts")
  };

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
      const response = await backend.get(`events/corequisites/${classId}`);

      if (response.status === 200) {
        setCoEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching corequisite enrollment:", error);
    }
  };
  const role = "teacher";
  // return (
  //   <Box height="100vh" position="relative">
  //     <VStack
  //       spacing={8}
  //       width="100%"
  //       height="calc(50vh - 60px)"
  //       marginX="auto"
  //       padding={5}
  //       alignItems="center"
  //       direction={"column"}
  //       justifyContent="flex-start"
  //     >
  //       <Heading size="lg" textAlign="center" mb={4}>
  //         Bookings
  //       </Heading>
  //       <HStack spacing={4}>
  //         <Button
  //           size="sm"
  //           onClick={handleClickEvents}
  //           bg={selectedButton === "events" ? "gray.500" : "blue.500"}
  //           color="white"
  //           _hover={{ bg: "blue.700" }}
  //         >
  //           Events
  //         </Button>
  //         <Button
  //           size="sm"
  //           onClick={handleClickClasses}
  //           bg={selectedButton === "classes" ? "gray.500" : "blue.500"}
  //           color="white"
  //           _hover={{ bg: "blue.700" }}
  //         >
  //           Classes
  //         </Button>
  //         {!isStudent && (
  //           <Button
  //             size="sm"
  //             onClick={handleClickDrafts}
  //             bg={selectedButton === "drafts" ? "gray.500" : "blue.500"}
  //             color="white"
  //             _hover={{ bg: "blue.700" }}
  //           >
  //             Drafts
  //           </Button>
  //         )}
  //       </HStack>
  //       <Box
  //         display="flex"
  //         flexWrap="wrap"
  //         flexDir={"column"}
  //         justifyContent="center"
  //         alignItems="center"
  //         gap={4}
  //         width="100%"
  //       >
  //         {selectedButton}
  //         {loading ? <Text>Loading...</Text> : (
  //           currentBookings.map((item, ind) => (
  //             <ClassCard
  //               key={ind}
  //               classId={item.id}
  //               title={item.title}
  //               location={item.location}
  //               date={item.date}
  //               description={item.description}
  //               capacity={item.capacity}
  //               level={item.level}
  //               costume={item.costume}
  //               performance={item.performance}
  //               navigate={navigate}
  //               isDraft={item.isDraft}
  //               button={selectedButton}
  //               setModalData={setModalData}
  //               onOpen={onOpen}
  //             />
  //           ))
  //         )}
  //       </Box>
  //       {!isStudent && <AddButton onOpen={onOpen} />}
  //     </VStack>
  //     <ViewModal
  //       isOpen={isOpen}
  //       onClose={onClose}
  //       title={"Create a Class/Draft"}
  //     >
  //       <CreateClassForm closeModal={onClose} modalData={modalData} reloadCallback={handleClickDrafts}/>
  //     </ViewModal>
  //     <Navbar />
  //   </Box>
  // );
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
          coEvents={coEvents}
          type={cardType}
          role={role}
        >
          {role === "student" ? (
            <InfoModal card={selectedCard}/>
          ) : (
            <CreateClassForm
              closeModal={onClose}
              modalData={modalData}
              reloadCallback={handleClickDrafts}
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
      {role === "teacher" && <AddButton onOpen={onOpen} />}
      <Navbar></Navbar>
    </Box>
  );
};

// const ClassCard = (
//   { classId, title, location, date, description, capacity, level, costume, performance, rsvpCount, link, isDraft, navigate, button, setModalData, onOpen },
// ) => {
//   // button shows if it is a class draft or a button
//   return (
//     <Card width="300px" minHeight="100px" position="relative">
//       <CardHeader paddingBottom={1}>
//         <Heading size={"lg"}>{title ? title : "Placeholder Title"}</Heading>
//       </CardHeader>
//       <CardBody paddingTop={1}>
//         <Text>Date: {date ? date : "1/27/2025 @ 1 PM - 3 PM"}</Text>
//         <Text>Location: {location ? location : "Irvine"}</Text>
//         <Text>RSVPd: {rsvpCount ? rsvpCount : 10}</Text>
//       </CardBody>
//       <Button
//         size="sm"
//         colorScheme="blue"
//         position="absolute"
//         bottom="8px"
//         right="8px"
//           onClick={
//             isDraft ? () => {
//                 const modalData = {
//                     id: classId,
//                     title,
//                     location,
//                     date,
//                     description,
//                     capacity,
//                     level,
//                     costume,
//                     performance
//                 }
//                 setModalData(modalData)
//                 onOpen()
//             } : () => navigate(`/dashboard/classes/${classId}`)
//           }
//       >
//         {isDraft ? "Edit" : "View Details"}
//       </Button>
//     </Card>
//   );
// };

const AddButton = ({ onOpen }) => {
  return (
    <Button
      onClick={onOpen}
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
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 12H19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
};

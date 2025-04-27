import { useEffect, useState } from "react";

import { Box, Button, Flex, Input, InputGroup, InputLeftElement, VStack, Badge } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { FaSearch } from "react-icons/fa";

export const Discovery = () => {
  // Active Tab Logic
  const [activeTab, setActiveTab] = useState("classes"); // Default to showing classes
  const [searchInput, setSearchInput] = useState("");
  const [refresh, setRefresh] = useState(0);
  const { currentUser } = useAuthContext();


  const toggleClasses = () => {
    setActiveTab("classes");
  };

  const toggleEvents = () => {
    setActiveTab("events");
  };

  // Fetching Class and Event Data
  const { backend } = useBackendContext();

  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});


  // this will be an array of users
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserData = () => {backend.get(`/users/${currentUser.uid}`).then(res => setUser(res))};
    fetchUserData();
  }, [backend, currentUser])


  useEffect(() => {
    const fetchData = async () => {
      // Fetch and Store Classes Information
      try {
        const response = await backend.get("/classes/scheduled");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }

      // Fetch and Store Events Information
      try {
        const response = await backend.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, [backend]);

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
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
  
    fetchTags();
  }, [backend]); // only run once or when `backend` changes
  

  const searchEvents = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(`/events/search/${searchInput}`);
        // console.log("Search results:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    } else {
      try {
        const response = await backend.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
  };

  const searchClasses = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(`/classes/search/${searchInput}`);
        // console.log("Search results:", response.data);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    } else {
      try {
        const response = await backend.get("/classes/scheduled");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
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

  const fetchEventsByTag = async (tagId) => {
    try {
      const res = await backend.get(`/event-tags/events/${tagId}`);
      const events = res.data;
      console.log("Fetched Events for Tag", tagId, res.data);
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
  }

  const fetchClassesByTag = async (tagId) => {
    try {
      const res = await backend.get(`/class-tags/classes/${tagId}`);
      const classes = res.data;
      setClasses(classes);
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
  }
  
  

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      activeTab === "classes" ? await searchClasses() : await searchEvents();
    }
  };

  // console.log(classes)
  return (
    <Box>
      <VStack
        mx="10%"
        my={5}
        mb={20} //added for mobile view of event/class cards; otherwise navbar covers it
      >
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder= "Search"
            variant="filled"
            borderRadius="full"
            borderColor={"gray.300"}
            bg="white.100"
            _hover={{ bg: "gray.200" }}
            _focus={{ bg: "white", borderColor: "gray.300" }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
          ></Input>
        </InputGroup>
        <Box width="100%" px={2}>
          {(activeTab === "events" || activeTab === "classes") && (
            <Flex
              wrap="wrap"
              gap={2}
              align="flex-start"
              mb={3}
            >
              {Object.keys(tags).map((tag) => (
                <Badge
                  key={tag}
                  onClick={
                    activeTab === "events"
                      ? handleFilterToggle(tag)
                      : handleClassFilterToggle(tag)
                  }
                  rounded="xl"
                  px={4}
                  py={1}
                  colorScheme={tagFilter[tag] ? "green" : "red"}
                  textTransform="none"
                  cursor="pointer"
                >
                  {tags[tag]}
                </Badge>
              ))}
            </Flex>
          )}
          <Flex
            gap="5"
            justify="center"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Button
              variant="unstyled"
              borderBottom="2px solid"
              borderColor={activeTab === "classes" ? "black" : "transparent"}
              fontWeight={activeTab === "classes" ? "bold" : "normal"}
              color={activeTab === "classes" ? "black" : "gray.500"}
              borderRadius="0"
              onClick={() => {
                setActiveTab("classes");
                toggleClasses();
              }}
            >
              Classes</Button>
            <Button
              variant="unstyled"
              borderBottom="2px solid"
              borderColor={activeTab === "events" ? "black" : "transparent"}
              fontWeight={activeTab === "events" ? "bold" : "normal"}
              color={activeTab === "events" ? "black" : "gray.500"}
              borderRadius="0"
              onClick={() => {
                setActiveTab("events");
                toggleEvents();
              }}
            >
              Events</Button>
          </Flex>
        </Box>

        <Box my="14px">
          <Flex
            display={activeTab === "events" ? "none" : "flex"}
            align="center"
            justify="center"
            gap={5}
            wrap="wrap"
          >
            {classes.map((classItem, index) => (
              <ClassCard
                id={classItem.id}
                key={index}
                title={classItem.title}
                description={classItem.description}
                location={classItem.location}
                capacity={classItem.capacity}
                level={classItem.level}
                costume={classItem.costume}
                date={classItem.date}
                startTime={classItem.startTime}
                endTime={classItem.endTime}
                attendeeCount={classItem.attendeeCount}
                user={user}
              />
            ))}
          </Flex>

          <Flex
            display={activeTab === "classes" ? "none" : "flex"}
            align="center"
            justify="center"
            gap={5}
            mt={5}
            wrap="wrap"
          >
            {events.map((eventItem, index) => (
              <EventCard
                key={index}
                title={eventItem.title}
                location={eventItem.location}
                description={eventItem.description}
                level={eventItem.level}
                date={eventItem.date}
                startTime={eventItem.startTime}
                endTime={eventItem.endTime}
                callTime={eventItem.callTime}
                classId={eventItem.classId}
                costume={eventItem.costume}
                id={eventItem.id}
                setRefresh={setRefresh}
                user={user}
              />
            ))}
          </Flex>
        </Box>
      </VStack>
      <Navbar></Navbar>
    </Box>
  );
};

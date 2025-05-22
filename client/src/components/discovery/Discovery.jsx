import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  VStack,
} from "@chakra-ui/react";


import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";
import { SearchBar } from "../searchbar/SearchBar";

export const Discovery = () => {
  // Active Tab Logic
  const [activeTab, setActiveTab] = useState("classes"); // Default to showing classes
  const [searchInput, setSearchInput] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [lastToggledTag, setLastToggledTag] = useState(null);

  const { currentUser, role } = useAuthContext();

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
    const fetchUserData = () => {
      backend.get(`/users/${currentUser.uid}`).then((res) => setUser(res));
    };
    fetchUserData();
  }, [backend, currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch and Store Classes Information
      try {
        const response = await backend.get(role !== 'student' ? "/classes/scheduled" : "/classes/published");
        console.log("Classes:", response.data);
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }

      // Fetch and Store Events Information
      try {
        const response = await backend.get(role !== 'student' ? "/events" : "/events/published");
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

  // take string as search query
  const searchEvents = async (query) => {
    try {
      if (role === 'student') {
        const res = await backend.get(
          query ? `/events/search/published/${query}` : "/events/published"
        );
        setEvents(res.data);
      } else {
        const res = await backend.get(
          query ? `/events/search/${query}` : "/events"
        );
        setEvents(res.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const searchClasses = async (query) => {
    try {
      if (role === 'student') {
        const res = await backend.get(
          query ? `/classes/search/published/${query}` : "/classes/scheduled"
        );
        setClasses(res.data);
      } else {
        const res = await backend.get(
          query ? `/classes/search/${query}` : "/classes/scheduled"
        );
        setClasses(res.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  const isFilterActive = Object.values(tagFilter).some(Boolean);

  const handleFilterToggle = (id) => {
    setTagFilter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setLastToggledTag(id);
  };

  useEffect(() => {
    if (lastToggledTag === null) {
      return;
    }
  
    const active = tagFilter[lastToggledTag];
  
    if (active) {
      fetchEventsByTag(lastToggledTag);
    } else {
      fetchAllEvents();
    }
  }, [tagFilter, lastToggledTag]);

  const handleClassFilterToggle = (id) => () => {
    setTagFilter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    setLastToggledTag(id);
  };

  useEffect(() => {
    if (lastToggledTag === null) {
      return;
    }
  
    const active = tagFilter[lastToggledTag];
  
    if (active) {
      fetchClassesByTag(lastToggledTag);
    } else {
      fetchAllClasses();
    }
  }, [tagFilter, lastToggledTag]);

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
  };

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

  // console.log(classes)
  return (
    <Box>
      <VStack
        // mx="5%"
        marginX={"auto"}
        maxWidth="100%"
        my={5}
        mb={20} //added for mobile view of event/class cards; otherwise navbar covers it
      >
        <Box width="100%" px={2}>
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
                toggleClasses();
              }}
            >
              Classes
            </Button>
            <Button
              variant="unstyled"
              borderBottom="2px solid"
              borderColor={activeTab === "events" ? "black" : "transparent"}
              fontWeight={activeTab === "events" ? "bold" : "normal"}
              color={activeTab === "events" ? "black" : "gray.500"}
              borderRadius="0"
              onClick={() => {
                toggleEvents();
              }}
            >
              Events
            </Button>
          </Flex>
        </Box>

        <Box width={"90%"}>
          <SearchBar
            onSearch={(query) => {
              if (activeTab === "events") {
                searchEvents(query);
              } else {
                searchClasses(query);
              }
            }}
            tags={tags}
            tagFilter={tagFilter}
            onTag={activeTab === "events" ? handleFilterToggle : handleClassFilterToggle}
          />
        </Box>

        <Box my="14px" width={"90%"}>
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
            // mt={5}
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
                attendeeCount={eventItem.attendeeCount}
                id={eventItem.id}
                setRefresh={setRefresh}
                user={user}
              />
            ))}
          </Flex>
        </Box>
      </VStack>
      <Navbar/>
    </Box>
  );
};

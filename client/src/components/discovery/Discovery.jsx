import { useCallback, useEffect, useState } from "react";

import { Box, Button, Flex, VStack } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { SearchBar } from "../searchbar/SearchBar";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";

export const Discovery = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("classes");
  const [lastToggledTag, setLastToggledTag] = useState(null);
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});
  const [classTagsMap, setClassTagsMap] = useState({});
  const [eventTagsMap, setEventTagsMap] = useState({});
  const [user, setUser] = useState(null);

  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();

  // API endpoint configuration
  const getApiEndpoints = useCallback(
    () => ({
      events: {
        published: role === "student" ? "/events/published" : "/events",
        search:
          role === "student" ? "/events/search/published" : "/events/search",
      },
      classes: {
        published:
          role === "student" ? "/classes/published" : "/classes/scheduled",
        search:
          role === "student" ? "/classes/search/published" : "/classes/search",
      },
    }),
    [role]
  );

  // Fetch functions
  const fetchAllEvents = useCallback(async () => {
    try {
      const endpoints = getApiEndpoints();
      const res = await backend.get(endpoints.events.published);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching all events:", error);
    }
  }, [backend, getApiEndpoints]);

  const fetchAllClasses = useCallback(async () => {
    try {
      const endpoints = getApiEndpoints();
      const res = await backend.get(endpoints.classes.published);
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching all classes:", error);
    }
  }, [backend, getApiEndpoints]);

  const fetchEventsByTag = useCallback(
    async (tagId) => {
      try {
        const res = await backend.get(`/event-tags/events/${tagId}`);
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events for specified tag:", error);
      }
    },
    [backend]
  );

  const fetchClassesByTag = useCallback(
    async (tagId) => {
      try {
        const res = await backend.get(`/class-tags/classes/${tagId}`);
        setClasses(res.data);
      } catch (error) {
        console.error("Error fetching classes for specified tag:", error);
      }
    },
    [backend]
  );

  // Search functions with proper empty query handling
  const searchEvents = useCallback(
    async (query) => {
      try {
        if (!query || query.trim() === "") {
          await fetchAllEvents();
          return;
        }

        const endpoints = getApiEndpoints();
        const res = await backend.get(
          `${endpoints.events.search}/${query.trim()}`
        );
        setEvents(res.data);
      } catch (error) {
        console.error("Error searching events:", error);
      }
    },
    [backend, fetchAllEvents, getApiEndpoints]
  );

  const searchClasses = useCallback(
    async (query) => {
      try {
        if (!query || query.trim() === "") {
          await fetchAllClasses();
          return;
        }

        const endpoints = getApiEndpoints();
        const res = await backend.get(
          `${endpoints.classes.search}/${query.trim()}`
        );
        setClasses(res.data);
      } catch (error) {
        console.error("Error searching classes:", error);
      }
    },
    [backend, fetchAllClasses, getApiEndpoints]
  );

  // Tab toggle functions
  const toggleClasses = () => {
    setActiveTab("classes");
  };

  const toggleEvents = () => {
    setActiveTab("events");
  };

  // Tag filter handlers
  const handleFilterToggle = useCallback(
    (id) => () => {
      setTagFilter((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      setLastToggledTag(id);
    },
    []
  );

  const handleClassFilterToggle = useCallback(
    (id) => () => {
      setTagFilter((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
      setLastToggledTag(id);
    },
    []
  );

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await backend.get(`/users/${currentUser.uid}`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (currentUser?.uid) {
      fetchUserData();
    }
  }, [backend, currentUser]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes with tags
        const classResponse = await backend.get(
          role !== "student" ? "/classes/scheduled" : "/classes/published"
        );
        setClasses(classResponse.data);

        const classTagsResponse = await backend.get(
          "/class-tags/all-class-tags"
        );
        const classTags = {};
        classTagsResponse.data.forEach((tag) => {
          classTags[tag.classId] = tag.tagArray;
        });
        setClassTagsMap(classTags);

        // Fetch events with tags
        const eventResponse = await backend.get(
          role !== "student" ? "/events" : "/events/published"
        );
        setEvents(eventResponse.data);

        const eventTagsResponse = await backend.get(
          "/event-tags/all-event-tags"
        );
        const eventTags = {};
        eventTagsResponse.data.forEach((tag) => {
          eventTags[tag.eventId] = tag.tagArray;
        });
        setEventTagsMap(eventTags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend, role]);

  // Fetch tags
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
  }, [backend]);

  // Tag filtering effect
  useEffect(() => {
    if (lastToggledTag === null) {
      return;
    }

    const active = tagFilter[lastToggledTag];

    if (activeTab === "events") {
      if (active) {
        fetchEventsByTag(lastToggledTag);
      } else {
        fetchAllEvents();
      }
    } else {
      if (active) {
        fetchClassesByTag(lastToggledTag);
      } else {
        fetchAllClasses();
      }
    }
  }, [
    tagFilter,
    lastToggledTag,
    activeTab,
    fetchAllEvents,
    fetchAllClasses,
    fetchEventsByTag,
    fetchClassesByTag,
  ]);

  return (
    <Box>
      <VStack
        marginX={"auto"}
        maxWidth="100%"
        my={5}
        mb={20}
      >
        <Box
          width="100%"
          px={2}
        >
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
              onClick={toggleClasses}
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
              onClick={toggleEvents}
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
            onTag={
              activeTab === "events"
                ? handleFilterToggle
                : handleClassFilterToggle
            }
          />
        </Box>

        <Box
          my="14px"
          width={"90%"}
        >
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
                tags={classTagsMap[classItem.id] || []}
              />
            ))}
          </Flex>

          <Flex
            display={activeTab === "classes" ? "none" : "flex"}
            align="center"
            justify="center"
            gap={5}
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
                user={user}
                tags={eventTagsMap[eventItem.id] || []}
              />
            ))}
          </Flex>
        </Box>
      </VStack>
      <Navbar />
    </Box>
  );
};

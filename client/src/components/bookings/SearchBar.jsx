import { useEffect, useState } from "react";

import {
    InputGroup,
    InputLeftElement,
    Input,
    Flex,
    Badge,
} from "@chakra-ui/react";

import { FaSearch } from "react-icons/fa";

export const SearchBar = ( { onSearch, type="classes", backend }) => {
    const [searchInput, setSearchInput] = useState("");
    const [tags, setTags] = useState({});
    const [tagFilter, setTagFilter] = useState({});

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

     const fetchEventsByTag = async (tagId) => {
        try {
          const res = await backend.get(`/event-tags/events/${tagId}`);
          const events = res.data;
          onSearch(events);
        } catch (error) {
          console.error("Error fetching events for specified tag:", error);
        }
      };
    
      const fetchAllEvents = async () => {
        try {
          const res = await backend.get("/events/published");
          onSearch(res.data);
        } catch (error) {
          console.error("Error fetching all events:", error);
        }
      }
    
      const fetchClassesByTag = async (tagId) => {
        try {
          const res = await backend.get(`/class-tags/classes/${tagId}`);
          const classes = res.data;
          onSearch(classes);
        } catch (error) {
          console.error("Error fetching events for specified tag:", error);
        }
      };
    
      const fetchAllClasses = async () => {
        try {
          const res = await backend.get("/classes/published");
          onSearch(res.data);
        } catch (error) {
          console.error("Error fetching all events:", error);
        }
      }

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

      const handleEnterKeyDown = async (e) => {
        if (e.key == "Enter") {
            try {
                const res = await backend.get(
                    `/${type}/search/${searchInput}`
                );

                onSearch(res.data);
            } catch (err) {
                console.log("Error performing search:", err);
            }
        }
      }

  return (
    <>
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
                onKeyDown={handleEnterKeyDown}
            />
        </InputGroup>

        {/* <Flex gap={3}>
            {Object.keys(tags).map((tag) => (
            <Badge
                key={tag}
                onClick={handleFilterToggle(tag)}
                rounded="xl"
                px={4}
                py={1}
                colorScheme={tagFilter[tag] ? "green" : "red"}
                textTransform="none"
            >
                {tags[tag]}
            </Badge>
            ))}
        </Flex> */}

        <Flex gap={3}>
            {Object.keys(tags).map((tag) => (
            <Badge
                key={tag}
                onClick={handleClassFilterToggle(tag)}
                rounded="xl"
                px={4}
                py={1}
                colorScheme={tagFilter[tag] ? "green" : "red"}
                textTransform="none"
            >
                {tags[tag]}
            </Badge>
            ))}
        </Flex>
    </>
  )
}
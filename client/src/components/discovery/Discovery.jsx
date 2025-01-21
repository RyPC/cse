import { VStack, Text, Input, Button, Flex, Box, Heading} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";

export const Discovery = () => {
    // Active Tab Logic
    const [activeTab, setActiveTab] = useState("both"); // Default to showing both

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

    useEffect(() => {
        const fetchData = async () => {
            // Fetch and Store Classes Information
            try {
                const response = await backend.get("/classes");
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
    

    return (
        <VStack mx="10%" my={5}>
            <Heading>Discovery</Heading>
            <Input placeholder="Search bar"></Input>
            <Flex gap="5">
                <Button onClick={toggleClasses}>Classes</Button>
                <Button onClick={toggleEvents}>Events</Button>
            </Flex>

            <Box my="14px">
                <Flex display={activeTab === "events" ? "none" : "flex"} align="center" justify="center" gap={5} wrap="wrap">
                    {classes.map((classItem, index) => (
                        <ClassCard 
                            key={index}
                            title={classItem.title}
                            description={classItem.description}
                            location={classItem.location}
                            capacity={classItem.capacity}
                            level={classItem.level}
                            costume={classItem.costume}
                        />
                    ))}
                </Flex>

                <Flex display={activeTab === "classes" ? "none" : "flex"} align="center" justify="center" gap={5} mt={5} wrap="wrap">
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
                        />
                    ))}
                </Flex>
            </Box>
        </VStack>
    );
};

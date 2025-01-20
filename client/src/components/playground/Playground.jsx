import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ClassCard } from "../shared/ClassCard";


export const Playground = () => {
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
        <Box>
            <Flex align="center" justify="center" gap={5} wrap="wrap">
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

                {events.map((eventItem, index) => (
                    // Your event card component and its props!
                    <></> // here to avoid errors
                ))}
            </Flex>
        </Box>
    );
};

import { VStack, HStack, Text, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { TeacherNotification } from "./TeacherNotification";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const NotificationPanel = ({ isOpen, onClose }) => {
    const [ activeTab, setActiveTab ] = useState("alerts");
    const [ teachers, setTeachers ] = useState([]);
    const { backend } = useBackendContext();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await backend.get("/teachers/notactivated");
                setTeachers(response.data);
            } catch (error) {
                console.error("Error fetching unapproved teachers:", error);
            }
        };
    
        fetchData();
    }, [backend]);


    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} >
            <DrawerOverlay />
            <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader fontSize="3xl">Notifications</DrawerHeader>

            <DrawerBody>
                <HStack gap={8}>
                    <Text 
                        cursor="pointer" 
                        fontSize="xl"
                        fontWeight={activeTab === "alerts" ? "bold" : "normal"}
                        onClick={() => setActiveTab("alerts")}
                    >
                        Alerts
                    </Text>
                    <Text
                        cursor="pointer" 
                        fontSize="xl"
                        fontWeight={activeTab === "teachers" ? "bold" : "normal"}
                        onClick={() => setActiveTab("teachers")}
                    >
                        Teachers
                    </Text>
                </HStack>

                <VStack>
                    {(activeTab === "teachers" && teachers) ? teachers.map((teacher, ind) => (
                        <TeacherNotification
                            key={ind}
                            id={teacher.id}
                            firstName={teacher.firstName}
                            lastName={teacher.lastName}
                        />))
                    : null}
                </VStack>
            </DrawerBody>

            {/* <DrawerFooter>
            </DrawerFooter> */}
            </DrawerContent>
        </Drawer>
    );
};
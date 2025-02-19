import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, HStack, Grid, GridItem, Text, Heading } from "@chakra-ui/react";
import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md"
import { formatDate } from "../../utils/formatDateTime";


export const ViewModal = ({ isOpen, onClose, setCurrentModal, card, type }) => {
    const onCancel = () => {
        setCurrentModal("cancel");
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>
                <HStack justify="space-between">
                    <MdArrowBackIosNew onClick={onClose}/>
                    <Heading size="lg">{card ? card.title : "N/A"}</Heading> {/* Will add from prop */}
                    <MdMoreHoriz/>
                </HStack>
            </ModalHeader>

            <ModalBody>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                        <Text fontWeight="bold">Location</Text> {/* Will add from prop */}
                        <Text>{card ? card.location : "N/A"}</Text>
                    </GridItem>

                    <GridItem>
                        <Text fontWeight="bold">Date</Text> {/* Will add from prop */}
                        <Text>{card ? formatDate(card.date) : "N/A"}</Text>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <Text fontWeight="bold">Description</Text> {/* Will add from prop */}
                        <Text>{card ? card.description : "N/A"}</Text>
                    </GridItem>

                    {type === "class" ? 
                        <GridItem>
                            <Text fontWeight="bold">Capacity</Text>
                            <Text>{card ? card.capacity : "N/A"}</Text>
                        </GridItem> 
                        : 
                        <GridItem>
                            <Text fontWeight="bold">Start Time</Text>
                            <Text>{card ? card.startTime : "N/A"}</Text>
                        </GridItem>
                    }
                    
                    {type === "class" ? 
                        <GridItem>
                            <Text fontWeight="bold">Level</Text>
                            <Text>{card ? card.level : "N/A"}</Text>
                        </GridItem> 
                        : 
                        <GridItem>
                            <Text fontWeight="bold">End Time</Text>
                            <Text>{card ? card.endTime : "N/A"}</Text>
                        </GridItem>
                    }

                    {type === "class" ? 
                        <GridItem colSpan={2}>
                            {/* Make an endpoint for this :sob: */}
                            <Text fontWeight="bold">Performances</Text>
                            <Text>Spring Traditional Chinese Dance Recital</Text>
                        </GridItem> 
                        : 
                        <GridItem colSpan={2}>
                            <Text fontWeight="bold">Level</Text>
                            <Text>{card ? card.level : "N/A"}</Text>
                        </GridItem>
                    }
                </Grid>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <Button size="sm" background="#757575" color="white" mr={3} onClick={onCancel} px={10} py={6}>
                    Cancel RSVP
                </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    );
};
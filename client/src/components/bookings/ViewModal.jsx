import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, HStack, Grid, GridItem, Text, Heading } from "@chakra-ui/react";
import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md"


export const ViewModal = ({ isOpen, onClose, setCurrentModal }) => {
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
                    <Heading size="lg">Ballet A</Heading> {/* Will add from prop */}
                    <MdMoreHoriz/>
                </HStack>
            </ModalHeader>

            <ModalBody>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <GridItem>
                        <Text fontWeight="bold">Location</Text> {/* Will add from prop */}
                        <Text>Walnut</Text>
                    </GridItem>

                    <GridItem>
                        <Text fontWeight="bold">Date</Text> {/* Will add from prop */}
                        <Text>1/30/2025</Text>
                    </GridItem>

                    <GridItem colSpan={2}>
                        <Text fontWeight="bold">Description</Text> {/* Will add from prop */}
                        <Text>12-week traditional Chinese dance class taught by Instructor Lin.</Text>
                    </GridItem>

                    <GridItem>
                        <Text fontWeight="bold">Capacity</Text> {/* Will add from prop */}
                        <Text>14</Text>
                    </GridItem>

                    <GridItem>
                        <Text fontWeight="bold">Level</Text> {/* Will add from prop */}
                        <Text>Advanced</Text>
                    </GridItem>

                    <GridItem colSpan={2}> {/* Do we even have this information? I can do costume for class and start/end time for event */}
                        <Text fontWeight="bold">Performances</Text> 
                        <Text>Spring Traditional Chinese Dance Recital</Text>
                    </GridItem>
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
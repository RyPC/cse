import { useState } from "react";

import { ConfirmationModal } from "./ConfirmationModal";
import { ViewModal } from "./ViewModal";
import { CancelModal } from "./CancelModal";
import { Navbar } from "../navbar/Navbar";

import { Button, Box, useDisclosure, Heading, VStack } from "@chakra-ui/react";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("view");

  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
  };

  const handleClickEvents = () => {
    console.log("Booked events button has been pressed!");
  };
  const handleClickClasses = () => {
    console.log("Booked classes button has been pressed!");
  };
  const handleClickHistory = () => {
    console.log("Booked history button has been pressed!");
  };

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Bookings</Heading>
        <div>
          <Button onClick={handleClickEvents}>Events</Button>
          <Button onClick={handleClickClasses}>Classes</Button>
          <Button onClick={handleClickHistory}>History</Button>
        </div>

      <Box
        p="50"
        borderWidth="1px"
        borderColor="black"
        onClick={onOpen}
      >
        Class Sample
      </Box>
      </VStack>
      {
        currentModal === "view" ?
          <ViewModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} /> :
        (currentModal === "confirmation" ?
          <ConfirmationModal isOpen={isOpen} onClose={onCloseModal} /> :
          <CancelModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} />
        )
      }
      <Navbar></Navbar>
    </Box>

  );
};

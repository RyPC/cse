import { useState, useEffect } from "react";
import { Box, useDisclosure, Button } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ClassRSVP } from "../rsvp/classRsvp";
import { EventRSVP } from "../rsvp/eventRsvp";
import { ViewModal } from "../bookings/ViewModal";

export const Playground = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [currentModal, setCurrentModal] = useState();
  
  // const onCloseModal = () => {
  //   setCurrentModal("view");
  //   onClose();
  // };

  return (
    <Box>
      <Button onClick={onOpen}>Click me</Button>
      <ClassRSVP
        isOpen={isOpen}
        onClose={onClose}
      />
      {/* <ViewModal
        isOpen={isOpen}
      /> */}
    </Box>
  );
};
import { Box, useDisclosure, Button } from "@chakra-ui/react";

import { ClassRSVP } from "../rsvp/classRsvp";
import { EventRSVP } from "../rsvp/eventRsvp";

export const Playground = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const flag = true;

  return (
    <Box>
      <Button 
        onClick={onOpen} 
        variant="unstyled"
        fontSize="lg" 
        fontWeight="normal"
        color="black"
        textDecoration="underline"
        _focus={{ boxShadow: "none" }}
      >
        View attendees &gt;
      </Button>

      { flag ? 
        <ClassRSVP
        isOpen={isOpen}
        onClose={onClose}
        card={{name: "Dance 101", id: 4}}
        />
      :
        <EventRSVP
          isOpen={isOpen}
          onClose={onClose}
          card={{name: "VIBE Dance Competition", id: 3}}
        />
      }
      
      
    </Box>
  );
};
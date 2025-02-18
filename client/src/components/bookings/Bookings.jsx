import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";

import { ConfirmationModal } from "./ConfirmationModal";
import { ViewModal } from "./ViewModal";
import { CancelModal } from "./CancelModal";
import { Navbar } from "../navbar/Navbar";

import { Box, Button, Heading, useDisclosure, VStack } from "@chakra-ui/react";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModal, setCurrentModal] = useState("view");
  const { userRole } = useRoleContext();
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [id, setId] = useState(null);
  useMemo(() => {
    if (currentUser?.uid && backend) {
      backend.get(`/users/${currentUser.uid}`)
        .then((response) => {
          setId(response.data[0].id);
        });
    }
  }, [backend, currentUser?.uid]);

  const isStudent = userRole === "student";
  const isTeacher = userRole === "admin";
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid && backend) {
        try {
          const userResponse = await backend.get(`/users/${currentUser.uid}`);
          const userId = userResponse.data[0].id;
          setId(userId);

          const classesResponse = await backend.get(`/students/joined/${userId}`);
          setClasses(classesResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [backend, currentUser?.uid]);

  useEffect(() => {
    console.log("Classes:", classes);
    console.log("ID:", id);
  }, [classes, id]);

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
        padding={10}
      >
        <Heading>Bookings</Heading>
        <div>
          <Button onClick={handleClickEvents}>Events</Button>
          <Button onClick={handleClickClasses}>Classes</Button>
          {isTeacher && <Button onClick={handleClickHistory}>Drafts</Button>}
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
      {currentModal === "view"
        ? (
          <ViewModal
            isOpen={isOpen}
            onClose={onClose}
            setCurrentModal={setCurrentModal}
          />
        )
        : (currentModal === "confirmation"
          ? <ConfirmationModal isOpen={isOpen} onClose={onClose} />
          : (
            <CancelModal
              isOpen={isOpen}
              onClose={onClose}
              setCurrentModal={setCurrentModal}
            />
          ))}
      <Navbar></Navbar>
    </Box>
  );
};

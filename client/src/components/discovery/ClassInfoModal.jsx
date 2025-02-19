import { useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SuccessSignupModal from "./SuccessSignupModal";

function ClassInfoModal({
  isOpenProp,
  handleClose,
  title,
  description,
  location,
  capacity,
  level,
  costume,
  id,
  date,
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [corequisites, setCorequisites] = useState([]);

  const fetchCorequirements = async () => {
    const response = await backend.get(`/classes/corequisites/${id}`);
    setCorequisites(response.data);
  };

  const handleClassSignUp = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/class-enrollments`, {
        studentId: users.data[0].id,
        classId: id,
        attendance: new Date(),
      });
      console.log(req);
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const closeAll = () => {
    setOpenSuccessModal(false);
    handleClose();
    navigate("/bookings");
  };

  useEffect(() => {
    if (isOpenProp && !imageSrc) {
      fetch("https://dog.ceo/api/breeds/image/random")
        .then((res) => res.json())
        .then((data) => setImageSrc(data.message));
      fetchCorequirements();
    }
  }, [isOpenProp]);

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={closeAll}
      />
      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={4}
              align="center"
            >
              <HStack width="100%">
                <Text>
                  Core-Req:{" "}
                  {corequisites.length === 0
                    ? "No corequisites for this class"
                    : ""}
                </Text>
              </HStack>
              <Box
                boxSize="sm"
                height="15rem"
                width={"100%"}
                alignContent={"center"}
                justifyContent={"center"}
                display="flex"
              >
                <Image
                  src={imageSrc}
                  alt="Random Dog"
                  height={"100%"}
                  width={"100%%"}
                />
              </Box>

              <HStack
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Location:</Text>
                  <Text>{location}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{date}</Text>
                </Box>
              </HStack>

              <Box width="100%">
                <Text fontWeight="bold">Description:</Text>
                <Text>{description}</Text>
              </Box>

              <HStack
                spacing={4}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Capacity:</Text>
                  <Text>{capacity}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Level:</Text>
                  <Text>{level}</Text>
                </Box>
              </HStack>

              <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold">Costume:</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClassSignUp}>Sign up</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ClassInfoModal;

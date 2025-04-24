import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  HStack
} from "@chakra-ui/react";
import { BiSolidEdit, BiTrash } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";
import { BsChevronLeft } from "react-icons/bs";
import { formatDate } from "../../utils/formatDateTime";
import { useState, useEffect } from "react";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { QRCode } from "./teacherView/qrcode/QRCode.jsx";
import { ClassRSVP } from "../rsvp/classRsvp.jsx"

export const TeacherViewModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  classData,
  performances,
}) => {
  const { backend } = useBackendContext();
  const [tagData, setTagData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [instructorName, setInstructorName] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      if (!classData?.id) {
        return;
      }

      setLoading(true);
      try {
        const response = await backend.get(`/class-tags/tags/${classData.id}`);
        
        if (response.data && response.data.length > 0) {
          // Extract tags from the response
          const processedTags = response.data.map(item => ({
            id: item.tagId,
            name: item.tag
          }));
          
          setTagData(processedTags);
        } else {
          setTagData([]);
        }
      } catch (error) {
        console.error('Error fetching tags for class:', error);
        setTagData([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchInstructor = async () => {
      if (!classData?.id) {
        return;
      }
      try {
        const res = await backend.get(`/classes-taught/instructor/${classData.id}`);
        console.log("TESTISNG",res.data);
        if (res.data) {
          const { firstName, lastName } = res.data;
          setInstructorName(`${firstName} ${lastName}`);
        }
      } catch (err) {
        console.error("Failed to fetch instructor:", err);
        setInstructorName("Unavailable");
      }
    };

    fetchTags();
    fetchInstructor();

  }, [backend, classData?.id]);

  const onCancel = () => {
    setCurrentModal("cancel");
  };

  const enterEditMode = () => {
    setCurrentModal("edit");
  };
  

  const { isOpen: isRSVPOpen, onOpen: onRSVPOpen, onClose: onRSVPClose } = useDisclosure();

  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <Flex
          align="center"
          w="100%"
          position="relative"
        >
          <IconButton
            onClick={onClose}
            icon={<BsChevronLeft />}
            position="absolute"
            left={5}
            backgroundColor="white"
          />
          <ModalHeader
            flex={1}
            textAlign="center"
            marginTop="10px"
          >
            {classData?.title ? classData.title : " "}
          </ModalHeader>
          <Menu>
            <MenuButton
              as={Button}
              position="absolute"
              right={5}
            >
              ...
            </MenuButton>
            <MenuList
              backgroundColor="gray.100"
              p={0}
              minW="auto"
              w="110px" 
              h="80px"
            >
              <MenuItem
                value="edit"
                onClick={enterEditMode}
                background="transparent"
                
                
              >
                <BiSolidEdit style={{ marginRight: "6px" }} />Edit
              </MenuItem>
              <MenuItem
                value="delete"
                onClick={onCancel}
                background="transparent"
                
              >
                <BiTrash style={{ marginRight: "6px" }} />Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <ModalBody>
          
          <VStack>
            <Box
              bg="gray.200"
              h="100%"
              w="100%"
              mt="4"
              mb="4"
              p="4"
            >
              <Box
                bg="gray"
                h="100%"
                w="100%"
                p="4"
                mt="4"
                color="white"
              >
                <Center>
                  <QRCode
                    id={classData?.id}
                    type="Class"
                    date={classData?.date}
                  >
                  </QRCode>
                </Center>
                <Center>
                  <Button
                    colorScheme="blue"
                    mr={3}
                  >
                    Share
                  </Button>
                </Center>
              </Box>
              <Box width="100%" align="center">
                <Text fontWeight="bold"> {classData?.rsvpCount ? classData?.rsvpCount : 0} RSVPs</Text>
                <Button
                  onClick={onRSVPOpen}
                  variant="unstyled"
                  fontSize="lg"
                  fontWeight="normal"
                  color="purple"
                  textDecoration="underline"
                  _focus={{ boxShadow: "none" }}
                >
                  View attendees &gt;
                </Button>
                <ClassRSVP isOpen={isRSVPOpen} onClose={onRSVPClose} card={{id: classData?.id, name: classData?.title, date: classData?.date}}/>
              </Box>
            </Box>
          </VStack>

          <HStack width="100%" justify="space-between" align="start" mt={4}>
            <Box>
              <Text fontWeight="bold" mb="0.5rem">Location</Text>
              <Text>{classData?.location}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold" mb="0.5rem">Date</Text>
              <Text>{formatDate(classData?.date)}</Text>
            </Box>
          </HStack>
          <Box>
            <Text
              fontWeight="bold"
              mb="1rem"
            >
              Time
            </Text>
            <Text>
              {classData?.startTime} -{" "}
              {classData?.endTime}
            </Text>
          </Box>
          <Box>
            <Text
              fontWeight="bold"
              mb="1rem"
              >
              Instructor
              
              </Text>
              <Text>
              {instructorName || "Unavailable"}
            </Text>
          </Box>
          <Text
              fontWeight="bold"
              mb="1rem"
            >
              Type
            </Text>
            <Text>
            {tagData.length > 0 
              ? tagData.map(tag => tag.name).join(", ")
              : "No tags available"}
              
          </Text>
          <Box>
            
          </Box>
          <Box>
            <Text
              fontWeight="bold"
              mb="1rem"
            >
              Description
            </Text>
            <Text>{classData?.description}</Text>
          </Box>
          <HStack width="100%" justify="space-between" align="start" mt={6}>
          <Box>
            <Text fontWeight="bold" mb="0.5rem">Capacity</Text>
            <Text>{classData?.capacity}</Text>
          </Box>
          <Box>
            <Text fontWeight="bold" mb="0.5rem">Level</Text>
            <Text>{classData?.level}</Text>
          </Box>
        </HStack>
          <Box>
            <Text
              fontWeight="bold"
              mb="0.5rem"
            >
              Performance(s)
            </Text>
            {performances.map((performance) => (
              <Text key={performance.id}>{performance.title}</Text>
            ))}
            <Text></Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

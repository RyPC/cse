import { memo, useEffect, useState } from "react";

// import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

// import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import PublishedReviews from "../reviews/classReview";

export const ViewModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  // children,
  // title,
  card,
  coEvents,
  // type,
  // role,
  isAttended = false,
}) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };

  const [tags, setTags] = useState([]);
  const { backend } = useBackendContext();

  const getTags = async () => {
    const tags_arr = [];
    if (!card?.id) {
      return;
    }
    const tags = await backend.get(`/event-tags/tags/${card.id}`);
    // console.log("TAGS from GETTAGS event")
    // console.log(tags.data)
    for (let i = 0; i < tags.data.length; i++) {
      if (!tags_arr.includes(tags.data[i].tag)) {
        tags_arr.push(tags.data[i].tag);
      }
    }
    setTags(tags_arr);
  };

  useEffect(() => {
    getTags();
  }, [backend]);

  // console.log("viewmodal", card);
  const viewInfo = (
    <>
      {/* <Flex justifyContent="center">
        {title}
      </Flex> */}
      <Text>
        {card?.description
          ? `Description: ${card.description}`
          : "No description available."}
      </Text>{" "}
      <br />
      <Divider orientation="horizontal" /> <br />
      <Text color="#553C9A">
        {formatDate(card?.date)} · {formatTime(card?.startTime)} –{" "}
        {formatTime(card?.endTime)}
      </Text>
      <Text>Call Time: {formatTime(card?.callTime)}</Text>
      <Text>Location: {card?.location}</Text>
      <br /> <Divider orientation="horizontal" /> <br />
      <VStack
        spacing={4}
        align="center"
      >
        <HStack
          spacing={4}
          width={"100%"}
        >
          <Box width="50%">
            <Text fontWeight="bold">Level</Text>
            <Text>{card?.level}</Text>
          </Box>
          <Box width="50%">
            <Text fontWeight="bold">Capacity</Text>
            <Text>{card?.capacity}</Text>
          </Box>
        </HStack>
        <br />
        <Divider orientation="horizontal" />
        {/* <HStack width="100%"> */}
        <Box>
          <Text
            mr="20"
            fontWeight="bold"
            mb="0.5rem"
          >
            Recommended Prerequisites(s)
          </Text>
          <Text>
            We recommend taking these classes before enrolling in this series.
          </Text>

          {/* {classData?.prerequisites && classData?.prerequisites.length > 0 ? (
            <Text fontSize="16px">
              {classData?.prerequisites.map((prerequisite) => (
                <Tag borderRadius={"full"} bg="purple.100" textColor={"purple.800"} key={prerequisite.id}>{prerequisite.title}</Tag>
              ))}
            </Text>
          ) : (
            <Text>No prerequisites for this class</Text>
          )} */}
        </Box>
        <Box>
          <Text
            mr="20"
            fontWeight="bold"
            mb="0.5rem"
          >
            Performance(s)
          </Text>
          <Text mb={3}>
            At the end of the class period, students will perform in a final
            performance.
          </Text>
          {coEvents.map((performance) => (
            <Tag
              borderRadius={"full"}
              bg="purple.100"
              textColor={"purple.800"}
              key={performance.id}
            >
              {performance.title}
            </Tag>
          ))}
        </Box>
        <Divider orientation="horizontal" />
        {/* <Divider borderColor="gray.400" borderWidth="1px" my={4} /> */}
        {/* {!isCorequisiteSignUp && (
            <Box bg = "#E8E7EF" borderRadius="md" width = "100%" p={4}>
              <Text as="b">
                Recommended classes
              </Text>
              {!corequisites || corequisites.length === 0 ? (
                <Text>No corequisites for this class</Text>
              ) : (
                <List>
                  {corequisites.map((coreq, index) => (
                    <ListItem key={index}>
                      <ListIcon
                        as={
                          coreq.enrolled
                            ? FaCircleCheck
                            : FaTimesCircle
                        }
                      />
                      {coreq.title}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )} */}
        {/* </HStack> */}
      </VStack>
    </>
  );
  return (
    <Modal
      size="full"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align={"start"}>
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={onClose}
              aria-label="Back"
              variant="ghost"
              fontSize={"2xl"}
              p={4}
              ml={-4}
            />
            <List>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  mr={1}
                  mb={1}
                  mt={1}
                  borderRadius={"full"}
                  bg="white"
                  textColor="gray.600"
                  borderColor={"gray.300"}
                  borderWidth={1}
                >
                  {tag}
                </Tag>
              ))}
            </List>
            <Text
              justifyContent="center"
              wordBreak={"break-word"}
              fontWeight={"bold"}
            >
              {card?.title ?? "Create a Class/Draft"}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody>{viewInfo}</ModalBody>
        {!isAttended && !card?.attendance && (
          <ModalFooter justifyContent="center">
            <Button
              width="60%"
              size="sm"
              background="purple.600"
              color="white"
              mr={3}
              onClick={onCancel}
              px={10}
              py={6}
            >
              Cancel RSVP
            </Button>
          </ModalFooter>
        )}
        <PublishedReviews
          classId={card?.id}
          isAttended={isAttended}
        />
      </ModalContent>
    </Modal>
  );
};

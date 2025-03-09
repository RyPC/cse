import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Class } from "../../../types/class";
// * Drafts need to have placholders and their cards should open the modal, so the functions sent down to them are different
export const Drafts = () => {
  const [drafts, setDrafts] = useState<Class[]>([]);
  const { backend } = useBackendContext();
  useEffect(() => {
    backend
      .get("/classes")
      .then((classes) => {
        const filteredClasses = classes.data.filter(
          (currentClass: Class) => currentClass.isDraft === true
        );
        setDrafts(filteredClasses as Class[]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [backend]);

  return (
    <VStack>
      {drafts.map((currentClass) => {
        return DraftTeacherCard(currentClass);
      })}
    </VStack>
  );
};

function DraftTeacherCard(currentDraft: Class) {
  return (
    <Card
      w={{ base: "90%", md: "30em" }}
      bg="gray.200"
    >
      <CardHeader pb={0}>
        <Heading
          size="md"
          fontWeight="bold"
        >
          {currentDraft.title || "Untitled Draft"}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">{currentDraft.date || "Unknown Date"} </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">
              {currentDraft.location || "Unknown Location"}
            </Text>
          </HStack>
          <Button
            alignSelf="flex-end"
            variant="solid"
            size="sm"
            bg="gray.500"
            color="black"
            _hover={{ bg: "gray.700" }}
            mt={2}
            // TODO: navigate to edit draft page
            onClick={() => {}}
          >
            Edit Draft
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

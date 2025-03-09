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

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Class } from "../../../types/class";

export const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const { backend } = useBackendContext();
  const navigate = useNavigate();
  useEffect(() => {
    backend
      .get("/classes")
      .then((classes) => {
        const filteredClasses = classes.data.filter(
          (currentClass: Class) => currentClass.isDraft === false
        );
        setClasses(filteredClasses as Class[]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [backend]);

  return (
    <VStack>
      {classes.map((currentClass) => {
        return ClassTeacherCard(currentClass, navigate);
      })}
    </VStack>
  );
};

// class is a keyword in js :(
function ClassTeacherCard(currentClass: Class, navigate: NavigateFunction) {
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
          {currentClass.title}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">{currentClass.date} </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">{currentClass.location}</Text>
          </HStack>

          <HStack>
            <FaUser size={14} />
            <Text fontSize="sm">
              {/* * rsvp count placeholder here, but not in sql table so nothing here for now */}
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
            onClick={() => navigate(`/dashboard/classes/${currentClass.id}`)}
          >
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

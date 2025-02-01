import React from "react";

import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";

import { useParams } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Class } from "../../../types/class";

function ClassInfoDashboard() {
  const { classId } = useParams();
  const { backend } = useBackendContext();
  const [currentClass, setcurrentClass] = React.useState<Class | undefined>();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await backend.get(`/classes/${classId}`);
        setcurrentClass(classesResponse.data[0]);
        console.log(classesResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend, classId]);
  return (
    <Box p={4}>
      <Heading
        as="h2"
        size="xl"
        mb={4}
      >
        Class Information
      </Heading>
      <VStack
        spacing={4}
        align="stretch"
      >
        <FormControl>
          <FormLabel>Class Title</FormLabel>
          <Input
            value={currentClass?.title || ""}
            isDisabled
            bg="gray.900"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            value={currentClass?.description || ""}
            isDisabled
            bg="gray.900"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Level</FormLabel>
          <Input
            value={currentClass?.level || ""}
            isDisabled
            bg="gray.900"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Input
            value={currentClass?.location || ""}
            isDisabled
            bg="gray.900"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Capacity</FormLabel>
          <Input
            value={currentClass?.capacity || ""}
            isDisabled
            bg="gray.900"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Costume</FormLabel>
          <Input
            value={currentClass?.costume || ""}
            isDisabled
            bg="gray.900"
          />
        </FormControl>
      </VStack>
    </Box>
  );
}
export default ClassInfoDashboard;

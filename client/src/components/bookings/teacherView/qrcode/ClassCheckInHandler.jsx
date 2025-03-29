import { useEffect, useState, useRef } from "react";

import { Box, Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";

import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../../contexts/hooks/useBackendContext";

export const ClassCheckInHandler = () => {
  const { id, date } = useParams();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const hasCheckedIn = useRef(false);

  useEffect(() => {
    const handleCheckIn = async () => {
      // check if user has checked in previously
      if (hasCheckedIn.currentUser) {
        return;
      }
      hasCheckedIn.currentUser = true;

      try {
        if (!currentUser?.uid) {
          const id = params.id;
          const date = params.date;

          // removed baseURL, was preventing the redirect to login from happening
          localStorage.setItem("qrcode_redirect", `/check-in/class/${id}/${date}`);
          // throw new Error("No user ID found");
          navigate("/login");
        }

        const studentResponse = await backend.get(
          `/students/firebase/${currentUser.uid}`
        );
        const studentId = studentResponse.data.id;

        // Format current date as YYYY-MM-DD
        const today = new Date().toISOString().split("T")[0];
        // console.log(decodeURIComponent(date));
        // Class-specific endpoint

        const currentCheckIn = await backend.get(
          `/class-enrollments/test`, {
            params: {
              student_id: studentId,
              class_id: id,
              attendance: new Date(decodeURIComponent(date)).toISOString().split("T")[0],
            }
          }
        );

        if (!currentCheckIn.data.exists) {
          await backend.post("/class-enrollments", {
            studentId: studentId,
            classId: id,
            attendance: new Date(decodeURIComponent(date)).toISOString().split("T")[0],
          });
        }

        const classResponse = await backend.get(`/classes/${id}`);
        setTitle(classResponse.data[0].title);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleCheckIn();
  }, [id, backend, currentUser]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">Error: {error}</Text>
      </Center>
    );
  }

  return (
    <Box
      h="100vh"
      bg="grey"
    >
      <VStack
        spacing={4}
        align="center"
        justify="center"
        h="full"
        p={4}
      >
        <Box
          bg="white"
          p={8}
          borderRadius="full"
          boxSize="200px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="4xl">✓</Text>
        </Box>
        <Text
          fontSize="2xl"
          fontWeight="bold"
        >
          You've checked in for
        </Text>
        <Text fontSize="xl">{title}</Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate("/bookings")}
          mt={4}
        >
          View My Bookings
        </Button>
      </VStack>
    </Box>
  );
};

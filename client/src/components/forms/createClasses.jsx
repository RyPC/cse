import { memo, useEffect, useMemo, useState } from "react";

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { calculateRecurringDates } from "../../utils/formatDateTime";
import SaveClass from "./modals/saveClass";
import SaveClassAsDraftModal from "./modals/saveClassAsDraft";

export const CreateClassForm = memo(
  ({ closeModal, modalData, reloadCallback }) => {
    const { backend } = useBackendContext();
    const [events, setEvents] = useState([]);
    const [tags, setTags] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(
      modalData?.teachers?.[0] ?? ""
    );

    const [title, setTitle] = useState(modalData?.title ?? "");
    const [location, setLocation] = useState(modalData?.location ?? "");
    const [date, setDate] = useState(
      modalData?.start_date ?? modalData?.date ?? ""
    );
    const [endDate, setEndDate] = useState(
      modalData?.end_date ?? modalData?.date ?? ""
    );
    const [recurrencePattern, setRecurrencePattern] = useState(
      modalData?.recurrence_pattern ?? "none"
    );
    const [startTime, setStartTime] = useState(modalData?.startTime ?? "");
    const [endTime, setEndTime] = useState(modalData?.endTime ?? "");
    const [description, setDescription] = useState(
      modalData?.description ?? ""
    );
    const [capacity, setCapacity] = useState(modalData?.capacity ?? 0);
    const [level, setLevel] = useState(modalData?.level ?? "beginner");
    const [classType, setClassType] = useState(modalData?.classType ?? "1");
    const [performance, setPerformance] = useState(
      modalData?.performance ?? -1
    );

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
      isOpen: isConfirmationOpen,
      onOpen: onConfirmationOpen,
      onClose: onConfirmationClose,
    } = useDisclosure();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDraft, setIsDraft] = useState(false);

    const postClass = async () => {
      const classDates = calculateRecurringDates(
        date,
        endDate,
        recurrencePattern
      );

      

      const baseClassBody = {
        location: location ?? "",
        description: description ?? "",
        level: level ?? "",
        capacity: capacity === "" ? 0 : capacity,
        classType: classType ?? "",
        performance: performance ?? "",
        isDraft,
        title: title ?? "",
        is_recurring: recurrencePattern !== "none",
        recurrence_pattern: recurrencePattern,
        start_date: date,
        end_date: recurrencePattern !== "none" ? endDate : date,
        instructor: selectedInstructor

      };

      if (modalData) {
        // Update class information
        await backend
          .put("/classes/" + modalData.classId, {
            ...baseClassBody,
            is_recurring: recurrencePattern !== "none",
          })
          .catch((error) => console.log(error));
        
        // Add teacher to classes-taught on form post
        await backend
          .post(`/classes-taught/${modalData.classId}/${selectedInstructor.id}`, {
          })
          .then((response) =>
            console.log(`Added teacher to classes-taught ${response}`))
          .catch((error) => console.log(error));

        // For recurring classes, delete all existing scheduled classes and create new ones
        if (
          recurrencePattern !== "none" ||
          modalData.recurrence_pattern !== "none"
        ) {
          try {
            // First, delete all existing scheduled classes
            await backend
              .delete(`/scheduled-classes/${modalData.classId}`)
              .then((response) =>
                console.log("Deleted old scheduled classes:", response)
              )
              .catch((error) =>
                console.log("Error deleting scheduled classes:", error)
              );

            // Then create new scheduled classes for each date in the pattern
            for (const classDate of classDates) {
              if (classDate && startTime && endTime) {
                const scheduledClassBody = {
                  class_id: modalData.classId,
                  date: classDate,
                  start_time: startTime,
                  end_time: endTime,
                };
                await backend
                  .post("/scheduled-classes", scheduledClassBody)
                  .then((response) =>
                    console.log("Created scheduled class:", response)
                  )
                  .catch((error) =>
                    console.log("Error creating scheduled class:", error)
                  );
              }
            }
          } catch (error) {
            console.error("Error updating recurring classes:", error);
          }
        } else {
          // For non-recurring classes, just update the single scheduled class
          if (date && startTime && endTime) {
            const scheduledClassBody = {
              class_id: modalData.classId,
              date,
              start_time: startTime,
              end_time: endTime,
            };
            await backend
              .post("/scheduled-classes", scheduledClassBody)
              .then((response) =>
                console.log("Scheduled class updated:", response)
              )
              .catch((error) =>
                console.log("Error updating scheduled class:", error)
              );
          }
        }

        if (classType !== "") {
          await backend
            .post("/class-tags", {
              classId: modalData.classId,
              tagId: classType,
            })
            .then((response) => console.log(response))
            .catch((err) => {
              console.error(err);
            });
        }
      } else {
        const createdClassIds = [];
        const classBody = {
          ...baseClassBody,
          date: date,
        };
        const response = await backend.post("/classes", classBody);
        console.log("Class created:", response);
        const classId = response?.data[0]?.id;

        for (const classDate of classDates) {
          try {
            // const response = await backend.post("/classes", classBody);
            // console.log("Class created:", response);
            // const classId = response?.data[0]?.id;

            if (classId) {
              createdClassIds.push(classId);

              if (classDate && startTime && endTime) {
                const scheduledClassBody = {
                  class_id: classId,
                  date: classDate,
                  start_time: startTime,
                  end_time: endTime,
                };
                await backend.post("/scheduled-classes", scheduledClassBody);
              }

              if (classType !== "") {
                await backend.post("/class-tags", {
                  classId: classId,
                  tagId: classType,
                });
              }
            }
          } catch (error) {
            console.error("Error creating class:", error);
          }
        }

        console.log(`Created ${createdClassIds.length} classes for the series`);
      }

      setIsSubmitted(true);
      onConfirmationClose();
      onClose();
      reloadCallback();
    };

    useMemo(() => {
      if (backend) {
        backend.get("/events").then((response) => {
          setEvents(response.data);
        });
        backend.get("/tags").then((response) => {
          setTags(response.data);
        });
        backend.get("/teachers/activated").then((response) => {
          setTeachers(response.data);
        });
      }
    }, [backend]);

    useEffect(() => {
      if (recurrencePattern !== "none" && endDate && date) {
        if (new Date(endDate) < new Date(date)) {
          setEndDate(date);
        }
      }
    }, [date, endDate, recurrencePattern]);

    // Ensure end date is set to start date when selecting "none" recurrence pattern
    useEffect(() => {
      if (recurrencePattern === "none") {
        setEndDate(date);
      }
    }, [recurrencePattern, date]);

    return (
      <Container>
        <Text
          fontSize="2xl"
          textAlign="center"
          mb={4}
        >
          {!isSubmitted
            ? modalData
              ? "Edit Class"
              : "New Class"
            : `${title} ${isDraft ? "Draft" : "Published"}`}
        </Text>
        {!isSubmitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConfirmationOpen();
            }}
          >
            <FormControl>
              <FormLabel>Class Title</FormLabel>
              <Input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                bg="white"
                color="black"
              />
            </FormControl>

            <HStack
              mt={4}
              align="flex-start"
            >
              <FormControl width={"50%"}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  bg="white"
                  color="black"
                />
              </FormControl>

              <FormControl width={"50%"}>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  required={recurrencePattern !== "none"}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={date}
                  isDisabled={recurrencePattern === "none"}
                  opacity={recurrencePattern === "none" ? 0.4 : 1}
                  bg="white"
                  color="black"
                />
              </FormControl>
            </HStack>

            <FormControl mt={4}>
              <FormLabel>Recurrence Pattern</FormLabel>
              <Select
                value={recurrencePattern}
                onChange={(e) => setRecurrencePattern(e.target.value)}
                bg="white"
                color="black"
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option value="none">None</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </FormControl>

            <HStack
              mt={4}
              align="flex-start"
            >
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  bg="white"
                  color="black"
                />
              </FormControl>

              <FormControl>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  bg="white"
                  color="black"
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Instructor</FormLabel>
              <Select
                placeholder="Select an instructor"
                required
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                bg="white"
                color="black"
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}

                  </option>
                ))}
              </Select>

            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                bg="white"
                color="black"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Capacity</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  bg="white"
                  color="black"
                />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Level</FormLabel>
              <Select
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                bg="white"
                color="black"
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Performance</FormLabel>
              <Select
                required
                value={performance}
                onChange={(e) => setPerformance(e.target.value)}
                bg="white"
                color="black"
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                <option
                  key={null}
                  value={null}
                >
                  No Performance Required
                </option>
                {events
                  ? events.map((evt, ind) => (
                      <option
                        key={ind}
                        value={evt.id}
                      >
                        {evt.title}
                      </option>
                    ))
                  : null}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Class Type</FormLabel>
              <Select
                required
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                bg="white"
                color="black"
                sx={{
                  "& option": {
                    bg: "white",
                    color: "black",
                  },
                }}
              >
                {tags
                  ? tags.map((tag, ind) => (
                      <option
                        key={ind}
                        value={tag.id}
                      >
                        {tag.tag}
                      </option>
                    ))
                  : null}
              </Select>
            </FormControl>

            <Stack
              direction="row"
              justifyContent="center"
              mt={4}
            >
              {((!isSubmitted && !modalData) || modalData?.isDraft) && (
                <Button
                  onClick={() => {
                    onOpen();
                    setIsDraft(true);
                  }}
                  bg="#D8BFD8"
                  color="black"
                  border="1px solid black"
                  _hover={{ bg: "#C8A9C8" }}
                >
                  Save as Draft
                </Button>
              )}
              <Button
                type="submit"
                bg="#663399"
                color="white"
                border="1px solid black"
                _hover={{ bg: "#5D2E8C" }}
              >
                Publish
              </Button>
            </Stack>
          </form>
        ) : (
          <VStack>
            <IoIosCheckmarkCircle size={100} />
            <Heading
              as="h3"
              size="xl"
            >
              {isDraft ? "Draft" : "Class"}{" "}
              {modalData ? "Updated" : "Submitted"}!
            </Heading>{" "}
            <br />
            <Button
              colorScheme="blue"
              onClick={closeModal}
            >
              Return to Classes Page
            </Button>
          </VStack>
        )}

        <SaveClassAsDraftModal
          isOpen={isOpen}
          onClose={onClose}
          postClass={postClass}
        />
        <SaveClass
          isOpen={isConfirmationOpen}
          onClose={onConfirmationClose}
          postClass={postClass}
        />
      </Container>
    );
  }
);

export default CreateClassForm;

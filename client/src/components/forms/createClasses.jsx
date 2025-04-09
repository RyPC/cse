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
import SaveClass from "./modals/saveClass";
import SaveClassAsDraftModal from "./modals/saveClassAsDraft";

export const CreateClassForm = memo(
  ({ closeModal, modalData, reloadCallback }) => {
    const { backend } = useBackendContext();
    const [events, setEvents] = useState([]);
    const [tags, setTags] = useState([]);

    const [title, setTitle] = useState(modalData?.title ?? "");
    const [location, setLocation] = useState(modalData?.location ?? "");
    const [date, setDate] = useState(modalData?.date ?? "");
    const [endDate, setEndDate] = useState(""); // End date for recurring classes
    const [recurrencePattern, setRecurrencePattern] = useState("none"); // none or weekly
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

    // Function to calculate dates for recurring classes
    const calculateRecurringDates = (startDate, endDate, pattern) => {
      if (pattern !== "weekly" || !startDate || !endDate) {
        return [startDate]; // Return only start date if not recurring
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const dates = [];

      const currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split("T")[0]);
        // Add 7 days for weekly pattern
        currentDate.setDate(currentDate.getDate() + 7);
      }

      return dates;
    };

    const postClass = async () => {
      // Calculate recurring dates if weekly is selected
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
        isRecurring: recurrencePattern !== "none",
        recurrencePattern: recurrencePattern,
      };

      // Handle editing a single class
      if (modalData) {
        await backend
          .put("/classes/" + modalData.classId, {
            ...baseClassBody,
            date: date ?? new Date(),
            startTime: startTime ?? "",
            endTime: endTime ?? "",
          })
          .catch((error) => console.log(error));

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
        // Creating new class(es)
        const createdClassIds = [];

        // Create a class for each date in the recurring series
        for (const classDate of classDates) {
          const classBody = {
            ...baseClassBody,
            date: classDate,
            startTime: startTime ?? "",
            endTime: endTime ?? "",
          };

          try {
            const response = await backend.post("/classes", classBody);
            console.log("Class created:", response);
            const classId = response?.data[0]?.id;

            if (classId) {
              createdClassIds.push(classId);

              // Add scheduled class
              if (classDate && startTime && endTime) {
                const scheduledClassBody = {
                  class_id: classId,
                  date: classDate,
                  start_time: startTime,
                  end_time: endTime,
                };
                await backend.post("/scheduled-classes", scheduledClassBody);
              }

              // Add class tag
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
      }
    }, [backend]);

    const isEditingDraft = modalData && modalData.isDraft;

    // Handle date change validation
    useEffect(() => {
      if (recurrencePattern !== "none" && endDate && date) {
        // Check if end date is after start date
        if (new Date(endDate) < new Date(date)) {
          setEndDate(date);
        }
      }
    }, [date, endDate, recurrencePattern]);

    return (
      <Container>
        <Text
          fontSize="2xl"
          textAlign="center"
          mb={4}
        >
          {!isSubmitted
            ? modalData
              ? // if it is not submitted, and coming from a draft, then it is an edit, else it is a new class, else it is a published class
                "Edit Class"
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
              />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Recurrence Pattern</FormLabel>
              <RadioGroup
                value={recurrencePattern}
                onChange={setRecurrencePattern}
              >
                <HStack spacing={4}>
                  <Radio value="none">None</Radio>
                  <Radio value="weekly">Weekly</Radio>
                </HStack>
              </RadioGroup>
              <FormHelperText>
                {recurrencePattern === "weekly"
                  ? "Classes will be created weekly starting from the Start Date"
                  : "A single class will be created on the Start Date"}
              </FormHelperText>
            </FormControl>

            {recurrencePattern !== "none" && (
              <FormControl mt={4}>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={date} // Can't be before start date
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Capacity</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Level</FormLabel>
              <Select
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
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
              {/* wasnt a draft then show the button to save as draft */}
              {((!isSubmitted && !modalData) || modalData?.isDraft) && (
                <Button
                  onClick={() => {
                    onOpen();
                    setIsDraft(true);
                  }}
                >
                  Save as Draft
                </Button>
              )}
              <Button
                colorScheme="blue"
                type="submit"
              >
                {/* publish either way */}
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

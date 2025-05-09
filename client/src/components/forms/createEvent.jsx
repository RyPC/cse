import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const CreateEvent = ({
  event = null,
  eventId = null,
  onClose,
  triggerRefresh,
}) => {
  const [formData, setFormData] = useState({
    location: "",
    title: "",
    description: "",
    level: "",
    tag: "",
    date: "",
    startTime: "",
    endTime: "",
    callTime: "",
    costume: "",
    capacity: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // initial state should be changed
  const [tags, setTags] = useState({});
  // const [currentTag, setCurrentTag] = useState("Select Tag");
  const { backend } = useBackendContext();

  useEffect(() => {
    if (event) {
      setFormData({
        location: event.location || "",
        title: event.title || "",
        description: event.description || "",
        level: event.level || "",
        date: event.date || "",
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        callTime: event.callTime || "",
        costume: event.costume || "",
        capacity: event.capacity || event.capacity === 0 ? event.capacity : "",
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.level) newErrors.level = "Level is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (!formData.callTime) newErrors.callTime = "Call time is required";
    if (!formData.costume)
      newErrors.costume = "Costume information is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // add in call to events router here!
  const handleSubmit = async (isDraft) => {
    if (!isDraft || !validateForm()) return;
    setIsSubmitting(true);
    try {
      // Convert form data to match API expectations
      const eventData = {
        ...formData,
        level: formData.level === "" ? "beginner" : formData.level,
        tag:
          formData.tag === "Select Tag"
            ? ""
            : formData.tag[0].toLowerCase() + formData.tag.slice(1),
        date: formData.date === "" ? new Date() : formData.date,
        start_time:
          formData.startTime === ""
            ? `${new Date().getHours()}:${new Date().getMinutes()}`
            : formData.startTime,
        end_time:
          formData.endTime === ""
            ? `${new Date().getHours()}:${new Date().getMinutes()}`
            : formData.endTime,
        call_time:
          formData.callTime === ""
            ? `${new Date().getHours()}:${new Date().getMinutes()}`
            : formData.callTime,
        capacity:
          formData.capacity === "" &&
          (parseInt(formData.capacity) < 0 ||
            parseInt(formData.capacity) > Number.MAX_SAFE_INTEGER)
            ? 0
            : formData.capacity,
        is_draft: isDraft,
      };

      console.log(eventData);

      // Using axios instead of fetch
      let response;
      // let tagResponse;
      if (eventId) {
        // Edit event (PUT request)
        response = await backend.put(`/events/${eventId}/`, eventData);
      } else {
        // Create new event (POST request)
        if (eventData.tag !== "") {
          const tagId = await backend.get(`/tags/${eventData.tag}`);
          response = await backend.post("/events/", eventData);
          response = await backend.post("/event-tags/", {
            eventId: response.data[0].id,
            tagId: tagId.data[0].id,
          });
        } else {
          response = await backend.post("/events/", eventData);
        }
      }

      console.log("response", response.status, response?.data[0]);

      if (response?.status === 201 || response?.status === 200) {
        // Reset form or handle success
        setFormData({
          location: "",
          title: "",
          description: "",
          level: "",
          tag: "",
          date: "",
          startTime: "",
          endTime: "",
          callTime: "",
          costume: "",
          capacity: "",
        });
        if (onClose) onClose();
        if (triggerRefresh) triggerRefresh();
      } else {
        console.error("Failed to create/save event:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to create/save event, error:", error);
    } finally {
      if (triggerRefresh) triggerRefresh();
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchTags = async () => {
    try {
      const tagsResponse = await backend.get("/tags");
      // const initialTagFilter = {};
      const initialTags = {};
      tagsResponse.data.forEach((tag) => {
        // initialTagFilter[tag.id] = false;
        initialTags[tag.id] =
          tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1).toLowerCase();
      });

      // setTagFilter(initialTagFilter);
      setTags(initialTags);
      console.log(initialTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <VStack
      spacing={4}
      align="stretch"
    >
      {!eventId ? <Text></Text> : ""}
      <Box>
        <Text>Event Title</Text>
        <Input
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={errors.title}
        />
        {errors.title && <Text color="red.500">{errors.title}</Text>}
      </Box>

      <Box>
        <Text>Location</Text>
        <Input
          name="location"
          value={formData.location}
          onChange={handleChange}
          isInvalid={errors.location}
        />
        {errors.location && <Text color="red.500">{errors.location}</Text>}
      </Box>

      <Box>
        <Text>Level</Text>
        <Select
          name="level"
          value={formData.level}
          onChange={handleChange}
          isInvalid={errors.level}
        >
          <option value="">Select Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
        {errors.level && <Text color="red.500">{errors.level}</Text>}
      </Box>

      <Box>
        <Text>Tags</Text>
        <Select
          name="tag"
          value={formData.tag}
          // onChange={handleOnChange}
          onChange={handleChange}
          // isInvalid={errors.level}
        >
          <option value="Select Tag">Select Tag</option>
          {Object.values(tags).map((option) => {
            return <option value={option}>{option}</option>;
          })}
        </Select>
        {/* {errors.level && <Text color="red.500">{errors.level}</Text>} */}
      </Box>

      <Box>
        <Text>Date</Text>
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          isInvalid={errors.date}
        />
        {errors.date && <Text color="red.500">{errors.date}</Text>}
      </Box>

      <Box>
        <Text>Start Time</Text>
        <Input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          isInvalid={errors.startTime}
        />
        {errors.startTime && <Text color="red.500">{errors.startTime}</Text>}
      </Box>

      <Box>
        <Text>End Time</Text>
        <Input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          isInvalid={errors.endTime}
        />
        {errors.endTime && <Text color="red.500">{errors.endTime}</Text>}
      </Box>

      <Box>
        <Text>Call Time</Text>
        <Input
          type="time"
          name="callTime"
          value={formData.callTime}
          onChange={handleChange}
          isInvalid={errors.callTime}
        />
        {errors.callTime && <Text color="red.500">{errors.callTime}</Text>}
      </Box>

      <Box>
        <Text>Description</Text>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={errors.description}
        />
        {errors.description && (
          <Text color="red.500">{errors.description}</Text>
        )}
      </Box>

      <Box>
        <Text>Capacity</Text>
        <Input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
        />
      </Box>

      <Box>
        <Text>Costume</Text>
        <Textarea
          name="costume"
          value={formData.costume}
          onChange={handleChange}
          isInvalid={errors.costume}
        />
        {errors.costume && <Text color="red.500">{errors.costume}</Text>}
      </Box>
      <Flex
        justifyContent="center"
        w="100%"
        gap={3}
      >
        <Button
          onClick={() => handleSubmit(true)} // true = save draft
          isLoading={isSubmitting}
          flex="1"
        >
          Save Draft
        </Button>
        <Button
          onClick={() => handleSubmit(false)} // false = publish
          isLoading={isSubmitting}
          bg="#422E8D"
          color="white"
          flex="1"
        >
          Publish
        </Button>
      </Flex>
    </VStack>
  );
};

export default CreateEvent;

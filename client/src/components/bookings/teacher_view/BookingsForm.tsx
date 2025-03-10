import { Box, VStack, HStack, FormControl, FormLabel, Input, NumberInput, NumberInputField, NumberInputStepped, NumberIncrementStepper, NumberDecrementStepper, useDisclosure } from "@chakra-ui/react";
import { Booking, IsClass, Level } from '../../../types/booking'

const handleFormChange = (updateCallback) => {
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    updateCallback((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }
}

// TODO: Figure out validation with required
export const BookingForm = (booking: Booking, updateCallback, formData) => {
  const handleChange = handleFormChange(updateCallback)
  return (
    <Box maxWidth="600px" margin="auto" padding="4" borderRadius="md" boxShadow="lg" bg="white">
        <VStack spacing="4" align="stretch">
          {/* Title */}
          <FormControl id="title">
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </FormControl>

          {/* Description */}
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </FormControl>

          {/* Location */}
          <FormControl id="location">
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </FormControl>

          {/* Level */}
          <FormControl id="level">
            <FormLabel>Level</FormLabel>
            <Select
                required
                value={formData.level}
                onChange={handleChange}
            >
                <option value={Level.beginner}>Beginner</option>
                <option value={Level.intermediate}>Intermediate</option>
                <option value={Level.advanced}>Advanced</option>
            </Select>
          </FormControl>

          {/* Date */}
          <FormControl id="date">
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </FormControl>

          {/* Start Time */}
          <FormControl id="start_time">
            <FormLabel>Start Time</FormLabel>
            <Input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
            />
          </FormControl>

          {/* End Time */}
          <FormControl id="end_time">
            <FormLabel>End Time</FormLabel>
            <Input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
            />
          </FormControl>
       </VStack>
    </Box>
  );
};

export const ClassForm = (updateCallback, performanceCallback, events, formData) => {
  const handleChange = handleFormChange(updateCallback)
  const handlePerformance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    performanceCallback(value)
  }
  return (
    <Box maxWidth="600px" margin="auto" padding="4" borderRadius="md" boxShadow="lg" bg="white">
        <VStack spacing="4" align="stretch">
          {/* Capacity */}
          <FormControl id="classType">
            <FormLabel>Capacity</FormLabel>
            <NumberInput value={formData.capacity} onChange={handleChange} min={0} max={100} step={1}>
               <NumberInputField />
               <NumberInputStepper>
                 <NumberIncrementStepper />
                 <NumberDecrementStepper />
               </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* Class Type */}
          <FormControl id="class_type">
            <FormLabel>Class Type</FormLabel>
            <Input
              type="text"
              name="class_type"
              value={formData.class_type}
              onChange={handleChange}
            />
          </FormControl>

          {/* Performance: NOTE: strongly consider adding to DB, only hacky part imo */}
          <FormControl id="performance">
            <FormLabel>Performance</FormLabel>
            <Select
                required
                value={-1}
                name="performance"
                onChange={handlePerformance}
            >
                <option value={-1}>No Event Corequisite</option>
                {
                    events.map(
                        (evt, ind) => 
                        ( <option key={ind} value={evt.id}>evt.title</option> )
                    )
                }
            </Select>
          </FormControl>
        </VStack>
    </Box>
  )
}

export const EventForm = (updateCallback, formData) => {
  const handleChange = handleFormChange(updateCallback)
  return (
    <Box maxWidth="600px" margin="auto" padding="4" borderRadius="md" boxShadow="lg" bg="white">
        <VStack spacing="4" align="stretch">
          {/* Call Time */}
          <FormControl id="call_time">
            <FormLabel>Class Time</FormLabel>
            <Input
              type="text"
              name="call_time"
              value={formData.call_time}
              onChange={handleChange}
            />
          </FormControl>
        </VStack>
    </Box>
  )
}

/* 
 * <modal>
 *      <common_shit>
 *          <input type="date"... />
 *          ...
 *      </common_shit>
 *      <subbooking_specific_shit>
 *      <>
 * </modal>
 *
 * is_draft => edit shit
 *
 * submit_function(is_draft, save_as_draft), how to PUT it */

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
const BookingForm = (booking: Booking, updateCallback) => {
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
                <option value=Level.beginner>Beginner</option>
                <option value=Level.intermediate>Intermediate</option>
                <option value=Level.advanced>Advanced</option>
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

const ClassForm = (updateCallback) {
  const handleChange = handleFormChange(updateCallback)
}

const EventForm = (updateCallback) {
  const handleChange = handleFormChange(updateCallback)

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

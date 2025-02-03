import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Container,
  Textarea,
  Select,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

import { useState } from 'react';

import axios from 'axios';



export const Playground = () => {

  const sendAjax = e => {

    axios.post('http://localhost:3001/classes/', {
      location: location,
      date: date,
      description: description,
      level: level,
      capacity: capacity,
      costume: performances, // Need to confirm the equivalence between the two fields here
      isDraft: false,
      title: title
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    setIsSubmitted(true);
  
  }

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [level, setLevel] = useState('beginner');
  const [performances, setPerformances] = useState('');

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    
    <Container>
    {!isSubmitted ? (
      <form onSubmit={sendAjax}>

      <FormControl>
      <FormLabel>Title</FormLabel>
              <Input 
                type='text' 
                required 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
      </FormControl>

        
        <Stack direction="horizontal">

          <FormControl>
              <FormLabel>Location</FormLabel>
              <Input 
                type='text' 
                required 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
          </FormControl>

          <FormControl>
              <FormLabel>Date</FormLabel>
              <Input 
                type='date' 
                required 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
          </FormControl>

        </Stack>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Textarea>
        </FormControl>

        <Stack direction="horizontal">
          <FormControl>
            <FormLabel>Capacity</FormLabel>
            <NumberInput defaultValue={15} min={10} max={20}>
              <NumberInputField 
               required 
               value={capacity}
               onChange={(e) => setCapacity(e.target.value)}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
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
        </Stack>

        <FormControl>
          <FormLabel>Performances</FormLabel>
          <Input type='text' 
            required 
            value={performances}
            onChange={(e) => setPerformances(e.target.value)}
          />
        </FormControl>

        <br />

        <>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                fjasfdsafdsa
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant='blue'>Save as Draft</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>

        <Stack direction="horizontal" float={"right"}>
            <Button onClick={onOpen}>Save as Draft</Button>
            <Button colorScheme='blue' type="submit">Publish</Button>
        </Stack>
      </form>

    ) : (
      <div>Form submitted</div>
    )}
    
    </Container>

  )

}

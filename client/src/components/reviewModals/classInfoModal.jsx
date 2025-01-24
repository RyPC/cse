import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Stack, Text, Badge, Box, Icon } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { TbCapsuleHorizontal } from "react-icons/tb";

const ClassInfoModal = (props) => {
  const { title, description, location, capacity, level, costume } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renderDifficultyMeter = (level) => {
    const levels = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };
    const numPebbles = levels[level] || 0;
    return (
      <Stack direction="row" spacing={2}>
        {[...Array(3)].map((_, index) => (
          <Icon
            key={index}
            as={TbCapsuleHorizontal}
            color={index < numPebbles ? ['green.500', 'yellow.500', 'red.500'][numPebbles-1] : 'gray.300'}
            boxSize={6}
          />
        ))}
      </Stack>
    );
  };

  return (
    <>
      <Button onClick={onOpen}>Open Class Info Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {title}
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <Box p={5}>
              <Text fontSize="md" color="gray.600" mb={4}>
                {description}
              </Text>

              <Box mb={4}>
                <Text fontSize="sm" color="gray.500" mb={2}>
                  <strong>Difficulty:</strong>
                </Text>
                {renderDifficultyMeter(level)}
              </Box>

              <Stack direction="column" spacing={3}>
                <Text fontSize="sm" color="gray.500">
                  <strong>Location:</strong> {location}
                </Text>

                <Text fontSize="sm" color="gray.500">
                  <strong>Capacity:</strong> {capacity}
                </Text>

                <Text fontSize="sm" color="gray.500">
                  <strong>Level:</strong>{' '}
                  <Badge colorScheme={
                      level === 'beginner' ? 'green' :
                      level === 'intermediate' ? 'yellow' :
                      'red'}
                  >
                    {level}
                  </Badge>
                </Text>

                <Text fontSize="sm" color="gray.500">
                  <strong>Costume:</strong> {costume}
                </Text>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button mr={3}>Add Review</Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClassInfoModal;


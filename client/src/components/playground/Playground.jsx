import { useState } from "react";

import { Button, Box, useDisclosure, Heading, VStack, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Input, FormControl, Card, CardBody, CardFooter, Image, Divider, Tag, Text} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

const UploadComponent = () => {

  const { backend } = useBackendContext();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fetchS3URL = async () => {
    try {
      const URLResponse = await backend.get('/s3/url');
      console.log(URLResponse);
      return URLResponse.data.url;
    } catch (error) {
      console.error('Error fetching S3 URL:', error);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage("Please select file to upload");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");

    try {
      // Get S3 URL from server backend
      const url = await fetchS3URL();

      // Upload file to S3 bucket
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (uploadResponse.ok) {
        setMessage("File uploaded successfully!");
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box mt={4}>
      <Text fontWeight="bold">Upload a File</Text>
      <Input type="file" onChange={handleFileChange} mt={2} />
      <Button onClick={uploadFile} isDisabled={uploading} mt={2}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
      {message && <Text mt={2} color="green.500">{message}</Text>}
    </Box>
  );
};


const SelectMediaModal = ({ isOpen, onClose, setCurrentModal }) => {
  const onPhoto = () => {
    setCurrentModal("upload-photo");
  };

  const onLink = () => {
    setCurrentModal("upload-link");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Media</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button onClick={onPhoto}>
            Photo
          </Button>
          <Button onClick={onLink}>
            Link
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


const UploadFileModal = ({ isOpen, onClose, setCurrentModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Upload File</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <UploadComponent />
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='red' mr={3}>
          Next
        </Button>
        <Button colorScheme='blue' mr={3}>
          Go back
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

const UploadLinkModal = ({ isOpen, onClose, setCurrentModal, link, setLink }) => {

  const isValidURL = string => {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };

  const onGoBack = () => {
    setCurrentModal("select-media")
  }

  const onConfirm = () => {
    if (link.length == 0 || !isValidURL(link)) {
      alert("Please type a valid link")
    } else {
      setCurrentModal("select-tag")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl>
              <Input value={link}
              onChange={(e) => setLink(e.target.value)}/>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onConfirm}>
            Next
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onGoBack}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const SelectTagModal = ({ isOpen, onClose, setCurrentModal, tags, setTags }) => {

  const onGoBack = () => {
    setCurrentModal("select-media")
  }

  const onConfirm = () => {
    setCurrentModal("title")
  }

  const addTag = (value) => {
    setTags(tags.concat([value]))
  }

  const removeTag = (value) => {
    setTags(tags.filter(item => item !== value))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Tag Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button 
          colorScheme={tags.includes("ballet") ? "teal" : "blue"}
          onClick={() => {
            if (tags.includes("ballet")) {
              removeTag("ballet")
            } else {
              addTag("ballet")
            }
          }}
          >
            Ballet
          </Button>
          <Button 
          colorScheme={tags.includes("classical") ? "teal" : "blue"}
          onClick={() => {
            if (tags.includes("classical")) {
              removeTag("classical")
            } else {
              addTag("classical")
            }}
          }
          >
            Classical
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onConfirm}>
            Confirm
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onGoBack}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const TitleModal = ({ isOpen, onClose, setCurrentModal, title, setTitle }) => {
  const onGoBack = () => {
    setCurrentModal("select-tag")
  }

  const onConfirm = () => {
    setCurrentModal("card")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl>
              <Input value={title}
              onChange={(e) => {
                if (e.target.value.length == 0) {
                  alert("Title cannot be empty")
                } else {
                  setTitle(e.target.value)
                }
              }}/>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onConfirm}>
            Next
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onGoBack}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


const CardModal = ({ isOpen, onClose, setCurrentModal, title, tags, link, ajax }) => {
  const onGoBack = () => {
    setCurrentModal("title")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Is everything correct?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card maxW='sm'>
            <CardBody>
              <Image
                src={link}
                alt='Green double couch with wooden legs'
                borderRadius='lg'
              />
              <Heading>{title}</Heading>
            </CardBody>
            <Divider />
            <CardFooter>
              {tags.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </CardFooter>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={ajax}>
            Confirm
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onGoBack}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}


export const Playground = () => {

  const { backend } = useBackendContext();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("select-media");
  const [ tags, setTags ] = useState([]);
  const [ link, setLink ] = useState('');
  const [ title, setTitle ] = useState('')

  const onCloseModal = () => {
    setCurrentModal("select-media");
    onClose();
  };


  const ajax = async () => {
    await backend
      .post("/classes-videos", {
        title: title,
        s3Url: "https://aws.com", // TODO: Need to obtain the actual S3 Url
        description : "",
        mediaUrl: link,
        classId: 1 // TODO: Need to find the actual class id
        // TODO: what to do with tags? 
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Resource Flows for Teacher</Heading>


      <Button onClick={onOpen}>
        Initiate
      </Button>
      </VStack>
      {
        currentModal === "select-media" ?
          <SelectMediaModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} /> :
        (currentModal === "upload-link" ?
          <UploadLinkModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} link={link} setLink={setLink}/> :
        (currentModal === "select-tag" ?
          <SelectTagModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} tags={tags} setTags={setTags}/> :
        (currentModal === "title" ? 
          <TitleModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} setTitle={setTitle}/> :
        (currentModal === "card" ?
          <CardModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} tags={tags} link={link} ajax={ajax}/>:
        (currentModal === "upload-photo" ? 
          <UploadFileModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} /> :
          <CancelModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} />
        ) 
        )
        )
        )
        )
      }
    </Box>

  );
};

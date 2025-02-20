import { useState } from "react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useEffect } from "react";

import { Button, Box, useDisclosure, Heading, VStack , Select} from "@chakra-ui/react";

import { CardModal } from "./CardModal"
import { SelectMediaModal } from "./SelectMediaModal"
import { SelectTagModal } from "./SelectTagModal";
import { TitleModal } from "./TitleModal";
import { UploadFileModal } from "./UploadFileModal";
import { UploadLinkModal } from "./UploadLinkModal";



export const ControllerModal = () => {

  const { backend } = useBackendContext();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("select-media");
  const [ tags, setTags ] = useState([]);
  const [ link, setLink ] = useState('');
  const [ title, setTitle ] = useState('')
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);

  const onCloseModal = () => {
    setCurrentModal("select-media");
    onClose();
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await backend.get("/classes");
        const formattedClasses = response.data.map(cls => ({
          id: cls.id,
          name: cls.title, // Using title for dropdown display
        }));
  
        setClasses(formattedClasses); 
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [backend]);


  const ajax = async () => {
    if (link.includes("youtu.be") || link.includes("youtube")) {
      await backend
      .post("/classes-videos", {
        title: title,
        s3Url: "https://aws.com", // TODO: Need to obtain the actual S3 Url
        description : "TODO",
        mediaUrl: link,
        classId: classId  // added classId, will change the look base on design
        // TODO: what to do with tags? 
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    } else {
      await backend
        .post("/articles", {
          s3_url: "https://aws.com",
          description: title,
          media_url: link
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error))
    }
    
  }

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Resource Flows for Teacher</Heading>


        <Select placeholder="Select a class" value={classId} onChange={(e) => setClassId(e.target.value)}>
        {classes.length > 0 ? (
          classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.id} {/* Display title */}
            </option>
          ))
        ) : (
          <option disabled>No classes available</option>
        )}
      </Select>


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

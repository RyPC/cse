import { useState } from "react";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";

import { Button, Box, useDisclosure, Heading, VStack , Select} from "@chakra-ui/react";

import { CardModal } from "./CardModal"
import { SelectMediaModal } from "./SelectMediaModal"
import { SelectTagModal } from "./SelectTagModal";
import { TitleModal } from "./TitleModal";
import { UploadFileModal } from "./UploadFileModal";
import { UploadLinkModal } from "./UploadLinkModal";
import { SelectClassModal } from "./SelectClassModal";



export const ControllerModal = () => {

  const { backend } = useBackendContext();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("select-class");
  const [ tags, setTags ] = useState([])
  const [ link, setLink ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ s3URL, setS3URL ] = useState('')
  const [ clsId, setClsId ] = useState('')

  const onCloseModal = () => {
    setCurrentModal("select-class");
    onClose();
  };


  const ajax = async () => {
    if (link.includes("youtu.be") || link.includes("youtube")) {
      await backend
      .post("/classes-videos", {
        title: title,
        s3Url: "https://aws.com", // TODO: Need to obtain the actual S3 Url
        description : "TODO",
        mediaUrl: link,
        classId: clsId  // added classId, will change the look base on design
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

  const renderModal = () => {
    if (currentModal == "select-media") {
      return <SelectMediaModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} />
    } else if (currentModal == "upload-link") {
      return <UploadLinkModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} link={link} setLink={setLink}/>
    } else if (currentModal == "select-tag") {
      return <SelectTagModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} tags={tags} setTags={setTags}/>
    } else if (currentModal == "title") {
      return <TitleModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} setTitle={setTitle}/>
    } else if (currentModal == "card") {
      return <CardModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} title={title} tags={tags} link={link} ajax={ajax}/>
    } else if (currentModal == "upload-photo") {
      return <UploadFileModal isOpen={isOpen} onClose={onCloseModal} setS3URL={setS3URL} />
    } else if (currentModal == "select-class") {
      return <SelectClassModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} setClsId={setClsId} />
    }
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
      {renderModal()}
    </Box>

  );
};

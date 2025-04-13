import { Button, Flex, Text, Box, IconButton, Badge, Input} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { NewsCard } from "./NewsCard";
import { UploadComponent } from "./UploadComponent";
import { ControllerModal } from "./ResourceFlow/ResourceFlowController";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";


export const Resources = () => {

  const { backend } = useBackendContext();
  const [searchInput, setSearchInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const {role} = useAuthContext();

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleVideoButton = () => {
    console.log('Videos button has been pressed!');
    console.log(videos);
  };

  const handleNewsButton = () => {
    console.log('News button has been pressed!');
    console.log(articles);
  };
  const handleAddButtonClick = () => {
    console.log('Add button clicked!');

    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
    }, 0);
  };

  const handleFilterToggle = (id) => () => {
    console.log(`Tag ${id} has been toggled!`);
    setTagFilter(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchNews = async () => {
    try {
      const newsResponse = await backend.get('/articles/with-tags');
      setArticles(newsResponse.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsResponse = await backend.get('/tags');
      const initialTagFilter = {};
      const initialTags = {};
      tagsResponse.data.forEach(tag => {
        initialTagFilter[tag.id] = false;
        initialTags[tag.id] = tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1).toLowerCase();
      });
    
      setTagFilter(initialTagFilter);
      setTags(initialTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }

  const searchVideos = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(`/classes-videos/with-tags/search/${searchInput}`);
        // console.log("Search results:", response.data);
        setVideos(response.data);
      } catch (error) {
        console.error(`Error fetching videos with query '${searchInput}':`, error);
      }
    } else {
      try {
        const response = await backend.get("/classes-videos/with-tags");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    }
  };

  useEffect(() => {
    searchVideos(); // Fetch videos initially
    fetchNews();   // Fetch news initially
    fetchTags();   // Fetch tags initially
  }, [searchInput]);

  return (
    <Box position="relative" pb="70px" minHeight="100vh">
    <Flex direction="column" p={4} gap={4}>
      <Input
        placeholder="Search bar"
        rounded="3xl"
        mt={10}
        value={searchInput}
        onChange={handleInputChange}
      />
      <Flex gap={3}>
        {Object.keys(tags).map((tag) => (
          <Badge
            key={tag}
            onClick={handleFilterToggle(tag)}
            rounded="xl"
            px={4}
            py={1}
            colorScheme={tagFilter[tag] ? 'green': 'red'}
            textTransform="none"
          >
            {tags[tag]}
          </Badge>
        ))}
      </Flex>
      {/* <Flex gap={4}>
        <Button onClick={handleVideoButton}>Videos</Button>
        <Button onClick={handleNewsButton}>News</Button>
      </Flex> */}
      <Box>
        <Text fontWeight="bold" mt={4}>Videos</Text>
        <Flex wrap="wrap" gap={4}>
          {videos.map((video) => {
            const isFilterActive = Object.values(tagFilter).some(Boolean);

            if (!isFilterActive || (video.tags && video.tags.some(tag => tagFilter[tag]))) {
              return (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  description={video.description}
                  title={video.title}
                  S3Url={video.s3Url}
                  classId={video.classId}
                  classTitle={video.classTitle}
                  mediaUrl={video.mediaUrl}
                  tags={video.tags?.map(tag => tags[tag] || [])}
                />
            )
            }
          })}
        </Flex>
      </Box>
      <Box>
        <Text fontWeight="bold" mt={4}>Articles</Text>
        <Flex wrap="wrap" gap={4}>
          {articles.map((article) => {
              const isFilterActive = Object.values(tagFilter).some(Boolean);
            
              if (!isFilterActive || (article.tags && article.tags.some(tag => tagFilter[tag]))) {
                return ( 
                  <NewsCard
                    key={article.id}
                    id={article.id}
                    S3Url={article.s3Url}
                    description={article.description}
                    mediaUrl={article.mediaUrl}
                    tags={article.tags?.map(tag => tags[tag] || [])}
                  />
                )
              }
          })}
        </Flex>

      </Box>
      <UploadComponent />
    </Flex>
      {role === "teacher" && 
        <IconButton
          icon={<span style={{ fontSize: "24px" }}>+</span>}
          colorScheme="purple"
          size="lg"
          isRound
          position="fixed"
          bottom="95px"
          right="24px"
          zIndex={5}
          boxShadow="lg"
          aria-label="Add new item"
          onClick={handleAddButtonClick}
        />
      }
      {showModal && <ControllerModal autoOpen={true}/> }
    <Navbar/>
    </Box>
  );
};

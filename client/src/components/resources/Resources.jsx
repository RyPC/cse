import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Center,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { IoSearch } from "react-icons/io5";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { Navbar } from "../navbar/Navbar";
import { SearchBar } from "../searchbar/SearchBar";
import { NewsCard } from "./NewsCard";
import { ControllerModal } from "./ResourceFlow/ResourceFlowController";
import { UploadComponent } from "./UploadComponent";
import { VideoCard } from "./VideoCard";

export const Resources = () => {
  const { backend } = useBackendContext();
  const [searchInput, setSearchInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState({});
  const [tagFilter, setTagFilter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [tab, setTab] = useState();

  const { role } = useAuthContext();

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFilterToggle = (id) => () => {
    console.log(`Tag ${id} has been toggled!`);
    setTagFilter((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddButtonClick = () => {
    console.log("Add button clicked!");

    setShowModal(false);
    setTimeout(() => {
      setShowModal(true);
    }, 0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchNews = async () => {
    try {
      const newsResponse = await backend.get("/articles/with-tags");
      setArticles(newsResponse.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const tagsResponse = await backend.get("/tags");
      const initialTagFilter = {};
      const initialTags = {};
      tagsResponse.data.forEach((tag) => {
        initialTagFilter[tag.id] = false;
        initialTags[tag.id] =
          tag.tag.charAt(0).toUpperCase() + tag.tag.slice(1).toLowerCase();
      });

      setTagFilter(initialTagFilter);
      setTags(initialTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const searchVideos = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(
          `/classes-videos/with-tags/search/${searchInput}`
        );
        // console.log("Search results:", response.data);
        setVideos(response.data);
      } catch (error) {
        console.error(
          `Error fetching videos with query '${searchInput}':`,
          error
        );
      }
    } else {
      try {
        const response = await backend.get("/classes-videos/with-tags");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching class videos:", error);
      }
    }
  };

  // allow search functionality for articles
  const searchArticles = async () => {
    if (searchInput) {
      try {
        const response = await backend.get(
          `/articles/with-tags/search/${searchInput}`
        );
        setArticles(response.data);
      } catch (error) {
        console.error(
          `Error fetching articles with query '${searchInput}':`,
          error
        );
      }
    } else {
      try {
        const response = await backend.get("/articles/with-tags");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      if (!query) {
        if (tabIndex === 0) {
          const res = await backend.get("/classes-videos/with-tags");
          setVideos(res.data);
        }
        if (tabIndex === 1) {
          const res = await backend.get("/articles/with-tags");
          setArticles(res.data);
        }
      } else {
        if (tabIndex === 0) {
          const res = await backend.get(
            `/classes-videos/with-tags/search/${query}`
          );
          setVideos(res.data);
        } else if (tabIndex === 1) {
          const res = await backend.get(`/articles/with-tags/search/${query}`);
          setArticles(res.data);
        }
      }
    } catch (err) {
      console.log("Error fetching search:", err);
    }
  };

  useEffect(() => {
    if (tabIndex == 0) {
      // only fetch videos
      console.log(tabIndex);
      searchVideos(); // Fetch videos initially
    } else if (tabIndex === 1) {
      searchArticles();
    }
    fetchNews(); // Fetch news initially
    fetchTags(); // Fetch tags initially
  }, [tabIndex]);

  return (
    <Box
      position="relative"
      pb="70px"
      minHeight="100vh"
    >
      <Flex
        direction="column"
        p={4}
      >
        <SearchBar
          onSearch={handleSearch}
          tags={tags}
          tagFilter={tagFilter}
          backend={backend}
          onTag={handleFilterToggle}
        />

        {/* place Videos and News cards into separate tabs */}
        <Tabs
          colorScheme="purple"
          mt={4}
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
        >
          <Center>
            <TabList>
              <Tab fontWeight="bold">Videos</Tab>
              <Tab fontWeight="bold">Articles</Tab>
            </TabList>
          </Center>
          <TabPanels>
            <TabPanel>
              <Text
                fontWeight="bold"
                mt={4}
                mb={2}
              >
                Videos
              </Text>
              <Flex
                wrap="wrap"
                gap={4}
              >
                {videos.map((video) => {
                  const isFilterActive = Object.values(tagFilter).some(Boolean);

                  if (
                    !isFilterActive ||
                    (video.tags && video.tags.some((tag) => tagFilter[tag]))
                  ) {
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
                        tags={video.tags?.map((tag) => tags[tag] || [])}
                      />
                    );
                  }
                })}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Text
                fontWeight="bold"
                mt={4}
                mb={2}
              >
                Articles
              </Text>
              <Flex
                wrap="wrap"
                gap={4}
              >
                {articles.map((article) => {
                  const isFilterActive = Object.values(tagFilter).some(Boolean);

                  if (
                    !isFilterActive ||
                    (article.tags && article.tags.some((tag) => tagFilter[tag]))
                  ) {
                    return (
                      <NewsCard
                        key={article.id}
                        id={article.id}
                        S3Url={article.s3Url}
                        description={article.description}
                        mediaUrl={article.mediaUrl}
                        tags={article.tags?.map((tag) => tags[tag] || [])}
                      />
                    );
                  }
                })}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* <UploadComponent /> */}
      </Flex>
      {role === "teacher" && (
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
      )}
      {showModal && <ControllerModal autoOpen={true} />}
      <Navbar />
    </Box>
  );
};

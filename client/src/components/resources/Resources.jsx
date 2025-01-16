import { useState, useEffect } from "react";
import { VideoCard } from "./VideoCard";
import { NewsCard } from "./NewsCard";
import axios from 'axios';
import { Button, Flex, Text, Box } from "@chakra-ui/react";

export const Resources = () => {
  const [videos, setVideos] = useState([]);
  const [news, setNews] = useState([]);

  const handleVideoButton = () => {
    console.log('Videos button has been pressed!');
    console.log(videos);
  };

  const handleNewsButton = () => {
    console.log('News button has been pressed!');
    console.log(news);
  };

  const fetchVideos = async () => {
    try {
      const videoResponse = await axios.get('http://localhost:3001/classes-videos');
      setVideos(videoResponse.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchNews = async () => {
    try {
      const newsResponse = await axios.get('http://localhost:3001/articles');
      setNews(newsResponse.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchVideos(); // Fetch videos initially
    fetchNews();   // Fetch news initially
  }, []);

  return (
    <Flex direction="column" p={4} gap={4}>
      <Text textStyle="xl" mb={4}>Resources</Text>
      <Flex gap={4}>
        <Button onClick={handleVideoButton}>Videos</Button>
        <Button onClick={handleNewsButton}>News</Button>
      </Flex>
      <Box>
        <Text fontWeight="bold" mt={4}>Videos</Text>
        <Flex wrap="wrap" gap={4}>
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              description={video.description}
              title={video.title}
              S3Url={video.S3Url}
              classId={video.classId}
              mediaUrl={video.mediaUrl}
            />
          ))}
        </Flex>
      </Box>
      <Box>
        <Text fontWeight="bold" mt={4}>News</Text>
        <Flex wrap="wrap" gap={4}>
          {news.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              id={newsItem.id}
              S3Url={newsItem.S3Url}
              description={newsItem.description}
              mediaUrl={newsItem.mediaUrl}
            />
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

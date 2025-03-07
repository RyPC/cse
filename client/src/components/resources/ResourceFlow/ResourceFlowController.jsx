const ajax = async () => {
  try {
    const url = new URL(s3URL);
    const urlBeforeQuery = url.origin + url.pathname;
    let resourceId;
    
    console.log("Starting resource creation with data:", { 
      title, 
      description, 
      link, 
      tags, 
      clsId 
    });
    
    if (link.includes("youtu.be") || link.includes("youtube")) {
      // Create video resource
      const videoResponse = await backend.post("/classes-videos", {
        title: title,
        s3Url: urlBeforeQuery,
        description: description,
        mediaUrl: link,
        classId: clsId
      });
      
      resourceId = videoResponse.data.id;
      console.log("Created video with ID:", resourceId);
      
      // Associate tags with video
      if (tags.length > 0) {
        // Create a separate post request for each tag
        for (const tagId of tags) {
          await backend.post("/video-tags", {
            video_id: resourceId,
            tag_id: tagId
          });
          console.log(`Associated tag ${tagId} with video ${resourceId}`);
        }
      }
    } 
    // if is not a youtube video
    else {
      // Create article resource
      const articleResponse = await backend.post("/articles", {
        s3_url: urlBeforeQuery,
        description: title,
        media_url: link
      });
      
      resourceId = articleResponse.data.id;
      console.log("Created article with ID:", resourceId);
      console.log("Tags to associate:", tags);
      
      // Associate tags with article
      if (tags.length > 0) {
        // Create a separate post request for each tag
        for (const tagId of tags) {
          const tagResponse = await backend.post("/article-tags", {
            article_id: resourceId,
            tag_id: tagId
          });
          console.log(`Associated tag ${tagId} with article ${resourceId}`, tagResponse.data);
        }
      }
    }
    
    // Redirect back to resources page
    window.location.href = "/resources";
  } catch (error) {
    console.error("Error in resource creation process:", error);
    // Show more detailed error message if available
    if (error.response && error.response.data) {
      alert(`Error: ${error.response.data}`);
    } else {
      alert("There was an error creating the resource. Please try again.");
    }
  }
};
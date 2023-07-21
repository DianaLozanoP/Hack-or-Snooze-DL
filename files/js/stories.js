"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${putStarHTML(story, currentUser)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
//function to decide which HTML star the story gets

function putStarHTML(story, user) {
  if (user.isFavorite(story)) {
    return "<span id='start'>&#x2605</span>"
  }
  else return "<span id='start'>&star;</span>"
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  $("#favs").hide();
  $("#mystories").hide();
  $("li").on("click", handleStarClick);
}

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  let title = $("#title-input").val()
  let author = $("#author-input").val()
  let url = $("#url-input").val()
  const newStory = await storyList.addStory(currentUser,
    { title, author, url });
  $("#newstory-form").trigger("reset");
  $("#newstory-form").hide();
  putStoriesOnPage();
}

$("#submit-story").on("click", submitNewStory)
//


// When a user is logged in, mark favorites
async function handleStarClick(evt) {
  let storyId = evt.delegateTarget.id
  let story = storyList.stories.find(i => i.storyId === storyId)
  if (evt.target.id === "start") {
    if (!currentUser.isFavorite(story)) {
      evt.delegateTarget.children[0].innerHTML = "&#x2605"
      await currentUser.addFavorite(story)
    }
    else {
      evt.delegateTarget.children[0].innerHTML = "&star;"
      await currentUser.removeFavorite(story)
    }
  }
}

$("li").on("click", handleStarClick);

//Add the function to show favorites stories

function showFavorites() {
  $("#fav-list").empty();
  for (let story of currentUser.favorites) {
    const storyFav = generateStoryMarkup(story);
    $("#fav-list").append(storyFav);
  }
  $("#fav-list").show();
}

//Add the function to show users created stories

function showMyStories() {
  $("#own-stories").empty();
  for (let story of currentUser.ownStories) {
    const ownStory = generateStoryMarkup(story);
    $("#own-stories").append(ownStory);
    ownStory.append(
      "<span class='trash-can'><i class= 'fas fa-trash-alt'style='font-size:15px'></i></span>")
  }
  $("#own-stories").show();
}

async function handleTrashClick(e) {
  const storyId = e.target.closest("li").id;
  await storyList.removeStory(storyId, currentUser);
  myStoriesClick();
}

$("#own-stories").on("click", handleTrashClick)
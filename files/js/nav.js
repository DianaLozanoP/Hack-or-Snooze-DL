"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $("#newstory-form").hide();
  $("#favs").hide();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

//Submit button

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $("#mystories").hide();
  $("#favs").hide();
  $("#newstory-form").show();
}

$("#nav-submit").on("click", navSubmitClick);

//Favorites section

function navFavClick(evt) {
  // console.debug("navFavClick", evt);
  hidePageComponents();
  $("#newstory-form").hide();
  $("#mystories").hide();
  $("#favs").show();
  if (currentUser.favorites.length === 0) {
    $("#h4-fav").html("No favorites added");
    $("#fav-list").empty();
  }
  else {
    showFavorites();
  }
}

$("#nav-fav").on("click", navFavClick);
//My stories section
function myStoriesClick() {
  hidePageComponents();
  $("#newstory-form").hide();
  $("#favs").hide();
  $("#mystories").show();
  if (currentUser.ownStories.length === 0) {
    $("#h4-story").html("No stories uploaded.");
    $("#own-stories").empty();
  }
  else {
    showMyStories();
  }

}
$("#nav-stories").on("click", myStoriesClick)
/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $("#nav-submit").show();
  $("#nav-fav").show();
  $("#nav-stories").show();
  $navUserProfile.text(`${currentUser.username}`).show();

}


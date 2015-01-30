$(document).ready(function() {
  init();
});

var submit = $("input[type='submit']");

function init() {
  clickSubmit();
  clickTitle();
}

function clickSubmit() {
  submit.click(function() {
    createUl();
    ajaxRequest(setUrl());
  })
}

function listTitles(jsonData) {
  // $("#movie_results").empty();
  for(var i = 0; i < jsonData["Search"].length; i++) {
    var title = jsonData["Search"][i].Title;
    // build li with id and text then append, i.e.make element then append
    $("ul").append("<li></li>");
    $("li").last().html(title);
  }
}

function setUrl() {
  var input = $("input[type='text']").val();
  return "http://www.omdbapi.com/?s=" + input;
}

function createUl() {
  $("#movie_results").append("<h2>Results</h2>");
  $("#movie_results").append("<ul></ul>");
}

function ajaxRequest(url) { // make API call
  return $.ajax(url,
    {dataType: 'json'}
  ).done(function(data) {
    listTitles(data);
    setHtmlId(data);
  });
}

function setHtmlId(jsonData) {
  for(var i = 0; i < jsonData["Search"].length; i++) {
    var imdbId = jsonData["Search"][i].imdbID;
    $($('li')[i]).attr('data-imdbId', imdbId);
  }
}

function clickTitle() {
  $("#movie_results").on("click", "li", function() {
    $("#single_movie").empty();
    var url = "http://www.omdbapi.com/?i=" + $(this).attr('data-imdbId'); // this.data
    $.ajax(url,
      {dataType: 'json'}
    ).done(function(data) {
      $("#single_movie").append("<img>"); // first make element then append it
      $("img").attr('src', data["Poster"]);
    });
  });
}

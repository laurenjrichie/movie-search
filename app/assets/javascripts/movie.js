$(document).ready(function() {
  init();
});

function init() {
  submit = $("div#submit");
  clickSubmit();
  clickTitle();
}

function clickSubmit() {
  submit.click(function() {
    $("#movie_results").append("<h2>Results</h2><div class='ui list'></div>");
    ajaxRequest(setUrl());
  })
}

function listTitles(jsonData) {
  // $("#movie_results").empty();
  for(var i = 0; i < jsonData["Search"].length; i++) {
    var title = jsonData["Search"][i].Title;
    var movieList = "\
      <div class='item'>\
        <div class='content'>\
          <a class='header'>" + title + "</a>\
        </div>\
      </div>"
    $("div.ui.list").append(movieList);
  }
}

function setUrl() {
  var input = $("input[type='text']").val();
  return "http://www.omdbapi.com/?s=" + input;
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
    $($('div.item')[i]).attr('data-imdbId', imdbId);
  }
}

function clickTitle() {
  $("#movie_results").on("click", "a", function() { // how to not have it work when you click to the right as well?
    $("#image").empty();
    $("#info").empty();
    var url = "http://www.omdbapi.com/?i=" + $(this).parent().parent().attr('data-imdbId'); // this.data
    $.ajax(url,
      {dataType: 'json'}
    ).done(function(data) {
      var imageElement = "<img src='" + data["Poster"] + "'>"
      var infoElement = "<p>info here</p>";
      $("#image").append(imageElement);
      $("#info").append(infoElement);
    });
  });
}

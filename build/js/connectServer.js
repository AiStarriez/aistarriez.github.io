function connectToServer(u,body,typ){
    var url = "https://rocky-gorge-34614.herokuapp.com"+u
    return Promise.resolve(
        $.ajax({
          url: url,
          type: typ,
          dataType: "json",
          data : body,
          contentType: "application/json"
        })
      ); 
}
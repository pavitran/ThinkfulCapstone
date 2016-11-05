var auth = firebase.auth();
    var storageRef = firebase.storage().ref();

    function handleFileSelect(evt,query) {
      evt.stopPropagation();
      evt.preventDefault();
      var file = evt.target.files[0];
      if (file.name.match(/\.(jpg|jpeg|png)$/)) {
        var metadata = {
          'contentType': file.type
        };

        // Push to child path.
        // [START oncomplete]
        storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
          //console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          //console.log(snapshot.metadata);
          var url = snapshot.metadata.downloadURLs[0];
          //console.log('File available at', url);
          // [START_EXCLUDE]
          getData(url,query);
          // [END_EXCLUDE]
        }).catch(function(error) {
          // [START onfailure]
          //console.error('Upload failed:', error);
          // [END onfailure]
        });
        // [END oncomplete]
      } else {
        $('.results').append("<h1>FILE FORMAT NOT SUPPORTED</h1>");
      }
    }

    window.onload = function() {
      var query= $('input[name=query]:checked', '#search').val();
      $('#search input').on('change', function() {
         query = $('input[name=query]:checked', '#search').val(); 
         console.log(query);
      });
      //document.getElementById('file').addEventListener('change', handleFileSelect, false);
      document.getElementById('file').addEventListener('change', function(e){handleFileSelect(e,query);}, false);
      document.getElementById('file').disabled = true;

      auth.onAuthStateChanged(function(user) {
        if (user) {
          //console.log('Anonymous user signed-in.', user);
          document.getElementById('file').disabled = false;
        } else {
          //console.log('There was no anonymous session. Creating a new anonymous user.');
          // Sign the user in anonymously since accessing Storage requires the user to be authorized.
          auth.signInAnonymously();
        }
      });
    }
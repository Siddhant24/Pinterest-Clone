'use strict';

(function() {

   var profileId = document.querySelector('#profile-id') || null;
   var profileUsername = document.querySelector('#profile-username') || null;
   var displayName = document.querySelector('#display-name') || null;
   var apiUrl = appUrl + '/api/:id';
   var userinfo = document.querySelector('.user-info');
   var myWall = document.querySelector('.my-wall') || null;

   function updateHtmlElement(data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(function() {

      ajaxFunctions.ajaxRequest('GET', appUrl + '/authenticated', function(isAuthenticated) {
         console.log(isAuthenticated);
         if (JSON.parse(isAuthenticated)) {
            if (userinfo)
               userinfo.removeAttribute('style');
            ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
               var userObject = JSON.parse(data).twitter;
               if (myWall) {
                  myWall.removeAttribute('style');
                  myWall.addEventListener('click', function() {
                     window.location.href = window.location.origin + '/my';
                  })
               }
               if (userObject.displayName !== null) {
                  updateHtmlElement(userObject, displayName, 'displayName');
               }
               else {
                  updateHtmlElement(userObject, displayName, 'username');
               }

               if (profileId !== null) {
                  updateHtmlElement(userObject, profileId, 'id');
               }

               if (profileUsername !== null) {
                  updateHtmlElement(userObject, profileUsername, 'username');
               }
            });
         }
         else {
            userinfo.innerHTML = '<a href="/auth/twitter"><div class="btn" id="login-btn"><p>LOGIN WITH TWITTER</p></div></a>';
            userinfo.removeAttribute('style');
         }
      });
   });
})();

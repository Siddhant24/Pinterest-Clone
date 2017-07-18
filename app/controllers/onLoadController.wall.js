'use strict';

(async function() {
    var grid = document.querySelector('.grid');

    function newGridElement(image) {
        var gridItem = document.createElement('div');
        gridItem.setAttribute("class", "grid-item text-center");
        gridItem.innerHTML += '<div class="grid-image"><img src=\"' + image.link + '\" class="img-fluid"></div>';
        gridItem.innerHTML += '<div class="caption-text text-center">' + image.caption + '</div>';
        gridItem.innerHTML += '<button class="btn-link owner-link" id=\"' + image.owner._id + '\">' + image.owner.twitter.username + '</button>';
        gridItem.innerHTML += '<i class="fa fa-heart like" aria-hidden="true" style="font-size:20px;" id=\".' + image._id + '\"></i>' + image.number;
        grid.append(gridItem);
    }

    function addImages(data) {
        return new Promise(function(resolve, reject) {
            data.forEach((image, index) => {
                newGridElement(image);
                if (index === data.length - 1) resolve();
            });
        }).then(function() {
            console.log("added");
        });
    }

    function fetchData() {
        return new Promise(function(resolve, reject) {
            var url = new URL(window.location.href);
            var id = url.searchParams.get("id");
            console.log(id);
            ajaxFunctions.ajaxRequest('GET', appUrl + '/wallPics?id=' + id, function(data) {
                resolve(JSON.parse(data));
            });
        });
    }

    ajaxFunctions.ready(async function() {
        try {
            var data = await fetchData();
            console.log(data);
            await addImages(data.reverse());
            document.querySelector('.username-text').innerHTML = data[0].owner.twitter.username;
            document.querySelectorAll('.like').forEach(val => val.addEventListener('click', function(e) {
                console.log(e.target.id.slice(1));
                ajaxFunctions.ajaxPostRequest({
                    image_id: e.target.id.slice(1)
                }, appUrl + '/myPics', function(msg) {
                    console.log(msg);
                    if (msg === 'added like' || msg === 'deleted like') window.location.reload();
                    else if (msg === 'unauthenticated') window.alert("Login required to vote");
                });
            }));
            document.querySelector('.home').addEventListener('click', function(){
                window.location.href = window.location.origin;
            });
        }
        catch (msg) {
            console.log(msg);
        }
    });
})();

$(document).ready(function(){


    $('#submit').click(function(e){

        var formModel = {}

        formModel.fiction_writer = $('#fiction_writer').is(':checked');
        formModel.singer = $('#singer').is(':checked');
        formModel.social_media_influencer = $('#social_media_influencer').is(':checked');
        formModel.actor = $('#actor').is(':checked');
        formModel.cinematographer = $('#cinematographer').is(':checked');
        formModel.non_fiction_writer = $('#non_fiction_writer').is(':checked');
        formModel.song_writer = $('#song_writer').is(':checked');
        formModel.voice_actor = $('#voice_actor').is(':checked');
        formModel.user_id  = window.location.href.split("/")[4]

        $.ajax({
            url : "/post/talents/ofuser",
            type : "POST",
            data : formModel,
            success : function(json){
                var talent_id = json['data']['_id'];
                $.ajax({
                    url : "/updatee/talent_id/usermodle/" + window.location.href.split("/")[4],
                    type : "PUT",
                    data : {talent_id: talent_id},
                    success : function(json){
                        window.localStorage.setItem('objectid', json['data']['_id']);
                        window.location = "http://127.0.0.1:8080/info/" + json['data']['_id'];
                    },
                    error : function(err){
                        alert(err);
                    }
                });
            },
            error : function(err){
                alert(err);
            }
        });

    });
});

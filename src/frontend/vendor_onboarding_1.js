let submit_talents = async () => {
    
    // We have associated a data utem with each checkbox. All the checked boxes will poush their ids in this array
    let selected_talents = $('.talent').toArray().map(t=>t.checked?t.dataset.id:null)

    // This will weed out all the falsy values
    selected_talents = selected_talents.filter(Boolean)

    let error;

    let response = await $.post('/api/vendor/update',JSON.stringify({talents:selected_talents})).fail(err => {error=err})

    if(error || response.statusCode==503){
        swal("Sorry!","We could not complete your request. It's not you, it's us. Can you try back in sometime?","error")
    }else{
        swal("Done!","We updated your profile","success")
        window.location.replace('/onboarding/vitalinfo')
    }
        
    
}
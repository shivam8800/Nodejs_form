$(document).ready(function () {

    var submit_vendor_task = async (form, e) => {

        e.preventDefault()

        let error

        var info = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        await B.post('/admin/tasks', JSON.stringify(info)).catch(err => { error = err })

        if (error) {
            swal("Sorry!", "There was a problem saving yout info", "error")
        }
    }

    $('#vendor_task').validate({
        submitHandler: submit_vendor_task
    })

    $('#summernote').summernote();
});
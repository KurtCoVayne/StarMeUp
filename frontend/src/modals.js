$(document).ready(function () {
    $('#formModal').on('show.bs.modal', function (event) {
        let starButton = $(event.relatedTarget)
        let buttonClass =  starButton.attr('class')
        let submitButton = $('#btnSendStar')
        let header = $(".modal-header")
        let title = $(".modal-title")
        let form = $(".form-group")
        let type;
        if(buttonClass.includes("btn-primary")){
            type = 'blue'
        }else if(buttonClass.includes("btn-warning")){
            type = 'yellow'
        }else if(buttonClass.includes("btn-success")){
            type = 'green'
        }
        else{
            let classList = buttonClass.split(" ")
            type = classList[1].substring('btn-'.length)
        }
        let backgroundColor = starButton.css("background-color")
        header.css('background-color',backgroundColor)
        submitButton.css('background-color', backgroundColor)
        title.empty()
        title.append(`<img src="images/star-white.svg" alt="A" width="8%" height="8%"
        aria-label="Excelencia">&nbsp;`+starButton.text())
        $('#starType').remove()
        form.append(`<input type="hidden" name="starType" value="${type}" id="starType"></input>`)
    })
})
$(document).ready(function () {

    var submit_vital_info = async (form, e) => {



        e.preventDefault()

        let error

        var info = $(form).serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        // Extract all langages from multi select
        info.languages = ms.getSelection().map(l=>l.name)

        await B.post('/api/vendor/update', JSON.stringify(info)).catch(err => { error = err })

        if (error) {
            swal("Sorry!", "There was a problem saving yout info", "error")
        }
    }

    $('#info_form').validate({
        submitHandler: submit_vital_info
    })

    new google.maps.places.Autocomplete($("#city")[0], { types: [`(cities)`] });

    var ms = $('#languages').magicSuggest({
        inputCfg: { name: 'languages' },
        data: ['Abkhaz', 'Afar', 'Afrikaans', 'Akan', 'Albanian', 'Amharic', 'Arabic', 'Aragonese', 'Armenian', 'Assamese', 'Avaric', 'Avestan', 'Aymara', 'Azerbaijani', 'Bambara', 'Bashkir', 'Basque', 'Belarusian', 'Bengali', 'Bihari', 'Bislama', 'Bosnian', 'Breton', 'Bulgarian', 'Burmese', 'Catalan; Valencian', 'Chamorro', 'Chechen', 'Chichewa; Chewa; Nyanja', 'Chinese', 'Chuvash', 'Cornish', 'Corsican', 'Cree', 'Croatian', 'Czech', 'Danish', 'Divehi; Dhivehi; Maldivian;', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Ewe', 'Faroese', 'Fijian', 'Finnish', 'French', 'Fula; Fulah; Pulaar; Pular', 'Galician', 'Georgian', 'German', 'Greek, Modern', 'Guaran\xc3\xad', 'Gujarati', 'Haitian; Haitian Creole', 'Hausa', 'Hebrew (modern)', 'Herero', 'Hindi', 'Hiri Motu', 'Hungarian', 'Interlingua', 'Indonesian', 'Interlingue', 'Irish', 'Igbo', 'Inupiaq', 'Ido', 'Icelandic', 'Italian', 'Inuktitut', 'Japanese', 'Javanese', 'Kalaallisut, Greenlandic', 'Kannada', 'Kanuri', 'Kashmiri', 'Kazakh', 'Khmer', 'Kikuyu, Gikuyu', 'Kinyarwanda', 'Kirghiz, Kyrgyz', 'Komi', 'Kongo', 'Korean', 'Kurdish', 'Kwanyama, Kuanyama', 'Latin', 'Luxembourgish, Letzeburgesch', 'Luganda', 'Limburgish, Limburgan, Limburger', 'Lingala', 'Lao', 'Lithuanian', 'Luba-Katanga', 'Latvian', 'Manx', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Mori', 'Marathi', 'Marshallese', 'Mongolian', 'Nauru', 'Navajo, Navaho', 'Norwegian Bokm\xc3\xa5l', 'North Ndebele', 'Nepali', 'Ndonga', 'Norwegian Nynorsk', 'Norwegian', 'Nuosu', 'South Ndebele', 'Occitan', 'Ojibwe, Ojibwa', 'Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic', 'Oromo', 'Oriya', 'Ossetian, Ossetic', 'Panjabi, Punjabi', 'P\xc4\x81li', 'Persian', 'Polish', 'Pashto, Pushto', 'Portuguese', 'Quechua', 'Romansh', 'Kirundi', 'Romanian, Moldavian, Moldovan', 'Russian', 'Sanskrit (Sa\xe1\xb9\x81sk\xe1\xb9\x9bta)', 'Sardinian', 'Sindhi', 'Northern Sami', 'Samoan', 'Sango', 'Serbian', 'Scottish Gaelic; Gaelic', 'Shona', 'Sinhala, Sinhalese', 'Slovak', 'Slovene', 'Somali', 'Southern Sotho', 'Spanish; Castilian', 'Sundanese', 'Swahili', 'Swati', 'Swedish', 'Tamil', 'Telugu', 'Tajik', 'Thai', 'Tigrinya', 'Tibetan Standard, Tibetan, Central', 'Turkmen', 'Tagalog', 'Tswana', 'Tonga (Tonga Islands)', 'Turkish', 'Tsonga', 'Tatar', 'Twi', 'Tahitian', 'Uighur, Uyghur', 'Ukrainian', 'Urdu', 'Uzbek', 'Venda', 'Vietnamese', 'Volap\xc3\xbck', 'Walloon', 'Welsh', 'Wolof', 'Western Frisian', 'Xhosa', 'Yiddish', 'Yoruba', 'Zhuang, Chuang']
    });



})





function texts(text,language){
    if(language == 'ru'){
        switch(text){
            case 'more':
                result = 'Подробнее';
                break;
        }
    }
    if(language == 'en'){
        switch(text){
            case 'more':
                result = 'More';
                break;
        }
    }
    return result;
}
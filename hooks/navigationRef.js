import {useRouter} from 'expo-router';

let navigation;


export function setNavigation(router){
    navigation = router;
}

export function navigateTo(name, params) {
    if(navigation){
        navigation.push(name, params);
    }
}
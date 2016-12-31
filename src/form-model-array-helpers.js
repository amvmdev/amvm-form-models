import _ from 'lodash';


// If array item is in this format:
// { key: 'xxx', value: something} 
// then new array will contain just what is inside value property
export function removeKeysFromArray(array) {
    array = array || [];
    let newArray = array.map(arrayItem => {
        if (arrayItem.key && arrayItem.value) {
            return arrayItem.value;
        } else {
            return arrayItem;
        }
    })
    return newArray;
}

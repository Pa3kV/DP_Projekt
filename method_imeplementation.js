import fetch from 'node-fetch'
class DPArray extends Array{
    dpMap (callback) {
        const returnValues = []
        for(let i = 0; i < this.length; i++){
            returnValues.push(callback(this[i]))
        }
        return returnValues
    }

    dpReduce (callback, initialValue) {
        let returnValue = initialValue
        for(let i = 0; i < this.length; i++){
            returnValue = callback(returnValue, this[i])
        }
        return returnValue
    }
}

const dpPipe = (initialValue, ...functions) => {
    let accValue = initialValue
    for(let i = 0; i < functions.length; i++){
        accValue = functions[i](accValue)
    }
    return accValue
}

//check if dpMap is functional
let arr = new DPArray(1,2,3,4,64)

let mappedArray = arr.dpMap((num) => {
    return num * 2
})

console.log(`dpMap result: ${mappedArray}`)
//

// check if dpReduce is functional
let reducedArray = arr.dpReduce((total, num) => total + num, 0)
console.log(`dpReduce result: ${reducedArray}`)
//

// first callback for dpPipe
const multiply = (val, multiplier) => {
    return val * multiplier
}
//
//second callback for dpPipe
const add = (val, adder) => {
    return val + adder
}
//

// check if dpPipe is functional
let pipedValue = dpPipe(0, (a) => add(a, 3), (a) => multiply(a, 2))
console.log(`First dpPipe result: ${pipedValue}`)

// callback function for dpPipe with array
const pushToArray = (array , value) => {
    array.push(value)
    return array
} 

// check if data
let pipedValue2 = dpPipe([], (a) => pushToArray(a, 4), (a) => pushToArray(a, 5))
console.log(`Second dpPipe result: ${pipedValue2}`)

//fetch data from url
const fetchData = async () => {
    const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic")
    const json = response.json()
    return json
}

// callback after the data is fetched
fetchData().then((response) => {
    const coctailData = new DPArray()
    coctailData.push(...response.drinks)
    
    // check dpMap for fetched data
    let mapArray = coctailData.dpMap((el) => {
        return el.strDrink
    })
    console.log(`Name of coctails: ${mapArray}`)

    //Counting all coctails that start with letter "A" (with function dpReduce)
    let reduceArray = coctailData.dpReduce((acc, el) => {
        if(el.strDrink.charAt(0) === 'A') {
            acc++
        }
        return acc
    }, 0)
    console.log("Number of coctail that start with A: %d", reduceArray)

    // checking if dpPipe works on fetched data
    let pipeValue = dpPipe([], (a)=>{
        let startsWithL = coctailData.dpMap(b => {
            if(b.strDrink.charAt(0) === 'L'){
                a.push(b)
            }
        })
        return a
    }, (a) => {
        let filtered = a.filter(el => el.idDrink > 12694)
        return filtered
    })
    console.log("Filtered coctails below:")

    console.log({pipeValue})
    console.log(pipeValue[0])
    console.log(pipeValue[1])
    console.log(pipeValue[2])
    console.log(pipeValue[3])

})
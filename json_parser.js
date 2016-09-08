function spaceParser (str) {
  // console.log(str)
  while(str.slice(0, 1) === ' ' || str.slice(0, 1) === '\n') {
    str = str.slice(1)
  }
  return str
}
function nullParser (str) {
  str = spaceParser(str)
  if (str.length > 3) {
    if (str.slice(0, 4) === 'null')
      return [null, str.slice(4, str.length)]
  }
  return null
}
function boolParser (str) {
  str = spaceParser(str)
  // console.log(str)

  if (str.slice(0, 4) === 'true')
    return [true, str.slice(4, str.length)]
  if (str.slice(0, 5) === 'false')
    return [false, str.slice(5, str.length)]
  return null
}
function stringParser (str) {
  if (str.slice(0, 1) == '"') {
    var temp = str.slice(1)
    return [temp.slice(0, temp.indexOf('"')), temp.slice(temp.indexOf('"') + 1)]
  }
  return null
}
function numberParser (str) {
  // console.log("numberParser")
  var temp = spaceParser(str)

  if (temp.length > 0) {
    if (temp.match(/^[-+]?\d+([.e]?\d*)/gi)) {
      var temp2 = temp.match(/^[-+]?\d+([.e]?\d*)/gi)[0]
      // console.log(temp2)
      var no = parseFloat(temp.slice(0, temp2.length))
      return [no, temp.slice(temp2.length)]
    }
  }
  return null
}
function commaParser (str) {
  var temp = str
  while (temp.slice(0, 1) === ',') {
    temp = temp.slice(1)
  }
  return temp
}
function colonParser (str) {
  var temp = str
  while (temp.slice(0, 1) === ':') {
    temp = temp.slice(1)
  }
  return temp
}
function arrayParser (str) {
  var temp = spaceParser(str)
  if (temp.slice(0, 1) === '[') {
    var array = []
    var temp = temp.slice(1)
    // console.log(temp)

    while(temp.length > 0 && temp.slice(0, 1) != ']') {
      temp = spaceParser(temp)
      temp = commaParser(temp)
      temp = spaceParser(temp)

      if (temp.slice(0, 1) === '[') {
        var index = temp.indexOf(']')
        array.push(arrayParser(temp))
        temp = temp.slice(index)
      }else {
        parsed = parseEngine(temp)
        // console.log(parsed)
        if (parsed == null || parsed[1] == '')
          break
        array.push(parsed[0])

        temp = parsed[1]
      }
    }
    return [array, temp.slice(1)]
  } else
    return null
}

function objectParser (str) {
  var obj = {}, key, value
  if (str.length > 0) {
    str = spaceParser(str)
    if (str.slice(0, 1) == '{') {
      str = str.slice(1)
      str = spaceParser(str)
      while (str.length > 0 && str.slice(0, 1) !== '}') {
        str = spaceParser(str)
        str = commaParser(str)
        // console.log(str)
        key = stringParser(str)
        if (key == null)
          break
        str = spaceParser(key[1])
        str = colonParser(str)
        str = spaceParser(str)
        value = parseEngine(str)
        obj[key[0]] = value[0]
        str = spaceParser(value[1])
      // console.log(obj)
      }
      return [obj, str.slice(1, str.length)]
    }
    return null
  }
  return null
}

function parseEngine (str) {
  // console.log("parseEngine")
  var parsedString

  parsedString = nullParser(str)
  if (parsedString !== null)
    return parsedString

  parsedString = boolParser(str)
  if (parsedString !== null)
    return parsedString

  parsedString = boolParser(str)
  if (parsedString !== null)
    return parsedString

  parsedString = stringParser(str)
  if (parsedString !== null)
    return parsedString

  parsedString = numberParser(str)
  if (parsedString !== null)
    return parsedString

  parsedString = objectParser(str)
  if (parsedString !== null)
    return parsedString

  parsedString = arrayParser(str)
  if (parsedString !== null)
    return parsedString
  return null
}

console.log(arrayParser('[1,true,"SK",null]'))

// console.log(JSON.stringify(parseEngine('{"key1":"val1","key2":"val2"}')))

// console.log(JSON.stringify(parseEngine('{"name": "chai"}')))
// var test1 = parseEngine(inp)
// console.log(JSON.stringify(test1,null,4))
// var inp = '{"name": "chai"}'

// console.log(boolParser('false, abc'))
// console.log(boolParser('true, 12'))
// console.log(boolParser('abc'))

// console.log(nullParser("null","abc"))

// console.log(stringParser('"abc", 12'))
// console.log(stringParser('12,"sk"'))

// console.log(numberParser('12,"sk"'))
// console.log(numberParser('1.45'))
// console.log(numberParser('"sk",1.45'))

// console.log(JSON.stringify(arrayParser('[1,true,"SK",null]')))

// console.log(JSON.stringify(objectParser('{"Shruti":123}')))

// console.log(JSON.stringify(arrayParser('[1,true,"SK",{"Shruti":123},null]')))

// console.log(JSON.stringify(objectParser('{   "abc":[1,true,"Shruti",null]}')))

// console.log(JSON.stringify(parseEngine('{"ID":null,"name":"Doe","first-name":"John","age":25,"hobbies":["reading","cinema",{"sports":["volley-ball","snowboard"]}],"address":{}}'),null,4))

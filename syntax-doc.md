

# Parsing
- matches following pattern
    - single quote: full words
    `'match me'` or
    `/match me/` (regex)
    - double quote: not full words

- separator between patterns
    - just separate
    `-`
    - match whitespace
    `->`
    - optional pattern
    `~`
    - optional pattern with whitespace
    `~>`
- multiple patterns optional
`~ ('hello' -> 'world')`
- match one pattern of list
`[ 'hello', 'hi', 'hey' ]`
- capture the result
    - without a name
    `{} [ 'hello', 'hi', 'hey' ]`
    - with a capture name
    `{whichGreeting} [ 'hello', 'hi', 'hey' ]`
    - add an additional value
    `{key: 'value'} {capture} [ 'a', 'b' ]`
- match previous pattern
`<= 'hi'>`
- don't allow previous pattern to be ...
`<!= 'hi'>`
- parse values in enumeration as list: `(1, 2, 3, 4)`
`'(' => /\d/ | ',' <= ')'`
- same without accepting whitespace
`'(' ==> /\d/ || ',' <== ')'`


# Variables
- variable declaration
`#varname 'match me'`
- access as pattern 
`$varname`
- in the actual pattern it will be just replaced with the value and also in braces
- use always the same pattern, once selected
`#!quotes [ '"', "'" ]
$quotes -> 'hello' <- $quotes`
matches
`"hello"` and `'hello'`, but not
`"hello'` or `'hello"`



# Functions
- starting with
`@nameOfFunction(parameter):`
- you can declare blockscoped variables
- at the end declare your pattern
- you can define parameters
- (actually just an advanced variable)
- accessing a function inside a pattern
`'hello' -> nameOfFuction('asdf')`
- or a function without parameters
`'hello' -> nameOfFunction`
- generates a type
- empty record `{}` prevents type generation 



# Missing
- delimiter, trailing separator?
- min and max for delimiter
    - suggestion, with min=1, max=2:
    `<1=> pattern <=2>`
- how define full words?
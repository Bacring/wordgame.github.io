(()=>{

print = console.log

let prevNums = []

function randNums(length, needSearch) {

    let nums = []
    let rand = Math.round(Math.random() * length) // random num of 0-length

    for (let i = 0; i < needSearch; i++) {
        do {rand = Math.round(Math.random() * length)}
        while (nums.indexOf(rand) != -1); //while (nums.lastIndexOf(rand) != -1);
        nums.push(rand)
    }

    return nums;
}


function doesntDifference(tbl1, tbl2)
{
    let result = false;

    if (tbl1.length != 0 && tbl2.length == tbl1.length) {
        for (let i = 0; i < tbl1.length; i++) {
            if (tbl2[i] === tbl1[i]) {
                result = true
                break
            }
        }
    }

    return result;
}

function newestRand(word, needCollect, minus=0) {

    if (typeof word != "string") return;

    let nums = randNums(word.length - minus, needCollect)

     do {
        nums = randNums(word.length - minus, needCollect)
    } while(doesntDifference(prevNums, nums))

    prevNums = nums

    return nums;

}

String.prototype.replaceAt=function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function addInput(type, value, id, onclick, parentId) {
    var element = document.createElement("input");
    element.type = type;
    element.value = value;
    element.id = id;
    element.classList.add("alphabet-button")
    element.onclick = onclick;

    var parent = document.getElementById(parentId);
    parent.appendChild(element);
}


let screen_Start = document.getElementById("startScreen")
let screen_Game = document.getElementById("place-center")

let screen_levelText = document.getElementById("level")
let screen_livesText = document.getElementById("lives")
let screen_hiddenText = document.getElementById("game-hiddentext")

let screen_mainImage = document.getElementById("mainImg")
let screen_headText = document.getElementById("mainText")
let screen_descText = document.getElementById("information")
let screen_bestText = document.getElementById("bestscore")
let screen_startButton = document.getElementById("StartButton")


let level = 0
let lives = 3 // Количество попыток на ошибку

let maxWords = 10 // Сколько букв выводить
let hiddingSlovo = ""

let disallowAll = false

let needShowWord = false; // показывать слово, которое игрок не смог отгадать

let ru = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя"

let listWords = [
    "Бабушка",
    "Палитра",
    "Компьютер",
    "Клавиатура",
    "Балкон",
    "Карандаш",
    "Ааааааа"
]

let livesOrig = lives

function alphaFromTo(from , to, func)
{
    from.style.opacity = "0.1";

    setTimeout(() => {

        from.style = "display:none;"
        to.style = "display:block;"

        func()
        
    }, 500);
}


function generateAlphabet(tbl1, tbl2, need)
{
    let result = []
    let sizeOfhW = Object.keys(tbl1).length

    if (sizeOfhW > need) {
        return
    }

    for (val in tbl1) {
        tbl2 = tbl2.replace(val, ""); // val - буква
        result.push(tbl1[val])
    }

    for (key of randNums(tbl2.length - 1, need - sizeOfhW)) {
        result.push(tbl2[key])
    }

    return result;
}

function shakeTable(argtbl) {

    let tbl = []
    let randomize = randNums(argtbl.length - 1, argtbl.length)

    for (let i = 0; i < argtbl.length; i++) {
        tbl.push(argtbl[randomize[i]])
    }

    return tbl
}


function calcWordAlphabet(word, min) // функция будет выдать значения о том сколько букв нужно убрать из слова исходя от длины
{
    let worLen = word.length - Math.floor(min) // 3 => 1 = 2
    return getRandomArbitrary(worLen >= 2 ? Math.floor(worLen/2) : 1, worLen >= 2 ? worLen : 1) // 2 это сколько букв я хочу оставить
}


function endGameScreen(mod)
{

    let phraseLevel = level + 1

    if (bestscore != null ) {
        if (phraseLevel > bestscore) {
            localStorage.setItem('bestScore', phraseLevel);
        }

    } else {
        localStorage.setItem('bestScore', phraseLevel); 
    }

    if (mod == 0)
    {
        alphaFromTo(screen_Game, screen_Start, function()
        {
            screen_mainImage.src = "images/emoji/sad/" +  getRandomArbitrary(1, 11) + ".png";
            screen_headText.innerHTML = "Вы проиграли!"
            screen_descText.innerHTML = `Ваш счёт: ${phraseLevel}`
            screen_startButton.innerText = "Начать заново"
        })
    
    } else if (mod == 1) {
        alphaFromTo(screen_Game, screen_Start, function()
        {
            screen_mainImage.src = "images/emoji/win/" +  getRandomArbitrary(1, 11) + ".png";
            screen_headText.innerHTML = "Вы победили!"
            screen_descText.innerHTML = `Поздравляем вас с этой победой!<br>Ваш счёт: ${phraseLevel}`
            screen_startButton.innerText = "Начать заново"
        })
    }

    screen_bestText.style.display = "none"
}

let hiddingWords = []

function enterKey(e)
{
    if (disallowAll) {return}

    let key = e.target
    let keyName = key.value

    let word = listWords[level]
    let keyInHidde = hiddingWords.indexOf(keyName) // вернёт индекс
    let isTrueWord = (keyInHidde != -1 && (word[keyInHidde] == keyName))

    key.disabled = true
    key.classList.remove("alphabet-button")

    if (isTrueWord) {

        hiddingSlovo = hiddingSlovo.replaceAt(keyInHidde, keyName)
        delete hiddingWords[keyInHidde];

        key.classList.add("alphabet-button-success")

        screen_hiddenText.innerHTML = hiddingSlovo
    
        let countHidWords = Object.keys(hiddingWords).length

        if (countHidWords == 0) { // Если все слова отгаданы, то:
            

            //disallowAll = true;

            level++;
            
            if (level + 1 > listWords.length) {
                
                endGameScreen(1)

            } else {

                let wordzone = document.getElementById("wordZone")
                alphaFromTo(wordzone, wordzone, function()
                {
                    startGame(true)
                })
  
            }


        }

    }
    else {

        key.classList.add("alphabet-button-denied")
        livesOrig--
        screen_livesText.innerHTML = "Попыток: " + livesOrig


        if (livesOrig == 0) {

            if (needShowWord == true) {
                screen_hiddenText.innerHTML = listWords[level]
            }
            
            disallowAll = true;

            setTimeout(() => {
                endGameScreen(0)
                disallowAll = false;
            }, (needShowWord == true ? 3000 : 1000));

        }
    }

}


let mixAlp = []

function startGame(newlevel = false)
{

    hiddingWords = []

    // применяю ко всем элементам таблицы нижний регистр
    for (let i = 0; i < listWords.length; i++) {
        listWords[i] = listWords[i].toLowerCase()
    }

    livesOrig = lives

 
    // Очищает панель с кнопка от старых кнопок, если следующий уровень
    var div = document.getElementById('game-alphabet');
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }


    if (!newlevel) {
        level = 0
        listWords = shakeTable(listWords)
    }

    screen_levelText.innerHTML = `${level + 1}/${listWords.length}`

    screen_livesText.innerHTML = "Попыток: " + livesOrig

    let word = listWords[level] // Первое слово уровня

    for (key of newestRand(word, calcWordAlphabet(word, word.length/2), 1)) { // old: for (key of newestRand(word, 3, 1)) {
        hiddingWords[key] = word[key] // before ["ы"] = 4 now: [4] = "ы"
        word = word.replaceAt(key, "_");
    }

    mixAlp = generateAlphabet(hiddingWords, ru, maxWords)
    mixAlp = shakeTable(mixAlp)

    hiddingSlovo = word
    screen_hiddenText.innerHTML = hiddingSlovo

    mixAlp.forEach(key => {
        addInput('button', key, key, enterKey, 'game-alphabet');
    });
}

document.addEventListener('keydown', function(event) {

    if (mixAlp.includes(event.key) && (!event.ctrlKey || !event.metaKey)) {
        let i = document.querySelectorAll(".alphabet-button")
        for (button of i) {
            if (button.id == event.key) {
                button.click()
                break
            }
        }
    }

});

screen_startButton.addEventListener("click", function(event) {
    alphaFromTo(screen_Start, screen_Game, startGame)
})

function startGameScreen()
{
    screen_mainImage.src = "images/emoji/happy/" +  getRandomArbitrary(1, 11) + ".png";

    let bestscore = localStorage.getItem('bestScore');
    if (bestscore != null) {
        screen_bestText.innerHTML = "Ваш лучший результат: " + bestscore;
    }

    screen_headText.innerHTML = "Добро пожаловать &#9996"
    screen_descText.innerHTML = "Вам предстоит собрать слово с пропущенными буквами, имея при этом несколько попыток ошибиться в выборе правильной буквы."
    screen_startButton.innerHTML = "Начать игру"
}
startGameScreen()

})()


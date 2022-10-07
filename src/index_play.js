const DEBUG = false


const WIDTH = 1920
const HEIGHT = 1080

const CENTER_X = WIDTH / 2
const CENTER_Y = HEIGHT / 2

const LOCATION_X = [1465, 748, 685, 1178, 1254]
const LOCATION_Y = [600,  788, 931, 601,  773]

//Rythm Dot
const DOT_SCALE = 0.8
const DOT_MARGIN = 30


const LEARNING_TRIALS_SUPPORT = 3
const LEARNING_TRIALS_NO_SUPPORT = 3

const TESTING_TRIALS_SUPPORT = 1
const TESTING_TRIALS_NO_SUPPORT = 5


const INCORRECT_STAY_TIME = 1500
const CORRECT_STAY_TIME = 1500

const GAME_EGG_REPS = 10

const RYTHM_CUTOFF = 0.3





const STIM = [
    "eggRed",
    "eggBlue",
    "eggYellow",
    "eggCyan"
]

const RYTHM = [
    [1,2,1,2],
    [1,1,2,2],
    [2,2,1,2],
    [2,1,1,1]
]

const DEVALUED = [1,999,999,1]


const LEARN_SR = new Map([
    [STIM[0], RYTHM[0]], 
    [STIM[1], RYTHM[1]], 
    [STIM[2], RYTHM[2]]
])

const TEST_SR  = new Map([
    [STIM[0], RYTHM[0]], 
    [STIM[1], RYTHM[1]], 
    [STIM[2], RYTHM[2]],
])

const WOODS_1_SR  = new Map([
    [STIM[0], RYTHM[0]], 
    [STIM[1], RYTHM[1]], 
    [STIM[2], RYTHM[2]],
    [STIM[3], DEVALUED]
])

const WOODS_2_SR  = new Map([
    [STIM[0], DEVALUED], 
    [STIM[1], DEVALUED], 
    [STIM[2], RYTHM[2]],
    [STIM[3], DEVALUED]
])


const STIM_ORDER_TEST = randomizeSetWise([...TEST_SR.keys()], 300)

const STIM_ORDER_WOODS_1 = randomizeSetWise([...WOODS_1_SR.keys()], 300)
const STIM_ORDER_WOODS_2 = randomizeSetWise([...WOODS_2_SR.keys()], 300)


function randomizeSetWise(stimuli, length) {
    let stimuliCopy = [...stimuli]
    let iPerStimulus = Math.ceil(length / stimuli.length)
    
    let result = []
    for(let i=0; i<iPerStimulus; i++) {
        result = [...result, ...shuffle(stimuliCopy)]
    }
    return result
}



const TAP_SOUND = "chisel"
const DIAMOND_SOUND = "diamond"
const CRACK_SOUND = "glass_break"







var config = {
    type: Phaser.AUTO,
    backgroundColor: "#FFF",
    scale: {
        parent: 'viewport',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        
        width: WIDTH,
        height: HEIGHT,

        min: {
            width: WIDTH/8,
            height: HEIGHT/8
        },
        max: {
            width: WIDTH*2,
            height: HEIGHT*2,
        },
        zoom: 1,
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoRound: false
};

const game = new Phaser.Game(config);



function preload ()
{
    let path = "assets"

    let imgSlides = ["buttonNext.png","rythmDot.png","clickUp.png", "clickDown.png",
                      "slide1.png","slide10.png","slide2.png","slide3.png","slide8.png","slide9.png","white.png",
                      "slideCorrectBlank.png","slideIncorrectBlank.png","slideLearnBlank.png","slideReproduceBlank.png","slideRetryBlank.png",
                    
                      "background.jpg","backgroundLayer.png","diamond.png","safe.png",
                      "eggBlue.png","eggCyan.png","eggRed.png","eggYellow.png",
                      "eggBlueShell.png","eggCyanShell.png","eggRedShell.png","eggYellowShell.png",
                    
                      "chisel.mp3","diamond.mp3","glass_break.mp3"
                    ]

    imgSlides.forEach(x => {
        if(x.includes(".png") | x.includes(".jpg")) {
            this.load.image(x.split(".")[0], `${path}/${x}`);
        }else if(x.includes(".mp3")) {
            this.load.audio(x.split(".")[0], [`${path}/${x}`]);
        }
    })
}



function create ()
{
    this.debugText = this.add.text(20,20, '', { fontSize: '35px', fill: '#C00', align: 'left', fontFamily: "calibri"}).setOrigin(0).setVisible(DEBUG)
    let s = new Sequence(this)


    study(this, s)

    this.s = s
}



function update(time, delta)
{
    this.s.play()

    this.debugText.setText(`
fps: ${Math.round(delta)}`)
}




//         GGGGGGGGGGGGG               AAA               MMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEE
//      GGG::::::::::::G              A:::A              M:::::::M             M:::::::ME::::::::::::::::::::E
//    GG:::::::::::::::G             A:::::A             M::::::::M           M::::::::ME::::::::::::::::::::E
//   G:::::GGGGGGGG::::G            A:::::::A            M:::::::::M         M:::::::::MEE::::::EEEEEEEEE::::E
//  G:::::G       GGGGGG           A:::::::::A           M::::::::::M       M::::::::::M  E:::::E       EEEEEE
// G:::::G                        A:::::A:::::A          M:::::::::::M     M:::::::::::M  E:::::E             
// G:::::G                       A:::::A A:::::A         M:::::::M::::M   M::::M:::::::M  E::::::EEEEEEEEEE   
// G:::::G    GGGGGGGGGG        A:::::A   A:::::A        M::::::M M::::M M::::M M::::::M  E:::::::::::::::E   
// G:::::G    G::::::::G       A:::::A     A:::::A       M::::::M  M::::M::::M  M::::::M  E:::::::::::::::E   
// G:::::G    GGGGG::::G      A:::::AAAAAAAAA:::::A      M::::::M   M:::::::M   M::::::M  E::::::EEEEEEEEEE   
// G:::::G        G::::G     A:::::::::::::::::::::A     M::::::M    M:::::M    M::::::M  E:::::E             
//  G:::::G       G::::G    A:::::AAAAAAAAAAAAA:::::A    M::::::M     MMMMM     M::::::M  E:::::E       EEEEEE
//   G:::::GGGGGGGG::::G   A:::::A             A:::::A   M::::::M               M::::::MEE::::::EEEEEEEE:::::E
//    GG:::::::::::::::G  A:::::A               A:::::A  M::::::M               M::::::ME::::::::::::::::::::E
//      GGG::::::GGG:::G A:::::A                 A:::::A M::::::M               M::::::ME::::::::::::::::::::E
//         GGGGGG   GGGGAAAAAAA                   AAAAAAAMMMMMMMM               MMMMMMMMEEEEEEEEEEEEEEEEEEEEEE                                                                             
                                                                                                    


function study(scene, s) {

    initGameObjects(scene)
    initDataCollection(scene, s)

    s.insert([
        ()=> submitStudyInformation(scene, s),
        //()=> introduction(scene, s),
        //()=> learnPhase(scene, s),
        ()=> testPhase(scene, s),
        ()=> woods(scene, s),
        ()=> woods(scene, s)
    ])
}


function initGameObjects(scene) {

    scene.state = {}


    scene.rythmDots = new RythmDots(scene, CENTER_X, HEIGHT*0.8)

    scene.slide = scene.add.image(CENTER_X,CENTER_Y, "white")
    scene.slide.setScale(1.5)
    scene.slide.setOrigin(.5,.5)

    scene.buttonNext = scene.add.image(WIDTH * 0.8, HEIGHT * 0.93, "buttonNext")
                    .setScale(1.5)
                    .setOrigin(.5,.5)
                    .setVisible(false)
    setInteractive(scene.buttonNext)

    scene.outcomeTraining = scene.add.image(CENTER_X, HEIGHT * 0.51, STIM[0])
                    .setScale(1.5)
                    .setOrigin(.5,.5)
                    .setVisible(false)

    scene.eggTraining = scene.add.image(CENTER_X, HEIGHT * 0.51, STIM[0])
                    .setOrigin(.5,.5)
                    .setVisible(false)
    setInteractive(scene.eggTraining)

    scene.cursor = new CursorImage(scene, WIDTH*0.53, CENTER_Y, "clickUp", "clickDown", 0.3).setVisible(false)


    scene.backgroundGame = scene.add.image(CENTER_X, CENTER_Y, "background")
                    .setOrigin(.5,.5)
                    .setVisible(false)

    scene.safe = scene.add.image(WIDTH/2,HEIGHT - 60, "safe")
                    .setScale(0.2)
                    .setOrigin(0.5)
                    .setAlpha(0.8)
                    .setVisible(false)

    scene.scoreText = scene.add.text(WIDTH/2,HEIGHT - 60, 'Depot: 0', 
                            { fontSize: '50px', fill: '#FFF', align: 'center' , fontFamily: "calibri"}).setOrigin(0.5).setVisible(false)

    scene.eggsGame = []
    scene.outcomesGame = []
    for(let i=0; i<LOCATION_X.length; i++) {
        
        let eggGame = scene.add.image(LOCATION_X[i], LOCATION_Y[i], "eggBlue")
                    .setOrigin(.5,.5)
                    .setVisible(false)
        setInteractive(eggGame)
        
        scene.eggsGame.push(eggGame)


        let outcomeGame = scene.add.image(LOCATION_X[i], LOCATION_Y[i], "eggBlue")
                    .setOrigin(.5,.5)
                    .setVisible(false)
        setInteractive(outcomeGame)
        
        scene.outcomesGame.push(outcomeGame)

    }
}
function initDataCollection(scene, s) {
    
    scene.columns = []
    scene.data = []

}



function submitStudyInformation(scene, s) {
    s.insert([
        ()=> initSubmitButton(),
        ()=> s.while(participantId==0, [()=> s.wait(20)])
    ])
}
function introduction(scene, s) {
    s.insert([
        ()=> scene.slide.setTexture("slide1"),
        ()=> s.wait(1500),
        ()=> scene.slide.setTexture("slide2"),
        ()=> waitNextButton(scene,s),
        ()=> scene.slide.setTexture("slide3"),
        ()=> waitNextButton(scene,s),
    ])
}
function learnPhase(scene, s) {
    s.insert([
        
        ()=> scene.stimProgress = new StimProgress(LEARN_SR.keys()),
        ()=> scene.stimToDo = shuffle(LEARN_SR.keys()),

        ()=> s.while(scene.stimToDo.length > 0, [ 
                    
            ()=> s.stim = scene.stimToDo.pop(),
            ()=> s.rythm = LEARN_SR.get(s.stim),

            ()=> s.while(scene.stimProgress.getProgress(s.stim) < LEARNING_TRIALS_SUPPORT + LEARNING_TRIALS_NO_SUPPORT, [

                ()=> s.if(scene.stimProgress.getProgress(s.stim) == 0, [
                    ()=> exposure(scene, s)
                ]),

                ()=> s.support = scene.stimProgress.getProgress(s.stim) < LEARNING_TRIALS_SUPPORT,
                
                ()=> reproduce(scene, s, s.support),

                ()=> logData(scene, s),
            ]),
        ]),
        ()=> scene.rythmDots.setVisible(false),
    ])
}
function testPhase(scene, s) {
    s.insert([
        ()=> scene.slide.setTexture("slide8"),
        ()=> waitNextButton(scene, s),

        ()=> scene.stimProgress = new StimProgress(TEST_SR.keys()),

        //Begin Trial
        ()=> scene.trial=0,
        ()=> s.while(scene.stimProgress.lowest() < TESTING_TRIALS_SUPPORT + TESTING_TRIALS_NO_SUPPORT, [

            ()=> s.stim = STIM_ORDER_TEST[scene.trial],
            ()=> s.rythm = TEST_SR.get(s.stim),

            ()=> s.support = scene.stimProgress.getProgress(s.stim) < TESTING_TRIALS_SUPPORT,

            ()=> reproduce(scene, s, s.support),

        ()=>scene.trial++])
    ])
}
function woods(scene, s) {
    s.insert([

        ()=> loadWoods(scene, s),
        ()=> scene.stimProgress = new StimProgress(WOODS_1_SR.keys()),
        ()=> scene.score = 0,

        ()=> scene.round = 0,
        ()=> s.while(scene.stimProgress.lowest() < GAME_EGG_REPS, [

            ()=> s.stim = STIM_ORDER_WOODS_1[scene.round],
            ()=> s.rythm = WOODS_1_SR.get(s.stim),
            ()=> scene.eggObject = shuffle(scene.eggsGame).pop(),
            ()=> s.timeout = 1000 + Math.floor(Math.random() * 1000),

            ()=> s.asynch((as)=> reproduceWoods(scene, as, s.stim, s.rythm, scene.eggObject, s.timeout)),
            ()=> s.wait(3000),

        ()=> scene.round++])
    ])
}



function exposure(scene, s) {
    scene.s.insert([
        ()=> scene.slide.setTexture("slideLearnBlank"),
        ()=> scene.eggTraining.setTexture(s.stim).setVisible(true),
        ()=> scene.rythmDots.setRythm(s.rythm),

        ()=> s.wait(500),
                            
        ()=> scene.cursor.setVisible(true),
        ()=> s.wait(1000),
        ()=> playRythm(scene, s.rythm, ()=> {
            scene.sound.play(TAP_SOUND); 
            scene.rythmDots.play();
            scene.cursor.click();
        }),
        ()=> s.wait(1000),
        ()=> scene.cursor.setVisible(false),
    ])
}
function reproduce(scene, s, support=false) {
    s.insert([
        ()=> scene.slide.setTexture("slideReproduceBlank"),
        ()=> scene.eggTraining.setTexture(s.stim).setVisible(true),

        ()=> scene.rythmDots.setRythm(s.rythm).setVisible(support),
    
        ()=> waitRythm(scene, s, s.rythm, scene.eggTraining, ()=> {
            scene.sound.play(TAP_SOUND)
        }),
    
        ()=> scene.rythmDots.setVisible(false),

        ()=> console.log(s.rythmAccuracy),

        ()=> feedbackSlides(scene, s, s.rythmAccuracy),

        ()=> s.wait(1500)
    ])
}
function feedbackSlides(scene, s, rythmAccuracy) {
    feedback({scene:scene, s:s, rythm:s.rythm, rythmAccuracy:rythmAccuracy, 
        correct: ()=> s.insert([
            ()=> scene.slide.setTexture("slideCorrectBlank"),
            ()=> eggCorrect(scene, s, s.eggTraining),
            ()=> scene.stimProgress.increment(s.stim)
        ]),
        incorrect: ()=> s.insert([
            ()=> scene.slide.setTexture("slideIncorrectBlank"),
            ()=> eggIncorrect(scene, s, s.eggTraining),
            ()=> scene.stimProgress.reset(s.stim)
        ])
    })
}


function loadWoods(scene, s) {
    s.insert([
        ()=> scene.backgroundGame.setVisible(true),
        ()=> scene.safe.setVisible(true),
        ()=> scene.scoreText.setVisible(true),
        ()=> document.body.style.backgroundColor = "black"
    ])
}
function reproduceWoods(scene, s, stim, rythm, eggObject, timeout) {
    s.insert([

        ()=> s.stim = stim,
        ()=> s.rythm = rythm,
        ()=> s.eggGame = eggObject,

        ()=> console.log(s.stim, s.rythm),

        ()=> s.eggGame.setTexture(s.stim),
        ()=> s.eggGame.setVisible(true),

        ()=> waitRythm(scene, s, s.rythm, s.eggGame, ()=> scene.sound.play(TAP_SOUND), ()=>{}, timeout, 1500,1500),

        ()=> feedbackWoods(scene, s)

    ])
}
function feedbackWoods(scene, s) {
    feedback({scene:scene, s:s, rythm:[], rythmAccuracy:rythmAccuracy, 
        correct: ()=> s.insert([
            ()=> scene.stimProgress.increment(s.stim),
            ()=> eggCorrect(scene, s, s.eggTraining)
        ]),
        incorrect: ()=> s.insert([
            ()=> scene.slide.setTexture("slideIncorrectBlank"),
            ()=> eggIncorrect(scene, s, s.eggTraining)
        ]),
        devalued: ()=> s.insert([
            ()=> scene.stimProgress.increment(s.stim),
            ()=> s.eggTraining.setVisible(false)
        ])
    })
}


function eggCorrect(scene, s, eggObj) {
    s.insert([
        ()=> eggObj.setTexture(`diamond`),
        ()=> scene.sound.play(DIAMOND_SOUND),
        ()=> s.wait(CORRECT_STAY_TIME),
        ()=> eggObj.setVisible(false)
    ])
}
function eggIncorrect(scene, s, eggObj) {
    s.insert([
        ()=> scene.eggTraining.setTexture(`${s.stim}Shell`),
        ()=> scene.sound.play(CRACK_SOUND),
        ()=> s.wait(INCORRECT_STAY_TIME),
        ()=> eggObj.setVisible(false)
    ])
}



function playRythm(scene, rythm, funcBeat) {
    scene.s.insert([
        ()=> scene.rythmBeats = rythmToRythmBeats(rythm),
        ()=> scene.pRi=0,
        ()=> scene.s.while(scene.pRi<scene.rythmBeats.length, [
            ()=> scene.playBeat = scene.rythmBeats[scene.pRi],

            ()=> scene.s.if(scene.playBeat, [
                ()=> funcBeat(),
            ]),
            ()=> scene.s.wait(300),
            ()=> scene.pRi++
        ])
    ])
}
function waitRythm(scene, s, rythm, image, onClick=()=>{}, returnFunc=()=>{}, hoverTimeout=99999, clickTimeout=99999, rythmTimeout=99999) {
    s.insert([

        ()=> s.rythm = rythm,
        ()=> s.timeout = clickTimeout,
        ()=> s.userRythm = [],
        ()=> s.rythmAccuracy = undefined,

        ()=> s.currBeat = 0,
        ()=> s.while(s.currBeat <= s.rythm.length, [

            ()=> s.if(s.currBeat > 0, [
                ()=> s.timeout = rythmTimeout
            ]),

            ()=> s.startTime = Date.now(),

            ()=> s.waitInput([
                {timer: s.timeout, image:image, func: ()=> {s.currBeat = s.rythm.length; s.rythmAccuracy= -1}},
                {trigger: "CLICK", image:image, func:onClick}, 
                {trigger: "R", image:image, func:onClick}]),
            
            ()=> s.userRythm.push(Date.now()-s.startTime),
            
        ()=> s.currBeat++]),


        ()=> s.timeClick = s.userRythm[0],
        ()=> s.userRythm = s.userRythm.slice(1),

        ()=> s.if(s.rythmAccuracy === undefined, [ //If the rythm is not set to be 1 due to incomplete rythm making
            ()=> s.rythmAccuracy = rythmsMatch(s.userRythm, s.rythm)
        ]),

        ()=> returnFunc(s.rythmAccuracy, s.userRythm, s.timeHover, s.timeClick)


    ])


}


function waitNextButton(scene, s) {
    s.insert([
        ()=> scene.buttonNext.setVisible(true),
        ()=> s.waitClick(scene.buttonNext),
        ()=> scene.buttonNext.setVisible(false),
    ])
}
function logData(scene, s) {

    console.log([s.stim, s.rythm, s.rythmAccuracy, s.userRythm])
    /*
    ()=> scope.locationList.push(s.location),

    ()=> scope.eggColor = s.eggColor,
    ()=> scope.rythm = s.rythm,
    ()=> scope.location = s.location,
    ()=> scope.rythmAccuracy = s.rythmAccuracy,
    ()=> scope.userRythm = s.userRythm,
    ()=> scope.timeHover = s.timeHover,
    ()=> scope.eggProgressEgg = scope.eggProgress[s.eggColor],

    ()=> scope.logData()
    */
}
function setInteractive(image) {
    image.setInteractive({ useHandCursor: true })
    image.on('pointerover',() => { hover.image = image; })
    image.on('pointerout',() => {hover.image = undefined; })
}


class StimProgress {

    constructor(stimList) {
        this.m = zerosMap([...stimList])
    }

    getProgress(stim) {
        this.m.get(stim)
    }

    increment(stim) {
        this.m.set(stim, this.m.get(stim) + 1)
    }

    lowest() {
        Math.min(...this.m.values())
    }

    reset(stim) {
        this.m.set(stim, 0)
    }
    
}


function feedback({scene, s, rythm, rythmAccuracy, correct=()=>{}, incorrect=()=>{}, devalued=()=>{}}) {
    if(safeCompare(rythm, DEVALUED)) {
        devalued(scene, s)
    }else{
        if(rythmAccuracy < RYTHM_CUTOFF) {
            correct(scene, s)
        }else{
            incorrect(scene, s)
        }
    }
}
function zerosMap(arr) {
    let arrCopy = [ ...arr]
    let m = new Map()

    arrCopy.forEach(x => m.set(x, 0))

    return m
} 





function stuff() {

    var rawData = {
        "Timestamp" : getTimestamp(),

        "STAGE.Id": this.stage,
        "STAGE.Show_Rythm" : this.displayRythm,

        "EGG.Rythm": JSON.stringify(this.rythm).replace(/,/g, '-'),
        "EGG.Color"  : this.eggColor,
        "EGG.Location" : JSON.stringify(this.location).replace(/,/g, '-'),
        "EGG.Progress" : this.eggProgressEgg,

        "USER.Time_Hover" : this.timeHover,
        "USER.Time_Rythm_Start" : this.userRythm[0],
        "USER.Rythm_Applied" : JSON.stringify(this.userRythm.slice(1)).replace(/,/g, '-'),
        "USER.Rythm_Error" : this.rythmAccuracy,
        
    }


    this.columns = Object.keys(rawData)

    let row = []
    for(let column in rawData) {
        row.push(rawData[column])
    }

    this.data.push(row)

    console.log(row)
}





function sumArray(array) {
	const reducer = (accumulator, curr) => accumulator + curr;
	return array.reduce(reducer)
}

function arrayIn(arr1, arr2) {
    return arr1.every(elem => arr2.indexOf(elem) > -1)
}

function safeCompare(item1, item2) {
    return (JSON.stringify(item1) == JSON.stringify(item2))
}

function inArray(item, arr) {
    for(var i=0; i<arr.length; i++) {
        if(safeCompare(item, arr[i])) {
            return true
        }
    }
    return false
}

function shuffle(arr) {
    let arrCopy = [ ...arr]

	return [...arrCopy.sort(() => Math.random() - 0.5)]
}



function getValues(dict) {
	var values = []; 
    Object.keys(dict).forEach((key)=> {values.push(dict[key])})
    return values;
 }


function rythmToRythmBreaks(rythm) {
    var newRythm = []
    var counter = 0
    for(let beat of rythm) {
        if(counter == 0) {
            if(beat) {
                counter++
            }
        }else{
            if(beat) {
                newRythm.push(counter)
                counter = 1
            }else{
                counter++
            }
        }
    }
    return newRythm
}


function rythmToRythmBeats(rythm) {
    var rythmBeats = [1]
    for(let beat of rythm) {
        for(let i=1; i<beat; i++) {
        rythmBeats.push(0)
        }
        rythmBeats.push(1)
    }
    return rythmBeats
}


function rythmsMatch(ir, ar) { //Inputs are input_rythm and actual_rythm

    var ir_total_duration = sumArray(ir)
    var ar_total_beats = sumArray(ar)

    var ir_mean_beat_duration = ir_total_duration / ar_total_beats
    
    var max_rel_e = 0
    for(let i=0; i<ar.length; i++) {
        var ir_beat_duration = ir[i]
        var ar_beat_duration = ar[i] * ir_mean_beat_duration

        var rel_e = Math.abs(ir_beat_duration - ar_beat_duration) / ar_beat_duration //Relative Error

        if(rel_e > max_rel_e) {
            max_rel_e = rel_e
        }
    }
    return max_rel_e
}





function exportToCsv(columns, data) {
    var csv;
    var orderedData = [];
    
    for(var i = 0; i < data.length; i++) {
        orderedData.push(data[i].join(','));
    }    

    csv = columns.join(',') + '\r\n' + orderedData.join('\r\n');

    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

}


function getTimestamp() {
    return new Date().toLocaleString()
}






class Sequence {


    constructor(scene, sequence=[]) {
        this.scene = scene

        this.asynchSequences = []
    
        this.step = 0
        this.paused = false
        this.sequence = sequence
    }

    play() {

        while(!this.isDone() & !this.isPaused()) {
            var currObject = this.sequence[this.step]

            //If it is a list, expand it, and ignore the execution
            if(Object.prototype.toString.call(currObject) === '[object Array]') {
                this.sequence.splice(this.step+1, 0, ...currObject);
            //Otherwise, run it as a function
            }else if(typeof currObject === 'function') {
                currObject()
            }else {
                //console.error("Runner found non processable item in sequence. Allowed are Arrays and Functions")
            }
            this.step++
        }

        //Play all asynchronous tasks
        var i=0
        for(let as of this.asynchSequences) {
            as.play()
            if(as.isDone()) {
                this.asynchSequences.splice(i, 1)
            }
            i++
        }
    }


    asynch(asynchFunc) {
        let as = new Sequence(this.scene)
        asynchFunc(as)
        this.asynchSequences.push(as)
    }

    pause() {
        this.paused = true
    }

    resume() {
        this.paused = false
    }

    isPaused() {
        return this.paused
    }

    isDone() {
        return (this.step == this.sequence.length)
    }


    while(condition, loopSequence) {
        if(condition) {
            loopSequence.push(this.sequence[this.step]) //This step is where the while statement is executed, put at end of sequece to recursively activate it
            this.insert(loopSequence)
        }
    }


    if(condition, subSequence) {
        if(condition) {
            this.insert(subSequence)
        }
    }


    insert(insertSequence) {
        this.sequence.splice(this.step+1, 0, ...insertSequence);
    }


    destroy() {
        this.sequence = []
        this.asynchSequence = []
        this.step=0
        this.paused=true
    }



    //Timer Functions
/*
    wait(delay) {
        this.pause()
        var waitDelay = delay
        this.scene.time.addEvent({delay: waitDelay, callback: () => {this.resume()}, callbackScope: this})
    }*/

    wait(delay) {
        this.waitInput(delay)
    }

    waitClick(image) {
        this.waitInput({trigger:"CLICK", image:image})
    }

    waitKey(key="SPACE", image) {
        this.waitInput({trigger:key, image:image})
    }


    //{trigger, image, func}
    //Order matters! Earlier events are prioritized.
    
    //There have been several issues with this function that have been resolved:
    // - the wrong function was being called. this was because onTrigger was defined global, and each new listener just changed that. It worked for 
    //   some as it was passed into the listener as a "onTrigger", but for those where it was passed as "onTrigger()", it executed the function that it was
    //   last assigned to, usually not the one we want.
    //
    // - For some reason, button event is called even after it has been delted (perhaps internally it calls all events before the delete goes through?)
    //   Created a list, where all registered images are logged. The "global" button press only triggers if it is not hovering over any of the previously
    //   registered images. 
    //
    //   Issue will still remain for double assignment of any of the listeners though! 


    waitInput(actionList) {
        this.pause()

        let clearListenerFunc = []
        let actionImagesKeyboard = []

        if(actionList.constructor !== Array) {
            if(actionList.constructor === Object) {
                actionList=[actionList]
            }else{
                if(typeof actionList === "string") {
                    actionList=[{trigger:actionList}]
                }else if(typeof actionList === "number") {
                    actionList=[{timer:actionList}]
                }else{
                    console.error(`TypeError in waitInput: Value of type ${typeof actionList} is not allowed as an input`)
                }
            }
        }

        for(let action of actionList) {

            action.func = action.func ?? (()=> {})
            let onTrigger = ()=> {action.func() ?? void 0; clearListenerFunc.forEach((clearListener)=> clearListener()); this.resume()}

            //Click listener

            if(action.trigger == "CLICK") {

                var clicklisteners = []

                //Set Listener 
                if(action.image !== undefined) {
                    clicklisteners.push(action.image.on('pointerdown', onTrigger))
                }else{
                    clicklisteners.push(this.scene.input.on("pointerdown", onTrigger))
                }

                //Prepare Remove Listener
                clicklisteners.forEach( (listener)=> clearListenerFunc.push(()=> {listener.removeListener("pointerdown")})
                )


            //Hover Listener

            }else if(action.trigger == "HOVER") {

                var hoverListeners = []

                //Set Listener 
                if(action.image !== undefined) {
                    hoverListeners.push(hover.registerListener((image)=> {if(action.image == image) {onTrigger()}}))
                    
                }else{
                    hoverListeners.push(hover.registerListener(onTrigger))
                }
                
                //Prepare Remove Listener
                hoverListeners.forEach((listener)=> {
                    clearListenerFunc.push(()=> hover.removeListener(listener))
                })

            }else{

                // Wait Keyboard

                if(typeof action.trigger === "string") {
                    try {
                        let key = action.trigger
                        
                        var keyListeners = []
                        //Set Listener 
                        if(action.image !== undefined) {
                            actionImagesKeyboard.push(action.image)
                            keyListeners.push(this.scene.input.keyboard.addKey(key).on('down', ()=> {if(hover.image == action.image) {onTrigger()}}));
                        }else{
                            keyListeners.push(this.scene.input.keyboard.addKey(key).on('down', ()=> {if(!inArray(hover.image, actionImagesKeyboard)) {onTrigger()}}));
                        }
    
                        //Prepare Remove Listener
                        keyListeners.forEach((listener)=> { clearListenerFunc.push(()=> {
                            this.scene.input.keyboard.removeKey(key); 
                            listener.removeListener("down")});
                            
                        })
    
                    } catch (error) {
                        console.error(error);
                    }

                // Wait timer

                }else if(typeof action.timer === "number") {
                    let timer = this.scene.time.addEvent({delay: action.timer, callback: onTrigger, callbackScope: this})

                    clearListenerFunc.push(()=> {timer.remove(false)})


                // Wait rythm

                }else{
                    console.error("No input given for waitInput()")
                }
            }
        }
    }
}







class RythmDots {

    constructor(scene, x,y, dotImage = "rythmDot") {
        this.x = x
        this.y = y
        this.dotImage = dotImage
        this.scene = scene
        this.counter = 0
    }

    setRythm(rythm) {


        let rythmBeats = rythmToRythmBeats(rythm)

        this.rythmDots = []
        for(let i=0; i<rythmBeats.length; i++) {
            let dotX = this.x - ((rythmBeats.length /2)*DOT_MARGIN) + ((i * DOT_MARGIN))

            let showDot = rythmBeats[i]
            if(showDot) {
                let dot = this.scene.add.image(dotX, this.y, this.dotImage).setAlpha(0.5).setScale(DOT_SCALE).setOrigin(0.5, 0.5) 
                this.rythmDots.push(dot)
            }
        }
        return this
    }

    play() {
        let currDot = this.rythmDots[this.counter]
        currDot.setAlpha(1)
        this.scene.time.addEvent({delay: 100, callback: (dot) => {dot.setAlpha(0.5)}, args: [currDot], callbackScope: this})
        this.counter++
        if(this.counter == this.rythmDots.length) {
            this.counter = 0
        }
        return this
    }

    resetPlay() {
        this.counter = 0
        return this
    }

    setVisible(visible) {
        for(var dot of this.rythmDots) {
            dot.setVisible(visible)
        }
        return this
    }

    destroy() {
        for(var dot of this.rythmDots) {
            dot.getPhaserImage().destroy()
        }
    }
}



class CursorImage {

    constructor(scene, x, y, image, imageDown, scale=1, visible=true) {
        this.scene = scene

        this.image = this.scene.add.image(x, y, image)
                                .setScale(scale)
                                .setOrigin(.5,.5)
                                .setVisible(true)

        this.imageDown = this.scene.add.image(x, y, imageDown)
                                .setScale(scale)
                                .setOrigin(.5,.5)
                                .setVisible(false)

    }

    setVisible(visible) {
        this.image.setVisible(visible)
        this.imageDown.setVisible(false)

        return this
    }

    click() {
        this.image.setVisible(false)
        this.imageDown.setVisible(true)

        this.scene.time.addEvent({delay: 100, callback: (currScene) => {
            this.imageDown.setVisible(false)
            this.image.setVisible(true)
        }, args: [this], callbackScope: this})

        return this
    }

    destroy() {
        this.imageDown.destroy()
        this.image.destroy()
    }
}








var participantId = 0
var trialId = 0

function initSubmitButton() {
    let element = document.getElementById('input-box')
    //element.style.display = 'none';

    var elem = {}

    for (let i = 0; i < element.children.length; i++) {
        if(element.children[i].name == 'id'){
            elem["id"] = element.children[i]
        }
        if(element.children[i].name == 'trial'){
            elem["trial"] = element.children[i]
        }
        else{
            elem["button"] = element.children[i]
        }
    }

    elem["button"].addEventListener('click',()=>{
        element.style.display = 'none';
        participantId = elem["id"].value;
        trialId = elem["trial"].value
    })
}








//Initialize Hover Listener

const hover = {
    imageInternal: undefined,
    hoveringListener: {},

    set image(val) {
        this.imageInternal = val;

        //Play all existing Listeners. If a listener is removed in the process of the loop, skip that
        for(let key in this.hoveringListener) {
            let listener = this.hoveringListener[key]
            listener.func(val, listener.args)
        }
    },

    get image() {
        return this.imageInternal;
    },

    registerListener: function(listener, args=[]) {
        if(Object.keys(this.hoveringListener).length == 0) {
            var listenerId = 0
        }else{
            var listenerId = Math.max(Object.keys(this.hoveringListener)) +1 //Find highest existing key, and return that +1 as the next id 
        }
         
        this.hoveringListener[listenerId] = {func:listener, args:args}
        return listenerId
    },

    removeListener: function(listenerId) {
        delete this.hoveringListener[listenerId]
    } 
  }


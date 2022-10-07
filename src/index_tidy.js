
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
                                                                                                    



function preload ()
{
    
    var img_slides = ["nextButton.PNG","rythmDot.png","clickUp.png", "clickDown.png",
                      "slide1.PNG","slide10.PNG","slide2.PNG","slide3.PNG","slide8.PNG","slide9.PNG","white.PNG",
                      "slideCorrectBlank.PNG","slideIncorrectBlank.PNG","slideLearnBlank.PNG","slideReproduceBlank.PNG","slideRetryBlank.PNG"]
    var img_game = ["background.jpg","backgroundLayer.png","diamond.png","safe.png",
                      "eggBlue.png","eggCyan.png","eggRed.png","eggYellow.png",
                      "eggBlueShell.png","eggCyanShell.png","eggRedShell.png","eggYellowShell.png"]
    var sounds = ["chisel.mp3","diamond.mp3","glass_break.mp3"]

    for(var img of img_slides) {
        this.load.image(img.split(".")[0], `assets/slides/${img}`);
    }
    for(var img of img_game) {
        this.load.image(img.split(".")[0], `assets/game/${img}`);
    }
    for(var sound of sounds) {
        this.load.audio(sound.split(".")[0], [`assets/sounds/${sound}`]);
    }
}





var EGG_RYTHM_TRAINING = {"eggBlue":[2,1,2,1], "eggRed":[2,1,2,2], "eggYellow":[1,2,2,1]}

function create ()
{

    var s = new Sequence(this)

    this.date = new Date();


    this.debugMode = false

    this.metadata = {phase:"", step:"", trial:1, egg:"", rythm:"", support:false, additionalInfo:""}


    this.debugText = this.add.text(20,20, '', { fontSize: '35px', fill: '#C00', align: 'left', fontFamily: "calibri"}).setOrigin(0).setAlpha(0)

    this.slide = new PsyImage(this, WIDTH/2, HEIGHT/2, "white", 1, 1.5)
    this.nextButton = new PsyImage(this, NEXT_BUTTON_LOC.x, NEXT_BUTTON_LOC.y, "nextButton", 0, 1.5, [0.5,0.5], true)
    this.trainingEgg = new PsyImage(this, EGG_LOC.x, EGG_LOC.y, "eggBlue", 0, 1, [0.5,0.5], true)
    this.cursorImage = new CursorImage(this, CURSOR_LOC.x, CURSOR_LOC.y, "clickUp", "clickDown", 0.3)


    this.userRythm = [-1,-1]
    this.rythm = ""
    this.location = ""
    
    this.columns = []

    this.data = []
    this.logData = ()=> {

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



    s.q([

        ...[ //Wait until Submit button is pressed
            ()=> initSubmitButton(),
            ()=> s.while(participantId==0, [()=> s.wait(20)]),
        ],

        ...[//Initialize Debug Mode
            ()=> s.if(this.debugMode, 
                ()=> this.debugText.setAlpha(1)
            ),
        ],

        ...[ //Introduction Slides
            ()=> this.slide.setImage("slide1"),
            ()=> s.wait(1500),
            ()=> this.slide.setImage("slide2"),
            ()=> this.nextButton.show(),
            ()=> s.waitClick(this.nextButton.getPhaserImage()),
            ()=> this.slide.setImage("slide3"),
            ()=> s.waitClick(this.nextButton.getPhaserImage()),
        ],
        
        ... [ //Phase 1: Aquisition

            ...[ //Prepare Phase 1
                ()=> this.stage = "Aquisition",
                ()=> this.eggList = shuffle(Object.keys(EGG_RYTHM_TRAINING)),
            ],

            ...[ //Run Phase 1
                ()=> s.while(this.eggList.length>0, [ 
                    
                    ...[ //Get Egg Color
                        ()=> this.eggColor = this.eggList.pop(),
                        ()=> this.rythm = EGG_RYTHM_TRAINING[this.eggColor],
                    ],

                    ...[ //Play and Reset when Error is made
                        ()=> this.repeatTrial=true,
                        ()=> s.while(this.repeatTrial, [

                            ...[ //Play Rythm

                                ...[ //Make Slide Learn
                                    ()=> this.repeatTrial = false,
                                    ()=> this.slide.setImage("slideLearnBlank"),
                                    ()=> this.trainingEgg.setImage(this.eggColor),
                                    ()=> this.trainingEgg.show(),
                                    ()=> this.rythmDots = new RythmDots(this, WIDTH/2, HEIGHT*0.8, this.rythm),
                                    ()=> this.nextButton.hide(),
                                    ()=> s.wait(1000),
                                    
                                ],

                                ...[ //Play Rythm
                                    ()=> this.cursorImage.show(),
                                    ()=> s.wait(1000),
                                    ()=> playRythm(this, this.rythm, ()=> {
                                        this.sound.play(TAP_SOUND); 
                                        this.rythmDots.play();
                                        this.cursorImage.click();
                                    }),
                                    ()=> s.wait(1000),
                                    ()=> this.cursorImage.hide(),
                                ]
                            ],
        
                            ...[ //Ask to Repeat Egg, with Support

                                ()=> this.displayRythm = true,
                                ()=> this.f=0,
                                ()=> s.while((this.f < TRAINING_EGG_REPS) & (!this.repeatTrial), [
            
                                    ...[ //Prepare Trial
                                        ()=> this.slide.setImage("slideReproduceBlank"),
                                        ()=> this.trainingEgg.setImage(this.eggColor),
                                        ()=> this.rythmDots.show(),
                                    ],
            
                                    ...[ //Wait for Rythm
                                
                                        ()=> waitRythm(s, this.rythm, this.trainingEgg.getPhaserImage(), ()=> {
                                            this.sound.play(TAP_SOUND);
            
                                        }, (rythmAccuracy)=>{this.rythmAccuracy = rythmAccuracy}),

                                        ()=> this.rythmDots.hide(),
                                    ],
            
                                    ...[ //Check if Correct
                                            ()=> s.if(this.rythmAccuracy < 0.3, [
                                                ()=> this.slide.setImage("slideCorrectBlank"),
                                                ()=> this.trainingEgg.setImage(`diamond`),
                                                ()=> this.sound.play(DIAMOND_SOUND),
                                            ]),
                                            ()=> s.if(this.rythmAccuracy >= 0.3, [
                                                ()=> this.slide.setImage("slideIncorrectBlank"),
                                                ()=> this.trainingEgg.setImage(`${this.eggColor}Shell`),
                                                ()=> this.repeatTrial = true,
                                                ()=> this.sound.play(CRACK_SOUND),
                                            ]),
                                            ()=> s.wait(1500),
                                    ],

                                    ...[ //Log data
                                        ()=> this.logData()
                                    ],

                                ()=> this.f++]),
                            ],

                            ...[ //Ask to Repeat Egg, with NO Support
                                ()=> this.displayRythm = true,
                                ()=> this.f=0,
                                ()=> s.while((this.f < TRAINING_EGG_REPS) & (!this.repeatTrial), [
                                    ...[ //Prepare Trial
                                        ()=> this.slide.setImage("slideReproduceBlank"),
                                        ()=> this.trainingEgg.setImage(this.eggColor),
                                    ],

                                    ...[ //Wait for Rythm
                                        ()=> waitRythm(s, this.rythm, this.trainingEgg.getPhaserImage(), ()=> {
                                            this.sound.play(TAP_SOUND)
                                        }, (rythmAccuracy)=>{this.rythmAccuracy = rythmAccuracy}),
                                    ],

                                    ...[// Check if Correct
                                        ()=> s.if(this.rythmAccuracy < 0.3, [
                                            ()=> this.slide.setImage("slideCorrectBlank"),
                                            ()=> this.trainingEgg.setImage(`diamond`),
                                            ()=> this.sound.play(DIAMOND_SOUND),
                                        ]),
                                        ()=> s.if(this.rythmAccuracy >= 0.3, [
                                            ()=> this.slide.setImage("slideIncorrectBlank"),
                                            ()=> this.trainingEgg.setImage(`${this.eggColor}Shell`),
                                            ()=> this.sound.play(CRACK_SOUND),
                                            ()=> this.repeatTrial = true,
                                        ]),
                                        ()=> s.wait(1500),
                                    ],

                                    ...[ //Log data
                                        ()=> this.logData()
                                    ],

                                ()=> this.f++]),
                            ],
                        ]),
                    ],
                ]),
            ],
        ],

        ... [ //Phase 2: AquisitionTest
    
            ...[ //Prepare Phase 2
                ()=> this.stage = "AquisitionTest",
                ()=> this.nextButton.hide(),
                
                ()=> this.eggProgress = {"eggBlue":0, "eggRed":0, "eggYellow":0},
                ()=> this.eggColors = Object.keys(this.eggProgress),
            ],

            ...[ //Run Phase 2 for all Eggs in the Egg list
                ()=> s.while(Object.keys(this.eggProgress).length > 0, [

                    ...[ //Go through first set of randomly ordered eggs (each color contained once)
                        ()=> s.wait(30),
                        ()=> this.shuffleEggColors = shuffle(this.eggColors),
                        ()=> s.while(this.shuffleEggColors.length > 0, [
        
                            ...[ //Get egg and rythm dots
                                ()=> this.eggColor = this.shuffleEggColors.pop(),
        
                                ()=> this.rythm = EGG_RYTHM_TRAINING[this.eggColor],
                                ()=> this.rythmDots = new RythmDots(this, WIDTH/2, HEIGHT*0.8, this.rythm),
                                ()=> this.displayRythm = true,
                
                                ()=> s.if(this.eggProgress[this.eggColor] != 0, [ //If its first egg show memory aid (dots)
                                    ()=> this.displayRythm = false,
                                    ()=> this.rythmDots.hide(),
                                ]),
                            ],
        
                            ...[ //Set Egg Reproduce Slide
                                ()=> this.slide.setImage("slideReproduceBlank"),
                                ()=> this.trainingEgg.setImage(this.eggColor).show(),
                            ],
        
                            ...[ //Wait for Rythm
                                ()=> waitRythm(s, this.rythm, this.trainingEgg.getPhaserImage(), ()=> {
                                    this.sound.play(TAP_SOUND);
                                    
                                    }, (rythmAccuracy)=>{this.rythmAccuracy = rythmAccuracy}),
                
                                ()=> this.rythmDots.destroy(),
                            ],
        
                            ...[ //Check if correct, only if egg is still in game
                                ()=> s.if(this.rythmAccuracy < 0.3, [
                                    ()=> s.if( inArray(this.eggColor, Object.keys(this.eggProgress)), [
                                        ()=> this.eggProgress[this.eggColor]++,
                                    ]),
                                    ()=> this.slide.setImage("slideCorrectBlank"),
                                    ()=> this.trainingEgg.setImage(`diamond`),
                                    ()=> this.sound.play(DIAMOND_SOUND),

        
                                    ()=> s.if(this.eggProgress[this.eggColor] >= TRAINING_EGG_REPS+1, [ //+1 because of the practise trial with the dots shown
                                        ()=> delete this.eggProgress[this.eggColor] //Mark as "learned"
                                    ]),
        
                                ]),
                                ()=> s.if(this.rythmAccuracy >= 0.3, [
                                    ()=> s.if( inArray(this.eggColor, Object.keys(this.eggProgress)), [
                                        ()=> this.eggProgress[this.eggColor] = 0,
                                    ]),
                                    ()=> this.slide.setImage("slideIncorrectBlank"),
                                    ()=> this.trainingEgg.setImage(`${this.eggColor}Shell`),
                                    ()=> this.sound.play(CRACK_SOUND),
                                    ()=> this.repeatTrial = true,
                                ]),
        
                                ()=> s.wait(1500),
                            ],
                        ]),
                    ]
                ]),
            ],

            ...[ //Log data
                this.logData()
            ],
        ],

        ()=> this.stage = "EggHunt1",
        ()=> runEggHunt(this, s, {"eggBlue":[2,1,2,1], "eggRed":[1,1,2,2], "eggYellow":[1,2,2,1], "eggCyan":[1,999,999,1]}, 40),

        ()=> this.background.destroy(),
        ()=> this.safe.destroy(),
        ()=> this.slide.setImage("white"),
        ()=> document.body.style.backgroundColor = "white",
        ()=> this.add.text(WIDTH/2,HEIGHT/2, `Some of the eggs may now not yield a diamond anymore.
As before, please try to collect as many diamonds as possible.`, { fontSize: '50px', fill: '#000', align: 'center' , fontFamily: "calibri"}).setOrigin(0.5, 0.5),
        ()=> this.nextButton.show(),
        ()=> s.waitInput({trigger:"CLICK", image:this.nextButton.getPhaserImage()}),
        ()=> this.nextButton.hide(),

        ()=> this.stage = "EggHunt2",
        ()=> runEggHunt(this, s, {"eggBlue":[2,1,2,1], "eggRed":[1,999, 999,1], "eggYellow":[1,999, 999,1], "eggCyan":[1,999, 999,1]}, 40),


        () => exportToCsv(this.columns, this.data)

    ])
        

    this.s = s

}







function update(time, delta)
{
    this.s.play()

    this.debugText.setText(`
fps: ${Math.round(delta)}`)
}





function runEggHunt(scope, s, eggRythmDict, iterationsPerEgg) {
    s.insert([
        
        ...[ //Phase 3: EggHunt

            ...[ //Prepare EggHunt
                
                ()=> scope.shuffledEggSequence = randomizeSequence(Object.keys(eggRythmDict), 500),

                ()=> console.log(scope.shuffledEggSequence),

                ()=> scope.background = new PsyImage(scope, WIDTH/2, HEIGHT/2, "background", 1, 1),
                ()=> scope.safe = scope.add.image(WIDTH/2,HEIGHT - 60, "safe").setScale(0.2).setOrigin(0.5).setAlpha(0.8),

                ()=> scope.scoreText = scope.add.text(WIDTH/2,HEIGHT - 60, 'Depot: 0', { fontSize: '50px', fill: '#FFF', align: 'center' , fontFamily: "calibri"}),
                ()=> scope.scoreText.setOrigin(0.5),

                ()=> scope.trainingEgg.destroy(),
                ()=> document.body.style.backgroundColor = "black",
                
                ()=> scope.eggProgress = {"eggBlue":0, "eggRed":0, "eggYellow":0, "eggCyan":0},
                ()=> scope.locationList = [{x: 1465, y: 600},{x: 748, y: 788},{x: 685, y: 931},{x: 1178, y: 601},{x: 1254, y: 773}],

                ()=> scope.score = 0
            ],

            ...[ //Run EggHunt 
                ()=> scope.t = 0,
                ()=> s.while(Math.min(...getValues(scope.eggProgress)) < iterationsPerEgg, [

                    ...[ //Asynchronous Egg: Lifecycle
                        ()=> s.asynch((s)=> s.insert([
    
                            ...[ //Prepare
                                ()=> s.eggColor = scope.shuffledEggSequence[scope.t],
                                ()=> s.rythm = eggRythmDict[s.eggColor],
                                ()=> s.location = shuffle(scope.locationList).pop(),
                                ()=> s.egg = new PsyImage(scope, s.location.x, s.location.y, s.eggColor, 1, 1, [0.5,0.5], true),

                                ()=> s.hasHovered = false
                            ],
    
                            ...[ //Wait for Rythm, or 

                                ()=> s.eggInitTimeout = 1000 + Math.floor(Math.random() * 1000),
                                ()=> scope.timer = Date.now(),
                                ()=> s.waitInput([
                                    {timer:s.eggInitTimeout, func:()=>{s.timeHover = -1}},
                                    {trigger:"HOVER", image:s.egg.getPhaserImage(), func:()=>{s.timeHover = (Date.now() - scope.timer)}}]),

                                ()=> waitRythm(s, s.rythm, s.egg.getPhaserImage(), ()=> scope.sound.play(TAP_SOUND),
                                                (rythmAccuracy, userRythm)=>{s.rythmAccuracy = rythmAccuracy; s.userRythm = userRythm}, 
                                                1000, 1500),
                            ],
    
                            ...[ //Evaluate Result
    

                                ()=> s.if(safeCompare(s.rythm, [1,999,999,1]), [
                                    ()=> s.egg.hide(),
                                    ()=> scope.eggProgress[s.eggColor]++,
                                ]),

                                ()=> s.if(!safeCompare(s.rythm, [1,999,999,1]), [
                                    ()=> s.if(s.rythmAccuracy == -1, [
                                        ()=> s.egg.hide(),
                                    ]),
    
                                    ()=> s.if(s.rythmAccuracy != -1, [
                                        
                                        ()=> s.if(s.rythmAccuracy < 0.3, [
                                            ()=> s.if(s.rythmAccuracy != -1, [
                                                ()=> s.egg.setImage(`diamond`),
                                                ()=> scope.sound.play(DIAMOND_SOUND),
                                                ()=> scope.score++,
                                                ()=> scope.scoreText.setText(`Depot: ${scope.score}`),
                                            ]),
                                        ]),
                    
                                        ()=> s.if(s.rythmAccuracy >= 0.3, [
                                            ()=> s.egg.setImage(`${s.eggColor}Shell`),
                                            ()=> scope.sound.play(CRACK_SOUND),
                                        ]),
    
                                        ()=> scope.eggProgress[s.eggColor]++,
                                    ]),
                                ]),


                                ()=> s.wait(1000),
                            ],
                    
                            ...[ //Finish off
                                ()=> s.egg.destroy(),    
            
                                ()=> s.wait(1000),
                                ()=> scope.locationList.push(s.location),
                            ],

                            ...[ //Collect Data
                                ()=> scope.eggColor = s.eggColor,
                                ()=> scope.rythm = s.rythm,
                                ()=> scope.location = s.location,
                                ()=> scope.rythmAccuracy = s.rythmAccuracy,
                                ()=> scope.userRythm = s.userRythm,
                                ()=> scope.timeHover = s.timeHover,
                                ()=> scope.eggProgressEgg = scope.eggProgress[s.eggColor],

                                ()=> scope.logData()
                            ],

                            console.log(scope.eggProgress)
                        ]))
                    ],
                    s.wait(3000),
                ()=> scope.t++]),
            ]
        ],
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



function waitRythm(s, rythm, image, onClick, returnFunc, initTimeout=99999, timeout=99999) {

    s.insert([
        ()=> s.trigger = [{trigger: "CLICK", image:image, func:onClick}, {trigger: "R", image:image, func:onClick}],
        ()=> s.timer = {timer: initTimeout, image:image, func: ()=> {s.wRi = rythm.length; s.rythmAccuracy= -1}},

        ()=> s.userRythm = [],
        ()=> s.rythmAccuracy = undefined,

        ()=> s.wRi=0,
        ()=> s.while(s.wRi <= rythm.length, [
            ()=> s.if(s.wRi > 0, [
                ()=> s.timer.timer = timeout
            ]),
            ()=> s.startTime = Date.now(),
            ()=> s.waitInput([...s.trigger, s.timer]),
            ()=> s.userRythm.push(Date.now()-s.startTime),
            ()=> s.wRi++
        ]),

        ()=> s.if(s.rythmAccuracy === undefined, [ //If the rythm is not set to be 1 due to incomplete rythm making
            ()=> s.rythmAccuracy = rythmsMatch(s.userRythm.slice(1), rythm)
        ]),

        ()=> returnFunc(s.rythmAccuracy, s.userRythm)
    ])
}



























const WIDTH = 1920
const HEIGHT = 1080

const TAP_SOUND = "chisel"
const DIAMOND_SOUND = "diamond"
const CRACK_SOUND = "glass_break"

const TRAINING_EGG_REPS = 5
const GAME_EGG_REPS = 10

const EGG_LOC = {x:WIDTH*0.5, y:HEIGHT*0.46}
const NEXT_BUTTON_LOC = {x:WIDTH*0.8, y:HEIGHT*0.93}
const CURSOR_LOC = {x:WIDTH*0.51, y:HEIGHT*0.44}


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
	return [...arr.sort(() => Math.random() - 0.5)]
}


function randomizeSequence(items, length) {
    let result = []
  
    for(let i=0; i< (length / 4); i++) {
  	    result = [...result, ...shuffle(items)]
    }
  
    return result
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


function setHoverable(image) {
    image.on('pointerover',() => { hover.image = image; })
    image.on('pointerout',() => {hover.image = undefined; })
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

    q(appendSequence) {
        this.sequence = [...this.sequence, ...appendSequence]
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



class PsyImage {
    constructor(scene, x,y,image, alpha=1, scale=1, origin=[0.5,0.5], interactive=false) {
        this.image = scene.add.image(x,y, image)

        this.image.setOrigin(origin[0],origin[1])
        this.image.setScale(scale)
        this.image.setAlpha(alpha)

        if(interactive) {
            this.image.setInteractive({ useHandCursor: true })
            setHoverable(this.image)
        }
    }

    show() {
        this.image.setAlpha(1)
        return this
    }

    hide() {
        this.image.setAlpha(0)
        return this
    }

    setSemiTransparent() {
        this.image.setAlpha(0.5)
        return this
    }

    getPhaserImage() {
        return this.image
    }

    setImage(image) {
        this.image.setTexture(image)
        return this
    }

    destroy() {
        this.image.destroy()
    }
}



class RythmDots {

    constructor(scene, x,y,rythm , dotImage = "rythmDot") {
        const DOT_MARGIN = 40
        
        this.scene = scene
        this.counter = 0

        this.rythmBeats = rythmToRythmBeats(rythm),

        this.rythmDots = []
        for(let i=0; i<this.rythmBeats.length; i++) {
            var dotX = x - ((this.rythmBeats.length /2)*DOT_MARGIN) + ((i * DOT_MARGIN))

            var showDot = this.rythmBeats[i]
            if(showDot) {
                var dot = new PsyImage(this.scene, dotX, y, dotImage, 0.5) 
                this.rythmDots.push(dot)
            }
        }
    }

    play() {
        let currDot = this.rythmDots[this.counter]
        currDot.show()
        this.scene.time.addEvent({delay: 100, callback: (dot) => {dot.setSemiTransparent()}, args: [currDot], callbackScope: this})
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

    show() {
        for(var dot of this.rythmDots) {
            dot.setSemiTransparent()
        }
        return this
    }

    hide() {
        for(var dot of this.rythmDots) {
            dot.hide()
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

    constructor(scene, x, y, image, imageDown, scale=1) {
        this.scene = scene

        this.image = new PsyImage(scene, x, y, image, 0, scale, [0.5,0.5], false)
        this.imageDown = new PsyImage(scene, x, y, imageDown, 0, scale, [0.5,0.5], false)
    }

    show() {
        this.image.show()
    }

    hide() {
        this.image.hide()
        this.imageDown.hide()
    }

    click() {
        this.image.hide()
        this.imageDown.show()

        this.scene.time.addEvent({delay: 100, callback: (currScene) => {
            this.imageDown.hide()
            this.image.show()
        }, args: [this], callbackScope: this})
    }

    liftClick() {
        this.imageDown.hide()
        this.image.show()
    }

    destroy() {
        this.imageDown.getPhaserImage().destroy()
        this.image.getPhaserImage().destroy()
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






class MoveImage {
    constructor(scene,x1,y1, x2,y2, image, scale) {
        this.scene = scene
        
        this.image = new PsyImage(scene, x1, y1, image, 0, scale, [0.5,0.5], false)
        
        this.dX = x2-x1
        this.dY = y2-y1

        if(this.dX < this.dY) {
            this.stepX=1
            this.stepY= this.dY / this.dX
        }else{
            this.stepY=1
            this.stepX= this.dX / this.dY
        }

        this.x1=x1
        this.y1=y1

    }

    show() {
        this.image.show()
    }

    hide() {
        this.image.hide()
    }

    moveTowardDestination(steps=1) {
        this.image.getPhaserImage().x = Math.round(this.image.getPhaserImage().x + this.stepX*steps)
        this.image.getPhaserImage().y = Math.round(this.image.getPhaserImage().y + this.stepY*steps)       
    }

    isDone() {
        return (((this.image.getPhaserImage().x - this.x1) > this.dX) & ((this.image.getPhaserImage().y - this.y1) > this.dY))
    }

    destroy() {
        this.image.getPhaserImage().destroy()
    }

}




                                                                                                 
                                                                                                      




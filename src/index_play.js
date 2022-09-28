const WIDTH = 1920
const HEIGHT = 1080

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

    console.log(ir,ar)

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




class Sequence {


    constructor(scene, sequence=[]) {
        this.scene = scene

        this.asynchSequences = {}
    
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
                console.error("Runner found non processable item in sequence. Allowed are Arrays and Functions")
            }
            
            this.step++
        }

        //Play all asynchronous tasks
        for(let seqName of Object.keys(this.asynchSequences)) {
            this.asynchSequences[seqName].play()
        }
    }

    asynch(name, asynchSequence) {
        if(inArray(name, Object.keys(this.asynchSequences))) {
            throw "Name of asynch sequence is already assigned! Choose a different one"
        } else {
            this.asynchSequences[name] = asynchSequence
        }
        
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
        return this.step == this.sequence.length
    }

    while(condition, loopSequence) {
        if(condition) {
            loopSequence.push(this.sequence[this.step])
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

    wait(delay) {
        this.pause()
        var waitDelay = delay
        this.scene.time.addEvent({delay: waitDelay, callback: () => {this.resume()}, callbackScope: this})
    }


    waitClick(image) {
        this.pause()
        var scope = this
        
        if(image !== undefined) {
            var clickListener = image.on('pointerdown',()=> {scope.resume();clickListener.removeListener("pointerdown")})
        }else{
            var clickListener = this.scene.input.on("pointerdown", () => {this.resume();clickListener.removeListener("pointerdown")})
        }
    }

    waitKey(key="SPACE", image) {
        this.pause()
        var keyListener = this.scene.input.keyboard.addKey(key).on('down', () => {
            this.resume()
            this.scene.input.keyboard.removeKey(key) 
            keyListener.removeListener("down")
        });
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



function shuffle(arr) {
	return arr.sort(() => Math.random() - 0.5)
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


function waitRythm(scene, rythm, image, onClick, returnFunc) {
    scene.s.insert([
        ()=> scene.userRythm = [],

        ()=> scene.wRi=0,
        ()=> scene.s.while(scene.wRi <= rythm.length, [
            ()=> scene.startTime = Date.now(),
            ()=> scene.s.waitClick(image),
            ()=> scene.userRythm.push(Date.now()-scene.startTime),
            ()=> onClick(),
            ()=> scene.wRi++
        ]),

        ()=> returnFunc(rythmsMatch(scene.userRythm.slice(1), rythm))
    ])
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





function preload ()
{
    var img_slides = ["nextButton.PNG","rythmDot.png","clickUp.png", "clickDown.png",
                      "slide1.PNG","slide10.PNG","slide2.PNG","slide3.PNG","slide8.PNG","slide9.PNG","white.PNG",
                      "slideCorrectBlank.PNG","slideIncorrectBlank.PNG","slideLearnBlank.PNG","slideReproduceBlank.PNG","slideRetryBlank.PNG"]

    for(var img of img_slides) {
        this.load.image(img.split(".")[0], `assets/slides/${img}`);
    }

    var img_game = ["background.jpg","backgroundLayer.png","diamond.png","safe.png",
                    "eggBlue.png","eggCyan.png","eggRed.png","eggYellow.png",
                    "eggBlueShell.png","eggCyanShell.png","eggRedShell.png","eggYellowShell.png"]
    
    for(var img of img_game) {
        this.load.image(img.split(".")[0], `assets/game/${img}`);
    }

    var sounds = ["chisel.mp3","diamond.mp3","glass_break.mp3"]

    for(var sound of sounds) {
        this.load.audio(sound.split(".")[0], [`assets/sounds/${sound}`]);
    }
}










const EGG_RYTHM_DICT = {"eggBlue":[1,2,1], "eggRed":[1,1,2], "eggYellow":[2,1,1]}
const TAP_SOUND = "chisel"

const EGG_REPS = 3


const EGG_LOC = {x:WIDTH*0.5, y:HEIGHT*0.46}
const NEXT_BUTTON_LOC = {x:WIDTH*0.8, y:HEIGHT*0.93}
const CURSOR_LOC = {x:WIDTH*0.51, y:HEIGHT*0.44}

function create ()
{
    var s = new Sequence(this)

    this.debugMode = false
    this.debugText = this.add.text(20,20, '', { fontSize: '35px', fill: '#C00', align: 'left', fontFamily: "calibri"}).setOrigin(0).setAlpha(0),

    s.q([

        //Setup of variables, debug mode, etc.
        
        ()=> this.slide = new PsyImage(this, WIDTH/2, HEIGHT/2, "white", 1, 1.5),
        ()=> this.nextButton = new PsyImage(this, NEXT_BUTTON_LOC.x, NEXT_BUTTON_LOC.y, "nextButton", 0, 1.5, [0.5,0.5], true),
        ()=> this.trainingEgg = new PsyImage(this, EGG_LOC.x, EGG_LOC.y, "eggBlue", 0, 1, [0.5,0.5], true),
        ()=> this.cursorImage = new CursorImage(this, CURSOR_LOC.x, CURSOR_LOC.y, "clickUp", "clickDown", 0.3),
        

        ()=> initSubmitButton(),

        ()=> s.while(participantId==0, [()=> s.wait(20)]),


        //Initialize Debug Mode
        ()=> s.if(this.debugMode, [
            ()=> this.debugText.setAlpha(1)
        ]),

        //Initial Block

        ()=> this.slide.setImage("slide1"),
        ()=> s.wait(2000),


        ()=> this.slide.setImage("slide2"),
        ()=> this.nextButton.show(),
        ()=> s.waitClick(this.nextButton.getPhaserImage()),
        ()=> this.slide.setImage("slide3"),
        ()=> s.waitClick(this.nextButton.getPhaserImage()),

        //Training on Single Eggs

        ()=> this.eggList = shuffle(Object.keys(EGG_RYTHM_DICT)),

        //For each Egg color
        ()=> s.while(false, [ //this.eggList.length>0
            ()=> this.eggColor = this.eggList.pop(),
            ()=> this.rythm = EGG_RYTHM_DICT[this.eggColor],

            ()=> this.repeatTrial=true,
            ()=> s.while(this.repeatTrial, [
                ()=> this.repeatTrial = false,
                ()=> this.slide.setImage("slideLearnBlank"),
                ()=> this.trainingEgg.setImage(this.eggColor),
                ()=> this.trainingEgg.show(),
                ()=> this.rythmDots = new RythmDots(this, WIDTH/2, HEIGHT*0.8, this.rythm),
    
                ()=> this.nextButton.hide(),

                ()=> s.wait(1000),

                //Play Rythm

                ()=> this.cursorImage.show(),
                ()=> s.wait(1000),
                ()=> playRythm(this, this.rythm, ()=> {
                    this.sound.play(TAP_SOUND); 
                    this.rythmDots.play();
                    this.cursorImage.click();
                }),
    
                //Present the Egg and Rythm
    
                ()=> s.wait(1000),
                ()=> this.cursorImage.hide(),
    
                //Ask to replicate the rythm, EGG_REPS times in a row, with support

                ()=> this.f=0,
                ()=> s.while((this.f < EGG_REPS) & (!this.repeatTrial), [
                    ()=> this.slide.setImage("slideReproduceBlank"),
                    ()=> this.trainingEgg.setImage(this.eggColor),
                    ()=> this.rythmDots.show(),
                
                    
                    ()=> waitRythm(this, this.rythm, this.trainingEgg.getPhaserImage(), ()=> {this.sound.play(TAP_SOUND)}, (rythmAccuracy)=>{this.rythmAccuracy = rythmAccuracy}),
        
                    ()=> this.rythmDots.hide(),

                    ()=> s.if(this.rythmAccuracy < 0.3, [
                        ()=> this.slide.setImage("slideCorrectBlank"),
                        ()=> this.trainingEgg.setImage(`diamond`),
                    ]),
                    ()=> s.if(this.rythmAccuracy >= 0.3, [
                        ()=> this.slide.setImage("slideIncorrectBlank"),
                        ()=> this.trainingEgg.setImage(`${this.eggColor}Shell`),
                        ()=> this.repeatTrial = true,
                    ]),
        
                    ()=> s.wait(1500),
                    ()=> this.f++
                ]),



                //Ask to replicate, EGG_REPS times in a row, without support

                ()=> this.f=0,
                ()=> s.while((this.f < EGG_REPS) & (!this.repeatTrial), [
                    ()=> this.slide.setImage("slideReproduceBlank"),
                    ()=> this.trainingEgg.setImage(this.eggColor),

                    ()=> waitRythm(this, this.rythm, this.trainingEgg.getPhaserImage(), ()=> {this.sound.play(TAP_SOUND), console.log("Tap!")}, (rythmAccuracy)=>{this.rythmAccuracy = rythmAccuracy}),

                    ()=> s.if(this.rythmAccuracy < 0.3, [
                        ()=> this.slide.setImage("slideCorrectBlank"),
                        ()=> this.trainingEgg.setImage(`diamond`),
                    ]),
                    ()=> s.if(this.rythmAccuracy >= 0.3, [
                        ()=> this.slide.setImage("slideIncorrectBlank"),
                        ()=> this.trainingEgg.setImage(`${this.eggColor}Shell`),
                        ()=> this.repeatTrial = true,
                    ]),
        
                    ()=> s.wait(1500),
                    ()=> this.f++

                ]),
            ]),
        ]),



        ()=> this.nextButton.hide(),

        //Phase, now with all three eggs
        
        
        ()=> this.eggProgress = {"eggBlue":0, "eggRed":0, "eggYellow":0},

        ()=> s.while(Object.keys(this.eggProgress).length > 0, [
            ()=> this.shuffled = shuffle(Object.keys(this.eggProgress)),
            ()=> console.log(this.shuffled),
            ()=> console.log(this.eggProgress),
            ()=> this.eggColor = this.shuffled.pop(), //Get random Egg from existing eggs dict

            ()=> this.rythm = EGG_RYTHM_DICT[this.eggColor],
            ()=> this.rythmDots = new RythmDots(this, WIDTH/2, HEIGHT*0.8, this.rythm),

            ()=> s.if(this.eggProgress[this.eggColor] != 0, [ //If its first egg show memory aid (dots)
                ()=> this.rythmDots.hide()
            ]),
            

            //Same code as above, let participant reproduce rythm

            ()=> this.slide.setImage("slideReproduceBlank"),
            ()=> this.trainingEgg.setImage(this.eggColor).show(),

            ()=> waitRythm(this, this.rythm, this.trainingEgg.getPhaserImage(), ()=> {this.sound.play(TAP_SOUND), console.log("Tap!")}, (rythmAccuracy)=>{this.rythmAccuracy = rythmAccuracy}),

            ()=> this.rythmDots.destroy(),

            ()=> s.if(this.rythmAccuracy < 0.3, [
                ()=> this.eggProgress[this.eggColor]++,
                ()=> this.slide.setImage("slideCorrectBlank"),
                ()=> this.trainingEgg.setImage(`diamond`),
            ]),
            ()=> s.if(this.rythmAccuracy >= 0.3, [
                ()=> this.eggProgress[this.eggColor] = 0,
                ()=> this.slide.setImage("slideIncorrectBlank"),
                ()=> this.trainingEgg.setImage(`${this.eggColor}Shell`),
                ()=> this.repeatTrial = true,
            ]),

            //Check if egg is done (remove from dict)
            
            ()=> s.if(this.eggProgress[this.eggColor] == EGG_REPS+1, [ //+1 because of the practise trial with the dots shown
                ()=> delete this.eggProgress[this.eggColor]
            ]),

            ()=> s.wait(1500),

        ]),

    ])
        

    this.s = s

}

function update(time, delta)
{
    this.s.play()

    this.debugText.setText(`
fps: ${Math.round(delta)}`)
}

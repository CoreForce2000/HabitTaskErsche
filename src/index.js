
var width=1920
var height=1080

function general_config(speed) {

    return {
        //Size and Scale
        width:1920,
        height:1080,

        egg_size: 0.2,

        //Grid where Eggs can Appear

        grid_x: 8,
        grid_y: 6,
        grid_margin: 1,
        grid_random: 0.2,

        //Speed

        max_speed: 4.0,
        min_speed: 0.8,

        speed_change_correct: 0.6,
        speed_change_incorrect: -0.4,
        speed_change_miss: -0.4,

        //Ingame: Training Parameters

        beat_duration: 300, //When playing the Beat in Practise
        delay_before_rythm_play: 0,
        delay_after_rythm_play: 1000,
        train_delay_between_beats:2000,

        //Ingame: Phase Parameters

        egg_drop_frequency: 4000 + (Math.random() * 1000), //
        egg_exist_duration: 3000 + (Math.random() * 2000), //
        egg_stay_after_collect_duration: 0 ,

        diamond_exist_duration: 1500,
        location_cooldown_duration: 2500,

        //Rythm Error Margin

        error_margin: 0.4,

        //Higher Level Parameters

        wait_after_trial_complete: 200,
        practise1_reps: 1,
        practice2_reps: 1,
        eggs_per_color: 5,
        
        //Misc

        collect_sound: "diamond",
        tap_sound: "tap",
        debug_mode: false,
        randomness: "absolute", //relative,  //Description: With absolute randomness each color is always picked with the same probability, with relative its depending on the number of eggs of that color in the list, so the less eggs the less likely it will be selected
    
        egg_locations_random: false
    }
}



var game_data_columns = ["participant_id", "trial_id", "phase", "ts", "egg", "x","y","event", "input_rythm_1","input_rythm_2","input_rythm_3", "error"]





//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
//
//MISCELLANEOUS FUNCTIONS
//
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



function sumArray(array) {
	const reducer = (accumulator, curr) => accumulator + curr;
	return array.reduce(reducer)
}


function arrayRemove(arr, value) {
    if(arr.length == 0) {
   			console.log("[arrayRemoveRandom]: Empty Array received")
    } else {
        for(var i=0; i<arr.length; i++) {
            if(safeCompare(arr[i], value)) {
                arr.splice(i,1)
                return value
            }
        }
    }
}

function arrayRemoveRandom(arr) {
    if(arr.length == 0) {
   		console.log("[arrayRemoveRandom]: Empty Array received")
    } else {
    	return arr.splice(Math.floor(Math.random()*arr.length), 1)[0];
    }
}


function arrayIn(arr1, arr2) {
    return arr1.every(elem => arr2.indexOf(elem) > -1)
}

function safeCompare(item1, item2) {
    return (JSON.stringify(item1) == JSON.stringify(item2))
}

function safeItemInArray(item, arr) {
    for(var i=0; i<arr.length; i++) {
        if(safeCompare(item, arr[i])) {
            return true
        }
    }
    return false
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



function shuffle(arr) {
	return arr.sort(() => Math.random() - 0.5)
}

function unique(arr) {
	return arr.filter((v, i, a) => a.indexOf(v) === i);
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


function rythmsMatch(ir, ar) { //Inputs are input_rythm and actual_rythm

    var ir_total_duration = sumArray(ir)
    var ar_total_beats = sumArray(rythmToRythmBreaks(ar))

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





// LLLLLLLLLLL             IIIIIIIIII   SSSSSSSSSSSSSSS TTTTTTTTTTTTTTTTTTTTTTT
// L:::::::::L             I::::::::I SS:::::::::::::::ST:::::::::::::::::::::T
// L:::::::::L             I::::::::IS:::::SSSSSS::::::ST:::::::::::::::::::::T
// LL:::::::LL             II::::::IIS:::::S     SSSSSSST:::::TT:::::::TT:::::T
//   L:::::L                 I::::I  S:::::S            TTTTTT  T:::::T  TTTTTT
//   L:::::L                 I::::I  S:::::S                    T:::::T        
//   L:::::L                 I::::I   S::::SSSS                 T:::::T        
//   L:::::L                 I::::I    SS::::::SSSSS            T:::::T        
//   L:::::L                 I::::I      SSS::::::::SS          T:::::T        
//   L:::::L                 I::::I         SSSSSS::::S         T:::::T        
//   L:::::L                 I::::I              S:::::S        T:::::T        
//   L:::::L         LLLLLL  I::::I              S:::::S        T:::::T        
// LL:::::::LLLLLLLLL:::::LII::::::IISSSSSSS     S:::::S      TT:::::::TT      
// L::::::::::::::::::::::LI::::::::IS::::::SSSSSS:::::S      T:::::::::T      
// L::::::::::::::::::::::LI::::::::IS:::::::::::::::SS       T:::::::::T      
// LLLLLLLLLLLLLLLLLLLLLLLLIIIIIIIIII SSSSSSSSSSSSSSS         TTTTTTTTTTT 



/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

LIST MANAGER

Takes care of the different lists of completed, incompleted, visible and invisible (eggs or rythms)
Includes functions to make things easier

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/



export class ListManager {

    constructor(invisible_list, distractor_list=[]) {
        
        this.prefix = "[ListManager]:"

        this.invisible_list = [...invisible_list]
        this.visible_list = []
        this.completed_list = []
        this.failed_list = []

        this.distractor_list = [...distractor_list]

    }

    log(message) {
        console.log(`${message}`)
    }


    printStatus() {
        this.log(` >> visible: ${this.visible_list.length}`)
        this.log(` >> invisible: ${this.invisible_list.length}`)
        this.log(` >> completed: ${this.completed_list.length}`)
        this.log(` >> failed: ${this.failed_list.length}`)
    }

    printStatusFull() {
        this.log(` >> visible: ${this.visible_list}`)
        this.log(` >> invisible: ${this.invisible_list}`)
        this.log(` >> completed: ${this.completed_list}`)
        this.log(` >> failed: ${this.failed_list}`)
    }

    hasItems() {
        return (this.invisible_list.length > 0)
    }

    getRandom() {
        if(general_config(1).randomness == "absolute") {
            var item = arrayRemoveRandom(unique(this.invisible_list))

            if(this.invisible_list.length > 0) {
                var item = arrayRemove(this.invisible_list, item)
                this.visible_list.push(item)

                return item
            }
        }
        else if(general_config(1).randomness == "relative") {
            var item = arrayRemoveRandom(this.invisible_list)
            this.visible_list.push(item)

            return item
        }else{
            this.log("ERROR: No valid randomness selected")
        }
    }


    remove(item, complete=false, successful=false) {
        if(safeItemInArray(item,this.visible_list)) {
            var item = arrayRemove(this.visible_list, item)
            
            if(complete) {
                if(successful) {
                    this.completed_list.push(item)
                }else {
                    this.failed_list.push(item)
                }
            }else {
                this.invisible_list.push(item)
            }

            return true
        }else{
            this.log(`return: No such items in the visible list`)
            if(safeItemInArray(item,this.invisible_list)) {
                this.log(`However, it seems to be in the invisible list. Is it not removed from visible in your code?`)
            }
            return false
        }
    }


    isDone() {
        return arrayIn([...this.visible_list, ...this.invisible_list], this.distractor_list)
    }
}



// RRRRRRRRRRRRRRRRR   YYYYYYY       YYYYYYYTTTTTTTTTTTTTTTTTTTTTTTHHHHHHHHH     HHHHHHHHHMMMMMMMM               MMMMMMMM
// R::::::::::::::::R  Y:::::Y       Y:::::YT:::::::::::::::::::::TH:::::::H     H:::::::HM:::::::M             M:::::::M
// R::::::RRRRRR:::::R Y:::::Y       Y:::::YT:::::::::::::::::::::TH:::::::H     H:::::::HM::::::::M           M::::::::M
// RR:::::R     R:::::RY::::::Y     Y::::::YT:::::TT:::::::TT:::::THH::::::H     H::::::HHM:::::::::M         M:::::::::M
//   R::::R     R:::::RYYY:::::Y   Y:::::YYYTTTTTT  T:::::T  TTTTTT  H:::::H     H:::::H  M::::::::::M       M::::::::::M
//   R::::R     R:::::R   Y:::::Y Y:::::Y           T:::::T          H:::::H     H:::::H  M:::::::::::M     M:::::::::::M
//   R::::RRRRRR:::::R     Y:::::Y:::::Y            T:::::T          H::::::HHHHH::::::H  M:::::::M::::M   M::::M:::::::M
//   R:::::::::::::RR       Y:::::::::Y             T:::::T          H:::::::::::::::::H  M::::::M M::::M M::::M M::::::M
//   R::::RRRRRR:::::R       Y:::::::Y              T:::::T          H:::::::::::::::::H  M::::::M  M::::M::::M  M::::::M
//   R::::R     R:::::R       Y:::::Y               T:::::T          H::::::HHHHH::::::H  M::::::M   M:::::::M   M::::::M
//   R::::R     R:::::R       Y:::::Y               T:::::T          H:::::H     H:::::H  M::::::M    M:::::M    M::::::M
//   R::::R     R:::::R       Y:::::Y               T:::::T          H:::::H     H:::::H  M::::::M     MMMMM     M::::::M
// RR:::::R     R:::::R       Y:::::Y             TT:::::::TT      HH::::::H     H::::::HHM::::::M               M::::::M
// R::::::R     R:::::R    YYYY:::::YYYY          T:::::::::T      H:::::::H     H:::::::HM::::::M               M::::::M
// R::::::R     R:::::R    Y:::::::::::Y          T:::::::::T      H:::::::H     H:::::::HM::::::M               M::::::M
// RRRRRRRR     RRRRRRR    YYYYYYYYYYYYY          TTTTTTTTTTT      HHHHHHHHH     HHHHHHHHHMMMMMMMM               MMMMMMMM


/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

RYTHM MANAGER

Listens for Clicks and Keyboard press as well as hover. 
Possiblity to initialize a "Rythm Listener" associated with an image. 

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


class RythmObject {
    constructor(image, rythm, sound, func) {
        this.image = image

        this.rythm = rythm
        this.sound = sound
        this.input_rythm = []
        this.func = func

        this.complete = false
        this.error = 1
    }

    pushBeat(duration) {
        this.input_rythm.push(duration)
    }
}




export class RythmManager {
    constructor(scope) {

        this.prefix = "[Rythm Manager]"
        this.scope = scope
        this.currently_hovering = 0

        this.debug_mode = false

        //Initialize Listener

        var this_this = this

        this.rythm_object = []



        this.scope.input.keyboard.on('keydown', function() {
            if(this_this.currently_hovering != 0) {
                this_this.click(this_this.currently_hovering)
            }
        });

        /*this.scope.input.on('pointerdown', function() {
            if(this_this.currently_hovering != 0) {
                
            }
        });*/



    }

    log(msg) {
        console.log(`${msg}`)
    }

    debug(msg) {
        if(this.debug_mode) {
            console.log(`DEBUG:${msg}`)
        }
    }

    hoverOver(rythm_obj) {
        this.debug(`Hovering over ${rythm_obj}`)
        this.currently_hovering = rythm_obj
    }

    removeRythmListener(egg_obj) {
        if(safeCompare(egg_obj, this.currently_hovering.image)) {
            this.hoverOver(0)
        }
    }

    
    addRythmListener(image, rythm, sound, pre_activate=false, func) {

        var rythm_object = new RythmObject(image, rythm, sound, func)

        var this_this = this

        rythm_object.image.on('pointerover',function() {
            this_this.log("Hovering")
            this_this.hoverOver(rythm_object)
        })

        rythm_object.image.on('pointerout',function() {
            this_this.log("Hovering no more")
            this_this.hoverOver(0)
        })

        rythm_object.image.on('pointerdown',function() {
            this_this.log("Hovering")
            this_this.hoverOver(rythm_object)
            this_this.click(this_this.currently_hovering)
        })

        if(pre_activate) {
            this_this.hoverOver(rythm_object)
        }
    }


    rythmImage(x, y, image, rythm, func, sound="tap", pre_activate=false) {

        this.scope.add.image(x,y,image)

        var rythm_object = new RythmObject(image, rythm, sound, func)

        var this_this = this

        rythm_object.image.on('pointerover',function() {
            this.log("Hovering")
            this_this.hoverOver(rythm_object)
        })

        rythm_object.image.on('pointerout',function() {
            this.log("Hovering no more")
            this_this.hoverOver(0)
        })

        if(pre_activate) {
            this_this.hoverOver(rythm_object)
        }
        console.log(rythm_object.texture.key)

        return rythm_object.image
    }


    click() 
    {
        this.curr_time = Date.now()


        this.log(`tap Registered on ${this.currently_hovering}`)

        if(this.currently_hovering != 0) {
            this.scope.sound.play(this.currently_hovering.sound)
            this.scope.sound.context.resume();
        }


        //Code for pushing the new time. Since we only want the intervals between clicks, after the first click we dont have a duration yet
        //So we put a placeholder (0). In the next beat we replace it with a duration

        if(this.currently_hovering.input_rythm.length == 0) {
            this.currently_hovering.input_rythm.push(0)
        } else {
            var interval = this.curr_time - this.start_time

            if(this.currently_hovering.input_rythm[0] == 0) {
                this.currently_hovering.input_rythm[0] = interval
            }else{
                this.currently_hovering.input_rythm.push(interval)
            }   
        }

        this.start_time = this.curr_time
                
        //If the rythms match

        if(this.currently_hovering.input_rythm.length == this.currently_hovering.rythm.length) {
            if(this.rythmsMatch(this.currently_hovering)) {
                this.debug("Rythm Success!")
                this.currently_hovering.func(true, this.currently_hovering)
                this.currently_hovering = 0
            } else {
                this.debug("Rythm Fail :(")
                this.currently_hovering.func(false, this.currently_hovering)
                this.currently_hovering = 0
            }
        }
    }

    
    rythmsMatch(rythm_obj) {

    this.log(rythm_obj.input_rythm)
    this.log(rythm_obj.rythm)
        
    //How do we compare the inserted rythm with the desired one?
    //Rythm is defined in config in beats, which is the smallest unit
    //Typically, 1 is short and 2 beats are long

    //We first summarize the number of beats in a rythm (should be the same for all rythms)
    var total_duration = sumArray(rythm_obj.input_rythm)
    var total_beats_actual_rythm = sumArray(rythm_obj.rythm)

    //then we divide the total duration by number of beats to get the length of all beats
    var beat_duration = total_duration / total_beats_actual_rythm
    

    var relative_error_list = []
    
    for(let i=0; i<rythm_obj.rythm.length; i++) {
        
        var input_break = rythm_obj.input_rythm[i]

        //Finally, we check for each entry if the number of beats times beat length (necessary length) Matches the one inserted
        var actual_break = rythm_obj.rythm[i] * beat_duration
        
        var error = Math.abs(input_break - actual_break)
        
        var relative_error = error / actual_break

        relative_error_list.push(relative_error)

        //Here we find the percentage divergence of the clicked with the ideal, and see if its below the threshold
        //If no, we break (fail), if yes, we continue until the end (success)
        //We are using percentage error, margin defined in config
        if(relative_error > general_config(1).error_margin) {
            return false
        }
    }

    var avg_relative_error = (sumArray(relative_error_list) / relative_error_list.length)

    this.log(`avg. relative error: ${avg_relative_error}`)

    rythm_obj.error = avg_relative_error
    
    return true

    }
}








//    SSSSSSSSSSSSSSS EEEEEEEEEEEEEEEEEEEEEE     QQQQQQQQQ     UUUUUUUU     UUUUUUUUEEEEEEEEEEEEEEEEEEEEEENNNNNNNN        NNNNNNNN        CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEE
//  SS:::::::::::::::SE::::::::::::::::::::E   QQ:::::::::QQ   U::::::U     U::::::UE::::::::::::::::::::EN:::::::N       N::::::N     CCC::::::::::::CE::::::::::::::::::::E
// S:::::SSSSSS::::::SE::::::::::::::::::::E QQ:::::::::::::QQ U::::::U     U::::::UE::::::::::::::::::::EN::::::::N      N::::::N   CC:::::::::::::::CE::::::::::::::::::::E
// S:::::S     SSSSSSSEE::::::EEEEEEEEE::::EQ:::::::QQQ:::::::QUU:::::U     U:::::UUEE::::::EEEEEEEEE::::EN:::::::::N     N::::::N  C:::::CCCCCCCC::::CEE::::::EEEEEEEEE::::E
// S:::::S              E:::::E       EEEEEEQ::::::O   Q::::::Q U:::::U     U:::::U   E:::::E       EEEEEEN::::::::::N    N::::::N C:::::C       CCCCCC  E:::::E       EEEEEE
// S:::::S              E:::::E             Q:::::O     Q:::::Q U:::::D     D:::::U   E:::::E             N:::::::::::N   N::::::NC:::::C                E:::::E             
//  S::::SSSS           E::::::EEEEEEEEEE   Q:::::O     Q:::::Q U:::::D     D:::::U   E::::::EEEEEEEEEE   N:::::::N::::N  N::::::NC:::::C                E::::::EEEEEEEEEE   
//   SS::::::SSSSS      E:::::::::::::::E   Q:::::O     Q:::::Q U:::::D     D:::::U   E:::::::::::::::E   N::::::N N::::N N::::::NC:::::C                E:::::::::::::::E   
//     SSS::::::::SS    E:::::::::::::::E   Q:::::O     Q:::::Q U:::::D     D:::::U   E:::::::::::::::E   N::::::N  N::::N:::::::NC:::::C                E:::::::::::::::E   
//        SSSSSS::::S   E::::::EEEEEEEEEE   Q:::::O     Q:::::Q U:::::D     D:::::U   E::::::EEEEEEEEEE   N::::::N   N:::::::::::NC:::::C                E::::::EEEEEEEEEE   
//             S:::::S  E:::::E             Q:::::O  QQQQ:::::Q U:::::D     D:::::U   E:::::E             N::::::N    N::::::::::NC:::::C                E:::::E             
//             S:::::S  E:::::E       EEEEEEQ::::::O Q::::::::Q U::::::U   U::::::U   E:::::E       EEEEEEN::::::N     N:::::::::N C:::::C       CCCCCC  E:::::E       EEEEEE
// SSSSSSS     S:::::SEE::::::EEEEEEEE:::::EQ:::::::QQ::::::::Q U:::::::UUU:::::::U EE::::::EEEEEEEE:::::EN::::::N      N::::::::N  C:::::CCCCCCCC::::CEE::::::EEEEEEEE:::::E
// S::::::SSSSSS:::::SE::::::::::::::::::::E QQ::::::::::::::Q   UU:::::::::::::UU  E::::::::::::::::::::EN::::::N       N:::::::N   CC:::::::::::::::CE::::::::::::::::::::E
// S:::::::::::::::SS E::::::::::::::::::::E   QQ:::::::::::Q      UU:::::::::UU    E::::::::::::::::::::EN::::::N        N::::::N     CCC::::::::::::CE::::::::::::::::::::E
//  SSSSSSSSSSSSSSS   EEEEEEEEEEEEEEEEEEEEEE     QQQQQQQQ::::QQ      UUUUUUUUU      EEEEEEEEEEEEEEEEEEEEEENNNNNNNN         NNNNNNN        CCCCCCCCCCCCCEEEEEEEEEEEEEEEEEEEEEE
//                                                        Q:::::Q                                                                                                             
//                                                         QQQQQQ                                                                                                        
       


class Sequence {


    constructor(scene, sequence=[]) {
        this.scene = scene

        this.asynchSequences = []
    
        this.step = 0
        this.paused = false
        this.sequence = sequence

        this.loopStart = []
    }

    play() {
        while(!this.isDone() & !this.isPaused()) {
            this.sequence[this.step]()
            this.step++
        }

        //Play all asynchronous tasks
        for(var asynchSequence of this.asynchSequences) {
            asynchSequence.play()
        }
    }

    asynch(asynchSequence) {
        this.asynchSequences.push(asynchSequence)
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

    loop() {
        this.loopStart[this.loopStart.length] = this.step
    }

    if(condition) {
        this.playIf = condition
    }

    else() {
        this.playIf = !this.playIf 
    }

    endif() {
        this.playIf = true
    }

    while(ignore, condition) {
        if(condition) {
            this.step = this.loopStart[this.loopStart.length-1]
        }else{
            this.loopStart.pop()
        }
    }

    q(appendSequence) {
        this.sequence = [...this.sequence, ...appendSequence]
    }

    destroy() {
        this.sequence = []
        this.asynchSequence = []
        this.step=0
        this.paused=true
    }



    //Timer Functions

    wait(delay=1) {
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










class RythmDots {

    constructor(scene, x,y, rythm) {
        const DOT_MARGIN = 40

        this.scene = scene
        this.counter = 0

        this.rythmDots = []
        for(let i=0; i<rythm.length; i++) {
            var dotX = x - ((rythm.length /2)*DOT_MARGIN) + ((f * DOT_MARGIN))

            var showDot = rythm[f]
            if(showDot) {
                rythmDots.push(this.add.image(dotX, y , "rythmDot").setOrigin(0.5,0.5).setAlpha(0))
            }
        }
    }

    play() {
        this.rythmDots[this.counter].setAlpha(1.0)
        this.scene.time.addEvent({delay: 100, callback: () => {this.rythmDots[this.counter].setAlpha(0.5)}, callbackScope: this})
        this.counter++
        if(this.counter == this.rythmDots.length) {
            this.counter = 0
        }
    }

    resetPlay() {
        this.counter = 0
    }

    destroy() {
        for(var dot of this.rythmDots) {
            dot.destroy()
        }
    }
}











//         GGGGGGGGGGGGG     OOOOOOOOO     
//      GGG::::::::::::G   OO:::::::::OO   
//    GG:::::::::::::::G OO:::::::::::::OO 
//   G:::::GGGGGGGG::::GO:::::::OOO:::::::O
//  G:::::G       GGGGGGO::::::O   O::::::O
// G:::::G              O:::::O     O:::::O
// G:::::G              O:::::O     O:::::O
// G:::::G    GGGGGGGGGGO:::::O     O:::::O
// G:::::G    G::::::::GO:::::O     O:::::O
// G:::::G    GGGGG::::GO:::::O     O:::::O
// G:::::G        G::::GO:::::O     O:::::O
//  G:::::G       G::::GO::::::O   O::::::O
//   G:::::GGGGGGGG::::GO:::::::OOO:::::::O
//    GG:::::::::::::::G OO:::::::::::::OO 
//      GGG::::::GGG:::G   OO:::::::::OO   
//         GGGGGG   GGGG     OOOOOOOOO     


class Study extends Phaser.Scene {
    constructor() {
      super('Study')
      this.debug = false
      this.hovering = undefined
    }


    //playBeat = (sound) => {this.scene.sound.play(sound); this.scene.sound.context.resume()}
    //visualBeat = (image) => {image.setAlpha(1);this.scene.time.addEvent({ delay: 100, callback: () => {image.setAlpha(0.5)}, callbackScope: this})}

    setHoverable(img) {
        var scene = this
        img.on('pointerover',() => {scene.hovering = img; console.log("Hovering")})
        img.on('pointerout',() => {scene.hovering = undefined; console.log("Hovering")})
    }


    preload() {

        var img_slides = ["nextButton.PNG","rythmDot.png","slide1.PNG","slide10.PNG","slide2.PNG","slide3.PNG","slide8.PNG","slide9.PNG","white.PNG",
        //"slideCorrect.PNG","slideIncorrect.PNG","slideLearn.PNG","slideReproduce.PNG","slideRetry.PNG",
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




    create(data) {
        const EGG_RYTHM_DICT = {"eggBlue":[1,1,0,1,1], "eggRed":[1,1,1,0,1], "eggYellow":[1,0,1,1,1]}


        this.slide = this.add.image(0.5* width, 0.5* height, "slideWhite").setOrigin(0.5,0.5).setScale(1.5);

        this.egg = this.add.image(0.5* width, 0.46* height , "eggRed").setOrigin(0.5,0.5).setAlpha(0)
        this.egg.setInteractive({ useHandCursor: true })
        this.setHoverable(this.egg)

        this.nextButton = this.add.image(width*0.8, height*0.93, "nextButton").setOrigin(0.5,0.5).setScale(1.5).setAlpha(0);
        this.nextButton.setInteractive({ useHandCursor: true })
        this.setHoverable(this.nextButton)

        this.debugText = this.add.text(20,20, '', { fontSize: '35px', fill: '#C00', align: 'left', fontFamily: "calibri"});
        this.debugText.setOrigin(0)

        var s = new Sequence(this)


        //visualBeat = (image) => {image.setAlpha(1);this.scene.time.addEvent({ delay: 100, callback: () => {image.setAlpha(0.5)}, callbackScope: this})}
    

        var waitRythm = (args, returnFunc) => {
            return [
                ()=> this.args = args(),

                ()=> this.userRythm = [],
                ()=> s.waitClick(this.args.image),
                ()=> this.sound.play(this.args.sound),
                ()=> s.loop(this.waitRythm_i=0),
                
                    ()=> this.startTime = Date.now(),
                    ()=> s.waitClick(this.args.image),
                    ()=> this.userRythm.push(Date.now()-this.startTime),
                    ()=> this.sound.play(this.args.sound),
                ()=> s.while(this.waitRythm_i++, this.waitRythm_i < this.args.rythm.length),

                ()=> returnFunc(rythmsMatch(this.userRythm, this.args.rythm))
            ]
        }




        var destroyRythmDots = (args, returnFunc) => {
            return [
                ()=> s.loop(this.f = 0),
                ()=> this.rythmDots[this.f].destroy(),
                ()=> s.while(this.f++, this.f < this.rythmDots.length)
            ]
        }


        function beatToTapList(rythm) {
            var rythmTap = [true]
            for(var beat of rythm) {
                for(let i=1; i<beat; i++) {
                    rythmTap.push(false)
                }
                rythmTap.push(true)
            }
            return rythmTap
        }



        var slideReproduce = ()=> {
            return [
                ()=> this.slide.setTexture("slideReproduceBlank"),

                ()=> this.egg.setTexture(this.eggColor).setAlpha(0.5),
                ()=> this.nextButton.setAlpha(0),

                ...waitRythm(()=> {return {image:this.egg, rythm:this.rythm, sound:"chisel"}}, (rythmAccuracy)=> {this.rythmAccuracy=rythmAccuracy}),

                ()=> {if(this.rythmAccuracy < 0.3) {
                        this.slide.setTexture("slideCorrectBlank")
                        this.egg.setTexture("diamond")
                        this.em.remove(this.eggColor, true, true)}
                    else{
                        this.slide.setTexture("slideIncorrectBlank")
                        this.egg.setTexture(`${this.eggColor}Shell`)
                        this.em.remove(this.eggColor, true, false)}},



                ()=> s.wait(1500),


            ]
        }



        var slidesInstruction = ()=> {return [
            ()=> this.slide.setTexture("slide1"),
            ()=> s.wait(1000),
            ()=> this.slide.setTexture("slide2"),
            ()=> this.nextButton.setAlpha(1),
            ()=> s.waitClick(this.nextButton),
            ()=> this.slide.setTexture("slide3"),
            ()=> s.waitClick(this.nextButton),
            ()=> this.nextButton.setAlpha(0)]}


        var slideLearn = (args, returnFunc)=> {return [ ()=> this.args = args(),
                ()=> this.slide.setTexture("slideLearnBlank"),
                ()=> this.egg.setTexture(this.eggColor).setAlpha(0.5),
                
                ...makeRythmDots(()=>{return {rythmList: this.rythmTap, height: (0.8*height)}}, (rythmDots)=>{this.rythmDots = rythmDots}),

                ()=> s.wait(1000),
                
                ()=> s.loop(this.f = 0),
                    ()=> this.isTap = this.rythmTap[this.f],
                    ()=> {if(this.isTap) {
                        this.sound.play("chisel"), //; this.scene.sound.context.resume()
                        this.rythmDots[this.f].setAlpha(1),
                        
                        this.egg.setAlpha(1),
                        this.time.addEvent({delay: 100, callback: () => {this.egg.setAlpha(0.5)}, callbackScope: this})}},
                    ()=> s.wait(300),
                ()=> s.while(this.f++, this.f < this.rythmTap.length),
            ]
        }




    


        s.q([
            ...slidesInstruction(),


            //Training Phase

            ()=> this.em = new ListManager(Object.keys(EGG_RYTHM_DICT)),

            ()=> s.loop(this.i=0),

                ()=> this.eggColor = this.em.getRandom(),
                ()=> this.rythm = EGG_RYTHM_DICT[this.eggColor],

                //Slide Learn

                ...slideLearn(()=>{return {eggColor: this.eggColor, rythm: this.rythm}}),

                ()=> s.wait(1000),

                ()=> s.loop(this.f=0),
                    ...slideReproduce(()=>{return {eggColor: this.eggColor, rythm: this.rythm}}, (correct)=>{this.correct=correct}),
                    ()=> {if(!this.correct) {this.f=0}},
                ()=> s.while(this.f++, this.f < 3),




            ()=> s.while(this.i++, !this.em.isDone()),

            ()=> this.nextButton.setAlpha(1),
            ()=> s.waitClick(this.nextButton),
            ()=> this.nextButton.setAlpha(0),




            




            ()=> {
                this.main_text.setText('Loading Task...')
                this.scene.launch('Game', { phase_id: 1, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1,2], "redEgg":[2,2,1,1], "yellowEgg":[1,2,1,1], "cyanEgg":[1,1,1,2]}, distractor_list: ["cyanEgg"]})
                this.scene.pause()},
            ()=> s.wait(3000),

            ()=> {
                this.main_text.setText('Loading Task...')
                this.scene.launch('Game', { phase_id: 2, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,999,1], "redEgg":[1,999,1], "yellowEgg":[2,1,1], "cyanEgg":[1,999,1]}, distractor_list: ["blueEgg", "redEgg", "cyanEgg"]})
                this.scene.pause()},
            ()=> s.wait(3000),

            ()=> {
                this.main_text.setText('Loading Task...')
                this.scene.launch('Game', { phase_id: 3, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[2,2,1], "yellowEgg":[2,1,1], "cyanEgg":[1,1,2]}, distractor_list: []})
                this.scene.pause()},
            ()=> s.wait(3000),

            ()=> {
                this.main_text.setText('Loading Task...')
                this.scene.launch('Game', { phase_id: 4, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[1,999,1], "yellowEgg":[1,999,1], "cyanEgg":[1,999,1]}, distractor_list: ["redEgg","yellowEgg","cyanEgg"]})
                this.scene.pause()},

            ()=> s.timer.waitClickOrKey(),
            ()=> this.main_text.setText(slide_text.finish),
            ()=> exportToCsv(game_data_columns, game_data),
            ()=> s.timer.waitClickOrKey()
        ])

        this.sequence = s

    }

    
    update(time, delta) {
        this.sequence.play()

        this.debugText.setText(`
fps: ${Math.round(delta)}
slide: ${this.slide}
egg: ${this.eggColor}
rythm: ${this.rythm}
        `)
    }
}

// TTTTTTTTTTTTTTTTTTTTTTTRRRRRRRRRRRRRRRRR                  AAA               IIIIIIIIIINNNNNNNN        NNNNNNNN
// T:::::::::::::::::::::TR::::::::::::::::R                A:::A              I::::::::IN:::::::N       N::::::N
// T:::::::::::::::::::::TR::::::RRRRRR:::::R              A:::::A             I::::::::IN::::::::N      N::::::N
// T:::::TT:::::::TT:::::TRR:::::R     R:::::R            A:::::::A            II::::::IIN:::::::::N     N::::::N
// TTTTTT  T:::::T  TTTTTT  R::::R     R:::::R           A:::::::::A             I::::I  N::::::::::N    N::::::N
//         T:::::T          R::::R     R:::::R          A:::::A:::::A            I::::I  N:::::::::::N   N::::::N
//         T:::::T          R::::RRRRRR:::::R          A:::::A A:::::A           I::::I  N:::::::N::::N  N::::::N
//         T:::::T          R:::::::::::::RR          A:::::A   A:::::A          I::::I  N::::::N N::::N N::::::N
//         T:::::T          R::::RRRRRR:::::R        A:::::A     A:::::A         I::::I  N::::::N  N::::N:::::::N
//         T:::::T          R::::R     R:::::R      A:::::AAAAAAAAA:::::A        I::::I  N::::::N   N:::::::::::N
//         T:::::T          R::::R     R:::::R     A:::::::::::::::::::::A       I::::I  N::::::N    N::::::::::N
//         T:::::T          R::::R     R:::::R    A:::::AAAAAAAAAAAAA:::::A      I::::I  N::::::N     N:::::::::N
//       TT:::::::TT      RR:::::R     R:::::R   A:::::A             A:::::A   II::::::IIN::::::N      N::::::::N
//       T:::::::::T      R::::::R     R:::::R  A:::::A               A:::::A  I::::::::IN::::::N       N:::::::N
//       T:::::::::T      R::::::R     R:::::R A:::::A                 A:::::A I::::::::IN::::::N        N::::::N
//       TTTTTTTTTTT      RRRRRRRR     RRRRRRRAAAAAAA                   AAAAAAAIIIIIIIIIINNNNNNNN         NNNNNNN








class Training extends Phaser.Scene {
    constructor() {
        super('Training')
    }

    init(data) {
        this.debug_mode = false
        this.successive_correct_required = data.successive_correct_required
        this.rythm_list = data.rythm_list
        this.grace_trials = data.grace_trials
    }
    
    preload() {

    }

    
    makeEgg(x,y,image, hover=true, scale=1, alpha=1 ) {
        var image = this.add.image(x,y,image)
        image.setInteractive({ useHandCursor: true })
        image.setAlpha(alpha)
        image.setScale(scale)

        if(hover) image.on('pointerover',() => {this.currently_hovering = image});
        if(hover) image.on('pointerout', () => {this.currently_hovering = 0});

        return image
    }


    create(data) {
        this.debug=true

        this.debug_phase = 0

        this.sequence_list = []
        var s = new Sequence(this)

        let element = document.getElementById('input-box')

        
        var clearInstruction = () => s.training_text.setText("")
        var setInstruction = (text) => s.training_text.setText(text)
        var resetEggs = () => {return new ListManager(Object.keys(this.rythm_list))}




        //SEQUENCE START


        s.screen_obj = this.add.image(width/2,height/2, "slide_white")
        s.training_text = this.add.text(width/2,height/2, "", { fontSize: '50px', fill: '#000  ', align: 'center' , fontFamily: "calibri"})
        s.training_text.setOrigin(0.5)
        s.right=true
        this.debug_fps_text = this.add.text(0,0, "", { fontSize: '30px', fill: '#000  ', align: 'left' , fontFamily: "calibri"})
        element.style.display = "none"









        s.qList([

            ()=> this.sound.context.resume(),
            ()=> s.loop(),
                ()=> clearInstruction(),
                ()=> s.em = resetEggs(),
                ()=> s.timer.wait(1000),

                ()=> s.loop(),
                    ()=> s.var["image"] = this.makeEgg(width/2, height/2, s.em.getRandom(), true, 1, 0.5),
                    ()=> s.var["rythm"] = this.rythm_list[s.var["image"].texture.key],

                    ()=> s.loop(),
                        ()=> clearInstruction(),
                        ()=> s.var["image"].setOrigin(0.5,0.5),
                        ()=> s.var["image"].setAlpha(0.5),
                        ()=> s.timer.wait(1000),
                        ...s.timer.q_playRythm("rythm", "image"),
                        ()=> s.timer.wait(1000),
                        ()=> s.var["image"].setOrigin(0.5,-0.5),
                        ()=> s.var["image"].setAlpha(1),
                        ()=> setInstruction("Please repeat the rythm as you have heard it\nWhile hovering over the egg with your mouse and pressing SPACE\nor clicking the Egg"),
                        ...s.timer.q_waitRythm("rythm", (rythm_accuracy)=>{
                                if(rythm_accuracy < 0.3) {
                                    setInstruction("Correct!"); s.var["rythm_correct"]=true
                                }else if(rythm_accuracy >= 0.45) {
                                    setInstruction("Almost! Try Again"); s.var["rythm_correct"]=false
                                }else {
                                    setInstruction("Incorrect :/ Please try again"); s.var["rythm_correct"]=false
                                }
                            }),
                        
                        ()=> s.timer.wait(1000),
                    ()=> s.while(()=>{return !s.var["rythm_correct"]}),

                    ()=> s.var["image"].destroy(),
                    ()=> clearInstruction(),
                ()=> s.while(()=>{return s.getCounter() < Object.keys(this.rythm_list).length}),

                        
                ()=> s.loop(),
                    ()=> this.debug_phase = s.getCounter()+1,
                    ()=> s.var["happy_path"] = true,
                    ()=> s.em = resetEggs(),
                    ()=> setInstruction(`Trial ${s.getCounter()+1}/${this.successive_correct_required}`),
                    ()=> s.timer.wait(1000),

                    ()=> s.loop(),
                        ()=> {s.timer.wait(500)},
                        ()=> s.var["image"] = this.makeEgg(width/2, height/2, s.em.getRandom(), true, 1, 0.5),
                        ()=> s.var["image"].setOrigin(0.5,-0.5),
                        ()=> s.var["rythm"] = this.rythm_list[s.var["image"].texture.key],
                                    
                        ()=> s.loop(),
                            ()=> setInstruction("Please tap the rythm that was associated with this egg"),
                            ()=> s.var["image"].setAlpha(1),
                            ...s.timer.q_waitRythm("rythm", (rythm_accuracy)=>{
                                if(rythm_accuracy < 0.3) {
                                    setInstruction("Correct!"); s.var["rythm_correct"]=true;
                                }else if(rythm_accuracy >= 0.45) {
                                    setInstruction("Almost!"); s.var["rythm_correct"]=false; 
                                }else {
                                    setInstruction("Incorrect"); s.var["rythm_correct"]=false;
                                }
                            }),

                            ()=> s.timer.wait(1000),
                            ()=> {if(!s.var["rythm_correct"] & (s.getCounter() < this.grace_trials)) {setInstruction("Try again"); s.timer.wait(1000)}},
                            ()=> {if(!s.var["rythm_correct"] & (s.getCounter() >= this.grace_trials)) {s.var["happy_path"]=false} },
                            ()=> clearInstruction(),
                        ()=> s.while(()=> {return (!s.var["rythm_correct"] & (s.getCounter() < (this.grace_trials+1)))}),

                        ()=> s.var["image"].destroy(),
                        ()=> s.timer.wait(500),
                        ()=> clearInstruction(),
                    ()=> s.while(()=>{return s.getCounter() < Object.keys(this.rythm_list).length}),
                ()=> s.while(()=>{return ((s.getCounter() < this.successive_correct_required) & s.var["happy_path"])}), //Number of Trials
            ()=> s.while(()=>{return !s.var["happy_path"]}),
        
        ()=> setInstruction(""),
        ()=> s.timer.wait(1000),
        ()=> {this.scene.resume('Study'); this.scene.stop()},
        ()=> s.timer.wait(1),
        ()=> s.timer.wait(1)



        ])





        var test_sequence_1 = [

            ()=> this.sound.context.resume(),
        
            ()=> s.loop(),
            
                ()=> this.debug_phase = 0,
                ()=> clearInstruction(),
                ()=> s.em = resetEggs(),
                ()=> s.timer.wait(1000),

                ()=> s.loop(),
                ()=> s.image = getRandomEgg(),
                ()=> s.rythm = this.rythm_list[s.image.texture.key],

                ()=> s.loop(),
                    ()=> clearInstruction(),
                    ()=> s.image.setOrigin(0.5,0.5),
                    ()=> s.image.setAlpha(0.5),
                    ()=> s.timer.wait(1000),
                    ...s.timer.q_playRythm(()=>{return s.rythm}, ()=>{return s.image}),
                    ()=> s.timer.wait(1000),
                    ()=> s.image.setOrigin(0.5,-0.5),
                    ()=> s.image.setAlpha(1),
                    ()=> setInstruction("Please repeat the rythm as you have heard it\nWhile hovering over the egg with your mouse and pressing SPACE\nor clicking the Egg"),
                    ...s.timer.q_waitRythm(()=>{return s.rythm},
                            ()=>{setInstruction("Correct!"),s.rythm_correct=true},
                            ()=>{setInstruction("Almost! Try Again"),s.rythm_correct=false},
                            ()=>{setInstruction("Incorrect :/ Please try again"),s.rythm_correct=false}),
                    ()=> s.timer.wait(1000),
                    ()=> s.while(()=>{return !s.rythm_correct},

                    ()=> s.image.destroy(),
                    ()=> clearInstruction(),
                ()=> s.while(()=>{return s.getCounter() < Object.keys(this.rythm_list).length}),

                //Recollect Rythm
                
                ()=> s.loop(),
                    ()=> this.debug_phase = s.getCounter()+1),
                    ()=> s.right = true,
                    ()=> s.em = resetEggs(),
                    ()=> setInstruction(`Trial ${s.getCounter()+1}/${this.successive_correct_required}`),
                    ()=> s.timer.wait(1000),

                    ()=> s.loop(),
                        ()=> {s.timer.wait(500)},
                        ()=> s.image = getRandomEgg(),
                        ()=> s.image.setOrigin(0.5,-0.5),
                        ()=> s.rythm = this.rythm_list[s.image.texture.key],
                                
                        ()=> s.loop(),
                            ()=> setInstruction("Please tap the rythm that was associated with this egg"),
                            ()=> s.image.setAlpha(1),
                            ...s.timer.q_waitRythm(()=>{return s.rythm},
                            ()=> {setInstruction("Correct!");s.rythm_correct=true},
                            ()=> {setInstruction("Almost!");s.rythm_correct=false},
                            ()=> {setInstruction("Incorrect");s.rythm_correct=false}),

                            ()=> s.timer.wait(1000),
                            ()=> {if(!s.rythm_correct & (s.getCounter() < 1)) {setInstruction("Try again"); s.timer.wait(1000)}},
                            ()=> {if(!s.rythm_correct & (s.getCounter() >= 1)) {s.right=false} },
                            ()=> clearInstruction(),
                        ()=> s.while(()=> {return (!s.rythm_correct & (s.getCounter() < 2))}),

                        ()=> s.image.destroy(),
                        ()=> s.timer.wait(500),
                        ()=> clearInstruction(),
                    ()=> s.while(()=>{return s.getCounter() < Object.keys(this.rythm_list).length}),
                ()=> s.while(()=>{return ((s.getCounter() < this.successive_correct_required) & (s.right == true))}), //Number of Trials
            
            ()=> s.while(()=>{return !s.right}),
            
            ()=> setInstruction(""),
            ()=> s.timer.wait(1000),
            ()=> {this.scene.resume('Study'); this.scene.stop()},
            ()=> s.timer.wait(1),
            ()=> s.timer.wait(1)
        ]

        //SEQUENCE END


        this.sequence_list.push(s)
    }





    update(time, delta) {
        for(var sequence of this.sequence_list) {
            sequence.play()
        }

        if(this.debug_mode) {
            this.debug_fps_text.setText(`
                                        ${((1000/delta/3).toFixed()*3)}fps
                                        ${((delta/3).toFixed()*3)}ms
                                        Phase: ${this.debug_phase}
                                        right=${this.sequence_list[0].right}`.replace(/ /g,''))
        }
    }
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
                                                                                                      
                                                                                                      
                                                                                                      





var game_data = []

class Game extends Phaser.Scene {
    constructor() {
        super('Game')
    }

    init(data) {
        this.debug_mode = false
        this.prev_time = 0

        this.speed = 1
        this.max_speed = general_config(1).max_speed
        this.min_speed = general_config(1).min_speed
        
        this.phase_id = data.phase_id

        this.rythm_list = data.rythm_list
        this.distractor_list = data.distractor_list
        
        this.eggs_in_game = [...Array.apply(null, Array(data.num_egg_per_color)).map(function(){return "blueEgg"}),
                             ...Array.apply(null, Array(data.num_egg_per_color)).map(function(){return "redEgg"}),
                             ...Array.apply(null, Array(data.num_egg_per_color)).map(function(){return "yellowEgg"}),
                             ...Array.apply(null, Array(data.num_egg_per_color)).map(function(){return "cyanEgg"})]

    }
    
    preload() {

    }

    generateEggLocations() {
        var egg_locations = []                                  
        for(var x=general_config(1).grid_margin; (x+general_config(1).grid_margin)<general_config(1).grid_x; x++) {
            for(var y=general_config(1).grid_margin; (y+general_config(1).grid_margin)<general_config(1).grid_y; y++) {
                egg_locations.push({
                    x: Math.floor(x* (general_config(1).width/general_config(1).grid_x) + ((Math.random()-0.5)*2*general_config(1).grid_random)*(general_config(1).width/general_config(1).grid_x) ), 
                    y: Math.floor(y* (general_config(1).height/general_config(1).grid_y) + ((Math.random()-0.5)*2*general_config(1).grid_random)*(general_config(1).height/general_config(1).grid_y) )
                })
            }
        }

        return egg_locations

        
    }
    

    create(data) {

        this.score = 0
        this.debug=true

        var safe_loc_x = general_config(1).width/2
        var safe_loc_y = general_config(1).height - 60

        this.add.image(width/2,height/2, "woods")
        this.add.image(safe_loc_x,safe_loc_y, "safe").setScale(0.2).setOrigin(0.5)

        this.debug_fps_text = this.add.text(0,0, "Debug", { fontSize: '30px', fill: '#FFF  ', align: 'left' , fontFamily: "calibri"})
    
        this.scoreText = this.add.text(safe_loc_x, safe_loc_y, 'Depot: 0', { fontSize: '50px', fill: '#FFF', align: 'center' , fontFamily: "calibri"});
        this.scoreText.setOrigin(0.5)

        this.egg_manager = new ListManager(this.eggs_in_game, this.distractor_list)

        if(general_config(1).egg_locations_random) {
            this.location_manager = new ListManager(this.generateEggLocations())
        }else{
            this.location_manager = new ListManager([{x: 1465, y: 600},
                                                    {x: 748, y: 788},
                                                    {x: 685, y: 931},
                                                    {x: 1178, y: 601},
                                                    {x: 1254, y: 773}])
        }

        this.rythm_manager = new RythmManager(this)

        this.start_time = Date.now()

        //this.main_loop = this.time.addEvent({
        //   delay: general_config(1).egg_drop_frequency,
        //    callback: this.dropEgg, callbackScope: this,
        //    loop: true });

    }

    calcScale(y) {
        if(y==600) {y=y+200}
        return ( 1.2* (((2/3) * height)-((height-y)/1.2)) / ((2/3) * height) )
    }


    dropEgg() {
        var this_scene = this

        if(this.egg_manager.hasItems()) {
            var egg = this.egg_manager.getRandom()
            var loc = this.location_manager.getRandom()

            var egg_obj = this.add.image(loc.x, loc.y, egg)
            
            egg_obj.setInteractive({ useHandCursor: true })
            egg_obj.setOrigin(0.5,1) 
            egg_obj.setScale(this.calcScale(loc.y))
            this.add.image(width/2,height/2, "woods_layer")
            
            //Disappear Timer
            var disappear_timer = this.time.addEvent({
                delay: general_config(this.speed).egg_exist_duration,
                callback: this.removeEgg, args:[egg_obj], callbackScope: this});
            
    
            //Collect Listener
            this.rythm_manager.addRythmListener(egg_obj, this.rythm_list[egg], "tap", false, function(successful, rythm_obj) {
                this_scene.removeEgg(egg_obj, true, successful, rythm_obj)
                disappear_timer.remove(false)
            })

            game_data.push([participantId, trialId, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"dropped"])

    
        }
    }


    removeEgg(egg_obj, complete=false, successful=false, rythm_obj=0) {
        this.egg_manager.printStatusFull()

        var loc = {x:Math.floor(egg_obj.x), y:Math.floor(egg_obj.y)}

        //How long the Location should stay unused, after egg is collected
        this.time.addEvent({delay: general_config(this.speed).location_cooldown_duration, callback: function() {
            this.location_manager.remove(loc)
        }, callbackScope: this});

        //How long the Egg should stay, after egg is collected
        this.time.addEvent({
            delay: general_config(this.speed).egg_stay_after_collect_duration, callback: function() {
                this.egg_manager.remove(egg_obj.texture.key, complete, successful)
            },callbackScope: this});
        
        //Remove Egg Operations
        this.rythm_manager.removeRythmListener(egg_obj)
        egg_obj.setOrigin(0,0)
        egg_obj.destroy()


        var trial_data = []
        //Forward to a "Befitting End"
        if(complete) {
            if(successful) {
                this.collectEgg(egg_obj)
                this.speed += general_config(1).speed_change_correct
                trial_data = [participantId, trialId, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"collected"]

            }else {
                this.destroyEgg(egg_obj)
                this.speed += general_config(1).speed_change_incorrect
                trial_data = [participantId, trialId, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"destroyed"]
            }
        }else {
            if(!safeItemInArray(egg_obj.texture.key, this.distractor_list)) {
                this.speed += general_config(1).speed_change_miss
            }
            trial_data = [participantId, trialId, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"returned"]
        }

        if(rythm_obj != 0) {
            trial_data = [...trial_data, rythm_obj.input_rythm, rythm_obj.error]
        }
        game_data.push(trial_data)

    }


    collectEgg(egg_obj) {
        if(general_config(1).collect_sound != "") {
            this.sound.play(general_config(1).collect_sound)
            this.sound.context.resume();
        }
        
        this.score++
        this.scoreText.setText(`Depot: ${this.score}`);
                
        var dia_obj = this.add.image(egg_obj.x, egg_obj.y, "diamond")
        dia_obj.setScale(this.calcScale(egg_obj.y))
        dia_obj.setOrigin(0.5,1.0)
        this.add.image(width/2,height/2, "woods_layer")

        this.time.addEvent({delay: general_config(this.speed).diamond_exist_duration, callback: function() {dia_obj.destroy()}, callbackScope: this})
    }


    destroyEgg(egg_obj) {
        if(general_config(1).debug_mode) {
            var fail_obj = this.add.text(egg_obj.x, egg_obj.y, this.rythm_list[egg_obj.texture.key].toString(), { fontSize: '50px', fill: '#F33', align: 'center', fontFamily: "calibri"})
            this.time.addEvent({delay: 3000, callback: function() {fail_obj.destroy()},callbackScope: this});
        }
    }


    update(time, delta) {
        // Used to update your game. This function runs constantly

        if(this.speed > this.max_speed) {
            this.speed = this.max_speed
        }else if(this.speed < this.min_speed) {
            this.speed = this.min_speed
        }

        if(this.timer == 0) {
            this.prev_time = time
        }else if((time - this.prev_time) > general_config(this.speed).egg_drop_frequency) {
            this.dropEgg()
            this.prev_time = time
        }


        if(this.egg_manager.isDone()) {

            this.time.addEvent({delay: general_config(this.speed).wait_after_trial_complete, callback: function() {
                this.scene.resume('Study');
                this.scene.stop();

            },callbackScope: this});
        }

        if(this.debug_mode) {
            this.debug_fps_text.setText(`
                                        ${((1000/delta/3).toFixed()*3)}fps
                                        ${((delta/3).toFixed()*3)}ms
                                        x=${this.game.input.mousePointer.x}
                                        y=${this.game.input.mousePointer.y}`.replace(/ /g,''))
        }


    }
}
    


//TTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEEEEEEEE   SSSSSSSSSSSSSSS TTTTTTTTTTTTTTTTTTTTTTT
//T:::::::::::::::::::::TE::::::::::::::::::::E SS:::::::::::::::ST:::::::::::::::::::::T
//T:::::::::::::::::::::TE::::::::::::::::::::ES:::::SSSSSS::::::ST:::::::::::::::::::::T
//T:::::TT:::::::TT:::::TEE::::::EEEEEEEEE::::ES:::::S     SSSSSSST:::::TT:::::::TT:::::T
//TTTTTT  T:::::T  TTTTTT  E:::::E       EEEEEES:::::S            TTTTTT  T:::::T  TTTTTT
//        T:::::T          E:::::E             S:::::S                    T:::::T        
//        T:::::T          E::::::EEEEEEEEEE    S::::SSSS                 T:::::T        
//        T:::::T          E:::::::::::::::E     SS::::::SSSSS            T:::::T        
//        T:::::T          E:::::::::::::::E       SSS::::::::SS          T:::::T        
//        T:::::T          E::::::EEEEEEEEEE          SSSSSS::::S         T:::::T        
//        T:::::T          E:::::E                         S:::::S        T:::::T        
//        T:::::T          E:::::E       EEEEEE            S:::::S        T:::::T        
//      TT:::::::TT      EE::::::EEEEEEEE:::::ESSSSSSS     S:::::S      TT:::::::TT      
//      T:::::::::T      E::::::::::::::::::::ES::::::SSSSSS:::::S      T:::::::::T      
//      T:::::::::T      E::::::::::::::::::::ES:::::::::::::::SS       T:::::::::T      
//      TTTTTTTTTTT      EEEEEEEEEEEEEEEEEEEEEE SSSSSSSSSSSSSSS         TTTTTTTTTTT      
                                                                                              









class Test extends Phaser.Scene {
    constructor() {
        super('Test')
    }
    
    preload() {
        this.load.image('cyanEgg', 'assets/cyanEgg.png');
    }


    create(data) {

        let element = document.getElementById('input-box')
        //element.style.display = 'none';
        for (let i = 0; i < element.children.length; i++) {
                          
            // it is an input element
            if(element.children[i].name == 'id'){
                element.children[i].addEventListener('input',()=>{participantId = element.children[i].value})
            }

            // it is an input element
            if(element.children[i].name == 'trial'){
                element.children[i].addEventListener('input',()=>{trialId = element.children[i].value})
            }
                
            // it is the button
            else {
                console.log("Init This")
                element.children[i].addEventListener('click',()=>{
                    element.style.display = 'none';
                    this.scene.launch('Study')
                    this.scene.pause()
                })
            }
        }         
    }


    update(time, delta) {


    }
}


const config = {
    type: Phaser.AUTO,
    backgroundColor: "#FFF",
    scene: [Test, Study, Training, Game],

    scale: {
        parent: 'viewport',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        
        width: general_config(1).width,
        height: general_config(1).height,

        min: {
            width: general_config(1).width/8,
            height: general_config(1).height/8
        },
        max: {
            width: general_config(1).width*2,
            height: general_config(1).height*2,
        },
        zoom: 1,
    },
    autoRound: false
};


const game = new Phaser.Game(config);


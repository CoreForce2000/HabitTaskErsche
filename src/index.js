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

        egg_drop_frequency: 3000 + (Math.random() * 2000), //
        egg_exist_duration: 2000 + (Math.random() * 1500), //
        egg_stay_after_collect_duration: 0 ,

        diamond_exist_duration: 1500 ,
        location_cooldown_duration: 2500 ,

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



var slide_text = {

    welcome: `Welcome. Please press F11 to enter fullscreen mode.
Please ensure your sound is turned on.
    
Press SPACE to continue`,

    introduction:`In this task, you are in the woods collecting diamonds,
which are hidden away in eggs of different color and pattern.
In order to retrieve a diamond, you need to use
a certain tapping rythm on an egg. If the rythm is correct,
the egg will open and a diamond will be added to your depot.
If the rythm is incorrect however, the egg will disappear and
no diamond will be added to your depot.`,

    practice1:`First you will learn the different rythms that 
may be used to open an egg and collect a diamond.
In each round,a rythm is played, followed by a promt.
You'll then need to replicate the rythm you just heard
using your mouse to hover over the image of an R-Key, and the
actual R-key on your keyboard button to tap the rythm.
Alternatively to the R-key, you can also use your mouse left click to 
click the rythm.
The practise round will end once you have mastered all the rythms

When you are ready, press SPACE to begin training`,

    phase1_p1:`Now that you have learned all the rythms, we can begin
the egg hunt.

Press SPACE to continue to the next slide`,

    phase1_p2:`You are on an egg hunt to collect diamonds
that are hidden in eggs. To open an egg, you have to 
hover over it and tap or click one of the previously 
learned rythms. You need to find out by trial and error 
which rhythm is associated with which egg. 
Some eggs might not have any associated rythm.
If you are correct, your will see a diamond and your 
score will increase, however if you are incorrect,
nothing will happen. Your goal is to collect as many diamonds as possible.

When you are ready, press SPACE to begin`,

    phase2_p1:`Thank you for your participation, you have successfully
Phase 1 of the study. We will now proceed to Phase 2.
    
Press SPACE to continue to the next slide`,

    phase2_p2:`Again, eggs
will appear on the screen and need to be collected by hovering
over the desired egg and tapping or clicking the associated rythm.
However, some eggs that previously contained a diamond might now
be empty. As previously, your goal is to collect as many diamonds as possible.

When you are ready, press SPACE to begin`,

    practice_2_and_phase_3_p1:`You have successfully completed Phase 2.
    
Press SPACE to continue to the next slide`,

    practice_2_and_phase_3_p2:`You will now complete another practise round,
followed by an egg collection phase.
You will be asked to replicate the old rythms along with some new ones. 
As in the previous training round, you will first hear the rythm, 
then be promted to replicate it using your keyboard or mouse.

Press SPACE to continue to the next slide`,

    practice_2_and_phase_3_p3:`In the egg collection phase, your goal is
as in previous trials to collect as many eggs as possible
by hovering over a desired egg and tapping the appropriate
rythm. However, some of the previously empty eggs might now
contain a diamond, and some eggs may now have different rythms
necessary to collect the diamond.

Press SPACE to continue to the next slide`,

    practice_2_and_phase_3_p4:`Again, you need to use trial and error
to discover which eggs contain a diamond, and what
rythm will open the egg to reveal a diamond.
When you press SPACE, you will begin the training round.

When you are ready, press SPACE to begin`,

    phase_3:`You will now begin the egg collection phase.
Remember, some of the previously empty eggs might now
contain a diamond, and some eggs may now have different rythms
associated to collect the diamond.

When you are ready, press SPACE to begin`,

    phase4:`Thank you for your engagement so far.
We will now initiate the fourth and final round of 
egg collection in this study. As before, please collect
as many eggs as possible using the correct rythm.
Some of the eggs that previously contained a diamond however
may now be empty. Please collect as many diamonds as possbile.

When you are ready, press SPACE to begin`,

    finish:`Thank you for participating!
Please inform the researcher for further instructions.

Press F11 to exit fullscreen`,



    // Other

    train_await_rythm: `Please replicate the rythm you have just heard
in any speed you like, by hovering over the image of an R-key on screen
and pressing the actualy R-key on your keyboard or clicking the mouse button 
once for every "tap" in that rythm`
}


















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

        this.scope.input.on('pointerdown', function() {
            if(this_this.currently_hovering != 0) {
                this_this.click(this_this.currently_hovering)
            }
        });
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
                                                                                                                                                                                  



class SequenceTimer {

    constructor(scene, sequence) {
        this.scene = scene
        this.s = sequence
    }


    startTimer = () => {this.timer = Date.now()}
    endTimer = () => {return Date.now()-this.timer }

    wait = (delay) => {
        this.s.stepBack()
        var wait_delay=delay
        this.scene.time.addEvent({delay: wait_delay, callback: () => {this.s.step()}, callbackScope: this})
    }

    waitClickOrKey = (key="SPACE") => {
        this.s.stepBack()
        var key_listener;
        var click_listener;
        
        var whenInput = () => {
            this.s.step()
            this.scene.input.keyboard.removeKey(key); key_listener.removeListener("down"); key_listener=0
            click_listener.removeListener("pointerdown"); click_listener=0
        }
        key_listener = this.scene.input.keyboard.addKey(key).on('down', whenInput);
        click_listener = this.scene.input.on("pointerdown", whenInput)
    }

    waitClick = () => {
        this.s.stepBack()

        var click_listener = this.scene.input.on("pointerdown", () => {
            this.s.step()
            click_listener.removeListener("pointerdown");
        })
    }

    waitKey = (key="SPACE") => {
        this.s.stepBack()

        var key_listener = this.scene.input.keyboard.addKey(key).on('down', () => {
            this.s.step()
            this.scene.input.keyboard.removeKey(key) 
            key_listener.removeListener("down")
        });
    }

    playBeat = (sound) => {this.scene.sound.play(sound); this.scene.sound.context.resume()}
    visualBeat = (image) => {image.setAlpha(1);this.scene.time.addEvent({ delay: 100, callback: () => {image.setAlpha(0.5)}, callbackScope: this})}


    q_playRythm = (getRythm, getImage) => {
        this.s.q(()=> {this.playBeat("tap"); this.visualBeat(getImage())})
        this.s.loop()
            this.s.q(()=> this.wait(getRythm()[this.s.getCounter()]*300))
            this.s.q(()=> {this.playBeat("tap"); this.visualBeat(getImage())})
        this.s.while(()=>{return (this.s.getCounter() < getRythm().length)})
    }

    q_waitRythm = (getRythm, funcCorr, funcParcorr, funcIncorr) => {
        this.s.q(()=> {this.input_rythm = []})
        this.s.q(()=> this.waitClickOrKey())
        this.s.q(()=> {this.playBeat("tap")})
        this.s.loop()
            this.s.q(()=> this.startTimer())
            this.s.q(()=> this.waitClickOrKey())
            this.s.q(()=> this.input_rythm.push(this.endTimer()))
            this.s.q(()=> {this.playBeat("tap")})
        this.s.while(()=>{return (this.s.getCounter() < getRythm().length)})
        this.s.q(() => this.rythm_accuracy = rythmsMatch(this.input_rythm, getRythm()))
        this.s.q(() => {
            if((this.rythm_accuracy < 0.3)) {
                funcCorr()
            }else if(this.rythm_accuracy >= 0.45) {
                funcIncorr()
            }else {
                funcParcorr()
            }
        })
    }

}





class Sequence {
    constructor(scene) {
        this.scene = scene
        this.timer = new SequenceTimer(scene, this)

        this.pending_sequence = []
        this.sequence = []

        this.checkpoint = {}
        this.loop_counter = []

        this.prev_step = -1
        this.curr_step = 0
    }

    play() {
        if(this.sequence.length-1 > this.curr_step) {
            while(this.curr_step != this.prev_step) {
                this.prev_step = this.curr_step

                console.log("Step", this.curr_step)
                this.sequence[this.curr_step]()
                this.curr_step++
                
            }
        }
    }

    q(func) {
        this.pending_sequence.push(func)
    }

    r(func) {
        func()
    }

    log(text) {
        this.q(()=> console.log(text))
    }

    pushQueue() {
        this.sequence = [...this.sequence, ...this.pending_sequence]
    }

    step() {
        this.curr_step++
    }

    stepBack() {
        this.curr_step--
    }

    setCheckpoint(name) {
        this.checkpoint[name] = this.curr_step
    }

    goCheckpoint(name) {
        this.curr_step = this.checkpoint[name]
        this.prev_step = this.curr_step-1
    }

    checkpoint(name) {
        this.setCheckpoint(name)
    }

    jump(name) {
        this.goCheckpoint(name)
    }

    loop() {
        this.q(()=> {
            console.log("LOOP")
            this.loop_counter.push(0)
            this.loop_counter[this.loop_counter.length-1]=0
            this.setCheckpoint(this.loop_counter.length-1)
        })
    }

    getCounter() {
        return this.loop_counter[this.loop_counter.length-1]
    }

    while(func) {
        this.q(()=> {
            this.loop_counter[this.loop_counter.length-1]++
            if(func()) {
                console.log("ITERATE")
                this.goCheckpoint(this.loop_counter.length-1);
                
            }else{
                console.log("END LOOP")
                this.loop_counter.pop()
            }
        })
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



var participant_id = 0
var trial_id = 0

class Study extends Phaser.Scene {
    constructor() {
      super('Study')
      this.debug = false
    }

    log(msg) {
        console.log(`${msg}`)
    }

    debug(msg) {
        if(this.debug) {
            console.log(`DEBUG:${msg}`)
        }
    }
    
    init() {
        this.prev_slide = -1
        this.slide = 0
    }

    preload() {
        this.load.image('whitescreen', 'assets/background_title.jpg');
        this.load.image('r_key', 'assets/r_key.png');
        this.load.audio('tap', ['assets/chisel.mp3'])

        this.load.image('cyanEgg', 'assets/eggCyanShadow.png');
        this.load.image('blueEgg', 'assets/eggBlueShadow.png');
        this.load.image('redEgg', 'assets/eggRedShadow.png');
        this.load.image('yellowEgg', 'assets/eggYellowShadow.png');
        this.load.image('diamond', 'assets/diamondShadow.png');
        this.load.image('fail', 'assets/fail.png');
        this.load.image('woods', 'assets/background_medium.jpg');
        this.load.image('woods_layer', 'assets/background_layer.png');
        this.load.image('safe', 'assets/safe.png');
        this.load.image('white', 'assets/background_title.jpg');
        this.load.audio('tap', ['assets/chisel.mp3'])
        this.load.audio('diamond', ['assets/diamond.mp3'])
    }

    create(data) {

        var s = new Sequence(this)

        let element = document.getElementById('input-box')
        element.style.display = 'none';

        this.add.image(general_config(1).width/2, general_config(1).height/2, "white").setOrigin(0.5);

        this.main_text = this.add.text(general_config(1).width/2, general_config(1).height/2, '', { fontSize: '40px', fill: '#000', align: 'center', fontFamily: "calibri"});
        this.main_text.setOrigin(0.5)
        this.debug_text = this.add.text(general_config(1).width/2, general_config(1).height - (general_config(1).height/8), '', { fontSize: '35px', fill: '#C00', align: 'center', fontFamily: "calibri"});
        this.debug_text.setOrigin(0.5)

        /*
        s.q(()=>{
            s.stepBack()
            for (let i = 0; i < element.children.length; i++) {
                      
            // it is an input element
            if(element.children[i].name == 'id'){
                element.children[i].addEventListener('input',()=>{participant_id = element.children[i].value})
            }

            // it is an input element
            if(element.children[i].name == 'trial'){
                element.children[i].addEventListener('input',()=>{trial_id = element.children[i].value})
            }
                
            // it is the button
            else {
                console.log("Init This")
                var this_scene = this
                element.children[i].addEventListener('click',()=>{element.style.display = 'none';  s.step()})
                }
            } 
        })*/

        s.q(()=> this.main_text.setText(slide_text.welcome))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.introduction))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.practice1))
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> {
            console.log("Running Trial 1")
            this.main_text.setText('')
            this.scene.launch('Training', { successive_correct_required: 2, rythm_list: {"yellowEgg":[1,2,1,1], "redEgg":[2,2,1,1]}})
            this.scene.pause()})

        s.q(()=> this.main_text.setText("Please press SPACE to Continue"))
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> {
            console.log("Running Trial 2")
            this.main_text.setText('')
            this.scene.launch('Training', { successive_correct_required: 2, rythm_list: {"blueEgg":[1,2,1,2], "cyanEgg":[1,1,1,2]}})
            this.scene.pause()})

        s.q(()=> this.main_text.setText("Please press SPACE to Continue"))
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> {
            console.log("Running Trial 3")
            this.main_text.setText('')
            this.scene.launch('Training', { successive_correct_required: 5, rythm_list: {"blueEgg":[1,2,1,2], "redEgg":[2,2,1,1], "yellowEgg":[1,2,1,1], "cyanEgg":[1,1,1,2]}})
            this.scene.pause()})

        s.q(()=> this.main_text.setText("Please press SPACE to Continue"))
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> this.main_text.setText(slide_text.phase1_p1))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.phase1_p2))
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> {
            this.main_text.setText('Loading Task...')
            this.scene.launch('Game', { phase_id: 1, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1,2], "redEgg":[2,2,1,1], "yellowEgg":[1,2,1,1], "cyanEgg":[1,1,1,2]}, distractor_list: ["cyanEgg"]})
            this.scene.pause()})
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> this.main_text.setText(slide_text.phase2_p1))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.phase2_p2))
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> {
            this.main_text.setText('Loading Task...')
            this.scene.launch('Game', { phase_id: 2, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,999,1], "redEgg":[1,999,1], "yellowEgg":[2,1,1], "cyanEgg":[1,999,1]}, distractor_list: ["blueEgg", "redEgg", "cyanEgg"]})
            this.scene.pause()})
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> this.main_text.setText(slide_text.practice_2_and_phase_3_p1))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.practice_2_and_phase_3_p2))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.practice_2_and_phase_3_p3))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText(slide_text.practice_2_and_phase_3_p4))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> this.main_text.setText("Note: Insert Training Yes/No?"))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> {this.main_text.setText(slide_text.phase_3)})
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> {
            this.main_text.setText('Loading Task...')
            this.scene.launch('Game', { phase_id: 3, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[2,2,1], "yellowEgg":[2,1,1], "cyanEgg":[1,1,2]}, distractor_list: []})
            this.scene.pause()})
        s.q(()=> s.timer.waitClickOrKey())

        s.q(()=> this.main_text.setText(slide_text.phase4))
        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> {
            this.main_text.setText('Loading Task...')
            this.scene.launch('Game', { phase_id: 4, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[1,999,1], "yellowEgg":[1,999,1], "cyanEgg":[1,999,1]}, distractor_list: ["redEgg","yellowEgg","cyanEgg"]})
            this.scene.pause()})

        s.q(()=> s.timer.waitClickOrKey())
        s.q(()=> {
            this.main_text.setText(slide_text.finish)
            exportToCsv(game_data_columns, game_data)})
        s.q(()=> s.timer.waitClickOrKey())

        s.pushQueue()

        this.sequence = s

    }

    
    update(time, delta) {
        this.sequence.play()
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
        var getRandomEgg = () => {return this.makeEgg(width/2, height/2, s.em.getRandom(), true, 1, 0.5)}



        //SEQUENCE START


        s.screen_obj = this.add.image(width/2,height/2, "whitescreen")
        s.training_text = this.add.text(width/2,height/2, "", { fontSize: '50px', fill: '#000  ', align: 'center' , fontFamily: "calibri"})
        s.training_text.setOrigin(0.5)
        s.right=true
        this.debug_fps_text = this.add.text(0,0, "", { fontSize: '30px', fill: '#000  ', align: 'left' , fontFamily: "calibri"})
        element.style.display = "none"
        
        s.q(()=> this.sound.context.resume())
        

        s.loop()
            //Reproduce Rythm
            
                s.q(()=> this.debug_phase = 0)
                s.q(()=> clearInstruction())
                s.q(()=> s.em = resetEggs())
                s.q(()=> s.timer.wait(1000))

                s.loop()
                    s.q(()=> s.image = getRandomEgg())
                    s.q(()=> s.rythm = this.rythm_list[s.image.texture.key])

                    s.loop()
                        s.q(()=> clearInstruction())
                        s.q(()=> s.image.setOrigin(0.5,0.5))
                        s.q(()=> s.image.setAlpha(0.5))
                        s.q(()=> s.timer.wait(1000))
                        s.timer.q_playRythm(()=>{return s.rythm}, ()=>{return s.image})
                        s.q(()=> s.timer.wait(1000))
                        s.q(()=> s.image.setOrigin(0.5,-0.5))
                        s.q(()=> s.image.setAlpha(1))
                        s.q(()=> setInstruction("Please repeat the rythm as you have heard it\nWhile hovering over the egg with your mouse and pressing SPACE\nor clicking the Egg"))
                        s.timer.q_waitRythm(()=>{return s.rythm},
                                    ()=>{setInstruction("Correct!"),s.rythm_correct=true},
                                    ()=>{setInstruction("Almost! Try Again"),s.rythm_correct=false},
                                    ()=>{setInstruction("Incorrect :/ Please try again"),s.rythm_correct=false})
                        s.q(()=> s.timer.wait(1000))
                    s.while(()=>{return !s.rythm_correct})

                    s.q(()=> s.image.destroy())
                    s.q(()=> clearInstruction())
                s.while(()=>{return s.getCounter() < Object.keys(this.rythm_list).length})

                //Recollect Rythm

                s.setCheckpoint("RetryTest")
                
                s.loop()
                    s.q(()=> this.debug_phase = s.getCounter()+1)
                    s.q(()=> s.right = true)
                    s.q(()=> s.em = resetEggs())
                    s.q(()=> setInstruction(`Trial ${s.getCounter()+1}/${this.successive_correct_required}`))
                    s.q(()=> s.timer.wait(1000))

                    s.loop()
                        s.q(()=> {s.timer.wait(500)})
                        s.q(()=> s.image = getRandomEgg())
                        s.q(()=> s.image.setOrigin(0.5,-0.5))
                        s.q(()=> s.rythm = this.rythm_list[s.image.texture.key])
                        
                        s.loop()
                            s.q(()=> setInstruction("Please tap the rythm that was associated with this egg"))
                            s.q(()=> s.image.setAlpha(1))
                            s.timer.q_waitRythm(()=>{return s.rythm},
                                ()=> {setInstruction("Correct!");s.rythm_correct=true},
                                ()=> {setInstruction("Almost!");s.rythm_correct=false},
                                ()=> {setInstruction("Incorrect");s.rythm_correct=false})
                            s.q(()=> s.timer.wait(1000))
                            s.q(()=> {if(!s.rythm_correct & (s.getCounter() < 1)) {setInstruction("Try again"); s.timer.wait(1000)}})
                            s.q(()=> {if(!s.rythm_correct & (s.getCounter() >= 1)) {s.right=false} })
                            s.q(()=> clearInstruction())
                        s.while(()=> {return (!s.rythm_correct & (s.getCounter() < 2))})

                        s.q(()=> s.image.destroy())
                        s.q(()=> s.timer.wait(500))
                        s.q(()=> clearInstruction())
                    s.while(()=>{return s.getCounter() < Object.keys(this.rythm_list).length})
                s.while(()=>{return ((s.getCounter() < this.successive_correct_required) & (s.right == true))}) //Number of Trials
        
        s.while(()=>{return !s.right})
            
        s.q(()=> setInstruction(""))
        s.q(()=> s.timer.wait(1000))
        s.q(()=> {this.scene.resume('Study'); this.scene.stop()})
        s.q(()=> s.timer.wait(1))
        s.q(()=> s.timer.wait(1))

        //SEQUENCE END



        s.pushQueue()
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

            game_data.push([participant_id, trial_id, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"dropped"])

    
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
                trial_data = [participant_id, trial_id, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"collected"]

            }else {
                this.destroyEgg(egg_obj)
                this.speed += general_config(1).speed_change_incorrect
                trial_data = [participant_id, trial_id, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"destroyed"]
            }
        }else {
            if(!safeItemInArray(egg_obj.texture.key, this.distractor_list)) {
                this.speed += general_config(1).speed_change_miss
            }
            trial_data = [participant_id, trial_id, this.phase_id, Date.now()-this.start_time, egg_obj.texture.key, `${loc.x},${loc.y}`,"returned"]
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
        this.load.image('blueEgg', 'assets/blueEgg.png');
        this.load.image('redEgg', 'assets/redEgg.png');
        this.load.image('yellowEgg', 'assets/yellowEgg.png');
        this.load.image('white', 'assets/background_title.jpg');
        this.load.audio('tap', ['assets/chisel.mp3'])
        this.load.audio('diamond', ['assets/diamond.mp3'])
    }


    create(data) {

        //
        //scene.input.keyboard.on(button, onInput);

        //var space_listener = this.input.keyboard.on("keydown-SPACE", ()=>{
        //    console.log("Space pressed!")
        //    //this.input.keyboard.removeKey('SPACE');
        //    space_listener.destroy();
        //});

        var pointer = true
        var key = "SPACE"

        var key_listener = 0
        var click_listener = 0

        var whenInput = () => {
            console.log("Key/Click down!")
            if(key_listener != 0) {
                this.input.keyboard.removeKey(key);
                key_listener.removeListener("down")
            }
            if(click_listener != 0) {
                click_listener.removeListener("pointerdown")
            }
        }

        if(key != "") {
            key_listener = this.input.keyboard.addKey(key).on('down', whenInput);
        }
        if(pointer) {
            click_listener = this.input.on("pointerdown", whenInput)
        }
    }


    update(time, delta) {
    }
}









const config = {
    type: Phaser.AUTO,
    backgroundColor: "#FFF",
    scene: [Study, Training, Game],

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


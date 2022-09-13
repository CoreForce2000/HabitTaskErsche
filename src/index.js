

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

        egg_drop_frequency: 2000 * (1/speed),
        egg_exist_duration: 1500 * (1/speed),
        egg_stay_after_collect_duration: 0 * (1/speed),

        diamond_exist_duration: 1500 * (1/speed),
        location_cooldown_duration: 2500 * (1/speed),

        //Rythm Error Margin

        error_margin: 0.25,

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

        this.invisible_list = invisible_list
        this.visible_list = []
        this.completed_list = []
        this.failed_list = []

        this.distractor_list = distractor_list

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
        this.load.image('white', 'assets/background_title.jpg');
    }

    create(data) {

        let element = document.getElementById('input-box')

        for (let i = 0; i < element.children.length; i++) {
                      
            // it is an input element
            if(element.children[i].name == 'id'){
                element.children[i].addEventListener('input',()=>{
                    participant_id = element.children[i].value            
                })
            }

            // it is an input element
            if(element.children[i].name == 'trial'){
                element.children[i].addEventListener('input',()=>{
                    trial_id = element.children[i].value  
                })
            }
                
            // it is the button
            else {
                var this_scene = this
                element.children[i].addEventListener('click',()=>{
                    element.style.display = 'none'
                    this.slide++
                    
                    this.input.keyboard.on('keydown-SPACE', function (event) {
                        this_scene.slide++
                    });
                })
                }
            }


        this.add.image(general_config(1).width/2, general_config(1).height/2, "white").setOrigin(0.5);

        this.main_text = this.add.text(general_config(1).width/2, general_config(1).height/2, '', { fontSize: '40px', fill: '#000', align: 'center', fontFamily: "calibri"});
        this.main_text.setOrigin(0.5)
        this.debug_text = this.add.text(general_config(1).width/2, general_config(1).height - (general_config(1).height/8), '', { fontSize: '35px', fill: '#C00', align: 'center', fontFamily: "calibri"});
        this.debug_text.setOrigin(0.5)
    }

    
    update(time, delta) {
        
        if(this.prev_slide != this.slide) {
            this.prev_slide = this.slide

            console.log("slide", this.slide)


            if(this.slide == 0) {
                this.main_text.setText('');
            }else if(this.slide == 1) {
                                        this.main_text.setText(slide_text.welcome);
            }else if(this.slide == 2) {
                                        this.main_text.setText(slide_text.introduction);
            }else if(this.slide == 3) {
                                        this.main_text.setText(slide_text.practice1);
            }else if(this.slide == 4) {
                                        this.scene.launch('Training', { successive_correct_required: general_config(1).practise1_reps, rythm_list: {"blueEgg":[1,2,1], "redEgg":[1,1,2], "yellowEgg":[2,1,1], "cyanEgg":[1,999,1]}})
                                        this.scene.pause()

                                        this.main_text.setText('Loading Task...');
                                        this.slide++
            }else if(this.slide == 5) {
                                        this.main_text.setText(slide_text.phase1_p1);
            }else if(this.slide == 6) {
                                        this.main_text.setText(slide_text.phase1_p2);
            }else if(this.slide == 7) {
                                        this.scene.launch('Game', { phase_id: 1, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[1,1,2], "yellowEgg":[2,1,1], "cyanEgg":[1,999,1]}, distractor_list: ["cyanEgg"]})
                                        this.scene.pause()

                                        this.main_text.setText('Loading Task...');
                                        this.slide++
            }else if(this.slide == 8) {
                                        this.main_text.setText(slide_text.phase2_p1);
            }else if(this.slide == 9) {
                                        this.main_text.setText(slide_text.phase2_p2);
            }else if(this.slide == 10) {
                                        this.scene.launch('Game', { phase_id: 2, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,999,1], "redEgg":[1,999,1], "yellowEgg":[2,1,1], "cyanEgg":[1,999,1]}, distractor_list: ["blueEgg", "redEgg", "cyanEgg"]})
                                        this.scene.pause()

                                        this.main_text.setText('Loading Task...');
                                        this.slide++
            }else if(this.slide == 11) {
                                        //exportToCsv(game_data_columns, game_data)
                                        this.main_text.setText(slide_text.practice_2_and_phase_3_p1);
            }else if(this.slide == 12) {
                                        this.main_text.setText(slide_text.practice_2_and_phase_3_p2);
            }else if(this.slide == 13) {
                                        this.main_text.setText(slide_text.practice_2_and_phase_3_p3);
            }else if(this.slide == 14) {
                                        this.main_text.setText(slide_text.practice_2_and_phase_3_p4);
            }else if(this.slide == 15) {
                                        this.scene.launch('Training', { successive_correct_required: general_config(1).practice2_reps, rythm_list: [[2,1,1],[1,1,2],[1,2,1],[2,2,1],[2,2,1],[2,2,1],[2,2,1]]})
                                        this.scene.pause()

                                        this.main_text.setText('Loading Task...');
                                        this.slide++
            }else if(this.slide == 16) {
                                        this.main_text.setText(slide_text.phase_3);
            }else if(this.slide == 17) {
                                        this.scene.launch('Game', { phase_id: 3, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[2,2,1], "yellowEgg":[2,1,1], "cyanEgg":[1,1,2]}, distractor_list: []})
                                        this.scene.pause()

                                        this.main_text.setText('Loading Task...');
                                        this.slide++
            }else if(this.slide == 18) {
                                        this.main_text.setText(slide_text.phase4);
            }else if(this.slide == 19) {
                                        this.scene.launch('Game', { phase_id: 4, num_egg_per_color: general_config(1).eggs_per_color, rythm_list: {"blueEgg":[1,2,1], "redEgg":[1,999,1], "yellowEgg":[1,999,1], "cyanEgg":[1,999,1]}, distractor_list: ["redEgg","yellowEgg","cyanEgg"]})
                                        this.scene.pause()

                                        this.main_text.setText('Loading Task...');
                                        this.slide++         
            }else if(this.slide == 20) {
                                        this.main_text.setText(slide_text.finish);
                                        exportToCsv(game_data_columns, game_data)
            }
        }
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



class Sequence {
    constructor() {
        this.pending_sequence = []
        this.sequence = []

        this.prev_step = -1
        this.step = 0

        this.initialized_buttons = {}
    }

    play() {
        if(this.sequence.length > this.step) {
            if(this.step != this.prev_step) {
                this.prev_step = this.step

                this.sequence[this.step]()
                console.log("Step", this.step)
                this.step++
            }
        }

    }

    q(func) {
        this.pending_sequence.push(func)
    }

    pushQueue() {
        this.sequence = [...this.sequence, ...this.pending_sequence]
    }

    pushQueueFirst() {
        this.sequence = [...this.pending_sequence, ...this.sequence]
    }

    wait(scene, delay) {
        
        this.q(() => {
            this.step--
            scene.time.addEvent({delay: delay, callback: function() {
                this.step++
            }, callbackScope: this});
        })
    }

    waitInput(scene, buttons) {
        this.q(() => {
            this.step--
            for(const button of buttons) {
                if(safeItemInArray(button, Object.keys(this.initialized_buttons))) {
                    this.initialized_buttons[button] += 1
                    return
                }
                this.initialized_buttons[button] = 1

                var onInput = () => {
                    if(this.initialized_buttons[button] > 0) {
                        this.initialized_buttons[button] -= 1
                        this.step++
                    }
                }

                if(button == "pointerdown") {
                    scene.input.on(button, onInput);
                }else{
                    scene.input.keyboard.on(button, onInput);
                }                
            }
        })
    }
}




class Training extends Phaser.Scene {
    constructor() {
        super('Training')
    }

    log(msg) {
        console.log(`${msg}`)
    }

    debug(msg) {
        if(general_config(1).debug_mode) {
            console.log(`DEBUG:${msg}`)
        }
    }
    
    init(data) {
        this.debug_mode = false
        this.rythm_list = data.rythm_list
    }
    
    preload() {
        this.load.image('cyanEgg', 'assets/cyanEgg.png');
        this.load.image('blueEgg', 'assets/blueEgg.png');
        this.load.image('redEgg', 'assets/redEgg.png');
        this.load.image('yellowEgg', 'assets/yellowEgg.png');

        this.load.image('whitescreen', 'assets/background_title.jpg');
        this.load.image('r_key', 'assets/r_key.png');
        this.load.audio('tap', ['assets/chisel.mp3'])
    }



    q_playRythm(rythm) {
        for(var beat of rythm) {
            this.s.wait(this, beat)
            this.s.q(() => {
                this.sound.play(general_config(1).tap_sound)
                this.sound.context.resume();
                this.image.setAlpha(1)
                this.time.addEvent({ delay: 100, callback: () => {this.image.setAlpha(0.5)}, callbackScope: this})
            })
        }
    }

    q_setup() {
        this.s.q(() => {
            this.screen_obj = this.add.image(general_config(1).width/2,general_config(1).height/2, "whitescreen")
            this.sound.context.resume()})
    }

    q_listenRythm(rythm) {
        this.s.q(() => {
            this.s.step--
            this.rm.addRythmListener(this.image, rythm, "tap", false, () => {this.s.step++})})
    }


    create(data) {
        this.s = new Sequence()
        this.rm = new RythmManager(this)

        this.s.waitInput(this,["keydown-SPACE", "pointerdown"])

        this.s.q(() => {        
            let element = document.getElementById('input-box')
            element.style.display = "none"})

        this.q_setup()
        
        this.s.wait(this,2000)

        for(var egg in shuffle(["redEgg", "yellowEgg", "blueEgg", "cyanEgg"])) {
            this.s.q(() => {
                this.image = this.add.image(general_config(1).width/2,general_config(1).height/2, "redEgg")
                this.image.setAlpha(0.5)
                this.image.setInteractive({ useHandCursor: true })
            })

            this.q_playRythm([0,300,600,300]) 

            this.q_listenRythm([1,2,1])

            this.s.wait(this, 1000)
        }
        
        this.s.pushQueue()

        

        
        //this.score = 0

        //this.rythm_list_manager = new ListManager(this.rythm_list)
        //this.rythm_manager = new RythmManager(this)

        //this.training_text = this.add.text(general_config(1).width/2,general_config(1).height/2, "", { fontSize: '50px', fill: '#000  ', align: 'center' , fontFamily: "calibri"})
        //this.training_text.setOrigin(0.5);

        //this.r_key = this.add.image(general_config(1).width/2,general_config(1).height/2, "r_key")
        //this.r_key.setAlpha(0.5)
        //this.r_key.setInteractive({ useHandCursor: true })


    }

    playRythm(rythm, sound, image, play_delay=500) {
        image.setAlpha(0.5)

        var beat = Math.min(...rythm)

        rythm = [0, ...rythm]

        for(var i = 0; i < rythm.length; i++){
            rythm[i] = ((rythm[i] / beat) * general_config(1).beat_duration)
            if(i>0) {
                rythm[i] += rythm[i-1]
            }

            
            this.time.addEvent({ delay: play_delay+rythm[i],
                callback: function() {
                    this.sound.play(sound)
                    this.sound.context.resume();
                    console.log("tap")

                    image.setAlpha(1.0)
                     
                    this.time.addEvent({ delay: 100,
                        callback: function() {
                            image.setAlpha(0.5)
                    }, callbackScope: this});


            }, callbackScope: this});
        }
    }


    update(time, delta) {
        this.s.play()
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

    log(msg) {
        console.log(`${msg}`)
    }

    debug(msg) {
        if(this.debug_mode) {
            console.log(`DEBUG:${msg}`)
        }
    }
    
    init(data) {
        this.debug_mode = true
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
        this.load.image('cyanEgg', 'assets/cyanEgg.png');
        this.load.image('blueEgg', 'assets/blueEgg.png');
        this.load.image('redEgg', 'assets/redEgg.png');
        this.load.image('yellowEgg', 'assets/yellowEgg.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.image('fail', 'assets/fail.png');
        this.load.image('woods', 'assets/background.jpg');
        this.load.image('safe', 'assets/safe.png');
        this.load.image('white', 'assets/background_title.jpg');
        this.load.audio('tap', ['assets/chisel.mp3'])
        this.load.audio('diamond', ['assets/diamond.mp3'])
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

        var safe_loc_x = general_config(1).width/2
        var safe_loc_y = general_config(1).height - 60

        this.add.image(general_config(1).width/2,general_config(1).height/2, "woods")
        this.add.image(safe_loc_x,safe_loc_y, "safe").setScale(0.2).setOrigin(0.5)
    
        this.scoreText = this.add.text(safe_loc_x, safe_loc_y, 'Depot: 0', { fontSize: '50px', fill: '#FFF', align: 'center' , fontFamily: "calibri"});
        this.scoreText.setOrigin(0.5)

        this.speedText = this.add.text(general_config(1).width/2, 30, 'Speed: 1', { fontSize: '50px', fill: '#F33', align: 'center' , fontFamily: "calibri"});
        this.speedText.setOrigin(0.5)
        this.speedText.visible = false
        
        if(general_config(1).debug_mode) {
            this.speedText.visible = true
        }

        this.egg_manager = new ListManager(this.eggs_in_game, this.distractor_list)

        if(general_config(1).egg_locations_random) {
            this.location_manager = new ListManager(this.generateEggLocations())
        }else{
            this.location_manager = new ListManager({x: general_config(1).width/8, y: general_config(1).height/4},
                                                    {x: general_config(1).width/4, y: general_config(1).height/2},
                                                    {x: general_config(1).width - general_config(1).width/4, y: general_config(1).height/2},
                                                    {x: general_config(1).width - general_config(1).width/8, y: general_config(1).height/4})
        }

        this.rythm_manager = new RythmManager(this)

        this.start_time = Date.now()

        //this.main_loop = this.time.addEvent({
        //   delay: general_config(1).egg_drop_frequency,
        //    callback: this.dropEgg, callbackScope: this,
        //    loop: true });

    }


    dropEgg() {
        this.debug("game.dropEgg")
        this.debug("-----------------------------------")
        var this_scene = this

        if(this.egg_manager.hasItems()) {
            var egg = this.egg_manager.getRandom()
            var loc = this.location_manager.getRandom()
    
            var egg_obj = this.add.image(loc.x, loc.y, egg)
            egg_obj.setScale(general_config(1).egg_size).setInteractive({ useHandCursor: true })
    
    
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

    
            this.debug("-----------------------------------")
        }else{
            this.debug("no eggs in list, skipping round")
            this.debug("-----------------------------------")
        }
    }


    removeEgg(egg_obj, complete=false, successful=false, rythm_obj=0) {
        this.debug("game.removeEgg")
        this.debug("-----------------------------------")
        
        this.egg_manager.printStatusFull()

        var loc = {x:Math.floor(egg_obj.x), y:Math.floor(egg_obj.y)}

        this.debug(`Object: ${egg_obj.texture.key} at ${loc}, complete: ${complete}, successful: ${successful}`)

        //How long the Location should stay unused, after egg is collected
        this.time.addEvent({delay: general_config(this.speed).location_cooldown_duration, callback: function() {
            this.debug("location_manager.remove")
            this.location_manager.remove(loc)
        }, callbackScope: this});

        //How long the Egg should stay, after egg is collected
        this.time.addEvent({
            delay: general_config(this.speed).egg_stay_after_collect_duration, callback: function() {
                this.debug("egg_manager.remove")
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
            this.log("Pushing Trial data")
            trial_data = [...trial_data, rythm_obj.input_rythm, rythm_obj.error]
        }
        game_data.push(trial_data)

        this.speedText.setText(`Speed: ${this.speed}`)

        this.debug("-----------------------------------")

    }


    collectEgg(egg_obj) {
        if(general_config(1).collect_sound != "") {
            this.sound.play(general_config(1).collect_sound)
            this.sound.context.resume();
        }
        
        this.score++
        this.scoreText.setText(`Depot: ${this.score}`);
                
        var dia_obj = this.add.image(egg_obj.x, egg_obj.y, "diamond")
        dia_obj.setScale(0.2)

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

        this.seq = new Sequence()



        this.seq.queue(() => {this.add.image(200,200, "cyanEgg")})
        this.seq.wait(this,500)
        this.seq.queue(() => {this.add.image(200,200, "blueEgg")})
        this.seq.wait(this,500)
        this.seq.queue(() => {this.add.image(200,200, "redEgg")})
        this.seq.waitButton(this, "keydown-SPACE")
        this.seq.queue(() => {this.add.image(200,200, "yellowEgg")})

        this.seq.pushQueue()

    }


    update(time, delta) {
        this.seq.play()
    }
}









const config = {
    type: Phaser.AUTO,
    backgroundColor: "#FFF",
    scene: [Training],//[Study, Training, Game],

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


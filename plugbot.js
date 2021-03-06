
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/*
 * TERMS OF REPRODUCTION USE
 *
 * 1. Provide a link back to the original repository (this repository), as
 *      in, https://github.com/ConnerGDavis/Plugbot, that is well-visible
 *    wherever the source is being reproduced.  For example, should you
 *    display it on a website, you should provide a link above/below that
 *    which the users use, titled something such as "ORIGINAL AUTHOR".
 *
 * 2. Retain these three comments:  the GNU GPL license statement, this comment,
 *    and that below it, that details the author and purpose.
 *
 * Failure to follow these terms will result in me getting very angry at you
 * and having your software tweaked or removed if possible.  Either way, you're
 * still an idiot for not following such a basic rule, so at least I'll have
 * that going for me.
 */
/*
 * NOTE:  This is all procedural as hell because prototypes and any
 *      OOP techniques in Javascript are stupid and confusing.
 *
 * @author  Conner Davis
 * @author Jiri Navratil (experimental development)
 *
 * Coner Davis is author of basic bot concept.
 * All other implementations has been made by Jiri Navratil (Master Yoda)
 *
 *
 */

var version = "v0.9.7";

/*
 * Whether the user has currently enabled auto-woot.
 */
var autowoot;
/*
 * Whether the user has currently enabled auto-queueing.
 */
var autoqueue;
/*
 * Whether or not the user has enabled hiding this video.
 */
var hideVideo;
/*
 * Whether or not the user has enabled the userlist.
 */
var userList;
/*
 * Whether or not the user want to turn on hosting bot
 */
var hostingBot;

/*
 * Whether or not the user want to send generated messages
 */
var autoMsg;

/*
 * Whether or not the user want to auto force skip mod
 */
var autoForceSkip;
var delay;

/*
 * Whether or not the user want to use curate notifications
 */
var curateNotes;

/*
 * Whether or not the user want to use DJ stats notification
 */
var djStats;

/*
 * Whether or not the user want to use score notification
 */

var scoreNotes;

/*
 * Whether or not the user want to use chat Commands
 */
var chatCommands;

/*
 * global variables
 */
var prevDj = API.getDJ().username;
var savedScore = new Array(0, 0, 0, 0);
var song = API.getMedia();
var savedSong = new Array(song.author, song.title);

var woots, mehs, curates, votes, mehsRatio, wootsRatio, percentil;

var SUList = new Array(
                        "50aeb062c3b97a2cb4c2a0a2",//Donna
                        "50fc0b9fc3b97a409682a3d0",//me
                        "50fda7f6c3b97a48cb78b3dc",//Electric Lover
                        "51c953c696fba562bc64d37e"//Nasta
                    );

var whiteList = new Array(
                        "50aeb062c3b97a2cb4c2a0a2",//Donna
                        "50fc0b9fc3b97a409682a3d0",//me
                        "50fda7f6c3b97a48cb78b3dc",//Electric Lover
                        "51b3a9113e083e308688b0b4",//Main Stage
                        "50dcd9ffd6e4a967879c3628",//Lady of Luminosity
                        "50aeb3b696fba52c3ca0c5dc",//Celtic
                        "5102ed4596fba5767a14b08e",//Pointforger
                        "5101823b877b923fba1fb83b" //Dj FIO [CZ]
                    );               


var blackList = new Array(
                        "50f96db0877b92289a5f1bca",//rokko
                        "50b2c894877b9268ceab44f9",//Vixen
                        "50aeb169d6e4a94f7747746b"//Husky
                    );



function isSuperuser(obj) {
    for (var i = 0; i < SUList.length; i++) {
        if (obj.id == SUList[i])
            return true;
    }
    return false;
}

function isStrSuperuser(obj) {
    for (var i = 0; i < SUList.length; i++) {
        if (obj == SUList[i])
            return true;
    }
    return false;
}

function isWhitelisted(obj) {
    for (var i = 0; i < whiteList.length; i++) {
        if (obj.id == whiteList[i])
            return true;
    }
    return false;
}

function isStrWhitelisted(obj) {
    for (var i = 0; i < whiteList.length; i++) {
        if (obj == whiteList[i])
            return true;
    }
    return false;
}


function isBlaclisted(obj) {
    for (var i = 0; i < blackList.length; i++) {
        if (obj.id == blackList[i])
            return true;
    }
    return false;
}

function isStrBlacklisted(obj) {
    for (var i = 0; i < blackList.length; i++) {
        if (obj == blackList[i])
            return true;
    }
    return false;
}

function chatMsg(type, from, fromId, msg,language)
{
    this.type=type;
    this.from=from;
    this.fromId=fromId;
    this.msg=msg;
    this.language = language;
}

function getAuthSelf(obj) {
    for (var i = 0; i < whiteList.length; i++) {
        if (obj.fromID == whiteList[i] && API.getUser().id == whiteList[i]) {
            return true;
        }
    }
    return false;
}

function getAuth(obj) {
    for (var i = 0; i < whiteList.length; i++) {
        if (obj.fromID == whiteList[i]) {
            return true;
        }
    }
    return false;
}

var chatLog = [];
var ret;
var numb;
var number_of_songs_played = 0;
var watch_iter = 0;
var unvoted = true;
var error = false;
var stored_vote = 0;

/*
 * Cookie constants
 */
var COOKIE_WOOT = 'autowoot';
var COOKIE_QUEUE = 'autoqueue';
var COOKIE_HIDE_VIDEO = 'hidevideo';
var COOKIE_USERLIST = 'userlist';
var COOKIE_HOSTINGBOT = 'hostingbot';
var COOKIE_AUTOMSG = 'automsg';
var COOKIE_AUTOFORCESKIP = 'autoforceskip';
var COOKIE_CURATENOTES = 'curatenotes';
var COOKIE_DJSTATS = 'djstats';
var COOKIE_SCORENOTES = 'scorenotes';
var COOKIE_CHATCMD = 'chatcmd';

/*
 * Maximum amount of people that can be in the waitlist.
 */
var MAX_USERS_WAITLIST = 50;

/*
 * Whenever a user chooses to apply custom username FX to a
 * user, their username and chosen colour and saved here.
 */
var customUsernames = new Array();

/*
 * djAdvance counter and msgArrays
 */
var djAdvanceCnt = 0;
var msgArrayPositive = new Array(
    'Well, pretty nice song?! =)',
    'I like that',
    'WOW',
    'nice job',
    'what´s this ? :D',
    'This is ... just awesome :D',
    'Thanks for that =),',
    'you must be kidding me :D',
    'tra da da da',
    'this is crazy =)'
);

var msgArrayNegative = new Array(
    'That is weird!',
    'I am little but confused',
    'WHAT THE HELL',
    'nah, I dont like that pretty much',
    'Ear rape sound :D',
    'My ears are bleeding =(',
    'ou come on ...',
    'this is s**t for me',
    'skip please ... :D',
    'I am goona die ...'
);

var msgArrayNeutral = new Array(
    'No votes ?',
    'nothing ?',
    'vote please',
    'like it ...',
    'What about voting ...',
    'No votes ?',
    'nothing ?',
    'vote please',
    'like it ...',
    'What about voting ...'
);

var watch_list = new Array( {
    "id" : "",
    "start" : 0,
    "votes" : 0,
    "unvoted" : 0,
    "woots" : 0,
    "mehs" : 0,
    "messages" : 0
});

var watching = false;

/*
 * LCG
 */
var a = 69069;
var b = 1;
var M = 4294967296; // 2^32
var ix = Math.random();
var genNb = 0;
var safeIt;

function rand() {
    ix = (ix * a + b) % M;
    return ix / M;
}
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// skip first seed value - always the same
rand();

// timeoutId for sending msg delay
var timeoutId = null;
var songTimeoutId = null;
var autoSkipActivate = null;
var timeout = null;
var alert_check = null;
var watch_timer = null;
clearTimeout(timeoutId);
clearTimeout(songTimeoutId);
clearTimeout(autoSkipActivate);
clearTimeout(timeout);
clearTimeout(alert_check);
clearInterval(watch_timer);

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  console.log("object proprerty: " + out);
}


/**
 * Initialise all of the Plug.dj API listeners which we use
 * to asynchronously intercept specific events and the data
 * attached with them.
 */
function initAPIListeners() {

    API.on(API.ROOM_SCORE_UPDATE, function (obj) {

        if (hostingBot) {
            /*
            if (obj.positive == 0 && obj.negative == 0) {
                savedScore[0] = woots;
                savedScore[1] = mehs;
                savedScore[2] = curates;
                savedScore[3] = percentil;
            }
            */
            woots = obj.positive;
            mehs = obj.negative;
            curates = obj.curates;
            percentil = obj.score;
            votes = woots + mehs;
            mehsRatio = mehs/woots;
            wootsRatio = woots/mehs;


        }

        if (autoForceSkip) {
            checkScore();
        }

        
    });
    /*
     * This listens in for whenever a new DJ starts playing.
     */
    API.on(API.DJ_ADVANCE, djAdvanced);

    /*
     * This listens for changes in the waiting list
     */
    API.on(API.WAIT_LIST_UPDATE, queueUpdate);

    /*
     * This listens for changes in the dj booth
     */
    API.on(API.DJ_UPDATE, queueUpdate);

    /*
     * This listens for whenever a user in the room either WOOT!s
     * or Mehs the current song.
     */

    API.on(API.VOTE_UPDATE, function (obj) {
        if (userList) {
            populateUserlist();
        }
        if (obj.user.id == watch_list[0].id) {
            watch_list[0].vote = obj.vote;
        }
    });

    API.on(API.CURATE_UPDATE, function (obj) {
        
        if (curateNotes) {
            var media = API.getMedia();
            API.sendChat('/em ' + ': ' + obj.user.username + " just added " + media.author + " - " + media.title);
        }
    });

    /*
     * Whenever a user joins, this listener is called.
     */
    API.on(API.USER_JOIN, function (user) {
        if (hostingBot) {
            /*
            var text = "Welcome ";
            var pom = 'Ji' + '\xAE' + 'in';
            if (user.username == pom) {
                API.sendChat('Welcome Ji' + '\xAE' + 'in');
            }
            else { */
            if (user.id == "50aeb062c3b97a2cb4c2a0a2") {
                API.sendChat('@' + user.username);
                API.sendChat('/em Welcome beauty !!!');
            }
            else if (user.id == "50fda7f6c3b97a48cb78b3dc") {
                API.sendChat('@' + user.username);
                API.sendChat('/em Welcome bro !!!');
            }
            else if (isBlaclisted(user)) {
                API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot owner or or of superusers for more details.");
                APi.sendChat("/em Superusers: Master Yoda, Donna, Electric Lover");
            }
            else {
                API.sendChat('Welcome @' + user.username + ' !');
            }
            //}
        }

        if (userList) {

            populateUserlist();
        }
    });

    /*
     * Called upon a user exiting the room.
     */
    API.on(API.USER_LEAVE, function (user) {
        /*
        if (hostingBot) {

        
            API.sendChat('/em ' + ': ' + user.username + ' has left the room!');

        } */
        if (userList) {
            populateUserlist();
        }
    });

    API.on(API.USER_SKIP, function (obj) {
        clearTimeout(songTimeoutId);
    });

    API.on(API.CHAT, function (obj) {
        /*
        obj.type
        // "message", "emote", "moderation", "system"
        obj.from
        // the username of the person
        obj.fromID
        // the user id of the person
        obj.message
        // the chat message
        obj.language
        // the two character code of the incoming language
        */

        checkCustomUsernames();

       // if (autoMsg) {
            /*var msgInstance = new chatMsg(obj.type, obj.from, obj.fromID, obj, obj.language);
            chatLog.push(msgInstance);*/
/*
            while (image_array!=undefined && image_array.length > 0) {
                var chatMsgObj = chatLog.pop();
                var toInvestigate = chatMsgObj.msg;

            }
*/
        // }

        if (watching) {
            if (obj.fromID == watch_list[0].id)
                watch_list[0].messages += 1;
        }

        if (chatCommands) {
            obj.message = obj.message.replace(/&#39;/g, "\'");
            obj.message = obj.message.replace(/&amp;/g, "&");
            obj.message = obj.message.replace(/&lt;/g, "<");
            obj.message = obj.message.replace(/&gt;/g, ">");
            //if (API.getUser(obj.fromID).permission >= 1) {
                
                
                ret = obj.message.search("!commands");
                if (ret != -1 && obj[0] == '!') {
                    var commands = "/em List of commands (every command is separated by {  } ).";
                    var users_list = "/em List of users(indexed from 0): superusers - Donna, Master Yoda, Old Electric Man";
                    users_list += ";commonusers - Donna, Master Yoda, Old Eletric Man, Main Stage [staff], Lady of Luminosity, Celtic warrior, Jeremmy N@sty, Pointforger, Dj Fio [cz]";
                    users_list += ";blacklisted - Huskey, Rokko, Vixen";
                    var nonstaff;
                    var common_users;
                    var su_users;
                    nonstaff += "/em Non-staff commands: { !check me } - print out your statistics.";
                    nonstaff += " { !drink me } or { !drink \"name\" } - gives a coctail to the specified user .";
                    nonstaff += " { !hug me } or { !hug \"name\" } - hugs the specified user.";

                    common_users += "/em Common users bot commands: { /check \"name\"} - check the users statistics(Required permission - F-DJ)";
                    common_users += " { !cancel tout } - cancel the running timeout(Required permission - Bouncer)";
                    common_users += " { !cancel watch} - cancel the running spy mode(Required permission - higher then the user under watch)";
                    common_users += " { !avatar number } - number 1-13 - change to the specific haloween avatar(Required permision - bot commonuser)";
                    common_users += " { !watch \"name\" } - turn on the spy mode and record users round statictics(Required permision - higher permission then user under watch)";
                    common_users += " { !checkWatched 0 } - check the user´s stats under spy mode(Required permission - F-DJ)";
                    common_users += " { !active \"name\" } - check whether the user is stuck on the audience or if not(Required permission - F-DJ)";

                    su_users += "/em Superuser commands(numbers as parameters of the command is number of user in whitelist array): { /forceWootChange number } - changes the autowoot settings to oposite";
                    su_users += " { !forceWootOn number } - force autowoot to turn off";
                    su_users += " { !forceAutoQueueOff number } - force autoqueue to turn off";
                    su_users += " { !forceAutoQueueOn number } - force autoqueue to turn on";
                    su_users += " { !forceHostingStaffOn number } - force all hosting functions to turn off,if they aren´t";
                    su_users += " { !turnOffHostCmdCurates } - That command will turn off all hosting functions to all users";
                    su_users += " { !setAllOptionsOff } - sets all bot options off for all users";
                    su_users += " { !whosScriptIsRunning } - all users will type to chat to notice about them";
                    su_users += " { !getScriptOption }  - all users will type and bot settings to chat";
                    su_users += " { !forceReload number}  - force page reload - muahaha :D";
                    su_users += " { !printUserID \"name\" } - print user ID to console,if found";

                    API.sendChat(users_list);
                    API.sendChat(commands);
                    API.sendChat(nonstaff);
                    API.sendChat(common_users);
                    API.sendChat(su_users);


                }
                
                
                ret = obj.message.search("!check");
                if (ret != -1 && obj.message[0] == '!') {
                    
                    if (! isStrBlacklisted(obj.fromID)) {
                        
                        if (obj.message.substring(7,9) == 'me') {
                            
                            var me = API.getUser(obj.fromID);
                            API.sendChat('/em ' + obj.from + ' is checking himself... Points: ' + (me.djPoints + me.listenerPoints + me.curatorPoints) + '(djPts-' + me.djPoints + ' | listenerPts-' + me.listenerPoints + ' | CuratorPts-' + me.curatorPoints + ') Fans: ' + me.fans);
                            delete me;
                            me = null;
                        }
                        else {
                            if (API.getUser(obj.fromID).permission >= 1) {
                                var stored_msg = obj.message;
                                if (obj.message.substring(7, 12) == "&#34;") {
                                    var ind = obj.message.lastIndexOf("&#34;");
                                    if (ind != -1) {
                                        var name = obj.message.substring(12, ind);
                                        name = name.replace(/&#34;/g, "\"");
                                        var users = API.getUsers();
                                        for (var k = 0; k < users.length; k++) {
                                            if (users[k].username == name) {                                            
                                                API.sendChat('/em ' + obj.from + ' is checking ' + users[k].username + '... Points: ' + (users[k].djPoints + users[k].listenerPoints + users[k].curatorPoints) + '(djPts-' + users[k].djPoints + ' | listenerPts-' + users[k].listenerPoints + ' | CuratorPts-' + users[k].curatorPoints +') Fans: ' + users[k].fans);
                                            }
                                        }
                                    }
                                }
                                else {
                                    numb = parseInt(obj.message.substring(7,8));
                                    var booth = API.getWaitList();
                                    if (numb <= booth.length - 1) {
                                        API.sendChat('/em ' + obj.from + ' is checking ' + booth[numb].username + '... Points: ' + (booth[numb].djPoints + booth[numb].listenerPoints + booth[numb].curatorPoints) + '(djPts-' + booth[numb].djPoints + ' | listenerPts-' + booth[numb].listenerPoints + ' | CuratorPts-' + booth[numb].curatorPoints +') Fans: ' + booth[numb].fans);
                                    }
                                    delete booth;
                                    booth = null;
                                }
                            }
                            else {
                                API.sendChat('@' + obj.from + ' you´re not allowed to check others - Only staffed ppl can do so! Use /check me if you want to check your stats');
                            }
                        }
                    }
                    else {
                        API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                    }
                }

                ret = obj.message.search("!hug");
                if (ret != -1 && obj.message[0] == '!') {
                    if (!isStrBlacklisted(obj.fromID)) {
                        if (obj.message.substring(5,7) == 'me') {
                            var me = API.getUser(obj.fromID);
                            API.sendChat('/em ' + obj.from + ' just hugged him/herself!');
                            delete me;
                            me = null;
                        }
                        else {
                            
                            var stored_msg = obj.message;
                            if (obj.message.substring(5, 10) == "&#34;") {
                                var ind = obj.message.lastIndexOf("&#34;");
                                if (ind != -1) {
                                    var name = obj.message.substring(10, ind);
                                    name = name.replace(/&#34;/g, "\"");
                                    var users = API.getUsers();
                                    for (var k = 0; k < users.length; k++) {
                                        if (users[k].username == name) {                                            
                                            API.sendChat('/em ' + users[k].username + ' just got hugged by ' + obj.from);
                                        }
                                    }
                                }
                            }
                            else {
                                numb = parseInt(obj.message.substring(5,6));
                                var booth = API.getWaitList();
                                if (numb <= booth.length - 1) {
                                    API.sendChat('/em ' + booth[numb].username + ' just got hugged by ' + obj.from);
                                }
                                delete booth;
                                booth = null;
                            }
                        }
                    }
                    else {
                        API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                    }
                }

                ret = obj.message.search("!drink");
                if (ret != -1 && obj.message[0] == '!') {
                    if (isStrBlacklisted(obj.fromID)) {
                        if (obj.message.substring(7,9) == 'me') {
                            var me = API.getUser(obj.fromID);
                            API.sendChat('/em ' + obj.from + ' just got drunk alone!');
                            delete me;
                            me = null;
                        }
                        else {
                            
                            var stored_msg = obj.message;
                            if (obj.message.substring(7, 12) == "&#34;") {
                                var ind = obj.message.lastIndexOf("&#34;");
                                if (ind != -1) {
                                    var name = obj.message.substring(12, ind);
                                    name = name.replace(/&#34;/g, "\"");
                                    var users = API.getUsers();
                                    for (var k = 0; k < users.length; k++) {
                                        if (users[k].username == name) {                                            
                                            API.sendChat('/em ' + users[k].username + ' just got a drink from ' + obj.from);
                                        }
                                    }
                                }
                            }
                            else {
                                numb = parseInt(obj.message.substring(7,8));
                                var booth = API.getWaitList();
                                if (numb <= booth.length - 1) {
                                    API.sendChat('/em ' + booth[numb].username + ' just got a drink from ' + obj.from);
                                }
                                delete booth;
                                booth = null;
                            }
                        }
                    }
                    else {
                        API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                    }
                }

                ret = obj.message.search('!cancel');
                if (ret != -1 && obj.message[0] == '!') {
                    if (! isStrBlacklisted(obj.fromID)) {
                        if (obj.message.substring(8, 12) == "tout") {
                            if (API.getUser(obj.fromID).permission >= 2) {
                                var media_cur = API.getMedia();
                                if (media_cur.duration >= 1800) {
                                    var duration = media_cur.duration;
                                    duration = (duration <= 3600) ? duration/2 : 3600;
                                    console.log(duration);
                                    clearTimeout(songTimeoutId);
                                    songTimeoutId = setTimeout(function() {
                                        API.moderateForceSkip();
                                        API.sendChat('/em ' + ': ' + prevDj + ' has been skipped due to reaching song length limit!');
                                    }, duration * 1000);
                                    
                                    API.sendChat('/em ' + API.getDJ().username + '. Your timeout cancel wont be fully applied. Timeout has been postponed by the half of your song´s length. Playing songs longer then 30 minutes is not allowed.');
                                }
                                else {
                                    clearTimeout(songTimeoutId);
                                    API.sendChat('/em Timeout has been canceled!');
                                }
                            }
                        }
                        if (obj.message.substring(8,13) == "watch") {
                            if (API.getUser(obj.fromID).permission >= API.getUser(watch_list[0].id).permission) {
                                clearInterval(watch_timer);
                                watching = false;
                                watch_list[0] = {
                                    "id" : "",
                                    "start" : 0,
                                    "votes" : 0,
                                    "unvoted" : 0,
                                    "woots" : 0,
                                    "mehs" : 0,
                                    "messages" : 0
                                };
                                API.sendChat("/em Watching has been canceled!");
                            }
                            else {
                                API.sendChat("/em You dont have enough permission for that command!");
                            }
                        }
                    }
                    else {
                        API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                    }
                }

                ret  = obj.message.search('!sexxy');
                if (ret != -1 && obj.message[0] == '!') {
                    if (! isStrBlacklisted(obj.fromID)) {
                        if (obj.message.substring(7, 12) == "Donna") {
                            if (obj.fromID == "50fc0b9fc3b97a409682a3d0" && API.getUser().id == "50fc0b9fc3b97a409682a3d0") {
                                var foo = "_$$$$$___________________________$________$___$$___________________________________$____$_$$$___$$$$__$$$$_$$$$____$_$$$$___$____$$___$__$___$_$___$___$____$_$______$____$$___$__$___$_$___$$$$$____$__$$____$___$$$___$__$___$_$___$$__$____$____$___$$$$$__$$$___$___$_$___$$$$$____$_$$$$__";
                                var bar = "_____________$$$$_$$$$$___$_$___$_$___$______________$_____$___$$_$$_$$_$$_$$_$$__$$$$_$$$____$$____$____$_$___$_$___$_$___$___$___$____$$$__$$$$_$$$___$$$____$_____$$_$___$_______$_$____$_$___$_$____$_______$$___$___$___$_$___$$_$$_$$_$$___$____$$$$_$$$_____$$$__$$$$$___$$$___$$__$____";
                                API.sendChat('/em ' + foo);
                                API.sendChat('/em ' + bar);
                            }
                            else {
                                if (obj.fromID != "50fc0b9fc3b97a409682a3d0") {
                                    API.sendChat('@' + obj.from + ' you cant use that. Only Master Yoda can!!!');
                                }
                            }
                        }
                    }
                    else {
                        API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                    }
                }

                ret = obj.message.search("!avatar");
                    if (ret != -1 && obj.message[0] == '!') {
                        if (isStrWhitelisted(obj.fromID) && API.getUser().id == obj.fromID) {
                            var data_content = '{"service":"user.set_avatar","body":["halloween';
                            var numb;
                            if (obj.message.length > 9) {
                                numb = parseInt(obj.message.substring(8,10));
                            }
                            else {
                                numb = parseInt(obj.message.substring(8,9));
                            }

                            if (numb >= 1 && numb <= 13) {
                                
                                if (numb < 10) {
                                    data_content += '0' + parseInt(obj.message.substring(8,9)) + '"]}';
                                }
                                else {
                                    data_content += parseInt(obj.message.substring(8,10)) + '"]}';
                                }

                                $.ajax({ type: 'POST',
                                    url: 'http://plug.dj/_/gateway/user.set_avatar',
                                    contentType: 'application/json',
                                    data: data_content
                                });

                            }
                            else {
                                API.sendChat("/em " + obj.from + ".Avatar number is out of range(1-13)!");
                            }
                        }
                        else {
                            if (! isStrWhitelisted(obj.fromID)) {
                                API.sendChat("/em " + obj.from + ".You are not allowed to change avatars this way!");
                            }
                        }
                    }

                if (API.getUser(obj.fromID).permission >= 1) {
                    ret = obj.message.search('!watch');
                    if (ret != -1 && obj.message[0] == '!') {
                        if (! isStrBlacklisted(obj.fromID)) {
                            var id_to_watch = "";
                            if (obj.message.substring(7, 12) == "&#34;") {
                                var ind = obj.message.lastIndexOf("&#34;");
                                if (ind != -1) {
                                    if (!watching)  {
                                        var name = obj.message.substring(12, ind);
                                        name = name.replace(/&#34;/g, "\"");
                                        var users = API.getUsers();
                                        for (var k = 0; k < users.length; k++) {
                                            if (users[k].username == name) {
                                                if (users[k].permission <= API.getUser(obj.fromID).permission) {
                                                    id_to_watch = users[k].id;
                                                }
                                                else {
                                                    error = true;
                                                    API.sendChat("/em User found, but you dont have enough permission for this!");
                                                    id_to_watch = "";
                                                }
                                            }
                                        }
                                        if (id_to_watch != "") {
                                            if (watch_list[0].id != id_to_watch) {
                                                var date = new Date();
                                                watch_list[0] = {
                                                    "id" : id_to_watch,
                                                    "start" : date.getTime(),
                                                    "start_round" : number_of_songs_played,
                                                    "votes" : 0,
                                                    "unvoted" : 0,
                                                    "woots" : 0,
                                                    "mehs" : 0,
                                                    "vote" : 0,
                                                    "messages" : 0,
                                                    "round" : number_of_songs_played
                                                };
                                                watching = true;
                                                API.sendChat("/em Watching ...");
                                                watch_iter = number_of_songs_played - 1;
                                                watch_timer = setInterval(function() {
                                                    var vote = watch_list[0].vote;
                                                    if (vote != 0) {
                                                        // voted
                                                        if (watch_iter < number_of_songs_played) {
                                                            if (vote == -1) {
                                                                watch_list[0].mehs++;
                                                                stored_vote = -1;
                                                            }
                                                            else {
                                                                watch_list[0].woots++;
                                                                stored_vote = 1;
                                                            }
                                                            watch_list[0].votes++;
                                                            watch_iter++;
                                                        }
                                                        else {
                                                            if (vote != 0) {
                                                                if (vote == -1 && stored_vote == 1) {
                                                                    watch_list[0].mehs++;
                                                                    watch_list[0].woots--;
                                                                    stored_vote = -1;
                                                                }
                                                                if (vote == 1 && stored_vote == -1) {
                                                                    watch_list[0].woots++;
                                                                    watch_list[0].mehs--;
                                                                    stored_vote = 1;
                                                                }
                                                            }
                                                        }
                                                        unvoted = false;
                                                    }
                                                    else {
                                                        unvoted = true;
                                                    }
                                                }, 5000);
                                            }
                                            else {
                                                API.sendChat("/em Somebody is already watched!");
                                            }

                                        }
                                        else {
                                            if (!error) {
                                                API.sendChat("/em This user is not here! If you can see him on the floor, he´s probably stucked!");
                                                watching = false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                        }
                    }

                    ret = obj.message.search("!checkWatched");
                    if (ret != -1 && obj.message[0] == '!') {
                        if (! isStrBlacklisted(obj.fromID)) {
                            if (API.getUser(obj.fromID).permission >= 1) {
                                numb = parseInt(obj.message.substring(14,15));
                                if (numb == 0) {
                                        if (watching) {
                                            var dat = new Date;
                                            var current_time = dat.getTime();
                                            var time_difference = Math.floor((current_time - watch_list[0].start)/1000);
                                            var hours = Math.floor(time_difference/3600);
                                            var minutes = Math.floor(time_difference/60);
                                            var seconds = Math.floor(time_difference%60);
                                            var time_str = "";
                                            if (hours != 0) {
                                                time_str += hours + "h";
                                            }
                                            if (minutes != 0) {
                                                if (hours != 0) { time_str += ":"; }
                                                time_str += minutes + "m";
                                            }
                                            if (seconds != 0) {
                                                if (hours != 0 || minutes != 0) {
                                                    time_str += ":";
                                                }
                                                time_str += seconds + "s";
                                            }
                                            var unvoted_score = (watch_list[0].unvoted == 0) ? 0 : watch_list[0].unvoted - 1;
                                            var msg = "/em BIG BROTHER´s watching you for " + time_str + " " + API.getUser(watch_list[0].id).username + ": votes-" + watch_list[0].votes
                                                    + ",unvoted-" + unvoted_score + ",woots-" + watch_list[0].woots + ",mehs-" + watch_list[0].mehs + ",messages-" + watch_list[0].messages;
                                            API.sendChat(msg);
                                        }
                                        else {
                                            API.sendChat("/em Nobody is watched!");
                                        }
                                }
                            }
                        }
                        else {
                            API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                        }
                    }

                    ret = obj.message.search("!lock");
                    if (ret != -1 && obj.message[0] == "!") {
                        if (! isStrBlacklisted(obj.fromID)) {
                            if (API.getUser(obj.fromID).permission >= 3) {
                                $.ajaxSetup({ cache: false });
                                $.ajax({
                                    url: "http://plug.dj/_/gateway/room.update_options",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        service: "room.update_options",
                                        body: [Slug,{
                                            "boothLocked":     true,
                                            "waitListEnabled": true,
                                            "maxPlays":        1,
                                            "maxDJs":          5
                                        }]
                                    }),
                                    async: this.async,
                                    dataType: 'json',
                                    contentType: 'application/json'
                                }).done(function() {
                                    API.sendChat('/em The booth has been locked!');
                                });
                            }
                        }
                        else {
                            API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                        }
                    }

                    ret = obj.message.search("!unlock");
                    if (ret != -1 && obj.message[0] == "!") {
                        if (! isStrBlacklisted(obj.fromID)) {
                            if (API.getUser(obj.fromID).permission >= 3) {
                                $.ajaxSetup({ cache: false });
                                $.ajax({
                                    url: "http://plug.dj/_/gateway/room.update_options",
                                    type: 'POST',
                                    data: JSON.stringify({
                                        service: "room.update_options",
                                        body: [Slug,{
                                            "boothLocked":     false,
                                            "waitListEnabled": true,
                                            "maxPlays":        1,
                                            "maxDJs":          5
                                        }]
                                    }),
                                    async: this.async,
                                    dataType: 'json',
                                    contentType: 'application/json'
                                }).done(function() {
                                    API.sendChat('/em The booth has been unlocked!');
                                });
                            }
                        }
                        else {
                            API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                        }
                    }

                    ret = obj.message.search('!active');
                    if (ret != -1 && obj.message[0] == '!' && API.getUser(obj.fromID).permission >= 1) {
                        if (!isStrBlacklisted(obj.fromID)) {
                            var active = false;
                            if (obj.message.substring(8, 13) == "&#34;") {
                                var ind = obj.message.lastIndexOf("&#34;");
                                if (ind != -1) {
                                    var name = obj.message.substring(13, ind);
                                    name = name.replace(/&#34;/g, "\"");
                                    var users = API.getUsers();
                                    for (var k = 0; k < users.length; k++) {
                                        if (users[k].username == name) {
                                            active = true;
                                        }
                                    }
                                    if (active) {
                                        API.sendChat("/em " + name + " is active!");
                                    }
                                    else {
                                        API.sendChat("/em " + name + " is not here!");
                                    }
                                    active = false;
                                }
                            }
                        }
                        else {
                            API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
                        }
                    }

                }


            //}

        }

        if (obj.message.search("AutoWoot: http") != -1) {
            API.moderateDeleteChat(obj.chatID);
        }

        ret = obj.message.search("!forceWootChange");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            var whoToChange = parseInt(obj.message.substring(17,18));
            var response = "from " + autowoot + " to ";
            if (whoToChange == 0) {
                if (API.getUser().id != whiteList[0]) {
                    autowoot = !autowoot;
                    $('#plugbot-btn-woot').css("color", autowoot ? "#3FFF00" : "#ED1C24");
                    jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
                    API.sendChat("/em " + response + autowoot);
                }
            }
            else {
                if (API.getUser().id == whiteList[whoToChange]) {
                    autowoot = !autowoot;
                    $('#plugbot-btn-woot').css("color", autowoot ? "#3FFF00" : "#ED1C24");
                    jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
                    API.sendChat("/em " + response + autowoot);
                }
            }
        }

        ret = obj.message.search("!forceWootOn");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            var whoToChange = parseInt(obj.message.substring(13,14));
            if (whoToChange == 0) {
                if (API.getUser().id != whiteList[0]) {
                    if (autowoot == false) {
                        autowoot = !autowoot;
                        $('#plugbot-btn-woot').css("color", autowoot ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
                        API.sendChat("/em autowoot:" + autowoot);
                    }
                }
            }
            else {
                if (API.getUser().id == whiteList[whoToChange]) {
                    if (autowoot == false) {
                        autowoot = !autowoot;
                        $('#plugbot-btn-woot').css("color", autowoot ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
                        API.sendChat("/em autowoot:" + autowoot);
                    }
                }
            }
        }

        ret = obj.message.search("!forceAutoQueueOff");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            var whoToChange = parseInt(obj.message.substring(19,(obj.message.length > 21)?21:20));
            if (whoToChange == 0) {
                if (API.getUser().id != whiteList[0]) {
                    if (autoqueue == true) {
                        autoqueue = false;
                        $('#plugbot-btn-queue').css("color", autoqueue ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
                        API.sendChat("/em autoqueue:" + autoqueue);
                    }
                }
            }
            else if (whoToChange != -1){
                if (API.getUser().id == whiteList[whoToChange]) {
                    if (autoqueue == true) {
                        autoqueue = false;
                        $('#plugbot-btn-queue').css("color", autoqueue ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
                        API.sendChat("/em autoqueue:" + autoqueue);
                    }
                }
            }
            else {
                for (var i = 0; i < whiteList.length; i++) {
                    if (API.getUser().id != whiteList[i]) {
                        if (autoqueue == true) {
                        autoqueue = false;
                        $('#plugbot-btn-queue').css("color", autoqueue ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
                        API.sendChat("/em autoqueue:" + autoqueue);
                    }
                    }
                }
            }
        }

        ret = obj.message.search("!forceAutoQueueOn");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            var whoToChange = parseInt(obj.message.substring(18,19));
            if (whoToChange == 0) {
                if (API.getUser().id != whiteList[0]) {
                    if (autoqueue == false) {
                        autoqueue = !autoqueue;
                        $('#plugbot-btn-queue').css("color", autoqueue ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
                        API.sendChat("/em autoqueue:" + autoqueue);
                    }
                }
            }
            else {
                if (API.getUser().id == whiteList[whoToChange]) {
                    if (autoqueue == false) {
                        autoqueue = !autoqueue;
                        $('#plugbot-btn-queue').css("color", autoqueue ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
                        API.sendChat("/em autoqueue:" + autoqueue);
                    }
                }
            }
        }

        ret = obj.message.search("!forceHostingStaffOn");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            var whoToChange = parseInt(obj.message.substring(21,22));
            if (whoToChange != 0) {
                if (API.getUser().id != whiteList[0] && API.getUser().id == whiteList[whoToChange]) {
                    var res = "";
                    if (!hostingBot) {
                        hostingBot = true;
                        $('#plugbot-btn-hostingbot').css("color", hostingBot ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_HOSTINGBOT, hostingBot);
                        res += "hostingBot";
                    }

                    if (!curateNotes) {
                        curateNotes = true;
                        $('#plugbot-btn-curate-notes').css("color", curateNotes ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_CURATENOTES, curateNotes);
                        if (res.length > 0) {
                            res += " , ";
                        }
                        res += "curateNotes";
                    }
                    if (!chatCommands) {
                        chatCommands = true;
                         $('#plugbot-btn-chatcmds').css("color", chatCommands ? "#3FFF00" : "#ED1C24");
                        jaaulde.utils.cookies.set(COOKIE_CHATCMD, chatCommands);
                        if (res.length > 0) {
                            res += " , ";
                        }
                        res += "chatCmds"
                    }
                    if (res.length != 0) {
                        API.sendChat("/em " + res + " has been forced to turn on");
                    }
                }
            }
        }

        ret = obj.message.search("!turnOffHostCmdCurates");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            if (API.getUser().id != whiteList[0]) {
                var res = "";
                if (hostingBot) {
                    hostingBot = false;
                    $('#plugbot-btn-hostingbot').css("color", hostingBot ? "#3FFF00" : "#ED1C24");
                    jaaulde.utils.cookies.set(COOKIE_HOSTINGBOT, hostingBot);
                    res += "hostingBot";
                }

                if (curateNotes) {
                    curateNotes = false;
                    $('#plugbot-btn-curate-notes').css("color", curateNotes ? "#3FFF00" : "#ED1C24");
                    jaaulde.utils.cookies.set(COOKIE_CURATENOTES, curateNotes);
                    if (res.length > 0) {
                        res += " , ";
                    }
                    res += "curateNotes";
                }
                if (chatCommands) {
                    chatCommands = false;
                     $('#plugbot-btn-chatcmds').css("color", chatCommands ? "#3FFF00" : "#ED1C24");
                    jaaulde.utils.cookies.set(COOKIE_CHATCMD, chatCommands);
                    if (res.length > 0) {
                        res += " , ";
                    }
                    res += "chatCmds"
                }
                if (res.length != 0) {
                    API.sendChat("/em " + res + " has been forced to turn off");
                }
            }
        }

        ret = obj.message.search("!whosScriptIsRunning");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            if (API.getUser().id != whiteList[0]) {
                API.sendChat('/em I am using ' + version + ' ' + API.getUser(whiteList[1]).username + ' =)');
            }
        }

        ret = obj.message.search("!getScriptOption");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            for (var i = 0; i < whiteList.length; i++) {
                if (obj.fromID == whiteList[i] && API.getUser().id != obj.fromID) {
                    API.sendChat('/em ' + version + ' woot:' + autowoot + " que:" + autoqueue + " host:" + hostingBot + " cmd:" + chatCommands + " cur:" + curateNotes + " score:" + scoreNotes + " djstat:" + djStats + " msgs:" + autoMsg);
                }
            }
        }

        ret = obj.message.search("!forceReload");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            var whoToChange = parseInt(obj.message.substring(13,14));
            if (API.getUser().id == whiteList[whoToChange]) {
                    API.sendChat("reloading page. WARNING - the bot wont be loaded after this reload!");
                    window.location.reload();
            }
        }

        ret = obj.message.search('!printUserID');
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            if (!isStrBlacklisted(obj.fromID)) {
                if (obj.message.substring(13, 18) == "&#34;") {
                    var found = -1;
                    var ind = obj.message.lastIndexOf("&#34;");
                    if (ind != -1) {
                        var name = obj.message.substring(18, ind);
                        name = name.replace(/&#34;/g, "\"");
                        var users = API.getUsers();
                        for (var k = 0; k < users.length; k++) {
                            if (users[k].username == name) {
                                found = k;
                            }
                        }
                        if (found != -1) {
                            console.log(users[found].username + ":" + users[found].id);
                            API.sendChat("/em User " + name + " found. ID was printed to console!");
                        }
                        else {
                            API.sendChat("/em User " + name + " not found!");
                        }
                        found = -1;
                    }
                }
            }
            else {
                API.sendChat("/em Nah " + API.getUser(obj.fromID).username + ". You´re blacklisted. Contact bot superuser or owner for more details.");
            }
        }

        ret = obj.message.search("!setAllOptionsOff");
        if (ret != -1 && obj.message[0] == '!' && isStrSuperuser(obj.fromID)) {
            if (! isSuperuser(API.getUser())) {        
                autowoot = false;
                $("#plugbot-btn-woot").css("color", autowoot ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);

                autoqueue = false;
                $("#plugbot-btn-queue").css("color", autoqueue ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);

                autoMsg = false;
                $("#plugbot-btn-auto-msg").css("color", autoMsg ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_AUTOMSG, autoMsg);

                hostingBot = false;
                $("#plugbot-btn-hostingbot").css("color", hostingBot ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_HOSTINGBOT, hostingBot);

                chatCommands = false;
                $("#plugbot-btn-chatcmds").css("color", chatCommands ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_CHATCMD, chatCommands);

                curateNotes = false;
                $("#plugbot-btn-curate-notes").css("color", curateNotes ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_CURATENOTES, curateNotes);

                djStats = false;
                $("#plugbot-btn-djStats").css("color", djStats ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_DJSTATS, djStats);

                scoreNotes = false;
                $("#plugbot-btn-score-notes").css("color", scoreNotes ? "#3FFF00" : "#ED1C24");
                jaaulde.utils.cookies.set(COOKIE_SCORENOTES, scoreNotes);

                API.sendChat("/em Off ... ");
            }
        }
    });

    /*
        This is called when an incoming chat arrives. It passes a chat object.

        USAGE
        API.on(API.CHAT, callback);
        function callback(data)
        {
        data.type
        // "message", "emote", "moderation", "system"
        data.from
        // the username of the person
        data.fromID
        // the user id of the person
        data.message
        // the chat message
        data.language
        // the two character code of the incoming language
        }
    */
}

/**
 * Periodically check the chat history to see if any of the messages
 * match that of the user's chosen custom username FX.  If so, then we
 * need to style every instance of those.
 */
function checkCustomUsernames() {
    $('span[class*="chat-from"]').each(function () {
        for (var custom in customUsernames) {
            var check = customUsernames[custom].split(":");
            if (check[0] == $(this).text()) {
                $(this).css({
                    color: "#" + check[1]
                });
                break;
            }
        }
    });
}

/**
 * Renders all of the Plug.bot "UI" that is visible beneath the video
 * player.
 */
function displayUI() {
    /*
     * Be sure to remove any old instance of the UI, in case the user
     * reloads the script without refreshing the page (updating.)
     */
    $('#plugbot-ui').remove();

    /*
     * Generate the HTML code for the UI.
     */
    $('#chat').prepend('<div id="plugbot-ui" style="position: absolute; margin-left: -165px;"></div>');
    var cWoot = autowoot ? "#3FFF00" : "#ED1C24";
    var cQueue = autoqueue ? "#3FFF00" : "#ED1C24";
    var cHideVideo = hideVideo ? "#3FFF00" : "#ED1C24";
    var cUserList = userList ? "#3FFF00" : "#ED1C24";
    var cHostingBot = hostingBot ? "#3FFF00" : "#ED1C24";
    var cAutoMsg = autoMsg ? "#3FFF00" : "#ED1C24";
    var cAutoForceSkip = autoForceSkip ? "#3FFF00" : "#ED1C24";
    var cCurateNotes = curateNotes ? "#3FFF00" : "#ED1C24";
    var cDjStats = djStats ? "#3FFF00" : "#ED1C24";
    var cScoreNotes = cScoreNotes ? "#3FFF00" : "#ED1C24";
    var cChatCommands = chatCommands ? "#3FFF00" : "#ED1C24";
    $('#plugbot-ui').append( '<p id="plugbot-btn-woot" style="color:' + cWoot + '">auto-woot</p>'
                + '<p id="plugbot-btn-queue" style="color:' + cQueue + '">auto-queue</p>'
                + '<p id="plugbot-btn-hidevideo" style="color:' + cHideVideo + '">hide video</p>'
                + '<p id="plugbot-btn-userlist" style="color:' + cUserList + '">userlist</p>'
                + '<p id="plugbot-btn-hostingbot" style="color:' + cHostingBot + '">hosting bot</p>'
                + '<p id="plugbot-btn-chatcmds" style="color:' + cChatCommands + '">chat commands</p>'
                + '<p id="plugbot-btn-score-notes" style="color:' + cScoreNotes + '">score notifications</p>'
                + '<p id="plugbot-btn-curate-notes" style="color:' + cCurateNotes + '">curate notifications</p>'
                + '<p id="plugbot-btn-djStats" style="color:' + cDjStats + '">djStats notification</p>'
                + '<p id="plugbot-btn-auto-msg" style="color:' + cAutoMsg + '">Autosending msgs</p>'
                + '<h2 title="This makes it so you can give a user in the room a special colour when they chat!">'
                + 'Custom Username FX: <br /><br id="space" /><span onclick="promptCustomUsername()" style="cursor:pointer">'
                + '+ add new</span></h2>');
}

/**
 * Prompt the user to provide a new custom username FX.
 *
 * TODO: Save to database per-user for saved settings.
 */
function promptCustomUsername() {
    var check = prompt("Format:  username:color\n(For color codes, Google 'Hexadecimal color chart')");

    customUsernames.push(check);

    $('#space').after('<span id="' + check + '" onclick="customUsernames.splice(\'' + check + '\', 1);$(this).next().remove();$(this).remove();" style="cursor:pointer;color:#' + check.split(":")[1] + '">- ' + check.split(":")[0] + '</span><br />');

    checkCustomUsernames();
}

/**
 * For every button on the Plug.bot UI, we have listeners backing them
 * that are built to intercept the user's clicking each button.  Based
 * on the button that they clicked, we can execute some logic that will
 * in some way affect their experience.
 */
function initUIListeners() {
    /*
     * Toggle userlist.
     */
    $("#plugbot-btn-userlist").on("click", function () {
        userList = !userList;
        $(this).css("color", userList ? "#3FFF00" : "#ED1C24");
        $("#plugbot-userlist").css("visibility", userList ? ("visible") : ("hidden"));
        if (!userList) {
            $("#plugbot-userlist").empty();
        } else {
            populateUserlist();
        }
        jaaulde.utils.cookies.set(COOKIE_USERLIST, userList);
    });

    /*
     * Toggle auto-woot.
     */
    $("#plugbot-btn-woot").on("click", function () {
        autowoot = !autowoot;
        $(this).css("color", autowoot ? "#3FFF00" : "#ED1C24");
        if (autowoot) {
            $("#button-vote-positive").click();
        }
        jaaulde.utils.cookies.set(COOKIE_WOOT, autowoot);
    });

    /*
     * Toggle hide video.
     */
    $("#plugbot-btn-hidevideo").on("click", function () {
        hideVideo = !hideVideo;
        $(this).css("color", hideVideo ? "#3FFF00" : "#ED1C24");
        $("#yt-frame").animate({
            "height": (hideVideo ? "0px" : "271px")
        }, {
            duration: "fast"
        });
        $("#playback .frame-background").animate({
            "opacity": (hideVideo ? "0" : "0.91")
        }, {
            duration: "medium"
        });
        jaaulde.utils.cookies.set(COOKIE_HIDE_VIDEO, hideVideo);
    });

    /*
     * Toggle auto-queue/auto-DJ.
     */
    $("#plugbot-btn-queue").on("click", function () {
        autoqueue = !autoqueue;
        $(this).css("color", autoqueue ? "#3FFF00" : "#ED1C24");
        if (autoqueue && !isInQueue()) {
            joinQueue();
        }
        jaaulde.utils.cookies.set(COOKIE_QUEUE, autoqueue);
    });

    /*
     * Toggle autosending of generated messages
     */
     $("#plugbot-btn-auto-msg").on("click", function () {
        autoMsg = !autoMsg;
        $(this).css("color", autoMsg ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_AUTOMSG, autoMsg);
    });

    /*
     * Toggle auto-welcome/leave messages
     */
    $("#plugbot-btn-hostingbot").on("click", function () {
        hostingBot = !hostingBot;
        $(this).css("color", hostingBot ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_HOSTINGBOT, hostingBot);
        if (hostingBot) {
            $('#button-vote-negative').click();
            $('#button-vote-positive').click();
        }
    });

    /*
     * Toggle chat commands
     */
    $("#plugbot-btn-chatcmds").on("click", function () {
        chatCommands = !chatCommands;
        $(this).css("color", chatCommands ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_CHATCMD, chatCommands);
    });

     /*
     * Toggle autoForceSkip mod
     */

    $("#plugbot-btn-auto-forceskip").on("click", function () {
        autoForceSkip = !autoForceSkip;
        $(this).css("color", autoForceSkip ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_AUTOFORCESKIP, autoForceSkip);
    });

    /*
     * Toggle curate notifications
     */

    $("#plugbot-btn-curate-notes").on("click", function () {
        curateNotes = !curateNotes;
        $(this).css("color", curateNotes ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_CURATENOTES, curateNotes);
    });

    /*
     * Toggle djStats notification
     */

    $("#plugbot-btn-djStats").on("click", function () {
        djStats = !djStats;
        $(this).css("color", djStats ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_DJSTATS, djStats);
    });

    /*
     * Toggle score notifications
     */

    $("#plugbot-btn-score-notes").on("click", function () {
        scoreNotes = !scoreNotes;
        $(this).css("color", scoreNotes ? "#3FFF00" : "#ED1C24");
        jaaulde.utils.cookies.set(COOKIE_SCORENOTES, scoreNotes);
    });
}

function checkScore() {
    var Djs = API.getWaitList();

    if (votes >= 5 && votes <= 10) {
        if (mehsRatio > 0.5 && curates == 0) {
            API.moderateForceSkip();
            API.sendChat('/em ' + ': ' + Djs[0].username + 'has been skipped due to bad score ratio.');
        }
    } 

    if (votes >= 10 && votes <= 20) {
        if (mehsRatio >= 0.5 && curates == 0) {
            API.moderateForceSkip();
            API.sendChat('/em ' + ': ' + Djs[0].username + 'has been skipped due to bad score ratio.');
        }
    }
    if (votes >= 21) {
        if (mehsRatio >= 0.35 && curates == 0) {
            API.moderateForceSkip();
            API.sendChat('/em ' + ': ' + Djs[0].username + 'has been skipped due to bad score ratio.');
        }
    }
}

/**
 * Called whenever a new DJ begins playing in the room.
 *
 * @param obj
 *        This contains the current DJ's data.
 */
function djAdvanced(obj) {

    if (chatCommands) {
        number_of_songs_played++;
        if (watching) {
            if (unvoted && API.getDJ().id != watch_list[0].id) {
                watch_list[0].unvoted++;
                watch_iter++;
                stored_vote = 0;
            }
        }
    }

    clearTimeout(songTimeoutId);

    if (autoForceSkip) {
        autoForSkipFlag = false;
        clearTimeout(autoSkipActivate);
        delay = (Math.floor(obj.media.duration/5) > 60) ? 60 : Math.floor(obj.media.duration/5);
        autoSkipActivate = setTimeout(function() {
            checkScore();
        }, delay);
    }
    if (djAdvanceCnt == 101) {
        djAdvanceCnt = 1;
    } else {
        djAdvanceCnt++;
    }
    var currentDj = obj.dj;

    if (hostingBot) {
        // DJ just left the booth

        if (scoreNotes) {
            savedScore[0] = woots;
            savedScore[1] = mehs;
            savedScore[2] = curates;
            savedScore[3] = percentil;
            var msg;
            if (savedScore[0] == undefined) {
                msg = '/em ' + ': ' + prevDj + ' just played ' + savedSong[0] + '-' + savedSong[1]
                        + ' and failed. Nobody voted or curated!';
            }
            else {
                msg = '/em ' + ': ' + prevDj + ' just played ' + savedSong[0] + '-' + savedSong[1]
                        + ' and achieved ' + savedScore[0] + ' woots' + ', ' + savedScore[1] + ' mehs, '
                        + savedScore[2] + ' curates and final score ' + Math.floor(savedScore[3] * 100) + '%';
            }
            API.sendChat(msg);
        }

        if (djStats) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                API.sendChat('/em ' + ': ' + currentDj.username + '´s stats: totalPoints:' + (currentDj.djPoints + currentDj.listenerPoints) + '(djPoints-' + currentDj.djPoints + ' | listenerPoints-' + currentDj.listenerPoints + '), fans-' + currentDj.fans + ' curatedCount-' + currentDj.curatorPoints + ' is currently playing ...');
            }, 5000);
        }


    }
    
    if (hostingBot) {
        var duration = obj.media.duration;
        if (duration > 485) {
            songTimeoutId = setTimeout(function() {
                API.moderateForceSkip();
                API.sendChat('/em ' + ': ' + prevDj + 'has been skipped due to reaching song length limit!');
            }, 480000);
            API.sendChat('/em ' + obj.dj.username + ' will be skipped after 8 minutes due to exceeding length limit!');
        }
        delete duration;
    }
    /*
     * If they want the video to be hidden, be sure to re-hide it.
     */
    if (hideVideo) {
        $("#yt-frame").css("height", "0px");
        $("#playback .frame-background").css("opacity", "0.0");
    }

    /*
     * If auto-woot is enabled, WOOT! the song.
     */
    if (autowoot) {
        $("#button-vote-positive").click();
    }

    if (autoMsg) {
            alert_check = setTimeout(function() {
                if ($('#dialog-box').children('#dialog-alert').length != 0) {
                    $('#dialog-box').children('#dialog-alert').children().last().click();
                }
            }, 10000);
            
        if (djAdvanceCnt % 8 == 0) {
            // send msg to chat
            safeIt = genNb;
            genNb = rand();
            while (Math.floor(safeIt * 10) == Math.floor(genNb * 10)) {
                genNb = rand();
            }
            // send msg after randomized delay between 5 - 60 seconds
            var delay = getRandomInRange(5000, 60000);        
            timeoutId = setTimeout(function() {
                // choose which msg to send - positive vs negative
                var positive = parseInt($('#room-score-positive-value').text());
                var negative = parseInt($('#room-score-negative-value').text());
                if (negative == 0 && positive > 0) {
                    // everyone likes that
                    API.sendChat(msgArrayPositive[Math.floor(genNb * 10)]);
                }
                else if (positive <= negative) {
                    // MEH - more dislikes
                    API.sendChat(msgArrayNegative[Math.floor(genNb * 10)]);
                }
                else if (positive > negative) {
                    // get negative percentage 
                    if (negative/positive > 0.25) {
                        // more then 25% of negative votes
                        API.sendChat(msgArrayNegative[Math.floor(genNb * 10)]);
                    }
                    else {
                        API.sendChat(msgArrayPositive[Math.floor(genNb * 10)]);
                    }
                }
                else {
                    // no votes
                    API.sendChat(msgArrayNeutral[Math.floor(genNb * 10)]);
                }
                
            }, delay);
        }

    }

    /*
     * If the userlist is enabled, re-populate it.
     */
    if (userList) {
        populateUserlist();
    }

    prevDj = currentDj.username;
    savedSong[0] = obj.media.author;
    savedSong[1] = obj.media.title;
    
}

/**
 * Called whenever a change happens to the queue.
 *
 */
function queueUpdate() {
    /*
     * If auto-queueing has been enabled, and we are currently
     * not in the waitlist, then try to join the list.
     */
    if (autoqueue && !isInQueue()) {
        joinQueue();
    }
}

/**
 * Checks whether or not the user is already in queue.
 *
 * @return True if the user is in queue, else false.
 */
function isInQueue() {
    var self = API.getUser();
    return API.getWaitList().indexOf(self) !== -1 || API.getDJ() == self;
}

function isUserInQueue(user) {
    return API.getWaitList().indexOf(user) !== -1 || API.getDJ() == self;
}

function isOnBooth() {
    return API.getDJ() == API.getUser();
}

/**
 * Tries to add the user to the queue or the booth if there is no queue.
 *
 */
function joinQueue() {
    if ($("#button-dj-play").css("display") === "block") {
        $("#button-dj-play").click();
    } else if (API.getWaitList().length < MAX_USERS_WAITLIST) {
        API.waitListJoin();
    }
}

/**
 * Generates every user in the room and their current vote as
 * colour-coded text.  Also, moderators get the star next to
 * their name.
 */
function populateUserlist() {
    /*
     * Destroy the old userlist DIV and replace it with a fresh
     * empty one to work with.
     */
    $('#plugbot-userlist').html(' ');

    /*
     * Update the current # of users in the room.
     */
    $('#plugbot-userlist').append('<h1 style="text-indent:12px;color:#42A5DC;font-size:14px;font-variant:small-caps;">Users: ' + API.getUsers().length + '</h1>');

    /*
     * Disclaimer that yes, you can now mention people from the
     * userlist!
     */
    $('#plugbot-userlist').append('<p style="padding-left:12px;text-indent:0px !important;font-style:italic;color:#42A5DC;font-size:11px;">Click a username to<br />@mention them! *NEW</p><br />');

    /*
     * If the user is in the waitlist, show them their current spot.
     */
    if ($('#button-dj-waitlist-view').attr('title') !== '') {
        if ($('#button-dj-waitlist-leave').css('display') === 'block' && ($.inArray(API.getWaitList(), API.getUser()) == -1)) {
            var spot = $('#button-dj-waitlist-view').attr('title').split('(')[1];
            spot = spot.substring(0, spot.indexOf(')'));
            $('#plugbot-userlist').append('<h1 id="plugbot-queuespot"><span style="font-variant:small-caps">Waitlist:</span> ' + spot + '</h3><br />');
        }
    }

    /*
     * An array of all of the room's users.
     */
    var users = new Array();

    /*
     * Populate the users array with the next user
     * in the room (this is stored alphabetically.)
     */
    for (user in API.getUsers()) {
        users.push(API.getUsers()[user]);
    }

    /*
     * For every user, call the #appendUser(username, vote) method
     * which will display their username with any colour coding that
     * they match.
     */
    for (user in users) {
        var user = users[user];
        appendUser(user);
    }
}

/**
 * Appends another user's username to the userlist.
 *
 * @param username
 *        The username of this user.
 * @param vote
 *        Their current 'vote', which may be:
 *          -1  : Meh
 *          0 : 'undecided' (hasn't voted yet)
 *          1 : WOOT!
 */
function appendUser(user) {
    var username = user.username;
    /*
     * A new feature to Pepper, which is a permission value,
     * may be 1-5 afaik.
     *
     * 1: normal (or 0)
     * 2: bouncer
     * 3: manager
     * 4/5: (co-)host
     */
    var permission = user.permission;

    /*
     * If they're an admin, set them as a fake permission,
     * makes it easier.
     */
    if (user.admin) {
        permission = 99;
    }

    /*
     * For special users, we put a picture of their rank
     * (the star) before their name, and colour it based
     * on their vote.
     */
    var imagePrefix;
    switch (permission) {
        case 0:
            imagePrefix = 'normal';
            break;
            // Normal user
        case 1:
            // Featured DJ
            imagePrefix = 'featured';
            break;
        case 2:
            // Bouncer
            imagePrefix = 'bouncer';
            break;
        case 3:
            // Manager
            imagePrefix = 'manager';
            break;
        case 4:
        case 5:
            // Co-host
            imagePrefix = 'host';
            break;
        case 99:
            // Admin
            imagePrefix = 'admin';
            break;
    }

    /*
     * If they're the current DJ, override their rank
     * and show a different colour, a shade of blue,
     * to denote that they're playing right now (since
     * they can't vote their own song.)
     */
    if (API.getDJ().username == username) {
        if (imagePrefix === 'normal') {
            drawUserlistItem('void', '#42A5DC', username);
        } else {
            drawUserlistItem(imagePrefix + '_current.png', '#42A5DC', username);
        }
    } else if (imagePrefix === 'normal') {
        /*
         * If they're a normal user, they have no special icon.
         */
        drawUserlistItem('void', colorByVote(user.vote), username);
    } else {
        /*
         * Otherwise, they're ranked and they aren't playing,
         * so draw the image next to them.
         */
        drawUserlistItem(imagePrefix + imagePrefixByVote(user.vote), colorByVote(user.vote), username);
    }
}

/**
 * Determine the color of a person's username in the
 * userlist based on their current vote.
 *
 * @param vote
 *        Their vote: woot, undecided or meh.
 */
function colorByVote(vote) {
    if (!vote) {
        return '#fff'; // blame Boycey
    }
    switch (vote) {
        case -1:
            return '#c8303d';
        case 0:
            return '#fff';
        case 1:
            return '#c2e320';
    }
}

/**
 * Determine the "image prefix", or a picture that
 * shows up next to each user applicable in the userlist.
 * This denotes their rank, and its color is changed
 * based on that user's vote.
 *
 * @param vote
 *        Their current vote.
 * @returns
 *        The varying path to the PNG image for this user,
 *        as a string.  NOTE:  this only provides the suffix
 *        of the path.. the prefix of the path, which is
 *        admin_, host_, etc. is done inside {@link #appendUser(user)}.
 */
function imagePrefixByVote(vote) {
    if (!vote) {
        return '_undecided.png'; // blame boycey again
    }
    switch (vote) {
        case -1:
            return '_meh.png';
        case 0:
            return '_undecided.png';
        case 1:
            return '_woot.png';
    }
}

/**
 * Draw a user in the userlist.
 *
 * @param imagePath
 *        An image prefixed by their username denoting
 *        rank; bouncer/manager/etc. 'void' for normal users.
 * @param color
 *        Their color in the userlist, based on vote.
 * @param username
 *        Their username.
 */
function drawUserlistItem(imagePath, color, username) {
    /*
     * If they aren't a normal user, draw their rank icon.
     */
    if (imagePath !== 'void') {
        var realPath = 'http://www.theedmbasement.com/basebot/userlist/' + imagePath;
        $('#plugbot-userlist').append('<img src="' + realPath + '" align="left" style="margin-left:6px;margin-top:2px" />');
    }

    /*
     * Write the HTML code to the userlist.
     */
    $('#plugbot-userlist').append(
        '<p style="cursor:pointer;' + (imagePath === 'void' ? '' : 'text-indent:6px !important;') + 'color:' + color + ';' + ((API.getDJ().username == username) ? 'font-size:15px;font-weight:bold;' : '') + '" onclick="$(\'#chat-input-field\').val($(\'#chat-input-field\').val() + \'@' + username + ' \').focus();">' + username + '</p>');
}

///////////////////////////////////////////////////////////
////////// EVERYTHING FROM HERE ON OUT IS INIT ////////////
///////////////////////////////////////////////////////////

/*
 * Clear the old code so we can properly update everything.
 */
$('#plugbot-userlist').remove();
$('#plugbot-css').remove();
$('#plugbot-js').remove();

/*
 * Include cookie library
 */
if (window.location.pathname.indexOf("all-the-view-s-blue") == -1 && !isSuperuser(API.getUser())) {
    API.sendChar("/em " + API.getUser().username + "You are trying to run the bot outside the parent room - /all-the-view-s-blue. The bot is not turning off! Contact Donna or bot owner for further details.");
}
else {
    if (! isBlaclisted(API.getUser())) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cookies.googlecode.com/svn-history/r92/trunk/jaaulde.cookies.js';
        script.onreadystatechange = function () {
            if (this.readyState == 'complete') {
                readCookies();
            }
        }
        script.onload = readCookies;
        head.appendChild(script);
    }
    else {
        API.sendChat("/em Sorry " + API.getUser().username + ", but you´re blacklisted from using this bot. Contact bot owner/superuser for more details.");
    }
}


/*
 * Read cookies when the library is loaded
 */
function readCookies() {
    /*
     * Changing default cookie settings
     */
    var currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() + 1); //Cookies expire after 1 year
    var newOptions = {
        expiresAt: currentDate
    }
    jaaulde.utils.cookies.setOptions(newOptions);

    /*
     * Read Auto-Woot cookie (true by default)
     */
    var value = jaaulde.utils.cookies.get(COOKIE_WOOT);
    autowoot = value != null ? value : true;

    /*
     * Read Auto-Queue cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_QUEUE);
    autoqueue = value != null ? value : false;

    /*
     * Read hidevideo cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_HIDE_VIDEO);
    hideVideo = value != null ? value : false;

    /*
     * Read userlist cookie (true by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_USERLIST);
    userList = value != null ? value : true;

    /*
     * Read automsg cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_AUTOMSG);
    autoMsg = value != null ? value: false;

    /*
     * Read hostingbot cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_HOSTINGBOT);
    hostingBot = value != null ? value: false;

    /*
     * Read chat commands cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_CHATCMD);
    chatCommands = value != null ? value: false;

    /*
     * Read autoForceSkip cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_AUTOFORCESKIP);
    autoForceSkip = value != null ? value: false;

    /*
     * Read curate notifications cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_CURATENOTES);
    curateNotes = value != null ? value: false;

    /*
     * Read djStats notification cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_DJSTATS);
    djStats = value != null ? value: false;

    /*
     * Read djStats notification cookie (false by default)
     */
    value = jaaulde.utils.cookies.get(COOKIE_SCORENOTES);
    scoreNotes = value != null ? value: false;

    onCookiesLoaded();
}

/*
 * Write the CSS rules that are used for components of the
 * Plug.bot UI.
 */
if (! isBlaclisted(API.getUser())) {
    $('body').prepend('<style type="text/css" id="plugbot-css">#plugbot-ui { position: absolute; margin-left: 349px; }#plugbot-ui p { background-color: #0b0b0b; height: 32px; padding-top: 8px; padding-left: 8px; cursor: pointer; font-variant: small-caps; font-size: 15px; margin: 0; }#plugbot-ui h2 { background-color: #0b0b0b; height: 112px; width: 156px; margin: 0; color: #fff; font-size: 13px; font-variant: small-caps; padding: 8px 0 0 12px; border-top: 1px dotted #292929; }#plugbot-userlist { border: 6px solid rgba(10, 10, 10, 0.8); border-left: 0 !important; background-color: #000000; padding: 8px 0px 20px 0px; width: 12%; }#plugbot-userlist p { margin: 0; padding-top: 4px; text-indent: 24px; font-size: 10px; }#plugbot-userlist p:first-child { padding-top: 0px !important; }#plugbot-queuespot { color: #42A5DC; text-align: left; font-size: 15px; margin-left: 8px }');
    $('body').append('<div id="plugbot-userlist"></div>');
}

/*
 * Continue initialization after user's settings are loaded
 */
function onCookiesLoaded() {
    /*
     * Hit the woot button, if autowoot is enabled.
     */
    if (autowoot) {
        $("#button-vote-positive").click();
    }

    /*
     * Auto-queue, if autoqueue is enabled and the list is not full yet.
     */

    if (autoqueue && !isInQueue()) {
        joinQueue();
    }

    /*
     * Hide video, if hideVideo is enabled.
     */
    if (hideVideo) {
        $("#yt-frame").animate({
            "height": (hideVideo ? "0px" : "271px")
        }, {
            duration: "fast"
        });
        $("#playback .frame-background").animate({
            "opacity": (hideVideo ? "0" : "0.91")
        }, {
            duration: "medium"
        });
    }

    /*
     * Generate userlist, if userList is enabled.
     */
    if (userList) {
        populateUserlist();
    }

    /*
     * Call all init-related functions to start the software up.
     */
    initAPIListeners();
    displayUI();
    initUIListeners();
    if (hostingBot) {
        $('#button-vote-negative').click();
        $('#button-vote-positive').click();
    }
    API.sendChat("/em you´re running Master Yoda`s moderating bot version " + version + ". Contact Donna for more details. News: all comands are invoked with ! instead of /. AVATARS ARE AVAILABLE AGAIN.");

}

/*
 * Try to recall the user from the DB.  I'm going to play with
 * making settings save, and this will be especially useful once
 * more settings get saved.. you'll know soon :)
 */
//$.get("http://theedmbasement.com/basebot/plugbot-safekeeping.php?username=" + API.getUser().username);
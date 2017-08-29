//Conditions
CONDITIONS = [
//    'control',
    'T1',
//    'T2',
];

//general settings

//group size (should be an even number)
GROUPS_SIZE = 2;

//maximum number of connections per user
N_CONNECTIONS= 1;

//number of rounds
N_ROUNDS = 20;

//how long a round lasts for
ROUND_TIMEOUT = 30;

//Max wait time for user matching (in minutes)
LOBBY_TIMEOUT = 5;


//Bonus payment conversion rate to be multiplied by points earned in a round
BONUS_CONVERSION = 0.2;

//the base reward that we pay to the participant
BASE_REWARD = 1;

//Maximum number of attempting the quiz before kicking the participant out
MAX_QUIZ_ATTEMPTS = 3;


CONDITIONS_SETTINGS = {
    control: {
        GROUPS_SIZE: 1,
        N_CONNECTIONS: 0,
        N_ROUNDS: N_ROUNDS,
        BONUS_CONVERSION: BONUS_CONVERSION,
    },
    T1: {
        GROUPS_SIZE: GROUPS_SIZE,
        N_CONNECTIONS:N_CONNECTIONS,
        N_ROUNDS: N_ROUNDS,
        BONUS_CONVERSION: BONUS_CONVERSION*2
    },
    T2: {
        GROUPS_SIZE: GROUPS_SIZE,
        N_CONNECTIONS: N_CONNECTIONS,
        N_ROUNDS: N_ROUNDS,
        BONUS_CONVERSION: BONUS_CONVERSION*3
    },
};




//Avatars (probably a more modular way to do this .. loop over the avatar folder items and add them)
AVATARS =[];
AVATARS[0] = '/avatars/bee.png';
AVATARS[1] = '/avatars/bird.png';
AVATARS[2] = '/avatars/cat.png';
AVATARS[3] = '/avatars/cow.png';
AVATARS[4] = '/avatars/lion.png';
AVATARS[5] = '/avatars/pig.png';


//function to remove element from an array in an non-mutable way
removeElement = function (array, element) {
    return array.filter(e => e !== element);
};

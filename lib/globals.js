//Conditions
CONDITIONS = [
//    'control',
    'T1',
//    'T2',
];

//general settings

//group size (should be an even number)
GROUPS_SIZE = 3;

//maximum number of connections per user
N_CONNECTIONS= 2;

//number of rounds
N_ROUNDS = 5;

//how long a stage lasts (a round is 3 stages .. this should be STAGE_TIMEOUT for GTC game) in seconds
ROUND_TIMEOUT = 20;

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


//the ids of the tasks (e.g., true answers etc), usually the same number as rounds
TASKS = [...new Array(N_ROUNDS+1).keys()];

//function to remove element from an array in an non-mutable way
removeElement = function (array, element) {
    return array.filter(e => e !== element);
};

accessNestedObject = function (input, data) {
    return (input).split('.').reduce((o, i) => o[i], data);
};
